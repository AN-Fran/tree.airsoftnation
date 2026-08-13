import { createOdooRecord, searchReadOdoo } from "./odoo";

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

type IdName = {
  id: number;
  name: string;
};

type HelpdeskTeam = IdName & {
  company_id?: [number, string] | false;
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

  return team;
}

function buildDescription(payload: ContactPayload) {
  const lines = [
    payload.message,
    "",
    `Motivo: ${payload.reason}`,
  ];

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
    partner_name: payload.name,
    partner_email: payload.email,
  };

  if (team.company_id && Array.isArray(team.company_id)) {
    values.company_id = team.company_id[0];
  }

  return createOdooRecord("helpdesk.ticket", values);
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
