import type { APIRoute } from "astro";

/* =========================
   CONFIG
========================= */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const LEAD_CAPTURE_TOKEN = process.env.ESPO_LEAD_CAPTURE_TOKEN;

/* =========================
   HELPERS
========================= */

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "(Web)" };
  }
  const firstName = parts.shift() || "";
  const lastName = parts.join(" ");
  return { firstName, lastName };
}

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "";
}

function calculateSpamScore(message: string) {
  const suspicious = ["viagra", "casino", "crypto", "loan", "http://", "https://"];
  let score = 0;

  suspicious.forEach(word => {
    if (message.toLowerCase().includes(word)) score += 20;
  });

  if (message.length > 1500) score += 30;

  return Math.min(score, 100);
}

/* =========================
   OPTIONS
========================= */

export const OPTIONS: APIRoute = async () => {
  return new Response(null, { status: 200, headers: corsHeaders });
};

/* =========================
   POST
========================= */

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!LEAD_CAPTURE_TOKEN) {
      return new Response(
        JSON.stringify({ error: "CRM not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await request.json();

    const {
      name,
      email,
      phone,
      message,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      consent,
      company,
    } = body;

    /* =========================
       VALIDATION
    ========================= */

    if (company) {
      return new Response(
        JSON.stringify({ error: "Spam detected" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!consent) {
      return new Response(
        JSON.stringify({ error: "Consent required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (message.length > 2000) {
      return new Response(
        JSON.stringify({ error: "Message too long" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { firstName, lastName } = splitName(name);

    const ipAddress = getClientIp(request);
    const userAgent = request.headers.get("user-agent") || "";
    const spamScore = calculateSpamScore(message);

    /* =========================
       PHONE VALIDATION
    ========================= */

    const formattedPhone =
      phone && /^\+[0-9]{8,15}$/.test(phone.trim())
        ? phone.trim()
        : null;

    /* =========================
       SEND TO ESPOCRM
    ========================= */

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const espoResponse = await fetch(
      `http://medusa_espocrm-app/api/v1/LeadCapture/${LEAD_CAPTURE_TOKEN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          firstName,
          lastName,
          emailAddress: email,
          description: message,

          ...(formattedPhone ? { phoneNumber: formattedPhone } : {}),

          cNsource: "web-contact",
          cSpamScore: spamScore,
          cConsentGiven: true,
          cUserAgent: userAgent,
          cWhatsappSent: false,
          cUtmSource: utmSource || "",
          cUtmMedium: utmMedium || "",
          cUtmCampaign: utmCampaign || "",
          cUtmTerm: utmTerm || "",
          cUtmContent: utmContent || "",
          cIpAddress: ipAddress,
        }),
      }
    );

    clearTimeout(timeout);

    if (espoResponse.status < 200 || espoResponse.status >= 300) {
      const errorText = await espoResponse.text().catch(() => "No response body");
      console.error("EspoCRM error:", espoResponse.status, errorText);

      return new Response(
        JSON.stringify({ error: "CRM error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Server error:", error);

    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

