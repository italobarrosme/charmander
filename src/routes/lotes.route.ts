import { FastifyInstance } from 'fastify';
import { loteQuerySchema, loteSchema } from '../schemas/lote.schema.js';
import { LoteService } from '../services/lote.service.js';
import { createLoteDoc, getLoteByIdDoc, getAllLotesDoc, processLoteDoc } from '../docs/lote.doc.js';

export async function loteRoutes(app: FastifyInstance) {
  const service = new LoteService();

  app.post('/lotes', { schema: createLoteDoc.schema }, async (request, reply) => {
    const parsed = loteSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        success: false,
        errors: parsed.error.format(),
      });
    }

    const savedLote = await service.create(parsed.data);
    return reply.status(201).send(savedLote);
  });

  app.get('/lotes', { schema: getAllLotesDoc.schema }, async (request, reply) => {
    const parsed = loteQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      return reply.status(400).send({
        success: false,
        errors: parsed.error.format(),
      });
    }
    const lotes = await service.findAll(parsed.data);
    return reply.status(200).send(lotes);
  });

  app.get('/lotes/:id', getLoteByIdDoc, async (request, reply) => {
    const parsed = loteSchema.pick({ id: true }).safeParse(request.params);
    if (!parsed.success) {
      return reply.status(404).send({
        message: 'Lote not found',
        errors: parsed.error.format(),
      });
    }

    const lote = await service.findById(parsed.data.id);
    if (!lote) {
      return reply.status(404).send({ message: 'Lote not found' });
    }

    return reply.status(200).send(lote);
  });

  app.patch('/lotes/:id/process', processLoteDoc, async (request, reply) => {
    const parsed = loteSchema.pick({ id: true }).safeParse(request.params);
    if (!parsed.success) {
      return reply.status(404).send({ message: 'Lote not found' });
    }

    const lote = await service.processLote(parsed.data.id);

    if (!lote) {
      return reply.status(404).send({ message: 'Lote not found' });
    }

    return reply.status(200).send(lote);
  });
}
