import { PayslipType } from "./payslip.types";
import { ModePaiement } from "./role.type";

export interface PaiementType {
  id: number;
  payslip: PayslipType;
  montant: number;
  mode: ModePaiement;
  datePaiement: Date;
  pdfRecu?: string;
}

export interface CreatePaiementDto {
  payslipId: number;
  montant: number;
  mode: ModePaiement;
  datePaiement?: Date;
  pdfRecu?: string;
}

export interface UpdatePaiementDto {
  montant?: number;
  mode?: ModePaiement;
  datePaiement?: Date;
  pdfRecu?: string;
}
