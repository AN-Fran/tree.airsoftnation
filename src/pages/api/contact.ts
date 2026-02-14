import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Enviar email con Brevo
    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY!,
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
    });

    if (!brevoResponse.ok) {
      throw new Error("Brevo error");
    }

    // Crear Lead en EspoCRM
    const espoResponse = await fetch(`${process.env.ESPO_URL}/api/v1/Lead`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.ESPO_API_KEY!,
      },
      body: JSON.stringify({
        firstName: name,
        emailAddress: email,
        phoneNumber: phone,
        description: message,
        assignedUserId: process.env.ESPO_ASSIGNED_USER_ID
      }),
    });

    if (!espoResponse.ok) {
      throw new Error("EspoCRM error");
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Contact API error:", error);

    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
};
