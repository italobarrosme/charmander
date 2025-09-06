export const createLoteDoc = {
  schema: {
    description: 'Cria um novo lote com pagamentos',
    tags: ['Lotes'],
    body: {
      type: 'object',
      properties: {
        gasStationCode: { type: 'string' },
        nameGasStation: { type: 'string' },
        period: {
          type: 'object',
          properties: {
            start: { type: 'string', format: 'date-time' },
            end: { type: 'string', format: 'date-time' },
          },
          required: ['start', 'end'],
        },
        tax: { type: 'number' },
        transactions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              cpf: { type: 'string' },
              dateTransaction: { type: 'string', format: 'date-time' },
              value: { type: 'number' },
              typePayment: {
                type: 'string',
                enum: ['PIX', 'CREDIT', 'MERCADO_PAGO'],
              },
              status: {
                type: 'string',
                enum: ['PEDDING', 'APPROVED', 'CANCELED', 'REVERSED'],
              },
              product: {
                type: 'string',
                enum: ['SUPPLY', 'SERVICES', 'OTHERS'],
              },
            },
            required: ['cpf', 'dateTransaction', 'value', 'typePayment', 'status', 'product'],
          },
        },
      },
      required: ['gasStationCode', 'nameGasStation', 'period', 'tax', 'transactions'],
    },
    response: {
      201: {
        description: 'Lote criado com sucesso',
        type: 'object',
      },
      400: {
        description: 'Erro de validação',
        type: 'object',
      },
      500: {
        description: 'Erro interno',
        type: 'object',
      },
    },
  },
};

export const getLoteByIdDoc = {
  schema: {
    description: 'Busca um lote pelo ID',
    tags: ['Lotes'],
    params: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
      },
      required: ['id'],
    },
    response: {
      200: {
        description: 'Lote encontrado',
        type: 'object',
      },
      404: {
        description: 'Lote não encontrado',
        type: 'object',
      },
      400: {
        description: 'Erro de validação',
        type: 'object',
      },
      500: {
        description: 'Erro interno',
        type: 'object',
      },
    },
  },
};

export const getAllLotesDoc = {
  schema: {
    description: 'Busca todos os lotes',
    tags: ['Lotes'],
    querystring: {
      type: 'object',
      properties: {
        page: { type: 'number' },
        limit: { type: 'number' },
        sort: { type: 'string', enum: ['asc', 'desc'] },
      },
      required: ['page', 'limit', 'sort'],
    },
    response: {
      200: {
        description: 'Lotes encontrados',
        type: 'object',
      },
      400: {
        description: 'Erro de validação',
        type: 'object',
      },
      500: {
        description: 'Erro interno',
        type: 'object',
      },
    },
  },
};

export const processLoteDoc = {
  schema: {
    description: 'Processa os pagamentos de um lote (mock síncrono)',
    tags: ['Lotes'],
    params: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
      },
      required: ['id'],
    },
    response: {
      200: {
        description: 'Lote processado com sucesso',
        type: 'object',
      },
      404: {
        description: 'Lote não encontrado',
        type: 'object',
      },
    },
  },
};
