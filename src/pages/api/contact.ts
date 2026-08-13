import type { APIRoute } from "astro";
import {
  createCrmLead,
  createHelpdeskTicket,
} from "../../lib/contact-odoo";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const VALID_REASONS = new Set([
  "general",
  "product_order",
  "technical_service",
  "hpa",
  "events_fields",
  "other",
]);

function jsonResponse(
  body: Record<string, unknown>,
  status = 200
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    let body: Record<string, unknown>;

    try {
      body = await request.json();
    } catch {
      return jsonResponse(
        { error: "Invalid JSON" },
        400
      );
    }

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim()
        : "";

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : "";

    const reason =
      typeof body.reason === "string"
        ? body.reason.trim()
        : "";

    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    const company =
      typeof body.company === "string"
        ? body.company.trim()
        : "";

    const consent = body.consent === true;

    const marketingConsent =
      body.marketingConsent === true;

    const utmSource =
      typeof body.utmSource === "string"
        ? body.utmSource.trim()
        : "";

    const utmMedium =
      typeof body.utmMedium === "string"
        ? body.utmMedium.trim()
        : "";

    const utmCampaign =
      typeof body.utmCampaign === "string"
        ? body.utmCampaign.trim()
        : "";

    const utmTerm =
      typeof body.utmTerm === "string"
        ? body.utmTerm.trim()
        : "";

    const utmContent =
      typeof body.utmContent === "string"
        ? body.utmContent.trim()
        : "";

    if (company) {
      return jsonResponse(
        { error: "Spam detected" },
        400
      );
    }

    if (!name || !email || !message || !reason) {
      return jsonResponse(
        { error: "Missing required fields" },
        400
      );
    }

    if (!VALID_REASONS.has(reason)) {
      return jsonResponse(
        { error: "Invalid reason" },
        400
      );
    }

    if (!consent) {
      return jsonResponse(
        { error: "Consent required" },
        400
      );
    }

    if (message.length > 2000) {
      return jsonResponse(
        { error: "Message too long" },
        400
      );
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return jsonResponse(
        { error: "Invalid email" },
        400
      );
    }

    let formattedPhone: string | null = null;

    if (phone) {
      if (!/^\+[0-9]{8,15}$/.test(phone)) {
        return jsonResponse(
          { error: "Invalid phone" },
          400
        );
      }

      formattedPhone = phone;
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
      marketingConsent,
    };

    if (reason === "technical_service") {
      await createHelpdeskTicket(payload);
    } else {
      await createCrmLead(payload);
    }

    return jsonResponse({
      success: true,
    });
  } catch (error) {
    console.error("Contact Odoo error:", error);

    return jsonResponse(
      { error: "Server error" },
      500
    );
  }
};
