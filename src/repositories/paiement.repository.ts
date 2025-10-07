import prisma from '../config/db';
import { CreatePaiementDto, UpdatePaiementDto } from '../type/paiement.types';
import { PaginationParams } from '../type/pagination.types';
import { paginateResults } from '../utils/pagination.utils';

export class PaiementRepository {
  async create(data: CreatePaiementDto) {
    return prisma.paiement.create({ data });
  }

  async findById(id: number) {
    return prisma.paiement.findUnique({ where: { id } });
  }

  async findAll(pagination?: PaginationParams) {
    const total = await prisma.paiement.count();
    const items = await prisma.paiement.findMany({
      skip: pagination?.page ? (pagination.page - 1) * (pagination.limit || 10) : undefined,
      take: pagination?.limit,
    });
    return pagination ? paginateResults(items, total, pagination) : items;
  }

  async update(id: number, data: UpdatePaiementDto) {
    return prisma.paiement.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.paiement.delete({ where: { id } });
  }
}
