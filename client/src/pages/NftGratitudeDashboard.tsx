import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  Award,
  Calendar,
  FileText,
  CheckCircle2,
  Clock,
  Gift
} from "lucide-react";
import { Link } from "wouter";

export default function NftGratitudeDashboard() {
  const { user, loading } = useAuth();
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<number | null>(null);

  // Queries
  const { data: myNfts } = trpc.nftGratitude.getMyNfts.useQuery();
  const { data: myContributions } = trpc.nftGratitude.getMyContributions.useQuery();
  const { data: myInquiries } = trpc.nftGratitude.getMyInquiries.useQuery();

  // Mutations
  const createInquiry = trpc.nftGratitude.createInquiry.useMutation({
    onSuccess: (data) => {
      toast.success(`Enquête soumise ! Contribution calculée : ${data.calculatedContribution.toFixed(2)} € (${data.percentage}%)`);
      setShowInquiryForm(false);
      setSelectedBeneficiary(null);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Form state
  const [inquiryForm, setInquiryForm] = useState({
    reportedRevenue: 0,
    evidenceProvided: "",
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Connexion Requise</CardTitle>
            <CardDescription>Veuillez vous connecter pour accéder à votre dashboard NFT.</CardDescription>
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

  const totalContributed = myNfts?.reduce((sum, item) => 
    sum + parseFloat(item.beneficiary.totalContributed), 0
  ) || 0;

  const highestGratitudeLevel = myNfts?.reduce((highest, item) => {
    const levels = ["none", "low", "medium", "high", "exceptional"];
    const currentLevel = levels.indexOf(item.beneficiary.gratitudeLevel);
    const highestLevel = levels.indexOf(highest);
    return currentLevel > highestLevel ? item.beneficiary.gratitudeLevel : highest;
  }, "none" as string);

  const handleSubmitInquiry = () => {
    if (!selectedBeneficiary) {
      toast.error("Veuillez sélectionner un NFT");
      return;
    }

    if (inquiryForm.reportedRevenue <= 0) {
      toast.error("Veuillez entrer un revenu valide");
      return;
    }

    createInquiry.mutate({
      beneficiaryId: selectedBeneficiary,
      inquiryType: "on_demand",
      reportedRevenue: inquiryForm.reportedRevenue,
      evidenceProvided: inquiryForm.evidenceProvided,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Sparkles className="h-10 w-10 text-accent" />
            Mon Dashboard NFT de Gratitude
          </h1>
          <p className="text-muted-foreground text-lg">
            Gérez vos ressources gratuites et contributions de gratitude
          </p>
        </div>

        {/* Statistiques Personnelles */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Mes NFT Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{myNfts?.length || 0}</div>
              <p className="text-sm text-muted-foreground mt-1">Ressources reçues gratuitement</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Contribué</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {totalContributed.toLocaleString("fr-FR")} €
              </div>
              <p className="text-sm text-muted-foreground mt-1">Gratitude versée</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Niveau de Gratitude</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Award className={`h-8 w-8 ${
                  highestGratitudeLevel === "exceptional" ? "text-purple-600" :
                  highestGratitudeLevel === "high" ? "text-yellow-600" :
                  highestGratitudeLevel === "medium" ? "text-blue-600" :
                  highestGratitudeLevel === "low" ? "text-gray-600" :
                  "text-gray-400"
                }`} />
                <span className="text-2xl font-bold capitalize">{highestGratitudeLevel}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {highestGratitudeLevel === "exceptional" ? "Badge Platine 💎" :
                 highestGratitudeLevel === "high" ? "Badge Or 🥇" :
                 highestGratitudeLevel === "medium" ? "Badge Argent 🥈" :
                 highestGratitudeLevel === "low" ? "Badge Bronze 🥉" :
                 "Aucun badge"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mes NFT Sources */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Mes NFT Sources</h2>
            {myNfts && myNfts.length > 0 && (
              <Button onClick={() => setShowInquiryForm(!showInquiryForm)}>
                <FileText className="h-4 w-4 mr-2" />
                Déclarer un Bénéfice
              </Button>
            )}
          </div>

          {showInquiryForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Déclarer un Bénéfice</CardTitle>
                <CardDescription>
                  Soumettez une enquête de recouvrement pour déclarer les bénéfices générés
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="nft">NFT Source *</Label>
                  <select
                    id="nft"
                    className="w-full border rounded-md p-2"
                    value={selectedBeneficiary || ""}
                    onChange={(e) => setSelectedBeneficiary(parseInt(e.target.value))}
                  >
                    <option value="">Sélectionnez un NFT</option>
                    {myNfts?.map((item) => (
                      <option key={item.beneficiary.id} value={item.beneficiary.id}>
                        {item.nftSource?.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="revenue">Revenu Généré (€) *</Label>
                  <Input
                    id="revenue"
                    type="number"
                    min="0"
                    step="0.01"
                    value={inquiryForm.reportedRevenue}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, reportedRevenue: parseFloat(e.target.value) })}
                    placeholder="5000.00"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Revenu net généré grâce à cette ressource
                  </p>
                </div>

                <div>
                  <Label htmlFor="evidence">Preuves (optionnel)</Label>
                  <Textarea
                    id="evidence"
                    value={inquiryForm.evidenceProvided}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, evidenceProvided: e.target.value })}
                    placeholder="Décrivez les preuves que vous pouvez fournir (factures, captures d'écran, témoignages...)&#10;&#10;Exemple : Contrat signé avec Client X pour 10 000 € grâce à la méthodologie PFPMA. Facture disponible sur demande."
                    rows={4}
                  />
                </div>

                <div className="p-4 bg-accent/10 rounded-lg">
                  <h4 className="font-semibold mb-2">ℹ️ Calcul Automatique</h4>
                  <p className="text-sm text-muted-foreground">
                    Votre contribution sera calculée automatiquement selon le barème :<br />
                    • Formation : <strong>5%</strong> du revenu<br />
                    • Coaching : <strong>10%</strong> du revenu<br />
                    • Template : <strong>3%</strong> du revenu<br />
                    • Ressource : <strong>7%</strong> du revenu
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSubmitInquiry} disabled={createInquiry.isPending}>
                    {createInquiry.isPending ? "Soumission..." : "Soumettre l'Enquête"}
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setShowInquiryForm(false);
                    setSelectedBeneficiary(null);
                  }}>
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {myNfts?.map((item) => (
              <Card key={item.beneficiary.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Gift className="h-5 w-5 text-accent" />
                        {item.nftSource?.name}
                      </CardTitle>
                      <CardDescription>{item.nftSource?.description}</CardDescription>
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
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Valeur Actuelle</p>
                      <p className="text-lg font-bold text-accent">
                        {parseFloat(item.nftSource?.currentValue || "0").toLocaleString("fr-FR")} €
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ma Contribution</p>
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

                  <div className="mt-4 p-3 bg-secondary/20 rounded-lg">
                    <p className="text-sm">
                      <strong>Enrichissement du NFT :</strong> Chaque contribution enrichit ce NFT selon le Facteur Alpha (α = 22.67).
                      Valeur initiale : {parseFloat(item.nftSource?.initialValue || "0").toLocaleString("fr-FR")} €
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}

            {(!myNfts || myNfts.length === 0) && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Sparkles className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Aucun NFT Source</h3>
                  <p className="text-muted-foreground mb-4">
                    Vous n'avez pas encore reçu de ressource gratuite.
                  </p>
                  <Button asChild>
                    <Link href="/ressources">Découvrir les Ressources Gratuites</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Mes Contributions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Historique des Contributions</h2>
          <div className="grid gap-4">
            {myContributions?.map((item) => (
              <Card key={item.contribution.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        {parseFloat(item.contribution.amount).toLocaleString("fr-FR")} €
                      </CardTitle>
                      <CardDescription>{item.nftSource?.name}</CardDescription>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.contribution.paymentStatus === "completed" ? "bg-green-100 text-green-700" :
                      item.contribution.paymentStatus === "pending" ? "bg-orange-100 text-orange-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {item.contribution.paymentStatus === "completed" ? "Payé" :
                       item.contribution.paymentStatus === "pending" ? "En attente" :
                       "Échoué"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
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
                </CardContent>
              </Card>
            ))}

            {(!myContributions || myContributions.length === 0) && (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">Aucune contribution pour le moment.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Mes Enquêtes */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Mes Enquêtes de Recouvrement</h2>
          <div className="grid gap-4">
            {myInquiries?.map((item) => (
              <Card key={item.inquiry.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-accent" />
                        {item.nftSource?.name}
                      </CardTitle>
                      <CardDescription>
                        {item.inquiry.inquiryType} — {new Date(item.inquiry.inquiryDate).toLocaleDateString("fr-FR")}
                      </CardDescription>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.inquiry.status === "approved" ? "bg-green-100 text-green-700" :
                      item.inquiry.status === "pending" ? "bg-orange-100 text-orange-700" :
                      item.inquiry.status === "disputed" ? "bg-red-100 text-red-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {item.inquiry.status === "approved" ? "Approuvé" :
                       item.inquiry.status === "pending" ? "En attente" :
                       item.inquiry.status === "disputed" ? "Contesté" :
                       "En révision"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
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
                  </div>

                  {item.inquiry.evidenceProvided && (
                    <div className="mt-4 p-3 bg-secondary/20 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Preuves fournies :</p>
                      <p className="text-sm whitespace-pre-wrap">{item.inquiry.evidenceProvided}</p>
                    </div>
                  )}

                  {item.inquiry.adminNotes && (
                    <div className="mt-4 p-3 bg-accent/10 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Notes de l'administrateur :</p>
                      <p className="text-sm">{item.inquiry.adminNotes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {(!myInquiries || myInquiries.length === 0) && (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">Aucune enquête soumise pour le moment.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Section Contrat */}
        <Card className="mt-8 bg-accent/5 border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-accent" />
              Contrat de NFT de Gratitude Économique
            </CardTitle>
            <CardDescription>
              Consultez les termes et conditions de la redevabilité
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              En recevant une ressource gratuite, vous acceptez le principe de **gratuité initiale** avec **redevabilité proportionnelle**.
              Consultez le contrat complet pour comprendre vos droits et obligations.
            </p>
            <Button variant="outline" asChild>
              <a href="/CONTRAT_NFT_GRATITUDE_ECONOMIQUE.md" target="_blank">
                <FileText className="h-4 w-4 mr-2" />
                Lire le Contrat Complet
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
