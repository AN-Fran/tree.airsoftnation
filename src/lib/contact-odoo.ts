import {
  createOdooRecord,
  fieldsGetOdoo,
  searchReadOdoo,
  writeOdooRecords,
} from "./odoo";

export type ContactPayload = {
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
  landing?: string;
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

type ProductRecord = {
  id: number;
};

type WorkshopPostTicketStage =
  | "product"
  | "quotation"
  | "quotation_line"
  | "ticket_link";

const WORKSHOP_PROJECT_NAME = "Taller Airsoft Nation";
const WORKSHOP_QUOTE_PRODUCT_CODE = "TALLER-PRESUPUESTO";
const WORKSHOP_QUOTE_PRODUCT_NAME = "Presupuesto Servicio Técnico";
const WORKSHOP_QUOTE_PRICE = 30;

const cache = new Map<string, number>();
let workshopQuoteProductPromise: Promise<number> | null = null;

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

async function getWorkshopProjectId() {
  const projectId = await findIdByName("project.project", WORKSHOP_PROJECT_NAME);

  if (!projectId) {
    throw new Error(`Odoo project "${WORKSHOP_PROJECT_NAME}" not found`);
  }

  return projectId;
}

function buildDescription(payload: ContactPayload) {
  const lines = [payload.message, "", `Motivo: ${payload.reason}`];

  if (payload.phone) {
    lines.push(`Teléfono: ${payload.phone}`);
  }

  if (payload.landing) {
    lines.push(`Landing: ${payload.landing}`);
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

function buildWorkshopQuotationLineName(payload: WorkshopTicketPayload) {
  return [
    WORKSHOP_QUOTE_PRODUCT_NAME,
    "",
    `Tipo de servicio: ${payload.serviceType}`,
    `Marca: ${payload.brand}`,
    `Modelo: ${payload.model || "No indicado"}`,
    `Número de serie: ${payload.serialNumber || "No indicado"}`,
    "",
    "Solicitud:",
    payload.message,
    "",
    "Importe correspondiente a diagnóstico y elaboración de presupuesto. Se descontará íntegramente del importe final si se acepta y realiza la reparación.",
  ].join("\n");
}

function reasonLabel(reason: string) {
  const labels: Record<string, string> = {
    general: "Consulta general",
    product_order: "Producto / pedido",
    workshop: "Servicio técnico",
    upgrade_hpa: "Upgrade / HPA",
    quotation: "Solicitud de presupuesto",
    events_business: "Eventos / campos / colaboración",
    technical_service: "Servicio técnico",
    hpa: "HPA",
    events_fields: "Eventos / campos",
    other: "Otra consulta",
  };

  return labels[reason] || reason;
}

function normalizeTicketType(serviceType: string) {
  return serviceType;
}

export async function findOrCreatePartner(payload: {
  name: string;
  email: string;
  phone?: string | null;
}) {
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

  const values: Record<string, unknown> = {
    name: payload.name,
    email: normalizedEmail,
  };

  if (payload.phone) {
    values.phone = payload.phone;
  }

  return createOdooRecord("res.partner", values);
}

async function findOrCreateWorkshopQuoteProduct() {
  const [product] = await searchReadOdoo<ProductRecord>(
    "product.product",
    [["default_code", "=", WORKSHOP_QUOTE_PRODUCT_CODE]],
    ["id"],
    1
  );

  if (product) {
    return product.id;
  }

  return createOdooRecord("product.product", {
    name: WORKSHOP_QUOTE_PRODUCT_NAME,
    default_code: WORKSHOP_QUOTE_PRODUCT_CODE,
    type: "service",
    list_price: WORKSHOP_QUOTE_PRICE,
    sale_ok: true,
    purchase_ok: false,
  });
}

function getWorkshopQuoteProductId() {
  if (!workshopQuoteProductPromise) {
    workshopQuoteProductPromise = findOrCreateWorkshopQuoteProduct().catch(
      (error) => {
        workshopQuoteProductPromise = null;
        throw error;
      }
    );
  }

  return workshopQuoteProductPromise;
}

async function assertWorkshopSaleOrderFields() {
  const requiredFields = ["partner_id", "company_id", "origin"];
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

async function runPostTicketStep<T>(
  ticketId: number,
  stage: WorkshopPostTicketStage,
  operation: () => Promise<T>,
  onError?: (
    error: unknown,
    ticketId: number,
    stage: WorkshopPostTicketStage
  ) => void
) {
  try {
    return await operation();
  } catch (error) {
    onError?.(error, ticketId, stage);
    throw error;
  }
}

export async function createHelpdeskTicket(payload: ContactPayload) {
  const [team, typeId, projectId] = await Promise.all([
    getHelpdeskTeam(),
    findIdByName("helpdesk.ticket.type", "Consulta"),
    getWorkshopProjectId(),
  ]);

  if (!typeId) {
    throw new Error('Helpdesk ticket type "Consulta" not found');
  }

  const partnerId = await findOrCreatePartner(payload);

  const values: Record<string, unknown> = {
    name: `Solicitud web - ${payload.name}`,
    description: buildDescription(payload),
    team_id: team.id,
    type_id: typeId,
    company_id: team.company_id[0],
    project_id: projectId,
    partner_id: partnerId,
    partner_name: payload.name,
    partner_email: payload.email.trim().toLowerCase(),
  };

  return createOdooRecord("helpdesk.ticket", values);
}

export async function createWorkshopTicket(
  payload: WorkshopTicketPayload,
  onPostTicketError?: (
    error: unknown,
    ticketId: number,
    stage: WorkshopPostTicketStage
  ) => void
): Promise<WorkshopResult> {
  const odooTypeName = normalizeTicketType(payload.serviceType);
  const [team, typeId, projectId] = await Promise.all([
    getHelpdeskTeam(),
    findIdByName("helpdesk.ticket.type", odooTypeName),
    getWorkshopProjectId(),
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
    project_id: projectId,
    partner_id: partnerId,
    partner_name: payload.name,
    partner_email: payload.email.trim().toLowerCase(),
  });

  const productId = await runPostTicketStep(
    ticketId,
    "product",
    getWorkshopQuoteProductId,
    onPostTicketError
  );

  const quotationId = await runPostTicketStep(
    ticketId,
    "quotation",
    async () => {
      await assertWorkshopSaleOrderFields();
      return createOdooRecord("sale.order", {
        partner_id: partnerId,
        company_id: team.company_id[0],
        origin: `Taller / Ticket #${ticketId}`,
      });
    },
    onPostTicketError
  );

  await runPostTicketStep(
    ticketId,
    "quotation_line",
    () =>
      createOdooRecord("sale.order.line", {
        order_id: quotationId,
        product_id: productId,
        name: buildWorkshopQuotationLineName(payload),
        product_uom_qty: 1,
        price_unit: WORKSHOP_QUOTE_PRICE,
      }),
    onPostTicketError
  );

  await runPostTicketStep(
    ticketId,
    "ticket_link",
    () =>
      writeOdooRecords("helpdesk.ticket", [ticketId], {
        sale_order_ids: [[4, quotationId]],
      }),
    onPostTicketError
  );

  return { ticketId, quotationId };
}

export async function createCrmLead(payload: ContactPayload) {
  const partnerId = await findOrCreatePartner(payload);

  const [sourceId, mediumId, campaignId] = await Promise.all([
    payload.utmSource
      ? findIdByName("utm.source", payload.utmSource)
      : Promise.resolve(null),
    payload.utmMedium
      ? findIdByName("utm.medium", payload.utmMedium)
      : findIdByName("utm.medium", "Website"),
    payload.utmCampaign
      ? findIdByName("utm.campaign", payload.utmCampaign)
      : Promise.resolve(null),
  ]);

  const values: Record<string, unknown> = {
    name: `${reasonLabel(payload.reason)} - ${payload.name}`,
    type: "opportunity",
    partner_id: partnerId,
    contact_name: payload.name,
    email_from: payload.email.trim().toLowerCase(),
    description: buildDescription(payload),
    user_id: false,
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
