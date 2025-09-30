
import prisma from '../config/db';
import { CreateEmployeDto, UpdateEmployeDto } from '../type/employe.type';

export class EmployeService {
  async createEmploye(data: CreateEmployeDto) {
    return prisma.employe.create({ data });
  }

  async getEmployesByEntreprise(entrepriseId: number) {
    return prisma.employe.findMany({ where: { entrepriseId } });
  }

  async getEmployeById(id: number) {
    return prisma.employe.findUnique({ where: { id } });
  }

  async updateEmploye(id: number, data: UpdateEmployeDto) {
    return prisma.employe.update({ where: { id }, data });
  }

  async deleteEmploye(id: number) {
    return prisma.employe.delete({ where: { id } });
  }
}
