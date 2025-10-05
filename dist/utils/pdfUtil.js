"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRecuPDF = generateRecuPDF;
exports.generatePayslipPDF = generatePayslipPDF;
const pdfkit_1 = __importDefault(require("pdfkit"));
// Génère un reçu PDF simple et l'envoie dans la réponse HTTP
function generateRecuPDF(res, paiement, employe, entreprise) {
    const doc = new pdfkit_1.default();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="recu.pdf"');
    doc.pipe(res);
    doc.fontSize(18).text('Reçu de Paiement', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Entreprise : ${entreprise.nom}`);
    doc.text(`Employé : ${employe.nomComplet}`);
    doc.text(`Montant : ${paiement.montant} ${entreprise.devise}`);
    doc.text(`Date : ${new Date(paiement.datePaiement).toLocaleDateString()}`);
    doc.text(`Mode : ${paiement.mode}`);
    doc.moveDown();
    doc.text('Merci pour votre paiement.');
    doc.end();
}
// Génère un bulletin de paie PDF simple
function generatePayslipPDF(res, payslip, employe, entreprise) {
    const doc = new pdfkit_1.default({ size: 'A4', margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="bulletin.pdf"');
    doc.pipe(res);
    // Logo (si url/logo fourni)
    if (entreprise.logo) {
        try {
            doc.image(entreprise.logo, doc.page.width - 120, 30, { width: 80 }).moveDown();
        }
        catch { }
    }
    doc
        .fontSize(22)
        .fillColor('#2563eb')
        .text(entreprise.nom, { align: 'left', continued: false });
    doc.moveDown(0.5);
    doc
        .fontSize(16)
        .fillColor('#222')
        .text('Bulletin de Paie', { align: 'center' });
    doc.moveDown(1);
    doc
        .fontSize(12)
        .fillColor('#444')
        .text(`Employé : `, { continued: true })
        .font('Helvetica-Bold')
        .text(employe.nomComplet)
        .font('Helvetica')
        .moveDown(0.2)
        .text(`Période : ${payslip.periode || payslip.createdAt?.toLocaleDateString?.() || ''}`)
        .text(`Statut : ${payslip.statut}`)
        .moveDown(0.5);
    doc
        .fontSize(13)
        .fillColor('#111')
        .text('Détail du Salaire', { underline: true })
        .moveDown(0.5);
    doc
        .fontSize(12)
        .fillColor('#111')
        .text(`Salaire brut : ${payslip.brut || payslip.netAPayer} ${entreprise.devise}`)
        .text(`Déductions : ${payslip.deductions || 0} ${entreprise.devise}`)
        .text(`Net à payer : ${payslip.netAPayer} ${entreprise.devise}`)
        .moveDown(1);
    doc
        .fontSize(10)
        .fillColor('#888')
        .text(`Entreprise : ${entreprise.nom} | Adresse : ${entreprise.adresse || ''}`)
        .text(`Téléphone : ${entreprise.telephone || ''} | Email : ${entreprise.email || ''}`)
        .moveDown(2);
    doc
        .fontSize(10)
        .fillColor('#aaa')
        .text('Document généré automatiquement. Merci pour votre confiance.', { align: 'center' });
    doc.end();
}
