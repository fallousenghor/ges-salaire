import prisma from '../config/db';
import { PayRun } from '@prisma/client';
import { CreatePayRunDto, UpdatePayRunDto } from '../type/payrun.types';

export class PayRunRepository {
  async create(data: CreatePayRunDto) {
    return prisma.payRun.create({ data });
  }

  async findById(id: number) {
    return prisma.payRun.findUnique({ where: { id } });
  }

  async findAll() {
    return prisma.payRun.findMany();
  }

  async update(id: number, data: UpdatePayRunDto) {
    return prisma.payRun.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.payRun.delete({ where: { id } });
  }
}
