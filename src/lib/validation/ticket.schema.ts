import { z } from "zod"

export const TicketSchema = z.object({

  serviceType: z.enum([
    "Reparación",
    "Upgrade",
    "Mantenimiento",
    "Diagnóstico",
    "Garantía",
    "Consulta"
  ]),

  name: z.string()
    .min(2, "Nombre demasiado corto"),

  email: z.string()
    .email("Email inválido"),

  phone: z.string()
    .regex(/^\+\d{8,15}$/, "Teléfono debe estar en formato internacional +34600000000"),

  brand: z.enum([
    "Tokyo Marui",
    "Specna Arms",
    "VFC",
    "G&G",
    "ICS",
    "LCT",
    "E&L",
    "Cyma",
    "Ares",
    "KWA",
    "WE",
    "Krytac",
    "Classic Army",
    "Umarex",
    "ASG",
    "Arcturus",
    "Double Eagle",
    "Jing Gong",
    "A&K",
    "Army Armament",
    "KWC",
    "Lancer Tactical",
    "Bo Manufactures",
    "Gate",
    "Saigo",
    "Secutor",
    "Evolution",
    "Otra"
  ]),

  model: z.string()
    .max(150)
    .optional()
    .or(z.literal("")),

  serialNumber: z.string()
    .max(100)
    .optional()
    .or(z.literal("")),

  message: z.string()
    .min(10, "Mensaje demasiado corto")

})

