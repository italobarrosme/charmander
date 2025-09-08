import { FastifyInstance } from 'fastify';
import { loteQuerySchema, loteSchema } from '../schemas/lote.schema.js';
import { LoteService } from '../services/lote.service.js';
import { createLoteDoc, getLoteByIdDoc, getAllLotesDoc, processLoteDoc } from '../docs/lote.doc.js';
import { handleErrorValidation } from '../utils/handleErrorValidation.js';

export async function loteRoutes(app: FastifyInstance) {
  const service = new LoteService();

  app.post('/lotes', { schema: createLoteDoc.schema }, async (request, reply) => {
    const parsed = loteSchema.safeParse(request.body);
    if (!parsed.success) {
      return handleErrorValidation({ error: parsed.error, reply });
    }

    const savedLote = await service.create(parsed.data);
    return reply.status(201).send(savedLote);
  });

  app.get('/lotes', { schema: getAllLotesDoc.schema }, async (request, reply) => {
    const parsed = loteQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      return handleErrorValidation({ error: parsed.error, reply });
    }
    const lotes = await service.findAll(parsed.data);
    return reply.status(200).send(lotes);
  });

  app.get('/lotes/:id', getLoteByIdDoc, async (request, reply) => {
    const parsed = loteSchema.pick({ id: true }).safeParse(request.params);
    if (!parsed.success) {
      return handleErrorValidation({ error: parsed.error, reply });
    }

    const lote = await service.findById(parsed.data.id);
    if (!lote) {
      return handleErrorValidation({
        error: new Error('Lote not found'),
        reply,
        statusCode: 404,
      });
    }

    return reply.status(200).send(lote);
  });

  app.patch('/lotes/:id/process', processLoteDoc, async (request, reply) => {
    const parsed = loteSchema.pick({ id: true }).safeParse(request.params);
    if (!parsed.success) {
      return handleErrorValidation({ error: parsed.error, reply, statusCode: 404 });
    }

    const lote = await service.processLote(parsed.data.id);

    if (!lote) {
      return handleErrorValidation({
        error: new Error('Lote not found'),
        reply,
        statusCode: 404,
        message: 'Lote not found',
      });
    }

    return reply.status(200).send(lote);
  });
}
