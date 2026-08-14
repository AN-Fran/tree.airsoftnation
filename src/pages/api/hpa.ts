import type { APIRoute } from "astro";
import { createCrmLead } from "../../lib/contact-odoo";

const jsonHeaders = { "Content-Type": "application/json" };
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const internationalPhoneRegex = /^\+[0-9]{8,15}$/;

function jsonResponse(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders });
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeInternationalPhone(value: string) {
  const compact = value.replace(/[\s().-]/g, "");
  return compact.startsWith("00") ? `+${compact.slice(2)}` : compact;
}

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;

  try {
    const parsedBody: unknown = await request.json();

    if (!parsedBody || typeof parsedBody !== "object" || Array.isArray(parsedBody)) {
      return jsonResponse({ error: "Invalid request" }, 400);
    }

    body = parsedBody as Record<string, unknown>;
  } catch {
    return jsonResponse({ error: "Invalid request" }, 400);
  }

  const name = stringValue(body.name);
  const email = stringValue(body.email).toLowerCase();
  const phone = normalizeInternationalPhone(stringValue(body.phone));
  const message = stringValue(body.message);

  if (stringValue(body.company)) {
    return jsonResponse({ error: "Invalid request" }, 400);
  }

  if (!name || !email || !message || !emailRegex.test(email)) {
    return jsonResponse({ error: "Invalid request" }, 400);
  }

  if (phone && !internationalPhoneRegex.test(phone)) {
    return jsonResponse({ error: "Invalid request" }, 400);
  }

  try {
    await createCrmLead({
      name,
      email,
      phone: phone || null,
      reason: "hpa",
      message,
      utmSource: "Tree HPA",
      utmMedium: "Website",
    });

    return jsonResponse({ success: true }, 200);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("HPA Odoo error:", message);
    return jsonResponse({ error: "Unable to process request" }, 502);
  }
};
