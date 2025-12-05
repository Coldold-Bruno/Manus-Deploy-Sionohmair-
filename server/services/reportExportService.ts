/**
 * Service d'export de rapports (PDF/Excel) avec graphiques
 * Génère des rapports professionnels pour l'analyse des données
 */

import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Types de rapports disponibles
export type ReportType = 
  | 'analytics'           // Rapport d'analytics global
  | 'leads'               // Rapport de performance des leads
  | 'financial'           // Rapport financier (revenus, MRR)
  | 'newsletter'          // Rapport d'engagement newsletter
  | 'conversion'          // Rapport de conversion par segment
  | 'custom';             // Rapport personnalisé

// Format d'export
export type ExportFormat = 'pdf' | 'excel';

// Interface d'un rapport
export interface Report {
  title: string;
  subtitle?: string;
  period: {
    start: Date;
    end: Date;
  };
  sections: ReportSection[];
  metadata?: Record<string, any>;
}

// Section d'un rapport
export interface ReportSection {
  title: string;
  type: 'kpi' | 'table' | 'chart' | 'text';
  data: any;
  description?: string;
}

/**
 * Exporter un rapport en PDF
 */
export async function exportReportToPDF(report: Report): Promise<Buffer> {
  const doc = new jsPDF();
  let yPosition = 20;

  // En-tête du rapport
  doc.setFontSize(20);
  doc.text(report.title, 105, yPosition, { align: 'center' });
  yPosition += 10;

  if (report.subtitle) {
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(report.subtitle, 105, yPosition, { align: 'center' });
    yPosition += 10;
  }

  // Période du rapport
  doc.setFontSize(10);
  doc.setTextColor(150);
  const periodText = `Période: ${formatDate(report.period.start)} - ${formatDate(report.period.end)}`;
  doc.text(periodText, 105, yPosition, { align: 'center' });
  yPosition += 15;

  // Ligne de séparation
  doc.setDrawColor(200);
  doc.line(20, yPosition, 190, yPosition);
  yPosition += 10;

  // Sections du rapport
  for (const section of report.sections) {
    // Vérifier si on a besoin d'une nouvelle page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    // Titre de la section
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(section.title, 20, yPosition);
    yPosition += 8;

    if (section.description) {
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(section.description, 20, yPosition);
      yPosition += 6;
    }

    // Contenu de la section selon le type
    switch (section.type) {
      case 'kpi':
        yPosition = renderKPIsInPDF(doc, section.data, yPosition);
        break;
      case 'table':
        yPosition = renderTableInPDF(doc, section.data, yPosition);
        break;
      case 'text':
        yPosition = renderTextInPDF(doc, section.data, yPosition);
        break;
      case 'chart':
        // Les graphiques nécessitent une implémentation côté client
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text('[Graphique non disponible en PDF - utilisez Excel]', 20, yPosition);
        yPosition += 10;
        break;
    }

    yPosition += 10;
  }

  // Pied de page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} sur ${pageCount} - Généré le ${formatDate(new Date())}`,
      105,
      290,
      { align: 'center' }
    );
  }

  return Buffer.from(doc.output('arraybuffer'));
}

/**
 * Exporter un rapport en Excel
 */
export async function exportReportToExcel(report: Report): Promise<Buffer> {
  const workbook = XLSX.utils.book_new();

  // Feuille de résumé
  const summaryData = [
    ['Rapport:', report.title],
    ['Sous-titre:', report.subtitle || ''],
    ['Période:', `${formatDate(report.period.start)} - ${formatDate(report.period.end)}`],
    ['Généré le:', formatDate(new Date())],
    [],
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Résumé');

  // Créer une feuille pour chaque section
  for (const section of report.sections) {
    const sheetName = section.title.substring(0, 31); // Excel limite à 31 caractères
    let sheetData: any[][] = [];

    switch (section.type) {
      case 'kpi':
        sheetData = convertKPIsToSheetData(section.data);
        break;
      case 'table':
        sheetData = convertTableToSheetData(section.data);
        break;
      case 'text':
        sheetData = [[section.data]];
        break;
      case 'chart':
        // Pour les graphiques, on exporte les données brutes
        sheetData = convertChartDataToSheetData(section.data);
        break;
    }

    const sheet = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
  }

  // Générer le buffer
  const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return Buffer.from(excelBuffer);
}

/**
 * Fonctions utilitaires pour le rendu PDF
 */

function renderKPIsInPDF(doc: jsPDF, kpis: any[], yPosition: number): number {
  const kpiData = kpis.map(kpi => [
    kpi.label,
    kpi.value,
    kpi.change ? `${kpi.change > 0 ? '+' : ''}${kpi.change}%` : '-'
  ]);

  autoTable(doc, {
    startY: yPosition,
    head: [['Indicateur', 'Valeur', 'Évolution']],
    body: kpiData,
    theme: 'grid',
    headStyles: { fillColor: [15, 25, 41] },
    margin: { left: 20, right: 20 },
  });

  return (doc as any).lastAutoTable.finalY + 10;
}

function renderTableInPDF(doc: jsPDF, tableData: any, yPosition: number): number {
  const { headers, rows } = tableData;

  autoTable(doc, {
    startY: yPosition,
    head: [headers],
    body: rows,
    theme: 'striped',
    headStyles: { fillColor: [15, 25, 41] },
    margin: { left: 20, right: 20 },
  });

  return (doc as any).lastAutoTable.finalY + 10;
}

function renderTextInPDF(doc: jsPDF, text: string, yPosition: number): number {
  doc.setFontSize(10);
  doc.setTextColor(0);
  const lines = doc.splitTextToSize(text, 170);
  doc.text(lines, 20, yPosition);
  return yPosition + (lines.length * 5);
}

/**
 * Fonctions utilitaires pour l'export Excel
 */

function convertKPIsToSheetData(kpis: any[]): any[][] {
  const data = [['Indicateur', 'Valeur', 'Évolution', 'Tendance']];
  
  for (const kpi of kpis) {
    data.push([
      kpi.label,
      kpi.value,
      kpi.change ? `${kpi.change}%` : '-',
      kpi.change > 0 ? '↑' : kpi.change < 0 ? '↓' : '→'
    ]);
  }

  return data;
}

function convertTableToSheetData(tableData: any): any[][] {
  const { headers, rows } = tableData;
  return [headers, ...rows];
}

function convertChartDataToSheetData(chartData: any): any[][] {
  if (!chartData || !chartData.labels || !chartData.datasets) {
    return [['Aucune donnée disponible']];
  }

  const data: any[][] = [['Label', ...chartData.datasets.map((d: any) => d.label)]];
  
  for (let i = 0; i < chartData.labels.length; i++) {
    const row = [chartData.labels[i]];
    for (const dataset of chartData.datasets) {
      row.push(dataset.data[i]);
    }
    data.push(row);
  }

  return data;
}

/**
 * Formater une date
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

/**
 * Rapports pré-configurés
 */

export function createAnalyticsReport(data: any, period: { start: Date; end: Date }): Report {
  return {
    title: 'Rapport d\'Analytics',
    subtitle: 'Vue d\'ensemble des performances',
    period,
    sections: [
      {
        title: 'Indicateurs Clés',
        type: 'kpi',
        data: [
          { label: 'Total Leads', value: data.totalLeads, change: data.leadsChange },
          { label: 'Leads Chauds', value: data.hotLeads, change: data.hotLeadsChange },
          { label: 'Taux de Conversion', value: `${data.conversionRate}%`, change: data.conversionChange },
          { label: 'Revenus', value: `${data.revenue}€`, change: data.revenueChange },
        ]
      },
      {
        title: 'Répartition des Leads par Température',
        type: 'table',
        data: {
          headers: ['Température', 'Nombre', 'Pourcentage'],
          rows: [
            ['Froid', data.coldLeads, `${((data.coldLeads / data.totalLeads) * 100).toFixed(1)}%`],
            ['Tiède', data.warmLeads, `${((data.warmLeads / data.totalLeads) * 100).toFixed(1)}%`],
            ['Chaud', data.hotLeads, `${((data.hotLeads / data.totalLeads) * 100).toFixed(1)}%`],
          ]
        }
      }
    ]
  };
}

export function createLeadsReport(data: any, period: { start: Date; end: Date }): Report {
  return {
    title: 'Rapport de Performance des Leads',
    subtitle: 'Analyse détaillée du scoring et de l\'engagement',
    period,
    sections: [
      {
        title: 'Top 10 Leads Chauds',
        type: 'table',
        data: {
          headers: ['Email', 'Score', 'Température', 'Dernière Activité'],
          rows: data.topLeads.map((lead: any) => [
            lead.email,
            lead.score,
            lead.temperature,
            formatDate(new Date(lead.lastActivity))
          ])
        }
      },
      {
        title: 'Activités par Type',
        type: 'table',
        data: {
          headers: ['Type d\'Activité', 'Nombre', 'Score Moyen'],
          rows: data.activitiesByType.map((activity: any) => [
            activity.type,
            activity.count,
            activity.avgScore
          ])
        }
      }
    ]
  };
}

export function createFinancialReport(data: any, period: { start: Date; end: Date }): Report {
  return {
    title: 'Rapport Financier',
    subtitle: 'Revenus et MRR',
    period,
    sections: [
      {
        title: 'Indicateurs Financiers',
        type: 'kpi',
        data: [
          { label: 'Revenus Total', value: `${data.totalRevenue}€`, change: data.revenueChange },
          { label: 'MRR', value: `${data.mrr}€`, change: data.mrrChange },
          { label: 'Nombre de Clients', value: data.customers, change: data.customersChange },
          { label: 'Panier Moyen', value: `${data.avgOrderValue}€`, change: data.avgOrderChange },
        ]
      },
      {
        title: 'Revenus par Produit',
        type: 'table',
        data: {
          headers: ['Produit', 'Ventes', 'Revenus'],
          rows: data.revenueByProduct.map((product: any) => [
            product.name,
            product.sales,
            `${product.revenue}€`
          ])
        }
      }
    ]
  };
}
