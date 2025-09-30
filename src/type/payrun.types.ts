import { EntrepriseType } from "./entreprise.type";
import { StatutPayRun, TypePeriode } from "./role.type";

export interface PayRunType {
  id: number;
  entreprise: EntrepriseType;
  periodeDebut: Date;
  periodeFin: Date;
  typePeriode: TypePeriode;
  statut: StatutPayRun;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePayRunDto {
  entrepriseId: number;
  periodeDebut: Date;
  periodeFin: Date;
  typePeriode: TypePeriode;
  statut?: StatutPayRun;
}

export interface UpdatePayRunDto {
  periodeDebut?: Date;
  periodeFin?: Date;
  typePeriode?: TypePeriode;
  statut?: StatutPayRun;
}
