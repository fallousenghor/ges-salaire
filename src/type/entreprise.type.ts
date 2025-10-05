import { TypePeriode } from "./role.type";

export interface EntrepriseType {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  adresse?: string;
  logo?: string;
  devise: string;
  typePeriode: TypePeriode;
  couleurPrimaire: string;
  couleurSecondaire: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEntrepriseDto {
  nom: string;
  email: string;
  telephone: string;
  adresse?: string | null;
  logo?: string | null;
  devise: string;
  typePeriode: TypePeriode;
  couleurPrimaire?: string;
  couleurSecondaire?: string;
}

export interface UpdateEntrepriseDto {
  nom?: string;
  email?: string;
  telephone?: string;
  adresse?: string | null;
  logo?: string | null;
  devise?: string;
  typePeriode?: TypePeriode;
  statut?: string;
  couleurPrimaire?: string;
  couleurSecondaire?: string;
}
