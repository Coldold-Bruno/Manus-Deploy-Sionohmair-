import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Sparkles, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Plus, 
  Check, 
  X,
  Eye,
  FileText
} from "lucide-react";
import { Link } from "wouter";

export default function NftGratitudeAdmin() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<"sources" | "beneficiaries" | "contributions" | "inquiries">("sources");
  const [showCreateSource, setShowCreateSource] = useState(false);

  // Queries
  const { data: sources, refetch: refetchSources } = trpc.nftGratitude.getAllNftSources.useQuery();
  const { data: beneficiaries } = trpc.nftGratitude.getAllBeneficiaries.useQuery();
  const { data: contributions } = trpc.nftGratitude.getAllContributions.useQuery();
  const { data: inquiries } = trpc.nftGratitude.getAllInquiries.useQuery();
  const { data: stats } = trpc.nftGratitude.getGlobalStats.useQuery();

  // Mutations
  const createSource = trpc.nftGratitude.createNftSource.useMutation({
    onSuccess: () => {
      toast.success("NFT Source créé avec succès !");
      setShowCreateSource(false);
      refetchSources();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const reviewInquiry = trpc.nftGratitude.reviewInquiry.useMutation({
    onSuccess: () => {
      toast.success("Enquête validée !");
    },
  });

  // Form state
  const [newSource, setNewSource] = useState({
    name: "",
    description: "",
    category: "formation" as "formation" | "resource" | "template" | "coaching" | "other",
    initialValue: 0,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Accès Refusé</CardTitle>
            <CardDescription>Cette page est réservée aux administrateurs.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/">Retour à l'accueil</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCreateSource = () => {
    if (!newSource.name || newSource.initialValue <= 0) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }

    createSource.mutate(newSource);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Sparkles className="h-10 w-10 text-accent" />
            Gestion NFT de Gratitude Économique
          </h1>
          <p className="text-muted-foreground text-lg">
            Système de gratuité initiale avec redevabilité proportionnelle
          </p>
        </div>

        {/* Statistiques Globales */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">NFT Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.sources?.totalSources || 0}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {stats.sources?.totalBeneficiaries || 0} bénéficiaires
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Valeur Totale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">
                  {parseFloat(String(stats.sources?.totalValue || "0")).toLocaleString("fr-FR")} €
                </div>
                <p className="text-sm text-muted-foreground mt-1">Valeur actuelle cumulée</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Contributions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {parseFloat(String(stats.contributions?.totalAmount || "0")).toLocaleString("fr-FR")} €
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {stats.contributions?.totalContributions || 0} versements
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">En Attente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {parseFloat(String(stats.contributions?.pendingAmount || "0")).toLocaleString("fr-FR")} €
                </div>
                <p className="text-sm text-muted-foreground mt-1">Paiements en cours</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Onglets */}
        <div className="flex gap-2 mb-6 border-b">
          <Button
            variant={activeTab === "sources" ? "default" : "ghost"}
            onClick={() => setActiveTab("sources")}
            className="rounded-b-none"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            NFT Sources
          </Button>
          <Button
            variant={activeTab === "beneficiaries" ? "default" : "ghost"}
            onClick={() => setActiveTab("beneficiaries")}
            className="rounded-b-none"
          >
            <Users className="h-4 w-4 mr-2" />
            Bénéficiaires
          </Button>
          <Button
            variant={activeTab === "contributions" ? "default" : "ghost"}
            onClick={() => setActiveTab("contributions")}
            className="rounded-b-none"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Contributions
          </Button>
          <Button
            variant={activeTab === "inquiries" ? "default" : "ghost"}
            onClick={() => setActiveTab("inquiries")}
            className="rounded-b-none"
          >
            <FileText className="h-4 w-4 mr-2" />
            Enquêtes
          </Button>
        </div>

        {/* Contenu des onglets */}
        {activeTab === "sources" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">NFT Sources</h2>
              <Button onClick={() => setShowCreateSource(!showCreateSource)}>
                <Plus className="h-4 w-4 mr-2" />
                Créer un NFT Source
              </Button>
            </div>

            {showCreateSource && (
              <Card>
                <CardHeader>
                  <CardTitle>Nouveau NFT Source</CardTitle>
                  <CardDescription>Créer une nouvelle ressource gratuite</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom *</Label>
                    <Input
                      id="name"
                      value={newSource.name}
                      onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                      placeholder="Formation Sprint de Clarté Gratuite"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newSource.description}
                      onChange={(e) => setNewSource({ ...newSource, description: e.target.value })}
                      placeholder="Description détaillée de la ressource..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Catégorie *</Label>
                    <Select
                      value={newSource.category}
                      onValueChange={(value: any) => setNewSource({ ...newSource, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="formation">Formation</SelectItem>
                        <SelectItem value="resource">Ressource</SelectItem>
                        <SelectItem value="template">Template</SelectItem>
                        <SelectItem value="coaching">Coaching</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="initialValue">Valeur Initiale (€) *</Label>
                    <Input
                      id="initialValue"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newSource.initialValue}
                      onChange={(e) => setNewSource({ ...newSource, initialValue: parseFloat(e.target.value) })}
                      placeholder="790.00"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleCreateSource} disabled={createSource.isPending}>
                      {createSource.isPending ? "Création..." : "Créer le NFT Source"}
                    </Button>
                    <Button variant="outline" onClick={() => setShowCreateSource(false)}>
                      Annuler
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {sources?.map((source) => (
                <Card key={source.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{source.name}</CardTitle>
                        <CardDescription>{source.description}</CardDescription>
                      </div>
                      <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                        {source.category}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Valeur Initiale</p>
                        <p className="text-lg font-bold">{parseFloat(source.initialValue).toLocaleString("fr-FR")} €</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Valeur Actuelle</p>
                        <p className="text-lg font-bold text-accent">
                          {parseFloat(source.currentValue).toLocaleString("fr-FR")} €
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Contributions</p>
                        <p className="text-lg font-bold text-green-600">
                          {parseFloat(source.totalContributions).toLocaleString("fr-FR")} €
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Bénéficiaires</p>
                        <p className="text-lg font-bold">{source.beneficiariesCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "beneficiaries" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Bénéficiaires</h2>
            <div className="grid gap-4">
              {beneficiaries?.map((item) => (
                <Card key={item.beneficiary.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{item.user?.name || item.user?.email}</CardTitle>
                        <CardDescription>{item.nftSource?.name}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.beneficiary.gratitudeLevel === "exceptional" ? "bg-purple-100 text-purple-700" :
                          item.beneficiary.gratitudeLevel === "high" ? "bg-yellow-100 text-yellow-700" :
                          item.beneficiary.gratitudeLevel === "medium" ? "bg-blue-100 text-blue-700" :
                          item.beneficiary.gratitudeLevel === "low" ? "bg-gray-100 text-gray-700" :
                          "bg-gray-50 text-gray-500"
                        }`}>
                          {item.beneficiary.gratitudeLevel}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.beneficiary.contributionStatus === "active" ? "bg-green-100 text-green-700" :
                          item.beneficiary.contributionStatus === "completed" ? "bg-blue-100 text-blue-700" :
                          item.beneficiary.contributionStatus === "exempt" ? "bg-gray-100 text-gray-700" :
                          "bg-orange-100 text-orange-700"
                        }`}>
                          {item.beneficiary.contributionStatus}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Contribué</p>
                        <p className="text-lg font-bold text-green-600">
                          {parseFloat(item.beneficiary.totalContributed).toLocaleString("fr-FR")} €
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Reçu le</p>
                        <p className="text-lg font-bold">
                          {new Date(item.beneficiary.grantedAt).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Dernière Contribution</p>
                        <p className="text-lg font-bold">
                          {item.beneficiary.lastContributionAt 
                            ? new Date(item.beneficiary.lastContributionAt).toLocaleDateString("fr-FR")
                            : "Aucune"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "contributions" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Contributions</h2>
            <div className="grid gap-4">
              {contributions?.map((item) => (
                <Card key={item.contribution.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{item.user?.name || item.user?.email}</CardTitle>
                        <CardDescription>{item.nftSource?.name}</CardDescription>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.contribution.paymentStatus === "completed" ? "bg-green-100 text-green-700" :
                        item.contribution.paymentStatus === "pending" ? "bg-orange-100 text-orange-700" :
                        item.contribution.paymentStatus === "failed" ? "bg-red-100 text-red-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {item.contribution.paymentStatus}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Montant</p>
                        <p className="text-lg font-bold text-green-600">
                          {parseFloat(item.contribution.amount).toLocaleString("fr-FR")} €
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Pourcentage</p>
                        <p className="text-lg font-bold">{parseFloat(item.contribution.percentage)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Revenu Déclaré</p>
                        <p className="text-lg font-bold">
                          {parseFloat(item.contribution.reportedRevenue).toLocaleString("fr-FR")} €
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="text-lg font-bold">
                          {new Date(item.contribution.createdAt).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                    {item.contribution.notes && (
                      <div className="mt-4 p-3 bg-secondary/20 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Notes :</p>
                        <p className="text-sm">{item.contribution.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "inquiries" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Enquêtes de Recouvrement</h2>
            <div className="grid gap-4">
              {inquiries?.map((item) => (
                <Card key={item.inquiry.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{item.user?.name || item.user?.email}</CardTitle>
                        <CardDescription>
                          {item.nftSource?.name} — {item.inquiry.inquiryType}
                        </CardDescription>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.inquiry.status === "approved" ? "bg-green-100 text-green-700" :
                        item.inquiry.status === "pending" ? "bg-orange-100 text-orange-700" :
                        item.inquiry.status === "disputed" ? "bg-red-100 text-red-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {item.inquiry.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Revenu Déclaré</p>
                        <p className="text-lg font-bold">
                          {parseFloat(item.inquiry.reportedRevenue).toLocaleString("fr-FR")} €
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Contribution Calculée</p>
                        <p className="text-lg font-bold text-green-600">
                          {parseFloat(item.inquiry.calculatedContribution).toLocaleString("fr-FR")} €
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="text-lg font-bold">
                          {new Date(item.inquiry.inquiryDate).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>

                    {item.inquiry.evidenceProvided && (
                      <div className="mb-4 p-3 bg-secondary/20 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Preuves fournies :</p>
                        <p className="text-sm">{item.inquiry.evidenceProvided}</p>
                      </div>
                    )}

                    {item.inquiry.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => reviewInquiry.mutate({ 
                            inquiryId: item.inquiry.id, 
                            status: "approved" 
                          })}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Approuver
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => reviewInquiry.mutate({ 
                            inquiryId: item.inquiry.id, 
                            status: "disputed" 
                          })}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Contester
                        </Button>
                      </div>
                    )}

                    {item.inquiry.adminNotes && (
                      <div className="mt-4 p-3 bg-accent/10 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Notes admin :</p>
                        <p className="text-sm">{item.inquiry.adminNotes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
