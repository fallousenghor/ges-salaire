

import prisma from "../config/db";
import { CreatePayRunDto, UpdatePayRunDto } from "../type/payrun.types";
import { PayslipService } from "./payslip.service";
import { PaginationParams } from "../type/pagination.types";
import { paginateResults } from "../utils/pagination.utils";

export class PayRunService {
  async getAllPayRuns(entrepriseId?: number, pagination?: PaginationParams) {
    const where = entrepriseId ? { entrepriseId } : undefined;
    const total = await prisma.payRun.count({ where });
    const items = await prisma.payRun.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: pagination?.page ? (pagination.page - 1) * (pagination.limit || 10) : undefined,
      take: pagination?.limit,
    });
    
    return pagination ? paginateResults(items, total, pagination) : items;
  }

  async updatePayRunStatus(id: number, statut: string) {
    return prisma.payRun.update({ where: { id }, data: { statut: statut as any } });
  }

  async createPayRun(data: CreatePayRunDto) {
    // Retirer typePeriode du payload car il n'existe pas dans le modèle Prisma PayRun
    const { typePeriode, ...rest } = data;
    // Création du cycle de paie
    const payRun = await prisma.payRun.create({ data: rest });

    // Récupérer les employés de l'entreprise
    const employes = await prisma.employe.findMany({ where: { entrepriseId: rest.entrepriseId, actif: true } });

    // Générer un bulletin de paie pour chaque employé
    const payslipService = new PayslipService();
    for (const employe of employes) {
      // Calculs simplifiés, à adapter selon la logique métier
      const salaireFixe = employe.salaireFixe || 0;
      const tauxJournalier = employe.tauxJournalier || 0;
      const honoraire = employe.honoraire || 0;
      let brut = salaireFixe;
      
      if (employe.typeContrat === 'JOURNALIER') {
        // Calculer le nombre de jours pointés dans le cycle
        const nbJoursTravailles = await prisma.pointage.count({
          where: {
            employeId: employe.id,
            date: {
              gte: new Date(rest.periodeDebut),
              lte: new Date(rest.periodeFin)
            }
          }
        });
        brut = tauxJournalier * nbJoursTravailles;
      }
      
      if (employe.typeContrat === 'HONORAIRE') brut = honoraire;
      // Deductions et net à payer à adapter selon la logique métier
      const deductions = 0;
      const netAPayer = brut - deductions;
      await payslipService.createPayslip({
        employeId: employe.id,
        payrunId: payRun.id,
        brut,
        deductions,
        netAPayer,
        statut: 'EN_ATTENTE',
      });
    }
    return payRun;
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
