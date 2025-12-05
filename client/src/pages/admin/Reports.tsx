/**
 * Page d'export de rapports (PDF/Excel)
 */

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { FileDown, FileSpreadsheet, FileText, TrendingUp, Users, DollarSign, Mail } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { Input } from '@/components/ui/input';

type ReportType = 'analytics' | 'leads' | 'financial';
type ExportFormat = 'pdf' | 'excel';

export default function Reports() {
  const [reportType, setReportType] = useState<ReportType>('analytics');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Mutations pour générer les rapports
  const generateAnalyticsMutation = trpc.reports.generateAnalyticsReport.useMutation({
    onSuccess: (data) => {
      downloadFile(data.data, data.filename, data.mimeType);
      toast.success('Rapport généré avec succès !');
    },
    onError: (error) => {
      toast.error('Erreur lors de la génération', {
        description: error.message
      });
    }
  });

  const generateLeadsMutation = trpc.reports.generateLeadsReport.useMutation({
    onSuccess: (data) => {
      downloadFile(data.data, data.filename, data.mimeType);
      toast.success('Rapport généré avec succès !');
    },
    onError: (error) => {
      toast.error('Erreur lors de la génération', {
        description: error.message
      });
    }
  });

  const generateFinancialMutation = trpc.reports.generateFinancialReport.useMutation({
    onSuccess: (data) => {
      downloadFile(data.data, data.filename, data.mimeType);
      toast.success('Rapport généré avec succès !');
    },
    onError: (error) => {
      toast.error('Erreur lors de la génération', {
        description: error.message
      });
    }
  });

  const handleGenerateReport = () => {
    if (!startDate || !endDate) {
      toast.error('Veuillez sélectionner une période');
      return;
    }

    const params = {
      startDate,
      endDate,
      format: exportFormat
    };

    switch (reportType) {
      case 'analytics':
        generateAnalyticsMutation.mutate(params);
        break;
      case 'leads':
        generateLeadsMutation.mutate(params);
        break;
      case 'financial':
        generateFinancialMutation.mutate(params);
        break;
    }
  };

  const downloadFile = (base64Data: string, filename: string, mimeType: string) => {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isLoading = 
    generateAnalyticsMutation.isPending || 
    generateLeadsMutation.isPending || 
    generateFinancialMutation.isPending;

  const reportTypes = [
    {
      value: 'analytics',
      label: 'Rapport d\'Analytics',
      icon: TrendingUp,
      description: 'Vue d\'ensemble des performances (leads, conversions, revenus)'
    },
    {
      value: 'leads',
      label: 'Rapport de Leads',
      icon: Users,
      description: 'Performance des leads et scoring détaillé'
    },
    {
      value: 'financial',
      label: 'Rapport Financier',
      icon: DollarSign,
      description: 'Revenus, MRR et analyse par produit'
    }
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 space-y-8">
        {/* En-tête */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileDown className="h-8 w-8" />
            Export de Rapports
          </h1>
          <p className="text-muted-foreground mt-2">
            Générez des rapports professionnels en PDF ou Excel avec graphiques et analyses détaillées
          </p>
        </div>

        {/* Sélection du type de rapport */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reportTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = reportType === type.value;
            return (
              <Card
                key={type.value}
                className={`cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-primary ring-2 ring-primary ring-offset-2' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setReportType(type.value as ReportType)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    {type.label}
                  </CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Configuration du rapport */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration du Rapport</CardTitle>
            <CardDescription>
              Sélectionnez la période et le format d'export
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Période */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Date de début</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Date de fin</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* Format d'export */}
            <div className="space-y-2">
              <Label htmlFor="format">Format d'export</Label>
              <Select value={exportFormat} onValueChange={(v) => setExportFormat(v as ExportFormat)}>
                <SelectTrigger id="format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      PDF (Portable Document Format)
                    </div>
                  </SelectItem>
                  <SelectItem value="excel">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      Excel (XLSX)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bouton de génération */}
            <Button 
              onClick={handleGenerateReport} 
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              <FileDown className="mr-2 h-5 w-5" />
              {isLoading ? 'Génération en cours...' : `Générer le Rapport ${exportFormat.toUpperCase()}`}
            </Button>
          </CardContent>
        </Card>

        {/* Aperçu du contenu selon le type */}
        <Card>
          <CardHeader>
            <CardTitle>Contenu du Rapport</CardTitle>
            <CardDescription>
              Ce rapport inclura les sections suivantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reportType === 'analytics' && (
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Indicateurs Clés :</strong> Total leads, leads chauds, taux de conversion, revenus</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Répartition des Leads :</strong> Par température (froid, tiède, chaud)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Évolutions :</strong> Comparaison avec la période précédente</span>
                </li>
              </ul>
            )}

            {reportType === 'leads' && (
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Top 10 Leads Chauds :</strong> Email, score, température, dernière activité</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Activités par Type :</strong> Nombre d'activités et score moyen par type</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Analyse de l'Engagement :</strong> Taux d'ouverture, clics, conversions</span>
                </li>
              </ul>
            )}

            {reportType === 'financial' && (
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Indicateurs Financiers :</strong> Revenus total, MRR, nombre de clients, panier moyen</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Revenus par Produit :</strong> Ventes et revenus détaillés par produit</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Évolutions :</strong> Comparaison avec la période précédente</span>
                </li>
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Informations */}
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="space-y-2 text-sm text-blue-900 dark:text-blue-100">
              <p><strong>💡 Astuce :</strong> Les rapports PDF sont optimisés pour l'impression et la présentation, tandis que les fichiers Excel permettent une analyse approfondie des données.</p>
              <p><strong>📊 Graphiques :</strong> Les graphiques sont disponibles uniquement dans les rapports Excel. Les rapports PDF affichent les données sous forme de tableaux.</p>
              <p><strong>⏱️ Période :</strong> Sélectionnez une période de 7 à 90 jours pour des résultats optimaux.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
