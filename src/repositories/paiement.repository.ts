import prisma from '../config/db';

import { CreatePaiementDto, UpdatePaiementDto } from '../type/paiement.types';

export class PaiementRepository {
  async create(data: CreatePaiementDto) {
    return prisma.paiement.create({ data });
  }

  async findById(id: number) {
    return prisma.paiement.findUnique({ where: { id } });
  }

  async findAll() {
    return prisma.paiement.findMany();
  }

  async update(id: number, data: UpdatePaiementDto) {
    return prisma.paiement.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.paiement.delete({ where: { id } });
  }
}
