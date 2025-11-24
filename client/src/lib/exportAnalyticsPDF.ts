import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface AnalyticsData {
  overviewStats: any;
  workflowStats: any[];
  abTestStats: any[];
  segmentStats: any;
}

export function exportAnalyticsPDF(data: AnalyticsData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 20;

  // Header
  doc.setFontSize(24);
  doc.setTextColor(249, 115, 22); // Orange primary
  doc.text('Rapport Analytics', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 10;
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  const currentDate = new Date().toLocaleDateString('fr-FR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  doc.text(`Généré le ${currentDate}`, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 15;

  // Overview Stats
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Vue d\'ensemble', 14, yPosition);
  yPosition += 10;

  const overviewData = [
    ['Total Leads', data.overviewStats?.totalLeads || 0],
    ['Leads Hot', data.overviewStats?.hotLeads || 0],
    ['Leads Warm', data.overviewStats?.warmLeads || 0],
    ['Taux de Conversion', `${data.overviewStats?.conversionRate || 0}%`],
    ['Score Moyen', data.overviewStats?.avgScore || 0],
    ['Activités (30j)', data.overviewStats?.totalActivities || 0],
    ['Workflows Actifs', data.overviewStats?.activeWorkflows || 0],
    ['Abonnés Workflows', data.overviewStats?.activeSubscriptions || 0],
    ['Tâches en Attente', data.overviewStats?.pendingTasks || 0],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [['Métrique', 'Valeur']],
    body: overviewData,
    theme: 'striped',
    headStyles: { fillColor: [249, 115, 22] },
    margin: { left: 14, right: 14 },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Segment Stats
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(16);
  doc.text('Répartition des Leads', 14, yPosition);
  yPosition += 10;

  const segmentData = [
    ['Par Température', ''],
    ['  Hot', data.segmentStats?.byTemperature.hot || 0],
    ['  Warm', data.segmentStats?.byTemperature.warm || 0],
    ['  Cold', data.segmentStats?.byTemperature.cold || 0],
    ['Par Intérêt', ''],
    ['  Sprint', data.segmentStats?.byInterest.sprint || 0],
    ['  Niveau 3', data.segmentStats?.byInterest.n3 || 0],
    ['  IA', data.segmentStats?.byInterest.ia || 0],
    ['  Aucun', data.segmentStats?.byInterest.none || 0],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [['Catégorie', 'Nombre']],
    body: segmentData,
    theme: 'striped',
    headStyles: { fillColor: [249, 115, 22] },
    margin: { left: 14, right: 14 },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Workflow Performance
  if (data.workflowStats && data.workflowStats.length > 0) {
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(16);
    doc.text('Performance des Workflows', 14, yPosition);
    yPosition += 10;

    const workflowData = data.workflowStats.map(w => [
      w.name,
      w.active ? 'Actif' : 'Inactif',
      w.totalSubscriptions,
      w.activeSubscriptions,
      w.completedSubscriptions,
      `${w.completionRate.toFixed(1)}%`
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Workflow', 'Statut', 'Total', 'Actifs', 'Complétés', 'Taux']],
      body: workflowData,
      theme: 'striped',
      headStyles: { fillColor: [249, 115, 22] },
      margin: { left: 14, right: 14 },
      styles: { fontSize: 9 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }

  // A/B Tests Performance
  if (data.abTestStats && data.abTestStats.length > 0) {
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(16);
    doc.text('Performance des Tests A/B', 14, yPosition);
    yPosition += 10;

    const abTestData = data.abTestStats.map(t => [
      t.name,
      t.status === 'running' ? 'En cours' : t.status === 'completed' ? 'Terminé' : 'Brouillon',
      `${t.variantAStats.openRate.toFixed(1)}%`,
      `${t.variantBStats.openRate.toFixed(1)}%`,
      t.winnerVariant || '-'
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Test', 'Statut', 'Taux A', 'Taux B', 'Gagnant']],
      body: abTestData,
      theme: 'striped',
      headStyles: { fillColor: [249, 115, 22] },
      margin: { left: 14, right: 14 },
      styles: { fontSize: 9 },
    });
  }

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} sur ${pageCount} - Sionohmair Insight Academy`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Save the PDF
  const fileName = `analytics-report-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
