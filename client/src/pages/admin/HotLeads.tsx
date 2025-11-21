import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Flame, TrendingUp, Users, Target, Mail, Phone, Calendar, Activity, RefreshCw, Download } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Papa from "papaparse";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function HotLeads() {
  const { user, loading: authLoading } = useAuth();
  const { data: stats, isLoading: statsLoading } = trpc.leadScoring.getLeadStats.useQuery();
  const { data: hotLeads, isLoading: hotLoading, refetch: refetchHot } = trpc.leadScoring.getHotLeads.useQuery();
  const { data: warmLeads, isLoading: warmLoading, refetch: refetchWarm } = trpc.leadScoring.getWarmLeads.useQuery();
  const recalculateMutation = trpc.leadScoring.recalculateAllScores.useMutation();

  const handleRecalculate = async () => {
    try {
      const result = await recalculateMutation.mutateAsync();
      toast.success(`${result.updated} scores recalculés avec succès`);
      refetchHot();
      refetchWarm();
    } catch (error) {
      toast.error("Erreur lors du recalcul des scores");
    }
  };

  const handleExport = async (temperature: "all" | "hot" | "warm" | "cold") => {
    try {
      const leads = await trpc.leadScoring.exportLeads.query({ temperature });
      
      // Format data for CSV
      const csvData = leads.map(lead => ({
        "Email": lead.email,
        "Nom": lead.name || "",
        "Score Total": lead.leadScore,
        "Score Newsletter": lead.engagementScore,
        "Température": lead.leadTemperature,
        "Intérêts": lead.interests || "",
        "Date d'inscription": lead.subscribedAt ? format(new Date(lead.subscribedAt), "dd/MM/yyyy", { locale: fr }) : "",
        "Statut": lead.status,
      }));

      // Generate CSV
      const csv = Papa.unparse(csvData);
      
      // Download file
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `leads_${temperature}_${format(new Date(), "yyyy-MM-dd")}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Export réussi : ${leads.length} leads exportés`);
    } catch (error) {
      toast.error("Erreur lors de l'export");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Accès Refusé</CardTitle>
            <CardDescription>Vous devez être administrateur pour accéder à cette page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="default">
              <Link href="/">
                <a>Retour à l'accueil</a>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isLoading = statsLoading || hotLoading || warmLoading;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <Flame className="inline-block h-10 w-10 text-orange-500 mr-3" />
              Leads Chauds
            </h1>
            <p className="text-xl text-muted-foreground">
              Identifiez et convertissez vos prospects à fort potentiel
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleRecalculate}
              disabled={recalculateMutation.isPending}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${recalculateMutation.isPending ? 'animate-spin' : ''}`} />
              Recalculer les scores
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport("all")}
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter en CSV
            </Button>
            <Button asChild variant="default">
              <Link href="/admin">
                <a>← Retour Admin</a>
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="border-orange-500/20 bg-orange-500/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  Leads Chauds
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-500">{stats.leadsByTemperature.hot}</div>
                <p className="text-xs text-muted-foreground mt-1">Score ≥ 80 points</p>
              </CardContent>
            </Card>

            <Card className="border-yellow-500/20 bg-yellow-500/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-yellow-500" />
                  Leads Tièdes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-500">{stats.leadsByTemperature.warm}</div>
                <p className="text-xs text-muted-foreground mt-1">Score 41-79 points</p>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20 bg-blue-500/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  Leads Froids
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-500">{stats.leadsByTemperature.cold}</div>
                <p className="text-xs text-muted-foreground mt-1">Score 0-40 points</p>
              </CardContent>
            </Card>

            <Card className="border-accent/20 bg-accent/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Target className="h-4 w-4 text-accent" />
                  Score Moyen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">{stats.averageScores.leadScore}</div>
                <p className="text-xs text-muted-foreground mt-1">Engagement: {stats.averageScores.engagementScore}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs: Hot vs Warm Leads */}
        <Tabs defaultValue="hot" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="hot" className="flex items-center gap-2">
              <Flame className="h-4 w-4" />
              Leads Chauds ({hotLeads?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="warm" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Leads Tièdes ({warmLeads?.length || 0})
            </TabsTrigger>
          </TabsList>

          {/* Hot Leads */}
          <TabsContent value="hot" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                <p className="text-muted-foreground">Chargement des leads chauds...</p>
              </div>
            ) : hotLeads && hotLeads.length > 0 ? (
              <div className="grid gap-4">
                {hotLeads.map((lead) => (
                  <Card key={lead.id} className="border-orange-500/30 hover:border-orange-500/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl flex items-center gap-3">
                            <Mail className="h-5 w-5 text-accent" />
                            {lead.email}
                            {lead.name && <span className="text-muted-foreground text-base">({lead.name})</span>}
                          </CardTitle>
                          <CardDescription className="mt-2 flex items-center gap-4 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Inscrit le {new Date(lead.subscribedAt).toLocaleDateString('fr-FR')}
                            </span>
                            <Badge variant="outline" className="capitalize">
                              {lead.interests}
                            </Badge>
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-orange-500">{lead.leadScore}</div>
                          <p className="text-xs text-muted-foreground">points</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Engagement Newsletter:</span>
                            <span className="font-semibold">{lead.engagementScore} pts</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Dernier email envoyé:</span>
                            <span className="font-semibold">J+{lead.lastEmailSent}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Température:</span>
                            <Badge className="bg-orange-500 text-white">
                              <Flame className="h-3 w-3 mr-1" />
                              {lead.leadTemperature.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Source:</span>
                            <span className="font-semibold capitalize">{lead.source}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t flex gap-2">
                        <Button size="sm" variant="default" className="flex-1">
                          <Phone className="h-4 w-4 mr-2" />
                          Contacter
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1" asChild>
                          <Link href={`/admin/lead-profile?email=${encodeURIComponent(lead.email)}`}>
                            <a className="flex items-center gap-2">
                              <Activity className="h-4 w-4" />
                              Voir l'activité
                            </a>
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Flame className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium mb-2">Aucun lead chaud pour le moment</p>
                  <p className="text-sm text-muted-foreground">
                    Les leads avec un score ≥ 80 apparaîtront ici
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Warm Leads */}
          <TabsContent value="warm" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                <p className="text-muted-foreground">Chargement des leads tièdes...</p>
              </div>
            ) : warmLeads && warmLeads.length > 0 ? (
              <div className="grid gap-4">
                {warmLeads.map((lead) => (
                  <Card key={lead.id} className="border-yellow-500/30 hover:border-yellow-500/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl flex items-center gap-3">
                            <Mail className="h-5 w-5 text-accent" />
                            {lead.email}
                            {lead.name && <span className="text-muted-foreground text-base">({lead.name})</span>}
                          </CardTitle>
                          <CardDescription className="mt-2 flex items-center gap-4 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Inscrit le {new Date(lead.subscribedAt).toLocaleDateString('fr-FR')}
                            </span>
                            <Badge variant="outline" className="capitalize">
                              {lead.interests}
                            </Badge>
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-yellow-500">{lead.leadScore}</div>
                          <p className="text-xs text-muted-foreground">points</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Engagement Newsletter:</span>
                            <span className="font-semibold">{lead.engagementScore} pts</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Dernier email envoyé:</span>
                            <span className="font-semibold">J+{lead.lastEmailSent}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Température:</span>
                            <Badge className="bg-yellow-500 text-white">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {lead.leadTemperature.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Source:</span>
                            <span className="font-semibold capitalize">{lead.source}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Mail className="h-4 w-4 mr-2" />
                          Envoyer un email
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1" asChild>
                          <Link href={`/admin/lead-profile?email=${encodeURIComponent(lead.email)}`}>
                            <a className="flex items-center gap-2">
                              <Activity className="h-4 w-4" />
                              Voir l'activité
                            </a>
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium mb-2">Aucun lead tiède pour le moment</p>
                  <p className="text-sm text-muted-foreground">
                    Les leads avec un score entre 41 et 79 apparaîtront ici
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Top Activities */}
        {stats && stats.topActivities && stats.topActivities.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-accent" />
                Activités les Plus Fréquentes
              </CardTitle>
              <CardDescription>
                Comprendre le comportement de vos leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium capitalize">{activity.activityType.replace(/_/g, ' ')}</p>
                        <p className="text-sm text-muted-foreground">{activity.count} occurrences</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-accent">{activity.totalScore} pts</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
