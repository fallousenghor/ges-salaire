import { EntrepriseType } from './entreprise.type';
import { RoleType, UserStatut } from './role.type';

export interface UserEntrepriseType {
  id: number;
  role: RoleType;
  entreprise: EntrepriseType;
}

export interface UserType {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  roles: UserEntrepriseType[];
  createdAt: Date;
  updatedAt: Date;
}


export interface CreateUserDto {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  roles?: { entrepriseId: number; role: RoleType }[];
  statut?: UserStatut;
  doitChangerMotDePasse?: boolean;
}

export interface UpdateUserDto {
  nom?: string;
  prenom?: string;
  email?: string;
  motDePasse?: string;
  roles?: { entrepriseId: number; role: RoleType }[];
  statut?: UserStatut;
  doitChangerMotDePasse?: boolean;
}
