import prisma from '../config/db';
import { CreateEmployeDto, UpdateEmployeDto } from '../type/employe.type';

export class EmployeRepository {
  async create(data: CreateEmployeDto) {
    return prisma.employe.create({ data });
  }

  async findById(id: number) {
    return prisma.employe.findUnique({ where: { id } });
  }

  async findAll() {
    return prisma.employe.findMany();
  }

  async update(id: number, data: UpdateEmployeDto) {
    return prisma.employe.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.employe.delete({ where: { id } });
  }
}
