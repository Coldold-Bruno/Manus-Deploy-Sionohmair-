import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
import { RefreshCw, TrendingUp, Users, DollarSign, AlertCircle, CheckCircle, Clock } from "lucide-react";

/**
 * Dashboard Admin d'Honofication avec Visualisations Temps Réel
 * 
 * Affiche :
 * - Statistiques globales (redevances, paiements, contestations)
 * - Graphiques de tendances (évolution mensuelle)
 * - Logs de détection en temps réel
 * - Alertes actives
 * - Statut des intégrations API
 */

const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function HonoficationAdminDashboard() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  // Récupérer les statistiques
  const { data: stats, refetch: refetchStats } = trpc.honofication.getHonoficationStats.useQuery();
  
  // Récupérer les logs de détection récents
  const { data: detectionLogs, refetch: refetchLogs } = trpc.honofication.getDetectionLogs.useQuery({
    limit: 10,
  });
  
  // Récupérer les alertes actives
  const { data: alerts, refetch: refetchAlerts } = trpc.nftRoyalty.getMyAlerts.useQuery();
  
  // Récupérer les intégrations API
  const { data: integrations, refetch: refetchIntegrations } = trpc.honofication.getApiIntegrations.useQuery();
  
  // Auto-refresh toutes les 30 secondes
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      refetchStats();
      refetchLogs();
      refetchAlerts();
      refetchIntegrations();
    }, 30000); // 30 secondes
    
    return () => clearInterval(interval);
  }, [autoRefresh, refetchStats, refetchLogs, refetchAlerts, refetchIntegrations]);
  
  const handleManualRefresh = () => {
    refetchStats();
    refetchLogs();
    refetchAlerts();
    refetchIntegrations();
  };
  
  // Données pour le graphique de répartition des redevances
  const royaltyDistribution = [
    { name: "Payées", value: parseFloat(stats?.totalPaid || "0"), color: "#10b981" },
    { name: "En attente", value: parseFloat(stats?.totalPending || "0"), color: "#f59e0b" },
    { name: "Contestées", value: stats?.activeContestations || 0, color: "#ef4444" },
  ];
  
  // Données pour le graphique d'évolution (simulé pour la démo)
  const monthlyData = [
    { month: "Jan", detected: 12000, paid: 8000 },
    { month: "Fév", detected: 15000, paid: 10000 },
    { month: "Mar", detected: 18000, paid: 14000 },
    { month: "Avr", detected: 22000, paid: 18000 },
    { month: "Mai", detected: 28000, paid: 24000 },
    { month: "Juin", detected: 35000, paid: 30000 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard Admin Honofication</h1>
            <p className="text-slate-600 mt-2">
              Visualisations en temps réel du système d'honofication
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${autoRefresh ? "animate-spin" : ""}`} />
              {autoRefresh ? "Auto-refresh ON" : "Auto-refresh OFF"}
            </Button>
            <Button onClick={handleManualRefresh} size="sm" variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Rafraîchir
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Présumé</p>
                <p className="text-2xl font-bold text-slate-900">{stats?.totalPresumed || "0"} €</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Payé</p>
                <p className="text-2xl font-bold text-green-600">{stats?.totalPaid || "0"} €</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">En Attente</p>
                <p className="text-2xl font-bold text-orange-600">{stats?.totalPending || "0"} €</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Contestations</p>
                <p className="text-2xl font-bold text-red-600">{stats?.activeContestations || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Évolution mensuelle */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Évolution Mensuelle</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="detected" stroke="#8b5cf6" name="Détecté (€)" strokeWidth={2} />
                <Line type="monotone" dataKey="paid" stroke="#10b981" name="Payé (€)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          
          {/* Répartition des redevances */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Répartition des Redevances</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={royaltyDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}€`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {royaltyDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Logs de détection récents */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Logs de Détection Récents</h3>
          <div className="space-y-3">
            {detectionLogs && detectionLogs.length > 0 ? (
              detectionLogs.map((log: any) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant={log.detectionMethod === "api" ? "default" : "secondary"}>
                      {log.detectionMethod}
                    </Badge>
                    <span className="text-sm text-slate-700">{log.detectionSource}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-900">
                      {log.indicesFound} indices • {log.benefitsDetected} € détectés
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(log.detectedAt).toLocaleString("fr-FR")}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-500 py-8">Aucun log de détection récent</p>
            )}
          </div>
        </Card>

        {/* Statut des intégrations API */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Statut des Intégrations API</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrations && integrations.length > 0 ? (
              integrations.map((integration: any) => (
                <div key={integration.id} className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-900">{integration.integrationName}</span>
                    <Badge variant={integration.status === "active" ? "default" : "secondary"}>
                      {integration.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">
                    Plateforme : {integration.platform}
                  </p>
                  {integration.lastSyncAt && (
                    <p className="text-xs text-slate-500">
                      Dernière sync : {new Date(integration.lastSyncAt).toLocaleString("fr-FR")}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="col-span-3 text-center text-slate-500 py-8">
                Aucune intégration configurée
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
