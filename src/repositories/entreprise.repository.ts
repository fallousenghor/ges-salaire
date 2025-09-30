import prisma from '../config/db';
import { CreateEntrepriseDto, UpdateEntrepriseDto } from '../type/entreprise.type';

export class EntrepriseRepository {
  async create(data: CreateEntrepriseDto) {
    return prisma.entreprise.create({ data });
  }

  async findById(id: number) {
    return prisma.entreprise.findUnique({ where: { id } });
  }

  async findAll() {
    return prisma.entreprise.findMany();
  }

  async update(id: number, data: UpdateEntrepriseDto) {
    return prisma.entreprise.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.entreprise.delete({ where: { id } });
  }
}
