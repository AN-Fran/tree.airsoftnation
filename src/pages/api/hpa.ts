import type { APIRoute } from "astro";
import { createCrmLead } from "../../lib/contact-odoo";

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();

    if (formData.get("company")) {
      return new Response("Spam detected", { status: 400 });
    }

    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const phone = formData.get("phone")?.toString().trim();
    const message = formData.get("message")?.toString().trim();

    if (!name || !email || !message) {
      return new Response("Missing fields", { status: 400 });
    }

    await createCrmLead({
      name,
      email,
      phone: phone || null,
      reason: "hpa",
      message,
      utmSource: "Tree HPA",
      utmMedium: "Website",
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("HPA Odoo error:", message);

    return new Response("Server error", { status: 500 });
  }
};
