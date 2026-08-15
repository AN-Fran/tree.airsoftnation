import type { APIRoute } from "astro";
import { createCrmLead, createWorkshopTicket } from "../../lib/contact-odoo";

const ALLOWED_ORIGINS = new Set([
  "https://tree.airsoftnation.eu",
  "http://localhost:3000",
  "http://localhost:4321",
]);

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 6;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const VALID_REASONS = new Set([
  "general",
  "product_order",
  "workshop",
  "upgrade_hpa",
  "quotation",
  "events_business",
  "other",
  "technical_service",
  "hpa",
  "events_fields",
]);

const WORKSHOP_SERVICE_TYPES = new Set([
  "Reparación",
  "Upgrade",
  "Mantenimiento",
  "Diagnóstico",
  "Garantía",
  "Consulta",
]);

const HPA_WORKSHOP_NEEDS = new Set([
  "installation",
  "technical_problem",
  "technical_quote",
]);

function jsonResponse(
  body: Record<string, unknown>,
  status = 200,
  extraHeaders: Record<string, string> = {}
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getRequestOrigin(request: Request) {
  return request.headers.get("origin")?.trim() || "";
}

function isAllowedOrigin(request: Request) {
  const origin = getRequestOrigin(request);
  return !origin || ALLOWED_ORIGINS.has(origin);
}

function getCorsHeaders(request: Request) {
  const origin = getRequestOrigin(request);
  if (!origin || !ALLOWED_ORIGINS.has(origin)) return {};

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const forwardedIp = forwardedFor?.split(",")[0]?.trim();
  return forwardedIp || request.headers.get("x-real-ip")?.trim() || "";
}

function isRateLimited(request: Request) {
  const key = getClientKey(request);
  if (!key) return false;

  const now = Date.now();
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  current.count += 1;
  if (current.count > RATE_LIMIT_MAX_REQUESTS) return true;

  if (rateLimitStore.size > 1000) {
    for (const [storedKey, entry] of rateLimitStore) {
      if (entry.resetAt <= now) rateLimitStore.delete(storedKey);
    }
  }

  return false;
}

export const OPTIONS: APIRoute = async ({ request }) => {
  if (!isAllowedOrigin(request)) {
    return jsonResponse({ error: "Request rejected" }, 403);
  }

  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request),
  });
};

export const POST: APIRoute = async ({ request }) => {
  const corsHeaders = getCorsHeaders(request);

  try {
    if (!isAllowedOrigin(request)) {
      return jsonResponse({ error: "Request rejected" }, 403);
    }

    if (isRateLimited(request)) {
      return jsonResponse(
        { error: "Too many requests" },
        429,
        { ...corsHeaders, "Retry-After": "600" }
      );
    }

    let body: Record<string, unknown>;
    try {
      const parsed: unknown = await request.json();
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return jsonResponse({ error: "Invalid request" }, 400, corsHeaders);
      }
      body = parsed as Record<string, unknown>;
    } catch {
      return jsonResponse({ error: "Invalid request" }, 400, corsHeaders);
    }

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

    if (company) {
      return jsonResponse({ error: "Invalid request" }, 400, corsHeaders);
    }
    if (!name || !email || !message || !reason) {
      return jsonResponse({ error: "Invalid request" }, 400, corsHeaders);
    }
    if (!VALID_REASONS.has(reason)) {
      return jsonResponse({ error: "Invalid request" }, 400, corsHeaders);
    }
    if (!consent) {
      return jsonResponse({ error: "Invalid request" }, 400, corsHeaders);
    }
    if (message.length > 2000 || name.length > 150 || email.length > 254) {
      return jsonResponse({ error: "Invalid request" }, 400, corsHeaders);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ error: "Invalid request" }, 400, corsHeaders);
    }

    let formattedPhone: string | null = null;
    if (phone) {
      const compactPhone = phone.replace(/[\s().-]/g, "").replace(/^00/, "+");
      if (!/^\+[0-9]{8,15}$/.test(compactPhone)) {
        return jsonResponse({ error: "Invalid request" }, 400, corsHeaders);
      }
      formattedPhone = compactPhone;
    }

    const isWorkshop =
      reason === "workshop" ||
      reason === "technical_service" ||
      (reason === "upgrade_hpa" && HPA_WORKSHOP_NEEDS.has(need));

    if (isWorkshop) {
      if (!formattedPhone || !brand || brand.length > 120) {
        return jsonResponse({ error: "Invalid request" }, 400, corsHeaders);
      }

      const resolvedServiceType =
        reason === "upgrade_hpa"
          ? need === "technical_problem"
            ? "Diagnóstico"
            : "Upgrade"
          : serviceType;

      if (!WORKSHOP_SERVICE_TYPES.has(resolvedServiceType)) {
        return jsonResponse({ error: "Invalid request" }, 400, corsHeaders);
      }

      const result = await createWorkshopTicket({
        name,
        email,
        phone: formattedPhone,
        serviceType: resolvedServiceType,
        brand,
        model: model.slice(0, 150),
        serialNumber: serialNumber.slice(0, 100),
        message,
      });

      return jsonResponse(
        {
          success: true,
          route: "workshop",
          ticketId: result.ticketId,
          quotationId: result.quotationId,
        },
        200,
        corsHeaders
      );
    }

    await createCrmLead({
      name,
      email,
      phone: formattedPhone,
      reason,
      message: need ? `${message}\n\nNecesidad: ${need}` : message,
      utmSource: stringValue(body.utmSource).slice(0, 120),
      utmMedium: stringValue(body.utmMedium).slice(0, 120),
      utmCampaign: stringValue(body.utmCampaign).slice(0, 120),
      utmTerm: stringValue(body.utmTerm).slice(0, 120),
      utmContent: stringValue(body.utmContent).slice(0, 200),
      landing: stringValue(body.landing).slice(0, 200),
    });

    return jsonResponse({ success: true, route: "crm" }, 200, corsHeaders);
  } catch (error) {
    console.error("Contact Odoo error:", error);
    return jsonResponse({ error: "Server error" }, 500, corsHeaders);
  }
};
