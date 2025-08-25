import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { LoteService } from './lote.service';
import { AppDataSource } from '../config/db';
import { In } from 'typeorm';

// Mock TypeORM
vi.mock('../config/db', () => ({
  AppDataSource: {
    getRepository: vi.fn(),
  },
}));

describe('LoteService', () => {
  let service: LoteService;
  let mockLoteRepo: any;
  let mockPaymentRepo: any;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-03-20T00:00:00.000Z'));

    mockLoteRepo = {
      create: vi.fn(),
      save: vi.fn(),
      findOne: vi.fn(),
      findAndCount: vi.fn(),
    };

    mockPaymentRepo = {
      create: vi.fn(),
      save: vi.fn(),
      find: vi.fn(),
      findOne: vi.fn(),
      findAndCount: vi.fn(),
    };

    vi.mocked(AppDataSource.getRepository).mockImplementation((entity: any) => {
      if (entity.name === 'Lote') return mockLoteRepo;
      if (entity.name === 'Payment') return mockPaymentRepo;
      return mockLoteRepo; // fallback
    });

    service = new LoteService();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create a lote successfully | deve criar um lote com sucesso', async () => {
    const paymentMock = {
      id: '123e4567-e89b-12d3-a456-426614164000',
      cpf: '12345678900',
      value: 100,
      dateTransaction: new Date('2024-03-20T00:00:00.000Z'),
      status: 'PEDDING',
      typePayment: 'CREDIT',
      product: 'SUPPLY',
    };

    const loteMock = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      transactions: [paymentMock.id],
      grossValue: 100,
      netValue: 90, // após taxa de 10%
      codeGasStation: '123e4567-e89b-12d3-a456-426614154000',
      nameGasStation: 'Gas Station 1',
      period: {
        start: new Date('2024-03-20T00:00:00.000Z'),
        end: new Date('2024-03-20T00:00:00.000Z'),
      },
      tax: 10,
    };

    // Mock do find de payments
    mockPaymentRepo.find.mockResolvedValue([paymentMock]);

    // Mock da criação do lote
    mockLoteRepo.create.mockReturnValue({ ...loteMock, transactions: [paymentMock] });
    mockLoteRepo.save.mockResolvedValue({ ...loteMock, transactions: [paymentMock] });

    const resultado = await service.create(loteMock);

    expect(resultado).toEqual({ ...loteMock, transactions: [paymentMock] });

    expect(mockPaymentRepo.find).toHaveBeenCalledWith({
      where: { id: In([paymentMock.id]) },
    });
    expect(mockLoteRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        codeGasStation: loteMock.codeGasStation,
        nameGasStation: loteMock.nameGasStation,
        period: loteMock.period,
        tax: loteMock.tax,
      }),
    );
    expect(mockLoteRepo.save).toHaveBeenCalled();
  });

  it('should find a lote by id | deve encontrar um lote por id', async () => {
    const id = '123e4567-e89b-12d3-a456-426614174000';
    const paymentMock = {
      id: '123e4567-e89b-12d3-a456-426614164000',
      cpf: '12345678900',
      value: 100,
      dateTransaction: new Date('2024-03-20T00:00:00.000Z'),
      status: 'PEDDING',
      typePayment: 'CREDIT',
      product: 'SUPPLY',
    };

    const loteMock = {
      id,
      transactions: [paymentMock],
      grossValue: 100,
      netValue: 90,
      codeGasStation: '123e4567-e89b-12d3-a456-426614154000',
      nameGasStation: 'Gas Station 1',
      period: {
        start: new Date('2024-03-20T00:00:00.000Z'),
        end: new Date('2024-03-20T00:00:00.000Z'),
      },
      tax: 10,
    };

    mockLoteRepo.findOne.mockResolvedValue(loteMock);

    const resultado = await service.findById(id);

    expect(resultado).toEqual(loteMock);
    expect(mockLoteRepo.findOne).toHaveBeenCalledWith({
      where: { id },
      relations: ['transactions'],
    });
  });

  it('should return paginated lotes | deve retornar lotes paginados', async () => {
    const query = {
      page: 1,
      limit: 10,
      sort: 'asc' as const,
    };

    const lotesMock = [
      { id: '123e4567-e89b-12d3-a456-426614174000', grossValue: 100 },
      { id: '123e4567-e89b-12d3-a456-426614164000', grossValue: 200 },
    ];

    mockLoteRepo.findAndCount.mockResolvedValue([lotesMock, 2]);

    const resultado = await service.findAll(query);

    expect(resultado).toEqual({
      data: lotesMock,
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
  });
});
