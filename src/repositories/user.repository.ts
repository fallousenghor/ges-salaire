
import prisma from '../config/db';
import { CreateUserDto, UpdateUserDto } from '../type/user.type';
import UserEntreprise from '../type/userEntreprise';

export class UserRepository {
  async create(data: CreateUserDto) {
    const { roles, statut, ...userData } = data;
  let userEntrepriseToCreate: UserEntreprise[] = [];
    if (Array.isArray(roles)) {
      for (const r of roles) {
        if (r.role === 'SUPER_ADMIN') {
          userEntrepriseToCreate.push({ role: 'SUPER_ADMIN' });
        } else if (r.entrepriseId) {
          userEntrepriseToCreate.push({ entrepriseId: r.entrepriseId, role: r.role });
        }
      }
    }
    return prisma.user.create({
      data: {
        ...userData,
        roles: userEntrepriseToCreate.length > 0 ? { create: userEntrepriseToCreate } : undefined,
      },
    });
  }

  async findById(id: number) {
    return prisma.user.findUnique({ where: { id }, include: { roles: true } });
  }

  async findAll() {
    return prisma.user.findMany({ include: { roles: true } });
  }

  async update(id: number, data: UpdateUserDto) {
    const { roles, ...userData } = data;
    return prisma.user.update({
      where: { id },
      data: {
        ...userData,
        // roles: roles ? { set: roles } : undefined,
      },
      include: { roles: true },
    });
  }

  async delete(id: number) {
    return prisma.user.delete({ where: { id } });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email }, include: { roles: true } });
  }

}
