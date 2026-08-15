import type { APIRoute } from "astro";
import { createCrmLead, createWorkshopTicket } from "../../lib/contact-odoo";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const VALID_REASONS = new Set([
  "general", "product_order", "workshop", "upgrade_hpa", "quotation", "events_business", "other",
  "technical_service", "hpa", "events_fields",
]);
const WORKSHOP_SERVICE_TYPES = new Set(["Reparación", "Upgrade", "Mantenimiento", "Diagnóstico", "Garantía", "Consulta"]);
const HPA_WORKSHOP_NEEDS = new Set(["installation", "technical_problem", "technical_quote"]);

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
function stringValue(value: unknown) { return typeof value === "string" ? value.trim() : ""; }

export const OPTIONS: APIRoute = async () => new Response(null, { status: 200, headers: corsHeaders });

export const POST: APIRoute = async ({ request }) => {
  try {
    let body: Record<string, unknown>;
    try {
      const parsed: unknown = await request.json();
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return jsonResponse({ error: "Invalid JSON" }, 400);
      body = parsed as Record<string, unknown>;
    } catch { return jsonResponse({ error: "Invalid JSON" }, 400); }

    const name = stringValue(body.name);
    const email = stringValue(body.email).toLowerCase();
    const phone = stringValue(body.phone);
    const reason = stringValue(body.reason);
    const need = stringValue(body.need);
    const message = stringValue(body.message);
    const company = stringValue(body.company);
    const consent = body.consent === true;
    const serviceType = stringValue(body.serviceType);
    const brand = stringValue(body.brand);
    const model = stringValue(body.model);
    const serialNumber = stringValue(body.serialNumber);

    if (company) return jsonResponse({ error: "Spam detected" }, 400);
    if (!name || !email || !message || !reason) return jsonResponse({ error: "Missing required fields" }, 400);
    if (!VALID_REASONS.has(reason)) return jsonResponse({ error: "Invalid reason" }, 400);
    if (!consent) return jsonResponse({ error: "Consent required" }, 400);
    if (message.length > 2000) return jsonResponse({ error: "Message too long" }, 400);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return jsonResponse({ error: "Invalid email" }, 400);

    let formattedPhone: string | null = null;
    if (phone) {
      const compactPhone = phone.replace(/[\s().-]/g, "").replace(/^00/, "+");
      if (!/^\+[0-9]{8,15}$/.test(compactPhone)) return jsonResponse({ error: "Invalid phone" }, 400);
      formattedPhone = compactPhone;
    }

    const isWorkshop = reason === "workshop" || reason === "technical_service" || (reason === "upgrade_hpa" && HPA_WORKSHOP_NEEDS.has(need));

    if (isWorkshop) {
      if (!formattedPhone || !brand) return jsonResponse({ error: "Workshop requires phone and brand" }, 400);
      const resolvedServiceType = reason === "upgrade_hpa"
        ? (need === "technical_problem" ? "Diagnóstico" : "Upgrade")
        : serviceType;
      if (!WORKSHOP_SERVICE_TYPES.has(resolvedServiceType)) return jsonResponse({ error: "Invalid workshop service type" }, 400);

      const result = await createWorkshopTicket({
        name, email, phone: formattedPhone, serviceType: resolvedServiceType, brand, model, serialNumber, message,
      });
      return jsonResponse({ success: true, route: "workshop", ticketId: result.ticketId, quotationId: result.quotationId });
    }

    await createCrmLead({
      name, email, phone: formattedPhone, reason, message: need ? `${message}\n\nNecesidad: ${need}` : message,
      utmSource: stringValue(body.utmSource), utmMedium: stringValue(body.utmMedium),
      utmCampaign: stringValue(body.utmCampaign), utmTerm: stringValue(body.utmTerm),
      utmContent: stringValue(body.utmContent), landing: stringValue(body.landing),
    });
    return jsonResponse({ success: true, route: "crm" });
  } catch (error) {
    console.error("Contact Odoo error:", error);
    return jsonResponse({ error: "Server error" }, 500);
  }
};
