import type { APIRoute } from "astro";
import { createWorkshopTicket } from "../../lib/contact-odoo";
import { TicketSchema } from "../../lib/validation/ticket.schema";
import { log } from "../../lib/logger";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const result = TicketSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.flatten();

      log("warn", "ticket_validation_failed", {
        errors,
      });

      return new Response(
        JSON.stringify({
          success: false,
          errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = result.data;

    const ticketId = await createWorkshopTicket({
      name: data.name,
      email: data.email,
      phone: data.phone,
      serviceType: data.serviceType,
      brand: data.brand,
      model: data.model || undefined,
      serialNumber: data.serialNumber || undefined,
      message: data.message,
    });

    log("info", "ticket_created", {
      id: ticketId,
      brand: data.brand,
      backend: "odoo18",
    });

    return new Response(
      JSON.stringify({
        success: true,
        id: ticketId,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    console.error("Workshop Odoo error:", message);

    log("error", "ticket_creation_failed", {
      message,
      backend: "odoo18",
    });

    return new Response(
      JSON.stringify({
        success: false,
        error: "Server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
