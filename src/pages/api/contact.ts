import type { APIRoute } from 'astro';

export const POST: APIRoute = async () => {
  try {

    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        sender: {
          email: process.env.BREVO_SENDER_EMAIL,
          name: "Tree Test"
        },
        to: [{ email: process.env.BREVO_TO_EMAIL }],
        subject: "Test envío desde servidor",
        htmlContent: "<p>Test correcto</p>"
      }),
    });

    const responseText = await brevoResponse.text();

    return new Response(
      JSON.stringify({
        status: brevoResponse.status,
        body: responseText
      }),
      { status: 200 }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500 }
    );
  }
};
