import { EmployeType } from './employe.type';
import { PaiementType } from './paiement.types';
import { PayRunType } from './payrun.types';
import { StatutPayslip } from './role.type';

export interface PayslipType {
  id: number;
  employe: EmployeType;
  payrun: PayRunType;
  brut: number;
  deductions: number;
  netAPayer: number;
  statut: StatutPayslip;
  paiements: PaiementType[];
  verrouille: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePayslipDto {
  employeId: number;
  payrunId: number;
  brut: number;
  deductions?: number;
  netAPayer: number;
  statut?: StatutPayslip;
  verrouille?: boolean;
}

export interface UpdatePayslipDto {
  brut?: number;
  deductions?: number;
  netAPayer?: number;
  statut?: StatutPayslip;
  verrouille?: boolean;
}
