import prisma from "../config/db";
import { CreatePaiementDto, UpdatePaiementDto } from "../type/paiement.types";


export class PaiementService {
  async createPaiement(data: CreatePaiementDto ) {
    return prisma.paiement.create({ data });
  }

  async getPaiementsByPayslip(payslipId: number) {
    return prisma.paiement.findMany({ where: { payslipId } });
  }

  async getPaiementById(id: number) {
    return prisma.paiement.findUnique({ where: { id } });
  }

  async updatePaiement(id: number, data: UpdatePaiementDto ) {
    return prisma.paiement.update({ where: { id }, data });
  }

  async deletePaiement(id: number) {
    return prisma.paiement.delete({ where: { id } });
  }
}
