import prisma from '../config/db';
import { Payslip } from '@prisma/client';
import { CreatePayslipDto, UpdatePayslipDto } from '../type/payslip.types';
import { PaginationParams } from '../type/pagination.types';
import { paginateResults } from '../utils/pagination.utils';

export class PayslipRepository {
  async create(data: CreatePayslipDto) {
    return prisma.payslip.create({ data });
  }

  async findById(id: number) {
    return prisma.payslip.findUnique({ where: { id } });
  }

  async findAll(pagination?: PaginationParams) {
    const total = await prisma.payslip.count();
    const items = await prisma.payslip.findMany({
      skip: pagination?.page ? (pagination.page - 1) * (pagination.limit || 10) : undefined,
      take: pagination?.limit,
    });
    return pagination ? paginateResults(items, total, pagination) : items;
  }

  async update(id: number, data: UpdatePayslipDto) {
    return prisma.payslip.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.payslip.delete({ where: { id } });
  }
}
