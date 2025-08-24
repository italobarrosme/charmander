import Fastify from "fastify"
import swagger from "@fastify/swagger"
import swaggerUi from "@fastify/swagger-ui"
import { loteRoutes } from "./routes/lotes.route"
import { paymentRoutes } from "./routes/payment.route"

export const buildApp = () => {
  const app = Fastify({ logger: true })


  
  // 🔹 Registro do Swagger
  app.register(swagger, {
    swagger: {
      info: {
        title: "Payments API",
        description: "API para gerenciamento de lotes de pagamentos",
        version: "1.0.0",
      },
      schemes: ["http"],
      consumes: ["application/json"],
      produces: ["application/json"],
    },
  })

  // 🔹 UI do Swagger
  app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
  })


  // Health check
  app.get("/", async () => {
    return { message: "API online ✅" }
  })

  // Rotas
  app.register(paymentRoutes, { prefix: "/api" })
  app.register(loteRoutes, { prefix: "/api" })

  return app
}
