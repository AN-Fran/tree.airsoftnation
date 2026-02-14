import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    const {
      name,
      email,
      phone,
      brand,
      model,
      serialNumber,
      message
    } = data;

    if (!name || !email || !phone || !message) {
      return new Response(
        JSON.stringify({ success: false, error: "Campos obligatorios faltantes" }),
        { status: 400 }
      );
    }

    // 1️⃣ Crear o actualizar contacto en CRM
    await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        email,
        attributes: {
          FIRSTNAME: name,
          PHONE: phone,
          MARCA: brand,
          MODELO: model,
          SERIE: serialNumber,
        },
        updateEnabled: true
      })
    });

    // 2️⃣ Enviar email transaccional
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        sender: {
          name: "Airsoft Nation",
          email: "admin@airsoftnation.eu"
        },
        to: [{ email: "admin@airsoftnation.eu" }],
        subject: `Nuevo ticket técnico - ${name}`,
        htmlContent: `
          <h2>Nuevo ticket técnico</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${phone}</p>
          <p><strong>Marca:</strong> ${brand}</p>
          <p><strong>Modelo:</strong> ${model}</p>
          <p><strong>Nº Serie:</strong> ${serialNumber}</p>
          <p><strong>Descripción:</strong><br>${message}</p>
        `
      })
    });

    return new Response(JSON.stringify({ success: true }));

  } catch (error) {
    console.error("Ticket error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Error interno" }),
      { status: 500 }
    );
  }
};
