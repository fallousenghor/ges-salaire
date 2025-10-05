import prisma from '../config/db';

export async function getDashboardKPI(entrepriseId: number) {
  // Masse salariale totale (somme des nets à payer des bulletins de l'entreprise)
  const totalPayroll = await prisma.payslip.aggregate({
    _sum: { netAPayer: true },
    where: { employe: { entrepriseId } },
  });

  // Montant payé (somme des paiements liés à l'entreprise)
  const totalPaid = await prisma.paiement.aggregate({
    _sum: { montant: true },
    where: { payslip: { employe: { entrepriseId } } },
  });

  // Montant restant (masse salariale - payé)
  const montantRestant = (totalPayroll._sum.netAPayer || 0) - (totalPaid._sum.montant || 0);

  // Nombre d'employés actifs
  const nbEmployesActifs = await prisma.employe.count({
    where: { entrepriseId, actif: true },
  });

  // Evolution masse salariale 6 derniers mois
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const evolution = await prisma.payslip.groupBy({
    by: ['createdAt'],
    _sum: { netAPayer: true },
    where: {
      employe: { entrepriseId },
      createdAt: { gte: sixMonthsAgo },
    },
    orderBy: { createdAt: 'asc' },
  });

  // Prochains paiements à effectuer (payslips non totalement payés)
  const prochainsPaiements = await prisma.payslip.findMany({
    where: {
      employe: { entrepriseId },
      statut: { in: ['EN_ATTENTE', 'PARTIEL'] },
    },
    include: { employe: true },
    orderBy: { createdAt: 'asc' },
    take: 10,
  });

  return {
    masseSalariale: totalPayroll._sum.netAPayer || 0,
    montantPaye: totalPaid._sum.montant || 0,
    montantRestant,
    nbEmployesActifs,
    evolution,
    prochainsPaiements,
  };
}
