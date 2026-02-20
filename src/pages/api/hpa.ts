import type { APIRoute } from "astro";
import { createEspoEntity } from "../../lib/espo";

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();

    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const message = formData.get("message")?.toString().trim();

    if (!name || !email || !message) {
      return new Response("Missing fields", { status: 400 });
    }

    await createEspoEntity("Lead", {
      name,
      emailAddress: email,
      description: message,
      source: "Tree HPA",
      status: "New",
      // Si tienes campo personalizado para tipo de interés:
      interestType: "HPA"
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );

  } catch (error) {
    console.error("HPA API error:", error);
    return new Response("Server error", { status: 500 });
  }
};
