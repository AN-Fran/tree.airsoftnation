import type { APIRoute } from "astro";
import { executeOdoo } from "../../../lib/odoo";
import { log, logError } from "../../../lib/logger";

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

function isAuthorized(request: Request) {
  const expectedToken = process.env.KUMA_HEALTH_TOKEN?.trim();
  if (!expectedToken) return false;

  const authorization = request.headers.get("authorization") || "";
  if (!authorization.startsWith("Bearer ")) return false;

  const providedToken = authorization.slice(7).trim();
  if (!providedToken || providedToken.length !== expectedToken.length) return false;

  let mismatch = 0;
  for (let index = 0; index < expectedToken.length; index += 1) {
    mismatch |= providedToken.charCodeAt(index) ^ expectedToken.charCodeAt(index);
  }
  return mismatch === 0;
}

async function checkOdoo() {
  const check = executeOdoo<number>("res.partner", "search_count", [[]]);
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Odoo healthcheck timeout")), HEALTH_TIMEOUT_MS);
  });

  await Promise.race([check, timeout]);
}

export const GET: APIRoute = async ({ request }) => {
  const startedAt = Date.now();

  if (!isAuthorized(request)) {
    log("warn", "health.contact.unauthorized");
    return jsonResponse(
      {
        status: "unauthorized",
        service: "tree-contact",
      },
      401
    );
  }

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
