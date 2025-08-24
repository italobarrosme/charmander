import { z } from "zod";

export const paymentSchema = z.object({
  cpf: z.string().min(11).max(11),
  dateTransaction: z.string().datetime(),
  value: z.number().positive(),
  typePayment: z.enum(["PIX", "CREDIT", "MERCADO_PAGO"]),
  status: z.enum(["PEDDING", "APPROVED", "CANCELED", "REVERSED"]),
  product: z.enum(["SUPPLY", "SERVICES", "OTHERS"]),
});

export type PaymentDTO = z.infer<typeof paymentSchema>;


export const paymentQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).default(10),
  sort: z.enum(["ASC", "DESC"]).default("ASC"),
});

export type PaymentQueryDTO = z.infer<typeof paymentQuerySchema>;