import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      brevoKeyExists: !!process.env.BREVO_API_KEY,
      sender: process.env.BREVO_SENDER_EMAIL || null,
      to: process.env.BREVO_TO_EMAIL || null,
      espoKeyExists: !!process.env.ESPO_API_KEY,
      espoUrl: process.env.ESPO_URL || null
    }),
    { status: 200 }
  );
};
