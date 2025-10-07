"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRecuPDF = generateRecuPDF;
exports.generatePayslipPDF = generatePayslipPDF;
const pdfkit_1 = __importDefault(require("pdfkit"));
// Génère un reçu PDF avec design professionnel
function generateRecuPDF(res, paiement, employe, entreprise) {
    const doc = new pdfkit_1.default({ size: 'A5', margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="recu.pdf"');
    doc.pipe(res);
    // En-tête avec logo et informations de l'entreprise
    if (entreprise.logo) {
        try {
            const logoPath = `${__dirname}/../../${entreprise.logo.replace(/^\//, '')}`;
            doc.image(logoPath, 40, 30, { width: 80 });
        }
        catch (error) {
            console.error('Erreur lors du chargement du logo:', error);
        }
    }
    // Informations de l'entreprise en haut à droite
    doc.fontSize(9)
        .font('Helvetica')
        .text(entreprise.nom, 300, 40, { align: 'right' })
        .text(entreprise.adresse || '', 300, 52, { align: 'right' })
        .text(entreprise.telephone || '', 300, 64, { align: 'right' })
        .text(entreprise.email || '', 300, 76, { align: 'right' });
    // Titre du document
    doc.moveDown(4)
        .fontSize(18)
        .font('Helvetica-Bold')
        .fillColor(entreprise.couleurPrimaire || '#2563eb')
        .text('REÇU DE PAIEMENT', { align: 'center' });
    // Référence et date
    doc.moveDown(1)
        .fontSize(11)
        .font('Helvetica')
        .fillColor('#444')
        .text(`N° ${paiement.id}`, { align: 'center' })
        .text(`Date : ${new Date(paiement.datePaiement).toLocaleDateString('fr-FR')}`, { align: 'center' });
    // Informations de l'employé dans un cadre
    doc.moveDown(1)
        .roundedRect(40, doc.y, 515, 70, 5)
        .lineWidth(1)
        .strokeColor(entreprise.couleurPrimaire || '#2563eb')
        .stroke();
    const infoY = doc.y + 15;
    doc.fontSize(10)
        .text('BÉNÉFICIAIRE', 50, infoY)
        .font('Helvetica-Bold')
        .text(employe.nomComplet, 50, infoY + 15)
        .font('Helvetica')
        .text(`Matricule : ${employe.matricule || 'N/A'}`, 50, infoY + 30)
        .text(`Poste : ${employe.poste || 'N/A'}`, 50, infoY + 45);
    // Détails du paiement
    doc.moveDown(3)
        .fontSize(12)
        .font('Helvetica-Bold')
        .fillColor(entreprise.couleurPrimaire || '#2563eb')
        .text('DÉTAILS DU PAIEMENT')
        .moveDown(0.5);
    // Tableau des détails
    const tableY = doc.y;
    doc.font('Helvetica')
        .fontSize(10)
        .fillColor('#444');
    // Lignes du tableau avec fond alterné
    const lignes = [
        { label: 'Mode de paiement', value: paiement.mode },
        { label: 'Montant', value: `${formatMontant(paiement.montant)} ${entreprise.devise || 'FCFA'}` }
    ];
    lignes.forEach((ligne, index) => {
        const yPos = tableY + (index * 25);
        // Rectangle de fond pour l'alternance
        if (index % 2 === 0) {
            doc.rect(40, yPos, 515, 25)
                .fillColor('#f8fafc')
                .fill();
        }
        doc.fillColor('#444')
            .text(ligne.label, 50, yPos + 7)
            .text(ligne.value, 300, yPos + 7, { align: 'right' });
    });
    // Message de remerciement
    doc.moveDown(2)
        .fontSize(10)
        .fillColor('#666')
        .text('Nous vous remercions de votre confiance.', { align: 'center' });
    // Pied de page
    const bottomY = doc.page.height - 40;
    doc.fontSize(8)
        .fillColor('#888')
        .text(`Document généré le ${new Date().toLocaleDateString('fr-FR')} par ${entreprise.nom}`, 40, bottomY, { align: 'center' });
    doc.end();
}
// Génère un bulletin de paie PDF avec design professionnel
function generatePayslipPDF(res, payslip, employe, entreprise) {
    const doc = new pdfkit_1.default({ size: 'A4', margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="bulletin.pdf"');
    doc.pipe(res);
    // En-tête avec logo et informations de l'entreprise
    if (entreprise.logo) {
        try {
            const logoPath = `${__dirname}/../../${entreprise.logo.replace(/^\//, '')}`;
            doc.image(logoPath, 50, 40, { width: 100 });
        }
        catch (error) {
            console.error('Erreur lors du chargement du logo:', error);
        }
    }
    // Informations de l'entreprise en haut à droite
    doc.fontSize(10)
        .font('Helvetica')
        .text(entreprise.nom, 400, 50, { align: 'right' })
        .text(entreprise.adresse || '', 400, 65, { align: 'right' })
        .text(entreprise.telephone || '', 400, 80, { align: 'right' })
        .text(entreprise.email || '', 400, 95, { align: 'right' });
    // Titre du document
    doc.moveDown(4)
        .fontSize(20)
        .font('Helvetica-Bold')
        .fillColor(entreprise.couleurPrimaire || '#2563eb')
        .text('BULLETIN DE PAIE', { align: 'center' });
    // Période et référence
    doc.moveDown(1)
        .fontSize(12)
        .font('Helvetica')
        .fillColor('#444')
        .text(`Période : ${payslip.periode || new Date(payslip.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`, { align: 'center' })
        .text(`Référence : ${payslip.id}`, { align: 'center' });
    // Informations de l'employé dans un cadre
    doc.moveDown(1)
        .roundedRect(50, doc.y, 495, 100, 5)
        .lineWidth(1)
        .strokeColor(entreprise.couleurPrimaire || '#2563eb')
        .stroke();
    const employeY = doc.y + 15;
    doc.fontSize(11)
        .text('EMPLOYÉ', 60, employeY)
        .font('Helvetica-Bold')
        .text(employe.nomComplet, 60, employeY + 20)
        .font('Helvetica')
        .text(`Matricule : ${employe.matricule || 'N/A'}`, 60, employeY + 35)
        .text(`Poste : ${employe.poste || 'N/A'}`, 60, employeY + 50)
        .text(`Date d'embauche : ${new Date(employe.dateEmbauche).toLocaleDateString('fr-FR')}`, 60, employeY + 65);
    // Détails du salaire dans un tableau
    doc.moveDown(4)
        .font('Helvetica-Bold')
        .fontSize(13)
        .fillColor(entreprise.couleurPrimaire || '#2563eb')
        .text('DÉTAIL DU SALAIRE')
        .moveDown(0.5);
    // En-têtes du tableau
    const startY = doc.y;
    doc.lineWidth(1)
        .strokeColor('#000')
        .moveTo(50, startY)
        .lineTo(545, startY)
        .stroke();
    doc.fontSize(11)
        .text('Description', 60, startY + 10)
        .text('Base', 300, startY + 10, { width: 100, align: 'right' })
        .text('Montant', 420, startY + 10, { width: 100, align: 'right' });
    doc.lineWidth(1)
        .strokeColor('#000')
        .moveTo(50, startY + 30)
        .lineTo(545, startY + 30)
        .stroke();
    // Contenu du tableau
    doc.font('Helvetica')
        .text('Salaire de base', 60, startY + 40)
        .text(formatMontant(payslip.brut), 300, startY + 40, { width: 100, align: 'right' })
        .text(formatMontant(payslip.brut), 420, startY + 40, { width: 100, align: 'right' });
    if (payslip.deductions) {
        doc.text('Déductions', 60, startY + 60)
            .text(formatMontant(payslip.deductions), 420, startY + 60, { width: 100, align: 'right' });
    }
    // Ligne de total
    const totalY = startY + (payslip.deductions ? 90 : 70);
    doc.lineWidth(1)
        .strokeColor('#000')
        .moveTo(50, totalY)
        .lineTo(545, totalY)
        .stroke();
    doc.font('Helvetica-Bold')
        .text('NET À PAYER', 60, totalY + 10)
        .fillColor(entreprise.couleurPrimaire || '#2563eb')
        .text(formatMontant(payslip.netAPayer) + ' ' + (entreprise.devise || 'FCFA'), 420, totalY + 10, { width: 100, align: 'right' });
    // Pied de page
    const bottomY = doc.page.height - 50;
    doc.fontSize(8)
        .fillColor('#666')
        .text(`Document généré le ${new Date().toLocaleDateString('fr-FR')} - ${entreprise.nom}`, 50, bottomY, { align: 'center' });
    doc.end();
}
// Fonction utilitaire pour formater les montants
function formatMontant(montant) {
    return new Intl.NumberFormat('fr-FR').format(montant);
}
