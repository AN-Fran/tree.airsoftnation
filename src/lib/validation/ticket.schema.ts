import { z } from "zod"

export const TicketSchema = z.object({
  name: z.string().min(2),

  email: z.string().email(),

  phone: z.string().min(6),

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

  model: z.string().max(150).optional(),

  serialNumber: z.string().max(100).optional(),

  message: z.string().min(10)
})
