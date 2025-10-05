import prisma from "../config/db";


export async function createBadge(employeId: number, matricule: string, qrCode: string) {
  return prisma.badge.create({
    data: {
      employeId,
      matricule,
      qrCode,
    },
  });
}
