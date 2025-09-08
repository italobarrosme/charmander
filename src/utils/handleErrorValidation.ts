import { FastifyReply } from 'fastify';
import { ZodError } from 'zod';

// Definindo um tipo para o corpo da resposta de erro para ser consistente
type ErrorResponseBody = {
  success: false;
  message?: string;
  errors: unknown;
};

type handleErrorValidationProps = {
  error: ZodError | Error;
  reply: FastifyReply;
  statusCode?: number;
  message?: string;
};

export const handleErrorValidation = ({
  error,
  reply,
  statusCode = 400,
  message,
}: handleErrorValidationProps) => {
  const response: ErrorResponseBody = {
    success: false,
    errors: error instanceof ZodError ? error.format() : { message: error.message },
  };
  if (message) {
    response.message = message;
  }
  return reply.status(statusCode).send(response);
};
