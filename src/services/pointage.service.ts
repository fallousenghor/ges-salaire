import { PointageRepository } from '../repositories/pointage.repository';
import prisma from '../config/db';

const pointageRepository = new PointageRepository();

export class PointageService {
  async getNbPointages(employeId: number, start: string, end: string) {
    return prisma.pointage.count({
      where: {
        employeId,
        date: {
          gte: new Date(start),
          lte: new Date(end)
        }
      }
    });
  }
  async getLastPointage(employeId: number) {
    const pointages = await pointageRepository.getByEmploye(employeId);
    if (!pointages.length) return null;
    // Récupère le plus récent
    return pointages.reduce((latest, p) => new Date(p.date) > new Date(latest.date) ? p : latest, pointages[0]);
  }
  async pointer(employeId: number) {
    // Enregistre le pointage du jour
    return pointageRepository.create(employeId);
  }

  async getNbJoursTravailles(employeId: number) {
    return pointageRepository.countByEmploye(employeId);
  }
}
