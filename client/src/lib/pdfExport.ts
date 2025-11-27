/**
 * Utilitaire d'export PDF pour analyses et copies
 * Utilise jsPDF pour générer des PDFs côté client
 */

import { jsPDF } from 'jspdf';

interface AnalysisData {
  title?: string;
  content: string;
  contentType: string;
  globalScore: number;
  seoScore: number;
  conversionScore: number;
  engagementScore: number;
  readabilityScore: number;
  psychologyScore: number;
  recommendations: any;
  createdAt: Date;
}

interface CopyData {
  brief: string;
  contentType: string;
  generatedContent: string;
  framework?: string;
  tone?: string;
  length?: string;
  createdAt: Date;
}

/**
 * Exporter une analyse de contenu en PDF
 */
export function exportAnalysisToPDF(analysis: AnalysisData) {
  const doc = new jsPDF();
  let yPosition = 20;
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(255, 153, 0); // Accent color
  doc.text('Sionohmair Insight Academy', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Analyse de Contenu Marketing', 20, yPosition);
  yPosition += 15;
  
  // Date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Généré le ${new Date(analysis.createdAt).toLocaleDateString('fr-FR')}`, 20, yPosition);
  yPosition += 15;
  
  // Titre
  if (analysis.title) {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Titre : ${analysis.title}`, 20, yPosition);
    yPosition += 10;
  }
  
  // Type de contenu
  doc.setFontSize(12);
  doc.text(`Type : ${analysis.contentType}`, 20, yPosition);
  yPosition += 15;
  
  // Scores
  doc.setFontSize(14);
  doc.setTextColor(255, 153, 0);
  doc.text('Scores d\'Analyse', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Score Global : ${analysis.globalScore}/100`, 20, yPosition);
  yPosition += 8;
  doc.text(`SEO : ${analysis.seoScore}/100`, 20, yPosition);
  yPosition += 8;
  doc.text(`Conversion : ${analysis.conversionScore}/100`, 20, yPosition);
  yPosition += 8;
  doc.text(`Engagement : ${analysis.engagementScore}/100`, 20, yPosition);
  yPosition += 8;
  doc.text(`Lisibilité : ${analysis.readabilityScore}/100`, 20, yPosition);
  yPosition += 8;
  doc.text(`Psychologie : ${analysis.psychologyScore}/100`, 20, yPosition);
  yPosition += 15;
  
  // Recommandations
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFontSize(14);
  doc.setTextColor(255, 153, 0);
  doc.text('Recommandations', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  if (analysis.recommendations) {
    const recommendations = typeof analysis.recommendations === 'string' 
      ? analysis.recommendations 
      : JSON.stringify(analysis.recommendations, null, 2);
    
    const lines = doc.splitTextToSize(recommendations, 170);
    lines.forEach((line: string) => {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 20, yPosition);
      yPosition += 6;
    });
  }
  
  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} sur ${pageCount} - Sionohmair Insight Academy`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Télécharger
  const filename = `analyse-${analysis.title?.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'contenu'}-${Date.now()}.pdf`;
  doc.save(filename);
}

/**
 * Exporter une copy générée en PDF
 */
export function exportCopyToPDF(copy: CopyData) {
  const doc = new jsPDF();
  let yPosition = 20;
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(255, 153, 0);
  doc.text('Sionohmair Insight Academy', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Copy Générée', 20, yPosition);
  yPosition += 15;
  
  // Date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Généré le ${new Date(copy.createdAt).toLocaleDateString('fr-FR')}`, 20, yPosition);
  yPosition += 15;
  
  // Informations
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Type : ${copy.contentType}`, 20, yPosition);
  yPosition += 8;
  
  if (copy.framework) {
    doc.text(`Framework : ${copy.framework}`, 20, yPosition);
    yPosition += 8;
  }
  
  if (copy.tone) {
    doc.text(`Ton : ${copy.tone}`, 20, yPosition);
    yPosition += 8;
  }
  
  if (copy.length) {
    doc.text(`Longueur : ${copy.length}`, 20, yPosition);
    yPosition += 8;
  }
  
  yPosition += 7;
  
  // Brief
  doc.setFontSize(14);
  doc.setTextColor(255, 153, 0);
  doc.text('Brief', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  const briefLines = doc.splitTextToSize(copy.brief, 170);
  briefLines.forEach((line: string) => {
    if (yPosition > 280) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(line, 20, yPosition);
    yPosition += 6;
  });
  
  yPosition += 10;
  
  // Contenu généré
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFontSize(14);
  doc.setTextColor(255, 153, 0);
  doc.text('Contenu Généré', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  const contentLines = doc.splitTextToSize(copy.generatedContent, 170);
  contentLines.forEach((line: string) => {
    if (yPosition > 280) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(line, 20, yPosition);
    yPosition += 6;
  });
  
  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} sur ${pageCount} - Sionohmair Insight Academy`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Télécharger
  const filename = `copy-${copy.contentType}-${Date.now()}.pdf`;
  doc.save(filename);
}
