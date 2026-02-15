import type { APIRoute } from "astro";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, { status: 200, headers: corsHeaders });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, phone, message, utm } = body;

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const [firstName, ...rest] = name.trim().split(" ");
    const lastName = rest.join(" ") || "Web";

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      "unknown";

    const userAgent = request.headers.get("user-agent") || "unknown";

    const espoUrl = process.env.ESPO_URL!.replace(/\/$/, "");

    const espoResponse = await fetch(
      `${espoUrl}/api/v1/LeadCapture/e265740ddcab3dcfbc80882c1087c06a`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          emailAddress: email,
          phoneNumber: phone,
          description: message,

          // Campos personalizados (usa nombres internos reales)
          cEntrada: "web-contact",
          cIpAddress: ip,
          cUserAgent: userAgent,

          cUtmSource: utm?.source,
          cUtmMedium: utm?.medium,
          cUtmCampaign: utm?.campaign,
          cUtmTerm: utm?.term,
          cUtmContent: utm?.content,

          cConsentGiven: true,
          cSpamScore: 0
        }),
      }
    );

    if (!espoResponse.ok) {
      const err = await espoResponse.text();
      console.error("ESPO ERROR:", err);
      return new Response(
        JSON.stringify({ error: "CRM error" }),
        { status: 500, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("SERVER ERROR:", error);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500, headers: corsHeaders }
    );
  }
};
