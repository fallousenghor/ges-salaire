import { EntrepriseType } from './entreprise.type';
import { StatutEmploye, TypeContrat } from './role.type';



export interface EmployeType {
  id: number;
  entreprise: EntrepriseType;
  nomComplet: string;
  poste?: string;
  typeContrat: TypeContrat;
  salaireFixe?: number;
  tauxJournalier?: number;
  honoraire?: number;
  coordonneesBancaires?: string;
  statut: StatutEmploye;
  actif: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEmployeDto {
  entrepriseId: number;
  nomComplet: string;
  matricule?: string;
  poste?: string;
  typeContrat: TypeContrat;
  salaireFixe?: number;
  tauxJournalier?: number;
  honoraire?: number;
  coordonneesBancaires?: string;
  statut?: StatutEmploye;
  actif?: boolean;
}

export interface UpdateEmployeDto {
  nomComplet?: string;
  matricule?: string;
  poste?: string;
  typeContrat?: TypeContrat;
  salaireFixe?: number;
  tauxJournalier?: number;
  honoraire?: number;
  coordonneesBancaires?: string;
  statut?: StatutEmploye;
  actif?: boolean;
}
