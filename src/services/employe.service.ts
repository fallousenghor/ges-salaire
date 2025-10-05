import prisma from '../config/db';
import { CreateEmployeDto, UpdateEmployeDto } from '../type/employe.type';

export class EmployeService {
  async getEmployesByEntreprisePaginated(entrepriseId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [employes, total] = await Promise.all([
      prisma.employe.findMany({ where: { entrepriseId }, skip, take: limit, include: { entreprise: true, badge: true } }),
      prisma.employe.count({ where: { entrepriseId } })
    ]);
    return { employes, total, page, limit };
  }
  async createEmploye(data: CreateEmployeDto) {
    try {
      // Générer une matricule si non fournie
      if (!data.matricule) {
        data.matricule = await this.generateUniqueMatricule();
      }
      // Vérifier unicité
      const exist = await prisma.employe.findUnique({ where: { matricule: data.matricule } });
      if (exist) {
        throw new Error('La matricule existe déjà.');
      }
      // Créer l'employé
      const employe = await prisma.employe.create({ data });

      // Générer le QR code
      let qrCode = '';
      try {
        const { generateQRCode } = await import('../utils/qrcode');
        qrCode = await generateQRCode(data.matricule);
      } catch (err) {
        console.error('Erreur génération QR code:', err);
        qrCode = '';
      }

      // Créer le badge
      try {
        const { createBadge } = await import('./badge.service');
        await createBadge(employe.id, data.matricule!, qrCode);
      } catch (err) {
        console.error('Erreur création badge:', err);
      }

      return employe;
    } catch (err) {
      console.error('Erreur création employé:', err);
      throw err;
    }
  }

  // Génère une matricule unique simple (ex: EMP20251002-XXXX)
  async generateUniqueMatricule(): Promise<string> {
    let matricule;
    let exist;
    do {
      matricule = `EMP${new Date().toISOString().slice(0,10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
      exist = await prisma.employe.findUnique({ where: { matricule } });
    } while (exist);
    return matricule;
  }


  async getEmployesByEntreprise(entrepriseId: number) {
    return prisma.employe.findMany({ where: { entrepriseId }, include: { entreprise: true, badge: true } });
  }

  // Recherche/filtres avancés
  async searchEmployes(entrepriseId: number, filters: {
    statut?: string;
    poste?: string;
    typeContrat?: string;
    actif?: boolean;
  }) {
    return prisma.employe.findMany({
      where: {
        entrepriseId,
        ...(filters.statut ? { statut: filters.statut as any } : {}),
        ...(filters.poste ? { poste: filters.poste } : {}),
        ...(filters.typeContrat ? { typeContrat: filters.typeContrat as any } : {}),
        ...(filters.actif !== undefined ? { actif: filters.actif } : {}),
      },
      include: { entreprise: true, badge: true },
    });
  }

  // Activation/désactivation
  async setEmployeActif(id: number, actif: boolean) {
    return prisma.employe.update({ where: { id }, data: { actif } });
  }

  async getEmployeById(id: number) {
    return prisma.employe.findUnique({
      where: { id },
      include: { badge: true },
    });
  }

  async updateEmploye(id: number, data: UpdateEmployeDto) {
    return prisma.employe.update({ where: { id }, data });
  }

  async deleteEmploye(id: number) {
    return prisma.employe.delete({ where: { id } });
  }
}
