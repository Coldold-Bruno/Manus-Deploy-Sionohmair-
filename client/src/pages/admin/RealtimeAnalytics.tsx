import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, DollarSign, Users, Activity, Zap, Clock, AlertTriangle, Target, Eye } from "lucide-react";
import { Link } from "wouter";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#f97316', '#eab308', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function RealtimeAnalytics() {
  const { data: conversionMetrics, isLoading: loadingConversion } = trpc.realtimeAnalytics.getConversionMetrics.useQuery();
  const { data: revenueAnalytics, isLoading: loadingRevenue } = trpc.realtimeAnalytics.getRevenueAnalytics.useQuery();
  const { data: realtimeEngagement, isLoading: loadingEngagement } = trpc.realtimeAnalytics.getRealtimeEngagement.useQuery();
  const { data: predictiveAnalytics, isLoading: loadingPredictive } = trpc.realtimeAnalytics.getPredictiveAnalytics.useQuery();
  const { data: hourlyActivity, isLoading: loadingHourly } = trpc.realtimeAnalytics.getHourlyActivityTrend.useQuery();

  if (loadingConversion || loadingRevenue || loadingEngagement || loadingPredictive || loadingHourly) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Chargement des analytics en temps réel...</p>
        </div>
      </div>
    );
  }

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
            <h1 className="text-4xl font-bold">⚡ Analytics en Temps Réel</h1>
            <p className="text-muted-foreground mt-2">
              Métriques avancées, prédictions IA et KPIs business
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-green-500/10 text-green-600 px-4 py-2 rounded-lg">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">En direct</span>
            </div>
          </div>
        </div>

        {/* Revenue KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">MRR</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{revenueAnalytics?.mrr || 0}€</div>
              <p className="text-xs text-muted-foreground">
                Revenus mensuels récurrents
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ARR</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{revenueAnalytics?.arr || 0}€</div>
              <p className="text-xs text-muted-foreground">
                Revenus annuels récurrents
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">LTV Moyen</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{revenueAnalytics?.ltv || 0}€</div>
              <p className="text-xs text-muted-foreground">
                Valeur vie client moyenne
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{revenueAnalytics?.churnRate || 0}%</div>
              <p className="text-xs text-muted-foreground">
                Taux de désabonnement
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Engagement KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visiteurs Actifs</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{realtimeEngagement?.activeVisitors || 0}</div>
              <p className="text-xs text-muted-foreground">
                En ce moment (5 dernières min)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Durée Session</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{realtimeEngagement?.avgSessionDuration || 0} min</div>
              <p className="text-xs text-muted-foreground">
                Moyenne des 24 dernières heures
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de Rebond</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{realtimeEngagement?.bounceRate || 0}%</div>
              <p className="text-xs text-muted-foreground">
                Visiteurs avec 1 seule page
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temps Conversion</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conversionMetrics?.avgTimeToConversion || 0} j</div>
              <p className="text-xs text-muted-foreground">
                Lead → Hot lead moyen
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1: Revenue by Product & Conversion by Source */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenus par Produit</CardTitle>
              <CardDescription>Distribution des revenus par offre</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueAnalytics?.revenueByProduct || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="productName" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalRevenue" fill="#f97316" name="Revenus (€)" />
                  <Bar dataKey="orderCount" fill="#3b82f6" name="Commandes" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversion par Source</CardTitle>
              <CardDescription>Taux de conversion selon l'origine du trafic</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={conversionMetrics?.bySource || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="source" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="conversionRate" fill="#eab308" name="Taux (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2: Top Pages & Hourly Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Pages les Plus Visitées (24h)</CardTitle>
              <CardDescription>Top 10 des pages avec le plus de trafic</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={realtimeEngagement?.topPages || []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="page" type="category" width={150} />
                  <Tooltip />
                  <Bar dataKey="views" fill="#3b82f6" name="Vues" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activité par Heure (24h)</CardTitle>
              <CardDescription>Nombre d'activités trackées par heure</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={hourlyActivity || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="activities" stroke="#f97316" strokeWidth={2} name="Activités" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Predictive Analytics Section */}
        <Card>
          <CardHeader>
            <CardTitle>🔮 Prédictions IA</CardTitle>
            <CardDescription>Analyse prédictive basée sur les données historiques</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Warm Leads Conversion Prediction */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-500" />
                  Leads Warm à Convertir
                </h3>
                <div className="space-y-3">
                  {predictiveAnalytics?.warmLeadsConversion.slice(0, 5).map((lead, idx) => (
                    <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">{lead.email}</span>
                        <span className="text-xs text-muted-foreground">Score: {lead.score}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-green-600 font-medium">
                          {lead.conversionProbability}% de conversion
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ~{lead.estimatedDaysToConversion}j
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Payments Prediction */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  Prochains Paiements
                </h3>
                <div className="space-y-3">
                  {predictiveAnalytics?.nextPayments.slice(0, 5).map((payment, idx) => (
                    <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">User #{payment.userId}</span>
                        <span className="text-sm font-bold text-green-600">{payment.amount}€</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {payment.nextPaymentDate} • {payment.interval}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Churn Risk Prediction */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Risque de Churn
                </h3>
                <div className="space-y-3">
                  {predictiveAnalytics?.churnRiskPredictions.slice(0, 5).map((customer, idx) => (
                    <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">User #{customer.userId}</span>
                        <span className={`text-xs font-bold ${
                          customer.churnRisk === 'high' ? 'text-red-600' :
                          customer.churnRisk === 'medium' ? 'text-orange-600' :
                          'text-green-600'
                        }`}>
                          {customer.churnRisk === 'high' ? '🔴 Élevé' :
                           customer.churnRisk === 'medium' ? '🟠 Moyen' :
                           '🟢 Faible'}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {customer.daysSinceLastOrder}j depuis dernier achat • {customer.totalSpent}€ dépensés
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Product Table */}
        <Card>
          <CardHeader>
            <CardTitle>Détail des Revenus par Produit</CardTitle>
            <CardDescription>Performance commerciale détaillée</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Produit</th>
                    <th className="text-right p-2">Commandes</th>
                    <th className="text-right p-2">Revenus Totaux</th>
                    <th className="text-right p-2">Revenu Moyen</th>
                  </tr>
                </thead>
                <tbody>
                  {revenueAnalytics?.revenueByProduct.map((product, idx) => (
                    <tr key={idx} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-medium">{product.productName}</td>
                      <td className="p-2 text-right">{product.orderCount}</td>
                      <td className="p-2 text-right font-bold text-green-600">{product.totalRevenue}€</td>
                      <td className="p-2 text-right">
                        {product.orderCount > 0 ? Math.round(product.totalRevenue / product.orderCount) : 0}€
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Conversion Metrics Table */}
        <Card>
          <CardHeader>
            <CardTitle>Métriques de Conversion par Source</CardTitle>
            <CardDescription>Analyse détaillée des performances par canal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Source</th>
                    <th className="text-right p-2">Total Leads</th>
                    <th className="text-right p-2">Conversions</th>
                    <th className="text-right p-2">Taux de Conversion</th>
                  </tr>
                </thead>
                <tbody>
                  {conversionMetrics?.bySource.map((source, idx) => (
                    <tr key={idx} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-medium">{source.source}</td>
                      <td className="p-2 text-right">{source.totalLeads}</td>
                      <td className="p-2 text-right font-bold text-orange-600">{source.conversions}</td>
                      <td className="p-2 text-right">
                        <span className={`font-bold ${
                          source.conversionRate >= 15 ? 'text-green-600' :
                          source.conversionRate >= 10 ? 'text-orange-600' :
                          'text-red-600'
                        }`}>
                          {source.conversionRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
