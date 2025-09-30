import prisma from "../config/db";
import { CreatePayslipDto, UpdatePayslipDto } from "../type/payslip.types";



export class PayslipService {
  async createPayslip(data: CreatePayslipDto) {
    return prisma.payslip.create({ data });
  }

  async getPayslipsByEmploye(employeId: number) {
    return prisma.payslip.findMany({ where: { employeId } });
  }

  async getPayslipsByPayrun(payrunId: number) {
    return prisma.payslip.findMany({ where: { payrunId } });
  }

  async getPayslipById(id: number) {
    return prisma.payslip.findUnique({ where: { id } });
  }

  async updatePayslip(id: number, data: UpdatePayslipDto) {
    return prisma.payslip.update({ where: { id }, data });
  }

  async deletePayslip(id: number) {
    return prisma.payslip.delete({ where: { id } });
  }
}
