import prisma from "../config/db";
import { CreatePayRunDto, UpdatePayRunDto } from "../type/payrun.types";



export class PayRunService {
  async createPayRun(data: CreatePayRunDto) {
    return prisma.payRun.create({ data });
  }

  async getPayRunsByEntreprise(entrepriseId: number) {
    return prisma.payRun.findMany({ where: { entrepriseId } });
  }

  async getPayRunById(id: number) {
    return prisma.payRun.findUnique({ where: { id } });
  }

  async updatePayRun(id: number, data: UpdatePayRunDto) {
    return prisma.payRun.update({ where: { id }, data });
  }

  async deletePayRun(id: number) {
    return prisma.payRun.delete({ where: { id } });
  }
}
