import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Users, Target, Activity, Zap, CheckCircle2, Clock, FileDown } from "lucide-react";
import { exportAnalyticsPDF } from "@/lib/exportAnalyticsPDF";
import { Link } from "wouter";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#f97316', '#eab308', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function Analytics() {
  const { data: overviewStats, isLoading: loadingOverview } = trpc.analytics.getOverviewStats.useQuery();
  const { data: workflowStats, isLoading: loadingWorkflows } = trpc.analytics.getWorkflowStats.useQuery();
  const { data: abTestStats, isLoading: loadingABTests } = trpc.analytics.getABTestStats.useQuery();
  const { data: segmentStats, isLoading: loadingSegments } = trpc.analytics.getLeadsBySegment.useQuery();
  const { data: engagementData, isLoading: loadingEngagement } = trpc.analytics.getNewsletterEngagement.useQuery({ days: 30 });

  if (loadingOverview || loadingWorkflows || loadingABTests || loadingSegments || loadingEngagement) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Chargement des analytics...</p>
        </div>
      </div>
    );
  }

  // Prepare data for charts
  const temperatureData = segmentStats ? [
    { name: 'Hot', value: segmentStats.byTemperature.hot, color: '#f97316' },
    { name: 'Warm', value: segmentStats.byTemperature.warm, color: '#eab308' },
    { name: 'Cold', value: segmentStats.byTemperature.cold, color: '#3b82f6' },
  ] : [];

  const interestData = segmentStats ? [
    { name: 'Sprint', value: segmentStats.byInterest.sprint },
    { name: 'Niveau 3', value: segmentStats.byInterest.n3 },
    { name: 'IA', value: segmentStats.byInterest.ia },
    { name: 'Aucun', value: segmentStats.byInterest.none },
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="mb-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour Admin
              </Button>
            </Link>
            <h1 className="text-4xl font-bold">📊 Analytics & KPIs</h1>
            <p className="text-muted-foreground mt-2">
              Tableau de bord complet des performances marketing et conversions
            </p>
          </div>
          <Button 
            onClick={() => exportAnalyticsPDF({ overviewStats, workflowStats: workflowStats || [], abTestStats: abTestStats || [], segmentStats })}
            className="bg-primary hover:bg-primary/90"
          >
            <FileDown className="h-4 w-4 mr-2" />
            Exporter en PDF
          </Button>
        </div>

        {/* Overview KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overviewStats?.totalLeads || 0}</div>
              <p className="text-xs text-muted-foreground">
                {overviewStats?.hotLeads || 0} hot, {overviewStats?.warmLeads || 0} warm
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de Conversion</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overviewStats?.conversionRate || 0}%</div>
              <p className="text-xs text-muted-foreground">
                Leads hot / total leads
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Score Moyen</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overviewStats?.avgScore || 0}</div>
              <p className="text-xs text-muted-foreground">
                Sur tous les leads actifs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activités (30j)</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overviewStats?.totalActivities || 0}</div>
              <p className="text-xs text-muted-foreground">
                Actions trackées ce mois
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Workflows & Tasks Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Workflows Actifs</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overviewStats?.activeWorkflows || 0}</div>
              <p className="text-xs text-muted-foreground">
                {overviewStats?.activeSubscriptions || 0} abonnés actifs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tâches en Attente</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overviewStats?.pendingTasks || 0}</div>
              <p className="text-xs text-muted-foreground">
                À traiter
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tests A/B</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{abTestStats?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Tests créés
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1: Temperature & Interests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Répartition par Température</CardTitle>
              <CardDescription>Distribution des leads selon leur niveau d'engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={temperatureData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {temperatureData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Répartition par Intérêt</CardTitle>
              <CardDescription>Distribution des leads selon leurs centres d'intérêt</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={interestData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2: Newsletter Engagement */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Newsletter (30 derniers jours)</CardTitle>
            <CardDescription>Évolution des ouvertures et clics d'emails</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="opens" stroke="#f97316" name="Ouvertures" strokeWidth={2} />
                <Line type="monotone" dataKey="clicks" stroke="#3b82f6" name="Clics" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Workflow Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Performance des Workflows</CardTitle>
            <CardDescription>Statistiques détaillées par workflow d'emails</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Workflow</th>
                    <th className="text-left p-2">Déclencheur</th>
                    <th className="text-center p-2">Statut</th>
                    <th className="text-right p-2">Total Abonnés</th>
                    <th className="text-right p-2">Actifs</th>
                    <th className="text-right p-2">Complétés</th>
                    <th className="text-right p-2">Taux Complétion</th>
                  </tr>
                </thead>
                <tbody>
                  {workflowStats && workflowStats.length > 0 ? (
                    workflowStats.map((workflow) => (
                      <tr key={workflow.id} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{workflow.name}</td>
                        <td className="p-2 text-sm text-muted-foreground">{workflow.trigger}</td>
                        <td className="p-2 text-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            workflow.active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {workflow.active ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="p-2 text-right">{workflow.totalSubscriptions}</td>
                        <td className="p-2 text-right">{workflow.activeSubscriptions}</td>
                        <td className="p-2 text-right">{workflow.completedSubscriptions}</td>
                        <td className="p-2 text-right font-medium">
                          {workflow.completionRate.toFixed(1)}%
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-muted-foreground">
                        Aucun workflow créé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* A/B Tests Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Performance des Tests A/B</CardTitle>
            <CardDescription>Comparaison des variantes de subject lines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Test</th>
                    <th className="text-center p-2">Statut</th>
                    <th className="text-left p-2">Variante A</th>
                    <th className="text-right p-2">Taux Ouverture A</th>
                    <th className="text-left p-2">Variante B</th>
                    <th className="text-right p-2">Taux Ouverture B</th>
                    <th className="text-center p-2">Gagnant</th>
                  </tr>
                </thead>
                <tbody>
                  {abTestStats && abTestStats.length > 0 ? (
                    abTestStats.map((test) => (
                      <tr key={test.id} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{test.name}</td>
                        <td className="p-2 text-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            test.status === 'running' ? 'bg-blue-100 text-blue-700' :
                            test.status === 'completed' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {test.status === 'running' ? 'En cours' :
                             test.status === 'completed' ? 'Terminé' : 'Brouillon'}
                          </span>
                        </td>
                        <td className="p-2 text-sm">{test.variantA}</td>
                        <td className="p-2 text-right font-medium">
                          {test.variantAStats.openRate.toFixed(1)}%
                          <span className="text-xs text-muted-foreground ml-1">
                            ({test.variantAStats.opens}/{test.variantAStats.sent})
                          </span>
                        </td>
                        <td className="p-2 text-sm">{test.variantB}</td>
                        <td className="p-2 text-right font-medium">
                          {test.variantBStats.openRate.toFixed(1)}%
                          <span className="text-xs text-muted-foreground ml-1">
                            ({test.variantBStats.opens}/{test.variantBStats.sent})
                          </span>
                        </td>
                        <td className="p-2 text-center">
                          {test.winnerVariant ? (
                            <span className="font-bold text-green-600">
                              {test.winnerVariant}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-muted-foreground">
                        Aucun test A/B créé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
