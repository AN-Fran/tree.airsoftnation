import {
  createOdooRecord,
  fieldsGetOdoo,
  searchReadOdoo,
} from "./odoo";

type ContactPayload = {
  name: string;
  email: string;
  phone?: string | null;
  reason: string;
  message: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
};

export type WorkshopTicketPayload = {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  brand: string;
  model?: string;
  serialNumber?: string;
  message: string;
};

export type WorkshopResult = {
  ticketId: number;
  quotationId: number;
};

type IdName = {
  id: number;
  name: string;
};

type HelpdeskTeam = IdName & {
  company_id?: [number, string] | false;
};

type PartnerRecord = {
  id: number;
};

const cache = new Map<string, number>();

async function findIdByName(
  model: string,
  name: string
): Promise<number | null> {
  const key = `${model}:${name.toLowerCase()}`;

  if (cache.has(key)) {
    return cache.get(key)!;
  }

  const rows = await searchReadOdoo<IdName>(
    model,
    [["name", "=", name]],
    ["id", "name"],
    1
  );

  const id = rows[0]?.id ?? null;

  if (id) {
    cache.set(key, id);
  }

  return id;
}

async function getHelpdeskTeam() {
  const rows = await searchReadOdoo<HelpdeskTeam>(
    "helpdesk.ticket.team",
    [["name", "=", "Taller"]],
    ["id", "name", "company_id"],
    1
  );

  const team = rows[0];

  if (!team) {
    throw new Error('Helpdesk team "Taller" not found');
  }

  if (!team.company_id || !Array.isArray(team.company_id)) {
    throw new Error('Helpdesk team "Taller" has no company configured');
  }

  return team;
}

function buildDescription(payload: ContactPayload) {
  const lines = [payload.message, "", `Motivo: ${payload.reason}`];

  if (payload.phone) {
    lines.push(`Teléfono: ${payload.phone}`);
  }

  if (payload.utmSource) {
    lines.push(`UTM source: ${payload.utmSource}`);
  }

  if (payload.utmMedium) {
    lines.push(`UTM medium: ${payload.utmMedium}`);
  }

  if (payload.utmCampaign) {
    lines.push(`UTM campaign: ${payload.utmCampaign}`);
  }

  if (payload.utmTerm) {
    lines.push(`UTM term: ${payload.utmTerm}`);
  }

  if (payload.utmContent) {
    lines.push(`UTM content: ${payload.utmContent}`);
  }

  return lines.join("\n");
}

function buildWorkshopDescription(payload: WorkshopTicketPayload) {
  const lines = [
    payload.message,
    "",
    `Tipo de servicio: ${payload.serviceType}`,
    `Marca: ${payload.brand}`,
  ];

  if (payload.model) {
    lines.push(`Modelo: ${payload.model}`);
  }

  if (payload.serialNumber) {
    lines.push(`Número de serie: ${payload.serialNumber}`);
  }

  lines.push(`Teléfono: ${payload.phone}`);

  return lines.join("\n");
}

function buildWorkshopQuotationNote(
  payload: WorkshopTicketPayload,
  ticketId: number,
  ticketName: string
) {
  return [
    `Ticket: #${ticketId} — ${ticketName}`,
    `Tipo de servicio: ${payload.serviceType}`,
    `Marca: ${payload.brand}`,
    `Modelo: ${payload.model || "No indicado"}`,
    `Número de serie: ${payload.serialNumber || "No indicado"}`,
    `Teléfono: ${payload.phone}`,
    "",
    "Solicitud:",
    payload.message,
  ].join("\n");
}

function reasonLabel(reason: string) {
  const labels: Record<string, string> = {
    general: "Consulta general",
    product_order: "Producto / pedido",
    technical_service: "Servicio técnico",
    hpa: "HPA",
    events_fields: "Eventos / campos",
    other: "Otro",
  };

  return labels[reason] || reason;
}

function normalizeTicketType(serviceType: string) {
  // Odoo currently contains the typo "Grantía" instead of "Garantía".
  return serviceType === "Garantía" ? "Grantía" : serviceType;
}

async function findOrCreatePartner(payload: WorkshopTicketPayload) {
  const normalizedEmail = payload.email.trim().toLowerCase();
  const [partner] = await searchReadOdoo<PartnerRecord>(
    "res.partner",
    [["email", "=ilike", normalizedEmail]],
    ["id"],
    1
  );

  if (partner) {
    return partner.id;
  }

  return createOdooRecord("res.partner", {
    name: payload.name,
    email: normalizedEmail,
    phone: payload.phone,
  });
}

async function assertWorkshopSaleOrderFields() {
  const requiredFields = ["partner_id", "company_id", "origin", "note"];
  const fields = await fieldsGetOdoo("sale.order", requiredFields);
  const missingFields = requiredFields.filter((field) => !fields[field]);

  if (missingFields.length) {
    throw new Error(
      `Odoo sale.order is missing workshop fields: ${missingFields.join(", ")}`
    );
  }

  if (fields.partner_id.relation !== "res.partner") {
    throw new Error("Odoo sale.order partner_id has an unexpected relation");
  }
}

export async function createHelpdeskTicket(payload: ContactPayload) {
  const [team, typeId] = await Promise.all([
    getHelpdeskTeam(),
    findIdByName("helpdesk.ticket.type", "Consulta"),
  ]);

  if (!typeId) {
    throw new Error('Helpdesk ticket type "Consulta" not found');
  }

  const values: Record<string, unknown> = {
    name: `Solicitud web - ${payload.name}`,
    description: buildDescription(payload),
    team_id: team.id,
    type_id: typeId,
    company_id: team.company_id[0],
    partner_name: payload.name,
    partner_email: payload.email,
  };

  return createOdooRecord("helpdesk.ticket", values);
}

export async function createWorkshopTicket(
  payload: WorkshopTicketPayload,
  onQuotationError?: (error: unknown, ticketId: number) => void
): Promise<WorkshopResult> {
  const odooTypeName = normalizeTicketType(payload.serviceType);
  const [team, typeId] = await Promise.all([
    getHelpdeskTeam(),
    findIdByName("helpdesk.ticket.type", odooTypeName),
  ]);

  if (!typeId) {
    throw new Error(`Helpdesk ticket type "${odooTypeName}" not found`);
  }

  const partnerId = await findOrCreatePartner(payload);
  const ticketName = `Taller - ${payload.brand} ${payload.model || ""}`.trim();
  const ticketId = await createOdooRecord("helpdesk.ticket", {
    name: ticketName,
    description: buildWorkshopDescription(payload),
    team_id: team.id,
    type_id: typeId,
    company_id: team.company_id[0],
    partner_id: partnerId,
    partner_name: payload.name,
    partner_email: payload.email.trim().toLowerCase(),
  });

  try {
    await assertWorkshopSaleOrderFields();
    const quotationId = await createOdooRecord("sale.order", {
      partner_id: partnerId,
      company_id: team.company_id[0],
      origin: `Taller / Ticket #${ticketId}`,
      note: buildWorkshopQuotationNote(payload, ticketId, ticketName),
    });

    return { ticketId, quotationId };
  } catch (error) {
    onQuotationError?.(error, ticketId);
    throw error;
  }
}

export async function createCrmLead(payload: ContactPayload) {
  const [sourceId, mediumId, campaignId] = await Promise.all([
    payload.utmSource
      ? findIdByName("utm.source", payload.utmSource)
      : findIdByName("utm.source", "ig"),
    payload.utmMedium
      ? findIdByName("utm.medium", payload.utmMedium)
      : findIdByName("utm.medium", "social"),
    payload.utmCampaign
      ? findIdByName("utm.campaign", payload.utmCampaign)
      : Promise.resolve(null),
  ]);

  const values: Record<string, unknown> = {
    name: `${reasonLabel(payload.reason)} - ${payload.name}`,
    type: "lead",
    contact_name: payload.name,
    email_from: payload.email,
    description: buildDescription(payload),
  };

  if (payload.phone) {
    values.phone = payload.phone;
  }

  if (sourceId) {
    values.source_id = sourceId;
  }

  if (mediumId) {
    values.medium_id = mediumId;
  }

  if (campaignId) {
    values.campaign_id = campaignId;
  }

  return createOdooRecord("crm.lead", values);
}
