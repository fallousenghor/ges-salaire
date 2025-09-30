
import prisma from '../config/db';
import { RoleType } from '../type/role.type';



export class UserEntrepriseService {
  async addUserToEntreprise(userId: number, entrepriseId: number, role: RoleType) {
    return prisma.userEntreprise.create({
      data: {
        userId,
        entrepriseId,
        role,
      },
    });
  }

  async getUsersByEntreprise(entrepriseId: number) {
    return prisma.userEntreprise.findMany({
      where: { entrepriseId },
      include: { user: true },
    });
  }

  async removeUserFromEntreprise(userEntrepriseId: number) {
    return prisma.userEntreprise.delete({
      where: { id: userEntrepriseId },
    });
  }
}

