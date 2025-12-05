import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, TrendingUp, Users, DollarSign, AlertCircle, Award } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function SubscriptionAnalytics() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "1y" | "all">("30d");

  // Récupérer les métriques
  const { data: metrics, isLoading: isLoadingMetrics } =
    trpc.subscriptionAnalytics.getMetrics.useQuery({ period });

  // Récupérer les statistiques de rétention
  const { data: retention, isLoading: isLoadingRetention } =
    trpc.subscriptionAnalytics.getRetentionStats.useQuery();

  if (isLoadingMetrics || isLoadingRetention) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Données pour le graphique en camembert (répartition par durée)
  const pieData = [
    { name: "Mensuel", value: metrics?.subscriptionsByDuration.monthly || 0, color: "#3b82f6" },
    { name: "Trimestriel", value: metrics?.subscriptionsByDuration.quarterly || 0, color: "#10b981" },
    { name: "Semestriel", value: metrics?.subscriptionsByDuration.semiannual || 0, color: "#f59e0b" },
    { name: "Annuel", value: metrics?.subscriptionsByDuration.annual || 0, color: "#8b5cf6" },
  ];

  // Données pour le graphique en barres (conversions par durée)
  const barData = [
    { name: "Mensuel", conversions: metrics?.conversionsByDuration.monthly || 0 },
    { name: "Trimestriel", conversions: metrics?.conversionsByDuration.quarterly || 0 },
    { name: "Semestriel", conversions: metrics?.conversionsByDuration.semiannual || 0 },
    { name: "Annuel", conversions: metrics?.conversionsByDuration.annual || 0 },
  ];

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Analytics d'Abonnement</h1>
          <p className="text-muted-foreground mt-2">
            Métriques clés : MRR, conversions, churn rate, rétention
          </p>
        </div>

        <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 derniers jours</SelectItem>
            <SelectItem value="30d">30 derniers jours</SelectItem>
            <SelectItem value="90d">90 derniers jours</SelectItem>
            <SelectItem value="1y">1 an</SelectItem>
            <SelectItem value="all">Tout</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">MRR</CardTitle>
            <DollarSign className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics?.mrr}€</div>
            <p className="text-xs text-muted-foreground mt-1">
              ARR : {metrics?.arr}€
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Abonnements Actifs</CardTitle>
            <Users className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics?.totalActiveSubscriptions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics?.totalTrials} essais gratuits en cours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Taux de Conversion</CardTitle>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics?.conversionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Essais → Abonnements payants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <AlertCircle className="w-5 h-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics?.churnRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics?.totalCancelled} désabonnements
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphique d'évolution du MRR */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Évolution du MRR</CardTitle>
          <CardDescription>Revenu mensuel récurrent sur la période sélectionnée</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics?.mrrHistory || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="mrr" stroke="#8b5cf6" strokeWidth={2} name="MRR (€)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Répartition par durée d'abonnement */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par Durée</CardTitle>
            <CardDescription>Distribution des abonnements actifs</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conversions par durée */}
        <Card>
          <CardHeader>
            <CardTitle>Conversions par Durée</CardTitle>
            <CardDescription>Nombre d'abonnements par type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="conversions" fill="#3b82f6" name="Conversions" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques de rétention */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            Rétention Client
          </CardTitle>
          <CardDescription>Taux de rétention à différentes périodes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-sm text-blue-700 mb-2">Durée Moyenne</p>
              <p className="text-3xl font-bold text-blue-900">
                {retention?.averageLifetimeDays} jours
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-sm text-green-700 mb-2">Rétention 30j</p>
              <p className="text-3xl font-bold text-green-900">{retention?.retention30Days}%</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
              <p className="text-sm text-amber-700 mb-2">Rétention 60j</p>
              <p className="text-3xl font-bold text-amber-900">{retention?.retention60Days}%</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <p className="text-sm text-purple-700 mb-2">Rétention 90j</p>
              <p className="text-3xl font-bold text-purple-900">{retention?.retention90Days}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
