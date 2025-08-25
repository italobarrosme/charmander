import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { PaymentService } from './payment.service';
import { AppDataSource } from '../config/db';
import { PaymentType, PaymentStatus, ProductType } from '../entities/Payment';

// Mock do TypeORM
vi.mock('../config/db', () => ({
  AppDataSource: {
    getRepository: vi.fn(),
  },
}));

describe('PaymentService', () => {
  let service: PaymentService;
  let mockRepository: any;

  // Configuração que roda antes de cada teste
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-03-20T00:00:00.000Z'));
    // Cria um repositório mockado com todas as funções que usamos
    mockRepository = {
      create: vi.fn(),
      save: vi.fn(),
      findOne: vi.fn(),
      findAndCount: vi.fn(),
    };

    // Configura o mock para retornar nosso repositório mockado
    vi.mocked(AppDataSource.getRepository).mockReturnValue(mockRepository);

    // Cria uma nova instância do service para cada teste
    service = new PaymentService();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Teste do método create / Test create method
  it('should create a payment successfully | deve criar um pagamento com sucesso', async () => {
    // Prepara os dados de teste
    const paymentMock = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      cpf: '12345678900',
      value: 150.5,
      dateTransaction: new Date('2024-03-20T00:00:00.000Z'),
      status: 'PEDDING' as PaymentStatus,
      typePayment: 'CREDIT' as PaymentType,
      product: 'SUPPLY' as ProductType,
    };

    // Configura o comportamento esperado dos mocks
    mockRepository.create.mockReturnValue({ ...paymentMock });
    mockRepository.save.mockResolvedValue({ ...paymentMock });

    // Executa o método que queremos testar
    const resultado = await service.create(paymentMock);

    // Verifica se o resultado é o esperado
    expect(resultado).toEqual({ ...paymentMock });

    // Verifica se os métodos do repositório foram chamados corretamente
    expect(mockRepository.create).toHaveBeenCalledWith(paymentMock);
    expect(mockRepository.save).toHaveBeenCalled();
  });

  // Teste do método findById / Test findById method
  it('should find a payment by CPF | deve encontrar um pagamento por CPF', async () => {
    const cpf = '12345678900';
    const paymentMock = {
      id: '123e4567-e89b-12d3-a456-426614164000',
      cpf,
      value: 150.5,
      status: 'PEDDING',
    };

    mockRepository.findOne.mockResolvedValue(paymentMock);

    const resultado = await service.findById(cpf);

    expect(resultado).toEqual(paymentMock);
    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { cpf } });
  });

  // Teste de paginação / Pagination test
  it('should return paginated payments | deve retornar payments paginados', async () => {
    const query = {
      page: 1,
      limit: 10,
      sort: 'ASC' as const,
    };

    const paymentsMock = [
      { id: '123e4567-e89b-12d3-a456-426614154000', value: 100 },
      { id: '123e4567-e89b-12d3-a456-426614144000', value: 200 },
    ];

    mockRepository.findAndCount.mockResolvedValue([paymentsMock, 2]);

    const resultado = await service.findAll(query);

    expect(resultado).toEqual({
      data: paymentsMock,
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    });

    expect(mockRepository.findAndCount).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      order: { dateTransaction: 'ASC' },
    });
  });

  // Teste de payment não encontrado / Test payment not found
  it('should return null when payment not found | deve retornar null quando payment não encontrado', async () => {
    mockRepository.findOne.mockResolvedValue(null);
    const resultado = await service.findById('cpf-inexistente');
    expect(resultado).toBeNull();
  });

  // Teste de lista vazia / Test empty list
  it('should return empty list when no payments exist | deve retornar lista vazia quando não existem payments', async () => {
    const query = { page: 1, limit: 10, sort: 'ASC' as const };
    mockRepository.findAndCount.mockResolvedValue([[], 0]);

    const resultado = await service.findAll(query);

    expect(resultado).toEqual({
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    });
  });

  // Teste de paginação com offset / Test pagination with offset
  it('should calculate correct pagination offset | deve calcular offset de paginação corretamente', async () => {
    const query = { page: 3, limit: 5, sort: 'DESC' as const };
    mockRepository.findAndCount.mockResolvedValue([[], 20]);

    await service.findAll(query);

    expect(mockRepository.findAndCount).toHaveBeenCalledWith({
      skip: 10, // (page-1) * limit = (3-1) * 5 = 10
      take: 5,
      order: { dateTransaction: 'DESC' },
    });
  });
});
