import type { APIRoute } from "astro"
import { TicketSchema } from "../../lib/validation/ticket.schema"
import { createEspoEntity } from "../../lib/espo"
import { log } from "../../lib/logger"

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()

    const result = TicketSchema.safeParse(body)

    // 🔎 VALIDACIÓN ZOD
    if (!result.success) {

      const errors = result.error.flatten()

      console.log("❌ VALIDATION ERROR:", errors)

      log("warn", "ticket_validation_failed", {
        errors
      })

      return new Response(
        JSON.stringify({
          success: false,
          errors
        }),
        { status: 400 }
      )
    }

    const data = result.data

    // 🔧 Payload para Espo
    const payload = {
      name: `Taller - ${data.brand} ${data.model || ""}`.trim(),

      description: data.message,

      emailAddress: data.email,
      phoneNumber: data.phone,

      status: "New",

      // Campos personalizados
      cMarca: data.brand,
      cModelo: data.model || "",
      cNumerserie: data.serialNumber || "",

      cTipoServicio: "Reparación",
      cEstadoServicio: "Recibido",
      cPrioridadTecnica: "Media"
    }

    console.log("📦 PAYLOAD ENVIADO A ESPO:", payload)

    const espoResponse = await createEspoEntity("Case", payload)

    log("info", "ticket_created", {
      id: espoResponse.id,
      brand: data.brand
    })

    return new Response(
      JSON.stringify({
        success: true,
        id: espoResponse.id
      }),
      { status: 200 }
    )

  } catch (error: any) {

    console.log("🔥 ERROR SERVIDOR:", error)

    log("error", "ticket_creation_failed", {
      message: error.message
    })

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { status: 500 }
    )
  }
}
