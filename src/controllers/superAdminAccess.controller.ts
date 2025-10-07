import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const grantAccessSchema = z.object({
  superAdminId: z.number(),
  entrepriseId: z.number(),
  hasAccess: z.boolean()
});

export const grantSuperAdminAccess = async (req: Request, res: Response) => {
  try {
    const { superAdminId: userId, entrepriseId, hasAccess } = grantAccessSchema.parse(req.body);

    // Vérifier si le super admin existe et récupérer son userEntreprise
    const superAdminUser = await prisma.userEntreprise.findFirst({
      where: {
        userId: userId,
        role: 'SUPER_ADMIN'
      }
    });

    if (!superAdminUser) {
      return res.status(404).json({ message: 'Super admin non trouvé' });
    }

    // On utilise l'ID de l'entrée userEntreprise pour l'accès
    const superAdminId = superAdminUser.id;

    // Vérifier si l'entreprise existe
    const entreprise = await prisma.entreprise.findUnique({
      where: { id: entrepriseId }
    });

    if (!entreprise) {
      return res.status(404).json({ message: 'Entreprise non trouvée' });
    }

    // Vérifier si une entrée UserEntreprise existe déjà
    const existingAccess = await prisma.userEntreprise.findFirst({
      where: {
        userId: userId,
        entrepriseId: entrepriseId
      }
    });

    if (!existingAccess) {
      // Créer une nouvelle entrée UserEntreprise pour donner l'accès ADMIN
      await prisma.userEntreprise.create({
        data: {
          userId: userId,
          entrepriseId: entrepriseId,
          role: 'ADMIN'
        }
      });
    } else {
      // Mettre à jour le rôle si nécessaire
      if (existingAccess.role !== 'ADMIN') {
        await prisma.userEntreprise.update({
          where: { id: existingAccess.id },
          data: { role: 'ADMIN' }
        });
      }
    }

    // Mettre à jour ou créer l'accès super admin
    const access = await prisma.superAdminAccess.upsert({
      where: {
        superAdminId_entrepriseId: {
          superAdminId,
          entrepriseId
        }
      },
      update: {
        hasAccess
      },
      create: {
        superAdminId,
        entrepriseId,
        hasAccess
      }
    });

    // Récupérer les données complètes de l'entreprise
    const entrepriseDetails = await prisma.entreprise.findUnique({
      where: { id: entrepriseId }
    });

    return res.status(200).json({
      message: hasAccess ? 'Accès accordé avec succès' : 'Accès révoqué avec succès',
      access,
      entreprise: entrepriseDetails
    });
  } catch (error) {
    console.error('Erreur lors de la gestion de l\'accès:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getSuperAdminAccess = async (req: Request, res: Response) => {
  try {
    const entrepriseId = parseInt(req.params.entrepriseId);
    const accesses = await prisma.superAdminAccess.findMany({
      where: { entrepriseId },
      include: {
        superAdmin: {
          include: {
            user: {
              select: {
                id: true,
                nom: true,
                prenom: true,
                email: true
              }
            }
          }
        }
      }
    });

    return res.status(200).json(accesses);
  } catch (error) {
    console.error('Erreur lors de la récupération des accès:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};