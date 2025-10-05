
import prisma from "../config/db";
import { CreatePaiementDto, UpdatePaiementDto } from "../type/paiement.types";

export class PaiementService {
  async getPaiementsByPayslipPaginated(payslipId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [paiements, total] = await Promise.all([
      prisma.paiement.findMany({ where: { payslipId }, skip, take: limit }),
      prisma.paiement.count({ where: { payslipId } })
    ]);
    return { paiements, total, page, limit };
  }

  // Utilitaires pour PDF
  async getPayslipById(id: number) {
    return prisma.payslip.findUnique({ where: { id } });
  }

  async getEmployeById(id: number) {
    return prisma.employe.findUnique({ where: { id } });
  }

  async getEntrepriseById(id: number) {
    return prisma.entreprise.findUnique({ where: { id } });
  }

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

  // Met à jour le statut d'un paiement (si champ statut existe)
  async updatePaiementStatus(id: number, statut: string) {
    return prisma.paiement.update({
      where: { id },
      data: { statut: statut as any },
    });
  }

  async getCurrentMonthStats(entrepriseId: number) {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Obtenir les employés actifs
    const actifs = await prisma.employe.count({
      where: {
        entrepriseId,
        actif: true
      }
    });

    // Obtenir les bulletins et paiements du mois en cours avec leurs relations
    const payslips = await prisma.payslip.findMany({
      where: {
        employe: {
          entrepriseId
        },
        createdAt: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth
        }
      },
      select: {
        brut: true,
        netAPayer: true,
        paiements: {
          select: {
            montant: true
          }
        }
      }
    });

    // Calculer les totaux
    const masseSalariale = payslips.reduce((sum, p) => sum + (p.brut || 0), 0);
    const montantPaye = payslips.reduce((sum, p) => 
      sum + p.paiements.reduce((pSum, paiement) => pSum + (paiement.montant || 0), 0), 
      0
    );
    const montantRestant = payslips.reduce((sum, p) => sum + (p.netAPayer || 0), 0) - montantPaye;

    return {
      actifs,
      masseSalariale,
      montantPaye,
      montantRestant
    };
  }
}
