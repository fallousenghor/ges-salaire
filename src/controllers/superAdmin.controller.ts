import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getMainSuperAdmin = async (_req: Request, res: Response) => {
  try {
    // Récupérer le premier super admin (qui est le principal)
    const mainSuperAdmin = await prisma.user.findFirst({
      where: {
        roles: {
          some: {
            role: 'SUPER_ADMIN'
          }
        }
      },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    if (!mainSuperAdmin) {
      return res.status(404).json({ message: 'Aucun super admin trouvé' });
    }

    return res.json(mainSuperAdmin);
  } catch (error) {
    console.error('Erreur lors de la récupération du super admin principal:', error);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};