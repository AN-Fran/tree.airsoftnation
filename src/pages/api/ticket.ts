import type { APIRoute } from "astro"
import { TicketSchema } from "../../lib/validation/ticket.schema"
import { createEspoEntity } from "../../lib/espo"
import { log } from "../../lib/logger"

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()

    const result = TicketSchema.safeParse(body)

    if (!result.success) {
      log("warn", "ticket_validation_failed", {
        errors: result.error.flatten()
      })

      return new Response(
        JSON.stringify({ success: false }),
        { status: 400 }
      )
    }

    const data = result.data

    const payload = {
      name: `Taller - ${data.brand} ${data.model || ""}`.trim(),

      description: data.message,

      emailAddress: data.email,
      phoneNumber: data.phone,

      status: "New", // Estado general Espo

      // 🔧 Campos personalizados
      cMarca: data.brand,
      cModelo: data.model || "",
      cNumerserie: data.serialNumber || "",

      cTipoServicio: "Reparación",
      cEstadoServicio: "Recibido",
      cPrioridadTecnica: "Media"
    }

    const espoResponse = await createEspoEntity("Case", payload)

    log("info", "ticket_created", {
      id: espoResponse.id,
      brand: data.brand,
      tipoServicio: "Reparación"
    })

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    )

  } catch (error: any) {

    log("error", "ticket_creation_failed", {
      message: error.message
    })

    return new Response(
      JSON.stringify({ success: false }),
      { status: 500 }
    )
  }
}
