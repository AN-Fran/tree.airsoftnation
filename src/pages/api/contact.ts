import type { APIRoute } from "astro";

/* ------------------ CORS ------------------ */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
};

/* ------------------ POST ------------------ */

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    /* =========================
       1️⃣ ENVÍO BREVO
    ========================= */

    if (!process.env.BREVO_API_KEY) {
      console.error("BREVO_API_KEY missing");
      return new Response(
        JSON.stringify({ error: "Email service unavailable" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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
            name: "Tree Airsoft Nation",
          },
          to: [{ email: process.env.BREVO_TO_EMAIL }],
          subject: `Nuevo contacto web - ${name}`,
          htmlContent: `
            <h3>Nuevo mensaje desde Tree</h3>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Teléfono:</strong> ${phone || "No proporcionado"}</p>
            <p><strong>Mensaje:</strong><br/>${message}</p>
          `,
        }),
      }
    );

    if (!brevoResponse.ok) {
      const errText = await brevoResponse.text();
      console.error("BREVO ERROR:", errText);
      return new Response(
        JSON.stringify({ error: "Email delivery failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

/* =========================
   ENVÍO ESPOCRM
========================= */

if (process.env.ESPO_URL && process.env.ESPO_API_KEY) {
  try {
    const espoUrl = process.env.ESPO_URL.replace(/\/$/, "");

    const espoResponse = await fetch(`${espoUrl}/api/v1/Lead`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.ESPO_API_KEY,
      },
      body: JSON.stringify({
        firstName: name,
        lastName: "Web",
        emailAddress: email,
        phoneNumber: phone,
        description: message,
        assignedUserId: process.env.ESPO_ASSIGNED_USER_ID,
      }),
    });

    if (!espoResponse.ok) {
      const errText = await espoResponse.text();
      console.error("ESPO ERROR:", errText);
    } else {
      console.log("ESPO Lead creado correctamente");
    }

  } catch (error) {
    console.error("ESPO FETCH ERROR:", error);
  }
} else {
  console.warn("ESPO variables not configured");
}

    /* =========================
       SUCCESS
    ========================= */

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("SERVER ERROR:", error);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};
