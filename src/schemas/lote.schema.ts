import { z } from "zod" 
import { paymentSchema } from "./payment.schema"

export const loteSchema = z.object({
    id: z.string().uuid(),
    codeGasStation: z.string().min(1),
    nameGasStation: z.string().min(1),
    period: z.object({
      start: z.string().datetime(),
      end: z.string().datetime(),
    }),
    tax: z.number().min(0),
    transactions: z.array(z.string().uuid()),
    grossValue: z.number().min(0),
    netValue: z.number().min(0),
  })

export type LoteDTO = z.infer<typeof loteSchema>


export const loteQuerySchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
  sort: z.enum(["asc", "desc"]).default("asc"),
})

export type LoteQueryDTO = z.infer<typeof loteQuerySchema>