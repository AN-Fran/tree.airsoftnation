import type { APIRoute } from "astro";
import { createCrmLead, createHelpdeskTicket } from "../../lib/contact-odoo";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const VALID_REASONS = new Set([
  "general",
  "product_order",
  "workshop",
  "upgrade_hpa",
  "quotation",
  "events_business",
  "other",
  // Legacy values kept during the migration of existing entry points.
  "technical_service",
  "hpa",
  "events_fields",
]);

const HELPDESK_REASONS = new Set(["workshop", "technical_service"]);

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export const OPTIONS: APIRoute = async () =>
  new Response(null, { status: 200, headers: corsHeaders });

export const POST: APIRoute = async ({ request }) => {
  try {
    let body: Record<string, unknown>;
    try {
      const parsed: unknown = await request.json();
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return jsonResponse({ error: "Invalid JSON" }, 400);
      }
      body = parsed as Record<string, unknown>;
    } catch {
      return jsonResponse({ error: "Invalid JSON" }, 400);
    }

    const name = stringValue(body.name);
    const email = stringValue(body.email).toLowerCase();
    const phone = stringValue(body.phone);
    const reason = stringValue(body.reason);
    const message = stringValue(body.message);
    const company = stringValue(body.company);
    const consent = body.consent === true;
    const utmSource = stringValue(body.utmSource);
    const utmMedium = stringValue(body.utmMedium);
    const utmCampaign = stringValue(body.utmCampaign);
    const utmTerm = stringValue(body.utmTerm);
    const utmContent = stringValue(body.utmContent);
    const landing = stringValue(body.landing);

    if (company) return jsonResponse({ error: "Spam detected" }, 400);
    if (!name || !email || !message || !reason) {
      return jsonResponse({ error: "Missing required fields" }, 400);
    }
    if (!VALID_REASONS.has(reason)) return jsonResponse({ error: "Invalid reason" }, 400);
    if (!consent) return jsonResponse({ error: "Consent required" }, 400);
    if (message.length > 2000) return jsonResponse({ error: "Message too long" }, 400);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ error: "Invalid email" }, 400);
    }

    let formattedPhone: string | null = null;
    if (phone) {
      const compactPhone = phone.replace(/[\s().-]/g, "").replace(/^00/, "+");
      if (!/^\+[0-9]{8,15}$/.test(compactPhone)) {
        return jsonResponse({ error: "Invalid phone" }, 400);
      }
      formattedPhone = compactPhone;
    }

    const payload = {
      name,
      email,
      phone: formattedPhone,
      reason,
      message,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      landing,
    };

    if (HELPDESK_REASONS.has(reason)) {
      await createHelpdeskTicket(payload);
    } else {
      await createCrmLead(payload);
    }

    return jsonResponse({ success: true });
  } catch (error) {
    console.error("Contact Odoo error:", error);
    return jsonResponse({ error: "Server error" }, 500);
  }
};
