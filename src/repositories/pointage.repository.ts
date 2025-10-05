import prisma from '../config/db';

export class PointageRepository {
  async create(employeId: number, date: Date = new Date()) {
    return prisma.pointage.create({ data: { employeId, date } });
  }

  async countByEmploye(employeId: number) {
    return prisma.pointage.count({ where: { employeId } });
  }

  async getByEmploye(employeId: number) {
    return prisma.pointage.findMany({ where: { employeId } });
  }
}
