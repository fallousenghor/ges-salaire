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
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEntrepriseDto {
  nom: string;
  email: string;
  telephone: string;
  adresse?: string;
  logo?: string;
  devise?: string;
  typePeriode: TypePeriode;
}

export interface UpdateEntrepriseDto {
  nom?: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  logo?: string;
  devise?: string;
  typePeriode?: TypePeriode;
}
