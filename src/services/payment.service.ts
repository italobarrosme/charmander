import { AppDataSource } from "src/config/db";
import { PaymentDTO, PaymentQueryDTO } from "src/schemas/payment.schema";
import { Payment } from "src/entities/Payment";

export class PaymentService {
  private paymentRepo = AppDataSource.getRepository(Payment);

  private toEntity(dto: PaymentDTO): Payment {
    return this.paymentRepo.create({
      cpf: dto.cpf,
      value: dto.value,
      dateTransaction: new Date(dto.dateTransaction),
      status: dto.status,
      typePayment: dto.typePayment,
      product: dto.product,
    });
  }

  // 🔹 cria e persiste o pagamento
  async create(dto: PaymentDTO): Promise<Payment> {
    const payment = this.toEntity(dto);

    return await this.paymentRepo.save(payment);
  }

  // 🔹 busca pagamento por cpf
  async findById(cpf: string): Promise<Payment | null> {
    return await this.paymentRepo.findOne({ where: { cpf } });
  }

  // 🔹 busca todos os pagamentos
  async findAll(
    query: PaymentQueryDTO
  ): Promise<{
    data: Payment[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page, limit, sort } = query;

    const [payments, total] = await this.paymentRepo.findAndCount({
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      order: { dateTransaction: sort },
    });

    return {
      data: payments,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }
}
