import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // VALIDACIÓN
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    if (!process.env.BREVO_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Email service unavailable" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // ENVÍO EMAIL
    const brevoResponse = await fetch(
      "https://api.brevo.com/v3/smtp/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_API_KEY,
        },
        body: JSON.stringify({
          sender: {
            email: process.env.BREVO_SENDER_EMAIL,
            name: "Tree Airsoft Nation"
          },
          to: [{ email: process.env.BREVO_TO_EMAIL }],
          subject: `Nuevo contacto web - ${name}`,
          htmlContent: `
            <h3>Nuevo mensaje desde Tree</h3>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Teléfono:</strong> ${phone || "No proporcionado"}</p>
            <p><strong>Mensaje:</strong><br/>${message}</p>
          `
        }),
      }
    );

    if (!brevoResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Email delivery failed" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // ESPOCRM (no bloqueante)
    if (process.env.ESPO_URL && process.env.ESPO_API_KEY) {
      try {
        await fetch(
          `${process.env.ESPO_URL.replace(/\/$/, "")}/api/v1/Lead`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Api-Key": process.env.ESPO_API_KEY,
            },
            body: JSON.stringify({
              firstName: name,
              emailAddress: email,
              phoneNumber: phone,
              description: message,
              assignedUserId: process.env.ESPO_ASSIGNED_USER_ID
            }),
          }
        );
      } catch {
        // no bloqueamos si falla CRM
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch {
    return new Response(
      JSON.stringify({ error: "Server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
