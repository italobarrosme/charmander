import { FastifyInstance } from "fastify";
import { paymentQuerySchema, paymentSchema } from "../schemas/payment.schema";
import { PaymentService } from "../services/payment.service";
import { createPaymentDoc, getPaymentByCpfDoc, getAllPaymentsDoc } from "../docs/payment.doc";

export async function paymentRoutes(app: FastifyInstance) {
    const service = new PaymentService();

    // 🔹 cria pagamento
    app.post("/payments", { schema: createPaymentDoc.schema }, async (request, reply) => {
        const parsed = paymentSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.status(400).send({
                success: false,
                errors: parsed.error.format(),
            });
        }

        const savedPayment = await service.create(parsed.data);
        return reply.status(201).send(savedPayment);
    });

    // 🔹 busca pagamento por cpf
    app.get("/payments/:cpf", { schema: getPaymentByCpfDoc.schema }, async (request, reply) => {
        const parsed = paymentSchema.pick({ cpf: true }).safeParse(request.params);
        if (!parsed.success) {
            return reply.status(400).send({
                success: false,
                errors: parsed.error.format(),
            });
        }

        const payment = await service.findById(parsed.data.cpf);
        if (!payment) {
            return reply.status(404).send({
                success: false,
                errors: {
                    message: "Pagamento não encontrado",
                },
            });
        }
        return reply.status(200).send(payment);
    });

    // 🔹 busca todos os pagamentos
    app.get("/payments", { schema: getAllPaymentsDoc.schema }, async (request, reply) => {
        const parsed = paymentQuerySchema.safeParse(request.query);
        if (!parsed.success) {
            return reply.status(400).send({
                success: false,
                errors: parsed.error.format(),
            });
        }

        const payments = await service.findAll(parsed.data);
        return reply.status(200).send(payments);
    });
}