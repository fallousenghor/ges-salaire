
import prisma from '../config/db';
import { CreateUserDto, UpdateUserDto } from '../type/user.type';
import UserEntreprise from '../type/userEntreprise';
import { PaginationParams } from '../type/pagination.types';
import { paginateResults } from '../utils/pagination.utils';
import { Prisma } from '@prisma/client';

export class UserRepository {
  async create(data: CreateUserDto) {
    const { roles, statut, ...userData } = data;
  let userEntrepriseToCreate: UserEntreprise[] = [];
    if (Array.isArray(roles)) {
      for (const r of roles) {
        if (r.role === 'SUPER_ADMIN') {
          userEntrepriseToCreate.push({ role: 'SUPER_ADMIN' });
        } else if (r.role === 'CAISSIER') {
          // Si caissier, entrepriseId obligatoire
          if (!r.entrepriseId) {
            throw new Error('Le caissier doit être lié à une entreprise (entrepriseId obligatoire)');
          }
          userEntrepriseToCreate.push({ entrepriseId: r.entrepriseId, role: r.role });
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

  async findSuperAdminAccess(params: { where: Prisma.SuperAdminAccessWhereInput }) {
    return prisma.superAdminAccess.findFirst({
      where: params.where
    });
  }

  async findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      include: { roles: true }
    });
  }

  async findAll(pagination?: PaginationParams) {
    const total = await prisma.user.count();
    const items = await prisma.user.findMany({
      include: { roles: true },
      skip: pagination?.page ? (pagination.page - 1) * (pagination.limit || 10) : undefined,
      take: pagination?.limit,
    });
    return pagination ? paginateResults(items, total, pagination) : items;
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
