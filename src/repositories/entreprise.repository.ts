import prisma from '../config/db';
import { CreateEntrepriseDto, UpdateEntrepriseDto } from '../type/entreprise.type';
import { PaginationParams } from '../type/pagination.types';
import { paginateResults } from '../utils/pagination.utils';

export class EntrepriseRepository {
  async create(data: CreateEntrepriseDto) {
    return prisma.entreprise.create({ data });
  }

  async findById(id: number) {
    return prisma.entreprise.findUnique({ where: { id } });
  }

  async findAll(pagination?: PaginationParams) {
    const total = await prisma.entreprise.count();
    const items = await prisma.entreprise.findMany({
      skip: pagination?.page ? (pagination.page - 1) * (pagination.limit || 10) : undefined,
      take: pagination?.limit,
      include: {
        superAdminAccess: {
          include: {
            superAdmin: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                    nom: true,
                    prenom: true
                  }
                }
              }
            }
          },
          where: {
            hasAccess: true
          }
        }
      }
    });
    return pagination ? paginateResults(items, total, pagination) : items;
  }

  async update(id: number, data: UpdateEntrepriseDto) {
    return prisma.entreprise.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.entreprise.delete({ where: { id } });
  }
}
