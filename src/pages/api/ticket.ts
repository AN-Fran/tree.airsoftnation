import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      brand,
      model,
      serialNumber,
      message
    } = body;

    if (!name || !email || !phone || !brand || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    // -------- 1. EMAIL A ADMIN --------
    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY!
      },
      body: JSON.stringify({
        sender: {
          email: process.env.BREVO_SENDER_EMAIL,
          name: "Servicio Técnico - Tree"
        },
        to: [{ email: process.env.BREVO_TO_EMAIL }],
        subject: `Nuevo ticket técnico - ${name}`,
        htmlContent: `
          <h3>Nuevo ticket técnico</h3>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${phone}</p>
          <p><strong>Marca:</strong> ${brand}</p>
          <p><strong>Modelo:</strong> ${model || "-"}</p>
          <p><strong>Número de serie:</strong> ${serialNumber || "-"}</p>
          <p><strong>Descripción:</strong><br/>${message}</p>
        `
      })
    });

    if (!brevoResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Email failed" }),
        { status: 500 }
      );
    }

    // -------- 2. CREAR LEAD EN ESPO --------
    await fetch(`${process.env.ESPO_URL}/api/v1/Lead`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.ESPO_API_KEY!
      },
      body: JSON.stringify({
        firstName: name,
        emailAddress: email,
        phoneNumber: phone,
        description: `
Marca: ${brand}
Modelo: ${model}
Serie: ${serialNumber}

${message}
        `,
        assignedUserId: process.env.ESPO_ASSIGNED_USER_ID
      })
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Ticket API error:", error);

    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
};
