import { PaymentDTO } from "../schemas/payment.schema"
import { AppDataSource } from "../config/db"
import { LoteDTO, LoteQueryDTO } from "../schemas/lote.schema"
import { Lote } from "../entities/Lote"
import { Payment } from "../entities/Payment"

const simulateProcessingPayments = (transactions: Payment[], lote: Lote) => {
  transactions.map((transaction) => {
    if (transaction.status === "PEDDING") {
      // 80% chance de aprovar, 20% chance de cancelar
      const approved = Math.random() < 0.8
      transaction.status = approved ? "APPROVED" : "CANCELED"

      if (approved) {
        const tax = (Number(transaction.value) * Number(lote.tax)) / 100
        transaction.value = Number(transaction.value) - tax
      }
    }
  })

  return {
    transactions,
    netValue: transactions.reduce((acc, transaction) => acc + Number(transaction.value), 0)
  }
}


export class LoteService {
  private loteRepo = AppDataSource.getRepository(Lote)
  private paymentRepo = AppDataSource.getRepository(Payment)

  // 🔹 converte DTO (validado pelo Zod) em entidade TypeORM
  private toEntity(dto: LoteDTO): Lote {
    return this.loteRepo.create({
      codeGasStation: dto.codeGasStation,
      nameGasStation: dto.nameGasStation,
      period: {
        start: new Date(dto.period.start),
        end: new Date(dto.period.end),
      },
      tax: dto.tax,
      transactions: dto.transactions.map((transaction: PaymentDTO) =>
        this.paymentRepo.create({
          ...transaction,
          dateTransaction: new Date(transaction.dateTransaction),
        })
      ),
      grossValue: 0,
      netValue: 0,
    })
  }

  // 🔹 cria e persiste o lote
  async create(dto: LoteDTO): Promise<Lote> {
    const lote = this.toEntity(dto)

    const grossValue = dto.transactions.reduce((acc, transaction) => acc + Number(transaction.value), 0)
    lote.grossValue = grossValue


    return await this.loteRepo.save(lote)
  }

  // busca lote por id (com pagamentos)
  async findById(id: string): Promise<Lote | null> {
    const lote = await this.loteRepo.findOne({
      where: { id },
      relations: ["transactions"],
    })
    return lote
  }


  async findAll(query: LoteQueryDTO): Promise<{ data: Lote[], total: number, page: number, limit: number, totalPages: number }> {
    const { page, limit, sort } = query;

    const [lotes, total] = await this.loteRepo.findAndCount({
      relations: ["transactions"],
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      order: { period: sort },
    })

    return {
      data: lotes,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    }
  }

  async processLote(id: string): Promise<Lote | null> {
    const lote = await this.loteRepo.findOne({
      where: { id },
      relations: ["transactions"],
    })

    if (!lote)  return null

    const { transactions, netValue } = simulateProcessingPayments(lote.transactions, lote)
    lote.transactions = transactions
    lote.netValue = netValue

    return await this.loteRepo.save(lote)
  }
}
