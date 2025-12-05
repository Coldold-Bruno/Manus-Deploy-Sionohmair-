import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Scale, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  FileText,
  Gavel,
  Heart,
  Info
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Link } from "wouter";

/**
 * Dashboard d'Honofication des Redevances
 * 
 * Gère :
 * - Redevances présumées (détection automatique)
 * - Déclarations volontaires (avec bonus 10%)
 * - Contestations
 * - Tribunal arbitral
 */

export default function HonoficationDashboard() {
  const [activeTab, setActiveTab] = useState<"presumed" | "voluntary" | "contestations">("presumed");
  const [contestDialogOpen, setContestDialogOpen] = useState(false);
  const [selectedRoyaltyId, setSelectedRoyaltyId] = useState<number | null>(null);

  const { data: stats, refetch: refetchStats } = trpc.honofication.getHonoficationStats.useQuery();
  const { data: presumedRoyalties, refetch: refetchPresumed } = trpc.honofication.getMyPresumedRoyalties.useQuery({});
  const { data: voluntaryDeclarations, refetch: refetchVoluntary } = trpc.honofication.getMyVoluntaryDeclarations.useQuery();
  const { data: contestations, refetch: refetchContestations } = trpc.honofication.getMyContestations.useQuery();

  const payPresumedRoyaltyMutation = trpc.honofication.payPresumedRoyalty.useMutation();
  const contestRoyaltyMutation = trpc.honofication.contestRoyalty.useMutation();
  const declareVoluntaryBenefitsMutation = trpc.honofication.declareVoluntaryBenefits.useMutation();

  const handlePayPresumedRoyalty = async (royaltyId: number) => {
    try {
      await payPresumedRoyaltyMutation.mutateAsync({ royaltyId });
      toast.success("Redevance payée avec succès !");
      refetchStats();
      refetchPresumed();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors du paiement");
    }
  };

  const handleContestRoyalty = async (data: any) => {
    if (!selectedRoyaltyId) return;

    try {
      await contestRoyaltyMutation.mutateAsync({
        royaltyId: selectedRoyaltyId,
        ...data,
      });
      toast.success("Contestation soumise avec succès !");
      setContestDialogOpen(false);
      setSelectedRoyaltyId(null);
      refetchPresumed();
      refetchContestations();
    } catch (error: any) {
      toast.error(error.message || "Erreur");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      notified: { variant: "secondary", label: "Notifié" },
      reminded: { variant: "default", label: "Rappelé" },
      formal_notice: { variant: "destructive", label: "Mise en demeure" },
      contested: { variant: "outline", label: "Contesté" },
      paid: { variant: "outline", label: "Payé" },
      waived: { variant: "outline", label: "Annulé" },
      arbitration: { variant: "default", label: "Arbitrage" },
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
            <Link href="/dashboard/nft-royalties">
              <Button variant="outline">Redevances Temps Réel</Button>
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
                <h1 className="text-4xl font-bold tracking-tight mb-2 flex items-center gap-3">
                  <Scale className="h-10 w-10 text-primary" />
                  Honofication des Redevances
                </h1>
                <p className="text-lg text-muted-foreground">
                  Détection automatique, recouvrement basé sur la présomption, et tribunal arbitral
                </p>
              </div>
            </div>

            {/* Stats */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Redevances Présumées</p>
                        <p className="text-2xl font-bold text-orange-600">{stats.totalPresumed} €</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          En attente : {stats.totalPending} €
                        </p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Déclarations Volontaires</p>
                        <p className="text-2xl font-bold text-green-600">{stats.totalVoluntary} €</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Bonus économisé : {(parseFloat(stats.totalVoluntary) * 0.1).toFixed(2)} €
                        </p>
                      </div>
                      <Heart className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Contestations</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.totalContestations}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Actives : {stats.activeContestations}
                        </p>
                      </div>
                      <Gavel className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Principe de l'Honofication */}
      <section className="py-6 bg-blue-50 dark:bg-blue-950/20">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Principe de l'Honofication :</strong> Les bénéfices générés grâce aux ressources gratuites sont détectés automatiquement.
                Vous pouvez déclarer volontairement (bonus 10%) ou attendre la notification de redevance présumée.
                En cas de désaccord, vous pouvez contester ou saisir le tribunal arbitral.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-8">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="presumed">
                  Redevances Présumées ({presumedRoyalties?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="voluntary">
                  Déclarations Volontaires ({voluntaryDeclarations?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="contestations">
                  Contestations ({contestations?.length || 0})
                </TabsTrigger>
              </TabsList>

              {/* Redevances Présumées */}
              <TabsContent value="presumed" className="space-y-4">
                {presumedRoyalties && presumedRoyalties.length > 0 ? (
                  presumedRoyalties.map((royalty) => (
                    <Card key={royalty.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{royalty.sourceName}</CardTitle>
                            <CardDescription>
                              Notifié le {new Date(royalty.notifiedAt).toLocaleDateString("fr-FR")}
                            </CardDescription>
                          </div>
                          {getStatusBadge(royalty.recoveryStatus)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Bénéfice Présumé</p>
                            <p className="text-xl font-bold text-green-600">{royalty.presumedBenefit} €</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Taux</p>
                            <p className="text-xl font-bold">{royalty.royaltyRate}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Confiance</p>
                            <p className="text-xl font-bold">{(parseFloat(royalty.confidenceCoefficient) * 100).toFixed(0)}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Redevance Due</p>
                            <p className="text-xl font-bold text-orange-600">{royalty.presumedRoyaltyAmount} €</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm font-semibold mb-2">Indices détectés :</p>
                          <p className="text-sm text-muted-foreground">{royalty.indicesSummary}</p>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground">
                            Date limite : <strong>{new Date(royalty.dueDate).toLocaleDateString("fr-FR")}</strong>
                          </p>
                        </div>

                        {royalty.recoveryStatus !== "paid" && royalty.recoveryStatus !== "contested" && (
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handlePayPresumedRoyalty(royalty.id)}
                              disabled={payPresumedRoyaltyMutation.isPending}
                            >
                              <DollarSign className="h-4 w-4 mr-2" />
                              Payer {royalty.presumedRoyaltyAmount} €
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSelectedRoyaltyId(royalty.id);
                                setContestDialogOpen(true);
                              }}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Contester
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Aucune redevance présumée pour le moment. Déclarez volontairement vos bénéfices pour bénéficier du bonus de 10% !
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              {/* Déclarations Volontaires */}
              <TabsContent value="voluntary" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Déclarer des bénéfices volontairement</CardTitle>
                    <CardDescription>
                      Bénéficiez d'une réduction de 10% en déclarant volontairement vos bénéfices dans les 30 jours
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Fonctionnalité à venir : formulaire de déclaration volontaire
                    </p>
                  </CardContent>
                </Card>

                {voluntaryDeclarations && voluntaryDeclarations.length > 0 ? (
                  voluntaryDeclarations.map((declaration) => (
                    <Card key={declaration.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{declaration.sourceName}</CardTitle>
                        <CardDescription>
                          Déclaré le {new Date(declaration.declaredAt).toLocaleDateString("fr-FR")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Bénéfice Déclaré</p>
                            <p className="text-lg font-bold">{declaration.declaredBenefit} €</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Redevance Initiale</p>
                            <p className="text-lg font-bold">{declaration.royaltyAmount} €</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Bonus</p>
                            <p className="text-lg font-bold text-green-600">-{declaration.bonusPercentage}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Montant Final</p>
                            <p className="text-lg font-bold text-orange-600">{declaration.finalAmount} €</p>
                          </div>
                        </div>
                        {declaration.isPaid ? (
                          <Badge variant="outline" className="mt-4">Payé</Badge>
                        ) : (
                          <Button className="mt-4">
                            <DollarSign className="h-4 w-4 mr-2" />
                            Payer {declaration.finalAmount} €
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Alert>
                    <AlertDescription>
                      Aucune déclaration volontaire pour le moment.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              {/* Contestations */}
              <TabsContent value="contestations" className="space-y-4">
                {contestations && contestations.length > 0 ? (
                  contestations.map((contestation) => (
                    <Card key={contestation.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{contestation.sourceName}</CardTitle>
                            <CardDescription>
                              Soumis le {new Date(contestation.submittedAt).toLocaleDateString("fr-FR")}
                            </CardDescription>
                          </div>
                          <Badge>{contestation.status}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-semibold">Type de contestation :</p>
                            <p className="text-sm text-muted-foreground">{contestation.contestationType}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold">Motif :</p>
                            <p className="text-sm text-muted-foreground">{contestation.contestationMotif}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold">Arguments :</p>
                            <p className="text-sm text-muted-foreground">{contestation.arguments}</p>
                          </div>
                          {contestation.sionohmairResponse && (
                            <div>
                              <p className="text-sm font-semibold">Réponse de Sionohmair :</p>
                              <p className="text-sm text-muted-foreground">{contestation.sionohmairResponse}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Alert>
                    <AlertDescription>
                      Aucune contestation en cours.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Dialog de contestation */}
      <Dialog open={contestDialogOpen} onOpenChange={setContestDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contester une redevance présumée</DialogTitle>
            <DialogDescription>
              Expliquez pourquoi vous contestez cette redevance. Vous recevrez une réponse dans les 21 jours.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Formulaire de contestation à implémenter (type, motif, arguments, documents)
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
