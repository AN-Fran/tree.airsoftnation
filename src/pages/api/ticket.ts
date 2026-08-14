import type { APIRoute } from "astro";
import { createWorkshopTicket } from "../../lib/contact-odoo";
import { log } from "../../lib/logger";
import { TicketSchema } from "../../lib/validation/ticket.schema";

const jsonHeaders = { "Content-Type": "application/json" };

function jsonResponse(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders });
}

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ success: false, error: "Invalid request" }, 400);
  }

  if (
    body &&
    typeof body === "object" &&
    !Array.isArray(body) &&
    typeof (body as Record<string, unknown>).company === "string" &&
    (body as Record<string, string>).company.trim()
  ) {
    return jsonResponse({ success: false, error: "Invalid request" }, 400);
  }

  const result = TicketSchema.safeParse(body);

  if (!result.success) {
    log("warn", "ticket_validation_failed");
    return jsonResponse({ success: false, error: "Invalid request" }, 400);
  }

  try {
    const { ticketId, quotationId } = await createWorkshopTicket(
      result.data,
      (error, createdTicketId, stage) => {
        log("error", "workshop_post_ticket_step_failed", {
          ticketId: createdTicketId,
          stage,
          message: error instanceof Error ? error.message : "Unknown Odoo error",
        });
      }
    );

    log("info", "workshop_ticket_and_quotation_created", {
      ticketId,
      quotationId,
      backend: "odoo18",
    });

    return jsonResponse({ success: true, ticketId, quotationId }, 200);
  } catch (error) {
    log("error", "workshop_request_failed", {
      message: error instanceof Error ? error.message : "Unknown Odoo error",
      backend: "odoo18",
    });
    return jsonResponse(
      { success: false, error: "Unable to process workshop request" },
      502
    );
  }
};
