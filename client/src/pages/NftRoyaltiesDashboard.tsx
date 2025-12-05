import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Bell,
  BellOff,
  Eye,
  EyeOff
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Link } from "wouter";

/**
 * Dashboard Temps Réel des Redevances NFT
 * 
 * Affiche en temps réel :
 * - Les redevances dues
 * - Les alertes
 * - Les statistiques
 * - L'historique des paiements
 */

export default function NftRoyaltiesDashboard() {
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");

  const { data: stats, refetch: refetchStats } = trpc.nftRoyalty.getMyRoyaltyStats.useQuery();
  const { data: pendingRoyalties, refetch: refetchPending } = trpc.nftRoyalty.getMyPendingRoyalties.useQuery();
  const { data: allRoyalties, refetch: refetchAll } = trpc.nftRoyalty.getMyRoyalties.useQuery();
  const { data: alerts, refetch: refetchAlerts } = trpc.nftRoyalty.getMyAlerts.useQuery({ unreadOnly: true });

  const payRoyaltyMutation = trpc.nftRoyalty.payRoyalty.useMutation();
  const markAlertAsReadMutation = trpc.nftRoyalty.markAlertAsRead.useMutation();
  const markAllAlertsAsReadMutation = trpc.nftRoyalty.markAllAlertsAsRead.useMutation();

  // Rafraîchir toutes les 30 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      refetchStats();
      refetchPending();
      refetchAll();
      refetchAlerts();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetchStats, refetchPending, refetchAll, refetchAlerts]);

  const handlePayRoyalty = async (trackingId: number) => {
    try {
      await payRoyaltyMutation.mutateAsync({ trackingId });
      toast.success("Redevance payée avec succès !");
      refetchStats();
      refetchPending();
      refetchAll();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors du paiement");
    }
  };

  const handleMarkAlertAsRead = async (alertId: number) => {
    try {
      await markAlertAsReadMutation.mutateAsync({ alertId });
      refetchAlerts();
    } catch (error: any) {
      toast.error(error.message || "Erreur");
    }
  };

  const handleMarkAllAlertsAsRead = async () => {
    try {
      await markAllAlertsAsReadMutation.mutateAsync();
      toast.success("Toutes les alertes marquées comme lues");
      refetchAlerts();
    } catch (error: any) {
      toast.error(error.message || "Erreur");
    }
  };

  const getEventTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      correction_used: "Correction utilisée",
      benefit_declared: "Bénéfice déclaré",
      revenue_detected: "Revenu détecté",
      conversion_tracked: "Conversion trackée",
      sale_completed: "Vente complétée",
      other: "Autre",
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: { variant: "secondary", label: "En attente" },
      notified: { variant: "default", label: "Notifié" },
      paid: { variant: "outline", label: "Payé" },
      overdue: { variant: "destructive", label: "En retard" },
      waived: { variant: "outline", label: "Annulé" },
    };
    const config = variants[status] || { variant: "secondary", label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b bg-card/50 bg-background/98 sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <Link href="/">
            <a className="text-xl font-bold hover:text-accent transition-colors">
              Sionohmair Insight Academy
            </a>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/dashboard/nft-gratitude">
              <Button variant="outline">NFT Gratitude</Button>
            </Link>
            <Link href="/correcteur">
              <Button variant="outline">Correcteur</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-8 bg-gradient-to-b from-background to-secondary/20">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">
                  Redevances NFT en Temps Réel
                </h1>
                <p className="text-lg text-muted-foreground">
                  Suivi automatique des bénéfices générés et redevances dues
                </p>
              </div>
              <Badge className="bg-green-600 text-white text-sm px-4 py-2 animate-pulse">
                ⚡ Temps réel
              </Badge>
            </div>

            {/* Stats */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Bénéfices</p>
                        <p className="text-2xl font-bold text-green-600">{stats.totalBenefits} €</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Redevances Dues</p>
                        <p className="text-2xl font-bold text-orange-600">{stats.totalPending} €</p>
                      </div>
                      <Clock className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Déjà Payé</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.totalPaid} €</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">En Retard</p>
                        <p className="text-2xl font-bold text-red-600">{stats.totalOverdue} €</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Alertes */}
      {alerts && alerts.length > 0 && (
        <section className="py-6 bg-orange-50 dark:bg-orange-950/20">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Bell className="h-5 w-5 text-orange-600" />
                  Alertes ({alerts.length})
                </h2>
                <Button variant="ghost" size="sm" onClick={handleMarkAllAlertsAsRead}>
                  <BellOff className="h-4 w-4 mr-2" />
                  Tout marquer comme lu
                </Button>
              </div>
              <div className="space-y-2">
                {alerts.slice(0, 5).map((alert) => (
                  <Alert key={alert.id} className="bg-white dark:bg-gray-900">
                    <AlertDescription className="flex items-center justify-between">
                      <div className="flex-1">
                        <strong>{alert.title}</strong>
                        <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                        {alert.amount && (
                          <p className="text-sm font-semibold mt-1">Montant : {alert.amount} €</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {alert.actionUrl && (
                          <Link href={alert.actionUrl}>
                            <Button size="sm">Voir</Button>
                          </Link>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAlertAsRead(alert.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Redevances */}
      <section className="py-8">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pending">
                  En Attente ({pendingRoyalties?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="all">
                  Toutes ({allRoyalties?.length || 0})
                </TabsTrigger>
              </TabsList>

              {/* En Attente */}
              <TabsContent value="pending" className="space-y-4">
                {pendingRoyalties && pendingRoyalties.length > 0 ? (
                  pendingRoyalties.map((royalty) => (
                    <Card key={royalty.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{royalty.sourceName}</CardTitle>
                            <CardDescription>
                              {getEventTypeLabel(royalty.eventType)} • {new Date(royalty.createdAt).toLocaleDateString("fr-FR")}
                            </CardDescription>
                          </div>
                          {getStatusBadge(royalty.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Bénéfice Généré</p>
                            <p className="text-xl font-bold text-green-600">{royalty.benefitAmount} €</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Taux</p>
                            <p className="text-xl font-bold">{royalty.royaltyPercentage}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Redevance Due</p>
                            <p className="text-xl font-bold text-orange-600">{royalty.royaltyAmount} €</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Date Limite</p>
                            <p className="text-xl font-bold">
                              {new Date(royalty.dueDate).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => handlePayRoyalty(royalty.id)}
                          disabled={payRoyaltyMutation.isPending}
                          className="w-full"
                        >
                          <DollarSign className="h-4 w-4 mr-2" />
                          Payer {royalty.royaltyAmount} €
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Aucune redevance en attente. Toutes vos contributions sont à jour ! 🎉
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              {/* Toutes */}
              <TabsContent value="all" className="space-y-4">
                {allRoyalties && allRoyalties.length > 0 ? (
                  allRoyalties.map((royalty) => (
                    <Card key={royalty.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{royalty.sourceName}</CardTitle>
                            <CardDescription>
                              {getEventTypeLabel(royalty.eventType)} • {new Date(royalty.createdAt).toLocaleDateString("fr-FR")}
                            </CardDescription>
                          </div>
                          {getStatusBadge(royalty.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Bénéfice</p>
                            <p className="text-lg font-bold">{royalty.benefitAmount} €</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Taux</p>
                            <p className="text-lg font-bold">{royalty.royaltyPercentage}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Redevance</p>
                            <p className="text-lg font-bold">{royalty.royaltyAmount} €</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {royalty.status === "paid" ? "Payé le" : "Date limite"}
                            </p>
                            <p className="text-lg font-bold">
                              {royalty.status === "paid" && royalty.paidAt
                                ? new Date(royalty.paidAt).toLocaleDateString("fr-FR")
                                : new Date(royalty.dueDate).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Alert>
                    <AlertDescription>
                      Aucune redevance enregistrée pour le moment.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Principe */}
      <section className="py-8 bg-secondary/20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Comment ça fonctionne ?</h2>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">1. Détection Automatique</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Chaque fois que vous utilisez une ressource gratuite (correction, formation, template) et générez des bénéfices,
                    le système détecte automatiquement l'événement et calcule la redevance due.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">2. Calcul Proportionnel</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Le taux de redevance varie selon le type de ressource : 3% pour les templates, 5% pour les formations,
                    7% pour les ressources, 10% pour le coaching. Le montant est calculé automatiquement.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">3. Paiement Facile</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Vous avez 30 jours pour payer chaque redevance. Le paiement enrichit le NFT source (Facteur Alpha = 22.67)
                    et augmente votre niveau de gratitude (Bronze → Argent → Or → Platine → Diamant).
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
