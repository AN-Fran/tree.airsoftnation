import type { APIRoute } from "astro";
import { createEspoEntity } from "../../lib/espo";

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

    await createEspoEntity("Lead", {
      name,
      emailAddress: email,
      phoneNumber: phone,
      description: message,
      source: "Tree HPA",
      status: "New"
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200
    });

  } catch (error) {
    console.error("HPA API error:", error);
    return new Response("Server error", { status: 500 });
  }
};
