import prisma from '../config/db';
import { Payslip } from '@prisma/client';
import { CreatePayslipDto, UpdatePayslipDto } from '../type/payslip.types';

export class PayslipRepository {
  async create(data: CreatePayslipDto) {
    return prisma.payslip.create({ data });
  }

  async findById(id: number) {
    return prisma.payslip.findUnique({ where: { id } });
  }

  async findAll() {
    return prisma.payslip.findMany();
  }

  async update(id: number, data: UpdatePayslipDto) {
    return prisma.payslip.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.payslip.delete({ where: { id } });
  }
}
