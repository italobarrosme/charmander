export const createPaymentDoc = {
  schema: {
    description: "Cria um pagamento",
    tags: ["Pagamentos"],
    body: {
      type: "object",
      properties: {
        cpf: { type: "string" },
        dateTransaction: { type: "string", format: "date-time" },
        value: { type: "number" },
        typePayment: {
          type: "string",
          enum: ["PIX", "CREDIT", "MERCADO_PAGO"],
        },
        status: {
          type: "string",
          enum: ["PEDDING", "APPROVED", "CANCELED", "REVERSED"],
        },
        product: { type: "string", enum: ["SUPPLY", "SERVICES", "OTHERS"] },
      },
    },
    required: [
      "cpf",
      "dateTransaction",
      "value",
      "typePayment",
      "status",
      "product",
    ],
    response: {
      201: {
        type: "object",
        properties: {
          cpf: { type: "string" },
          dateTransaction: { type: "string", format: "date-time" },
          value: { type: "number" },
          typePayment: {
            type: "string",
            enum: ["PIX", "CREDIT", "MERCADO_PAGO"],
          },
          status: {
            type: "string",
            enum: ["PEDDING", "APPROVED", "CANCELED", "REVERSED"],
          },
          product: { type: "string", enum: ["SUPPLY", "SERVICES", "OTHERS"] },
        },
      },
      400: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
      500: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
};

export const getPaymentByCpfDoc = {
  schema: {
    description: "Busca um pagamento por cpf",
    tags: ["Pagamentos"],
    params: {
      type: "object",
      properties: {
        cpf: { type: "string" },
      },
    },
    response: {
      200: {
        type: "object",
        properties: {
          cpf: { type: "string" },
          dateTransaction: { type: "string", format: "date-time" },
          value: { type: "number" },
          typePayment: {
            type: "string",
            enum: ["PIX", "CREDIT", "MERCADO_PAGO"],
          },
          status: {
            type: "string",
            enum: ["PEDDING", "APPROVED", "CANCELED", "REVERSED"],
          },
          product: { type: "string", enum: ["SUPPLY", "SERVICES", "OTHERS"] },
        },
      },
      404: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
      400: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
      500: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
};

export const getAllPaymentsDoc = {
  schema: {
    description: "Busca todos os pagamentos",
    tags: ["Pagamentos"],
    query: {
      type: "object",
      properties: {
        page: { type: "number" },
        limit: { type: "number" },
        sort: { type: "string", enum: ["ASC", "DESC"] },
      },
    },
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          cpf: { type: "string" },
          dateTransaction: { type: "string", format: "date-time" },
          value: { type: "number" },
          typePayment: {
            type: "string",
            enum: ["PIX", "CREDIT", "MERCADO_PAGO"],
          },
          status: {
            type: "string",
            enum: ["PEDDING", "APPROVED", "CANCELED", "REVERSED"],
          },
          product: { type: "string", enum: ["SUPPLY", "SERVICES", "OTHERS"] },
        },
      },
    },
    400: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
};
