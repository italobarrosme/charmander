import { AppDataSource } from "../config/db"
import { LoteDTO, LoteQueryDTO } from "../schemas/lote.schema"
import { Lote } from "../entities/Lote"
import { Payment } from "../entities/Payment"
import { In } from "typeorm"

const simulateProcessingPayments = (transactions: Payment[], lote: Lote) => {
  transactions.forEach((transaction) => {
    if (transaction.status === "PEDDING") {
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
    netValue: transactions.reduce((acc, t) => acc + Number(t.value), 0),
  }
}

export class LoteService {
  private loteRepo = AppDataSource.getRepository(Lote)
  private paymentRepo = AppDataSource.getRepository(Payment)

  private toEntity(dto: LoteDTO): Lote {
    return this.loteRepo.create({
      codeGasStation: dto.codeGasStation,
      nameGasStation: dto.nameGasStation,
      period: {
        start: new Date(dto.period.start),
        end: new Date(dto.period.end),
      },
      tax: dto.tax,
      grossValue: dto.grossValue,
      netValue: dto.netValue,
    })
  }

  async create(dto: LoteDTO): Promise<Lote> {
    const lote = this.toEntity(dto)

    const transactions = await this.paymentRepo.find({
      where: { id: In(dto.transactions) },
    })

    lote.transactions = transactions

    const grossValue = transactions.reduce(
      (acc, t) => acc + Number(t.value),
      0
    )
    lote.grossValue = grossValue

    return await this.loteRepo.save(lote)
  }

  async findById(id: string): Promise<Lote | null> {
    return await this.loteRepo.findOne({
      where: { id },
      relations: ["transactions"],
    })
  }

  async findAll(query: LoteQueryDTO) {
    const { page, limit, sort } = query

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
    if (!lote) return null

    const transactions = await this.paymentRepo.find({
      where: { id: In(lote.transactions.map((t) => t.id)) },
    })

    const { transactions: updated, netValue } = simulateProcessingPayments(
      transactions,
      lote
    )

    // salva as mudanças nos pagamentos
    await this.paymentRepo.save(updated)

    // atualiza lote
    lote.transactions = updated
    lote.netValue = netValue

    return await this.loteRepo.save(lote)
  }
}
