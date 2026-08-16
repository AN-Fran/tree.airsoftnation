import type { APIRoute } from "astro";
import { executeOdoo } from "../../../lib/odoo";
import { logError } from "../../../lib/logger";

const HEALTH_TIMEOUT_MS = 8000;

function jsonResponse(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

async function checkOdoo() {
  const check = executeOdoo<number>("res.partner", "search_count", [[]]);
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Odoo healthcheck timeout")), HEALTH_TIMEOUT_MS);
  });

  await Promise.race([check, timeout]);
}

export const GET: APIRoute = async () => {
  const startedAt = Date.now();

  try {
    await checkOdoo();
    return jsonResponse(
      {
        status: "ok",
        service: "tree-contact",
        odoo: "ok",
        durationMs: Date.now() - startedAt,
      },
      200
    );
  } catch (error) {
    logError("health.contact.failed", error, {
      durationMs: Date.now() - startedAt,
    });

    return jsonResponse(
      {
        status: "error",
        service: "tree-contact",
        odoo: "unavailable",
      },
      503
    );
  }
};
