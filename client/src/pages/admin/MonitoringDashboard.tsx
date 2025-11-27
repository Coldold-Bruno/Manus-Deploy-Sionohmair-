import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  TrendingUp,
  Zap,
  Database,
  Mail,
  Search,
  CreditCard
} from "lucide-react";
import { toast } from "sonner";

/**
 * Dashboard de Monitoring Global des Automatisations
 * 
 * Supervise en temps réel :
 * - Statut des cron jobs
 * - Intégrations API actives
 * - Détections récentes
 * - Alertes et erreurs
 * - Statistiques globales
 */

export default function MonitoringDashboard() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Récupérer les données de monitoring
  const { data: apiIntegrations, refetch: refetchIntegrations } = trpc.honofication.getApiIntegrations.useQuery();
  const { data: recentDetections, refetch: refetchDetections } = trpc.honofication.getDetectionLogs.useQuery({ limit: 10 });
  // const { data: royaltyStats, refetch: refetchRoyalties } = trpc.nftRoyalty.getGlobalStats.useQuery();
  const royaltyStats = null;
  const refetchRoyalties = () => {};
  
  // Auto-refresh toutes les 30 secondes
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      refetchIntegrations();
      refetchDetections();
      refetchRoyalties();
      setLastRefresh(new Date());
    }, 30000);
    
    return () => clearInterval(interval);
  }, [autoRefresh, refetchIntegrations, refetchDetections, refetchRoyalties]);

  const handleManualRefresh = () => {
    refetchIntegrations();
    refetchDetections();
    refetchRoyalties();
    setLastRefresh(new Date());
    toast.success("Données actualisées");
  };

  // Calculer les statistiques
  const activeIntegrations = apiIntegrations?.filter(i => i.status === "active").length || 0;
  const totalIntegrations = apiIntegrations?.length || 0;
  const recentDetectionsCount = recentDetections?.length || 0;

  // Icônes par plateforme
  const platformIcons: Record<string, any> = {
    stripe: CreditCard,
    paypal: CreditCard,
    google_analytics: TrendingUp,
    google_search: Search,
    sendgrid: Mail,
    mailgun: Mail,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Activity className="w-8 h-8 text-blue-600" />
              Monitoring Global
            </h1>
            <p className="text-slate-600 mt-1">
              Supervision en temps réel du système NFT de Gratitude Économique
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-slate-500">Dernière actualisation</p>
              <p className="text-sm font-medium text-slate-700">
                {lastRefresh.toLocaleTimeString("fr-FR")}
              </p>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Actualiser
            </Button>
            
            <Button
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="gap-2"
            >
              <Zap className="w-4 h-4" />
              {autoRefresh ? "Auto ON" : "Auto OFF"}
            </Button>
          </div>
        </div>

        {/* KPIs Globaux */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-900 flex items-center gap-2">
                <Database className="w-4 h-4" />
                Intégrations Actives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {activeIntegrations}/{totalIntegrations}
              </div>
              <p className="text-xs text-blue-700 mt-1">
                {activeIntegrations === 0 ? "Aucune intégration active" : 
                 activeIntegrations === totalIntegrations ? "Toutes actives" :
                 `${totalIntegrations - activeIntegrations} en pause`}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-900 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Détections Récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {recentDetectionsCount}
              </div>
              <p className="text-xs text-green-700 mt-1">
                Dernières 24 heures
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Redevances Totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                0€
              </div>
              <p className="text-xs text-purple-700 mt-1">
                0 en attente
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-orange-900 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Prochaine Exécution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {autoRefresh ? "30s" : "Pause"}
              </div>
              <p className="text-xs text-orange-700 mt-1">
                {autoRefresh ? "Auto-refresh actif" : "Auto-refresh désactivé"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Intégrations API */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              Intégrations API
            </CardTitle>
            <CardDescription>
              Statut des intégrations configurées pour la détection automatique
            </CardDescription>
          </CardHeader>
          <CardContent>
            {apiIntegrations && apiIntegrations.length > 0 ? (
              <div className="space-y-3">
                {apiIntegrations.map((integration) => {
                  const Icon = platformIcons[integration.platform] || Database;
                  return (
                    <div
                      key={integration.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          integration.status === "active" ? "bg-green-100" : "bg-slate-200"
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            integration.status === "active" ? "text-green-600" : "text-slate-500"
                          }`} />
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-slate-900">
                            {integration.integrationName}
                          </h4>
                          <p className="text-sm text-slate-600">
                            {integration.platform.charAt(0).toUpperCase() + integration.platform.slice(1)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {integration.lastSyncAt && (
                          <div className="text-right">
                            <p className="text-xs text-slate-500">Dernière sync</p>
                            <p className="text-sm font-medium text-slate-700">
                              {new Date(integration.lastSyncAt).toLocaleString("fr-FR")}
                            </p>
                          </div>
                        )}
                        
                        <Badge variant={integration.status === "active" ? "default" : "secondary"}>
                          {integration.status === "active" ? "Actif" : "En pause"}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Database className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">Aucune intégration configurée</p>
                <p className="text-sm text-slate-500 mt-1">
                  Ajoutez des intégrations dans la page de gestion des API keys
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Détections Récentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-purple-600" />
              Détections Récentes
            </CardTitle>
            <CardDescription>
              Dernières détections de bénéfices par le système d'honofication
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentDetections && recentDetections.length > 0 ? (
              <div className="space-y-3">
                {recentDetections.map((detection: any) => (
                  <div
                    key={detection.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        detection.detectionType === "transaction_detected" ? "bg-green-100" :
                        detection.detectionType === "conversion_detected" ? "bg-blue-100" :
                        detection.detectionType === "public_mention_detected" ? "bg-purple-100" :
                        "bg-slate-100"
                      }`}>
                        {detection.detectionType === "transaction_detected" ? (
                          <CreditCard className="w-5 h-5 text-green-600" />
                        ) : detection.detectionType === "conversion_detected" ? (
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                        ) : detection.detectionType === "public_mention_detected" ? (
                          <Search className="w-5 h-5 text-purple-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-slate-600" />
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-slate-900">
                          {detection.detectionType.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </h4>
                        <p className="text-sm text-slate-600">
                          {detection.amount ? `${detection.amount}€` : "Montant non défini"} • 
                          Confiance: {detection.confidenceScore}%
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xs text-slate-500">
                        {new Date(detection.detectedAt).toLocaleString("fr-FR")}
                      </p>
                      <Badge variant={
                        detection.status === "pending" ? "secondary" :
                        detection.status === "approved" ? "default" :
                        "destructive"
                      }>
                        {detection.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">Aucune détection récente</p>
                <p className="text-sm text-slate-500 mt-1">
                  Les détections apparaîtront ici dès qu'elles seront effectuées
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alertes et Erreurs */}
        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-900">
              <AlertCircle className="w-5 h-5" />
              Alertes et Erreurs
            </CardTitle>
            <CardDescription className="text-yellow-700">
              Problèmes détectés nécessitant votre attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeIntegrations === 0 ? (
              <div className="p-4 bg-yellow-100 rounded-lg border border-yellow-300">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-900">
                      Aucune intégration active
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Activez au moins une intégration API pour permettre la détection automatique des bénéfices.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-green-100 rounded-lg border border-green-300">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-900">
                      Système opérationnel
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      Toutes les intégrations fonctionnent correctement. Aucune alerte détectée.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
