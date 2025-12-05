import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Loader2,
  Copy,
  Check,
  Gift,
  Users,
  TrendingUp,
  Award,
  Mail,
  Share2,
} from "lucide-react";
import { useLocation } from "wouter";

export default function Referral() {
  const [, navigate] = useLocation();
  const [copied, setCopied] = useState(false);

  // Récupérer l'utilisateur connecté
  const { data: user, isLoading: isLoadingUser } = trpc.auth.me.useQuery();

  // Récupérer le lien de parrainage
  const { data: referralLink, isLoading: isLoadingLink } = trpc.referral.getMyReferralLink.useQuery(
    undefined,
    { enabled: !!user }
  );

  // Récupérer les statistiques de parrainage
  const { data: stats, isLoading: isLoadingStats } = trpc.referral.getMyReferralStats.useQuery(
    undefined,
    { enabled: !!user }
  );

  // Récupérer les crédits de parrainage
  const { data: credits, isLoading: isLoadingCredits } =
    trpc.referral.getMyReferralCredits.useQuery(undefined, { enabled: !!user });

  const handleCopyLink = () => {
    if (referralLink?.referralUrl) {
      navigator.clipboard.writeText(referralLink.referralUrl);
      setCopied(true);
      toast.success("Lien copié dans le presse-papiers !");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareEmail = () => {
    if (referralLink?.referralUrl) {
      const subject = "Rejoignez Sionohmair Insight Academy !";
      const body = `Bonjour,\n\nJe vous invite à découvrir Sionohmair Insight Academy, une plateforme exceptionnelle de Content Marketing & Copywriting.\n\nInscrivez-vous via mon lien de parrainage et profitez de 30 jours d'essai gratuit :\n${referralLink.referralUrl}\n\nÀ bientôt !`;
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  };

  if (isLoadingUser || isLoadingLink || isLoadingStats || isLoadingCredits) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container max-w-6xl py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gift className="w-12 h-12 text-purple-600" />
            <h1 className="text-4xl font-bold text-slate-900">Programme de Parrainage</h1>
          </div>
          <p className="text-lg text-slate-600">
            Partagez Sionohmair Insight Academy et gagnez <strong>1 mois gratuit</strong> pour
            chaque ami qui s'abonne !
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Invitations Envoyées</p>
                  <p className="text-3xl font-bold text-slate-900">{stats?.totalClicks || 0}</p>
                </div>
                <Share2 className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Inscriptions</p>
                  <p className="text-3xl font-bold text-slate-900">{stats?.totalSignups || 0}</p>
                </div>
                <Users className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conversions</p>
                  <p className="text-3xl font-bold text-slate-900">{stats?.totalConversions || 0}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Crédits Gagnés</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {stats?.totalCreditsEarned || 0} jours
                  </p>
                </div>
                <Award className="w-8 h-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lien de parrainage */}
          <Card className="border-2 border-purple-500">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <CardTitle className="text-2xl">Votre Lien de Parrainage</CardTitle>
              <CardDescription className="text-purple-50">
                Partagez ce lien unique avec vos amis
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex gap-2">
                <Input
                  value={referralLink?.referralUrl || ""}
                  readOnly
                  className="flex-1 font-mono text-sm"
                />
                <Button onClick={handleCopyLink} variant="outline" className="shrink-0">
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>

              <div className="space-y-2">
                <Button onClick={handleShareEmail} variant="outline" className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Partager par Email
                </Button>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2">Comment ça marche ?</h4>
                <ol className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-purple-600">1.</span>
                    <span>Partagez votre lien unique avec vos amis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-purple-600">2.</span>
                    <span>Ils s'inscrivent et profitent de 30 jours d'essai gratuit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-purple-600">3.</span>
                    <span>
                      Dès qu'ils s'abonnent, vous recevez <strong>1 mois gratuit</strong> !
                    </span>
                  </li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Crédits disponibles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Vos Crédits</CardTitle>
              <CardDescription>Crédits de parrainage accumulés</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-green-700">Total</p>
                  <p className="text-2xl font-bold text-green-900">
                    {credits?.totalCredits || 0} jours
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-blue-700">Utilisés</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {credits?.usedCredits || 0} jours
                  </p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-amber-700">Disponibles</p>
                  <p className="text-2xl font-bold text-amber-900">
                    {credits?.availableCredits || 0} jours
                  </p>
                </div>
              </div>

              {credits && credits.credits.length > 0 ? (
                <div>
                  <h4 className="font-semibold mb-3">Historique des Crédits</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {credits.credits.map((credit: any) => (
                      <div
                        key={credit.id}
                        className="flex justify-between items-center p-3 bg-muted rounded-lg text-sm"
                      >
                        <div>
                          <p className="font-medium">
                            {credit.creditDays} jours{" "}
                            {credit.used ? (
                              <span className="text-xs text-blue-600">(utilisé)</span>
                            ) : (
                              <span className="text-xs text-green-600">(disponible)</span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Créé le {new Date(credit.createdAt).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Expire le {new Date(credit.expiresAt).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
                  <p className="text-muted-foreground">
                    Aucun crédit pour le moment. Commencez à parrainer vos amis !
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Liste des parrainages */}
        {stats && stats.referrals.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Vos Parrainages</CardTitle>
              <CardDescription>Historique de tous vos parrainages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.referrals.map((referral: any) => (
                  <div
                    key={referral.id}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">
                        {referral.referredUserEmail || "En attente d'inscription"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {referral.status === "pending" && "Lien partagé, en attente"}
                        {referral.status === "signed_up" && "Inscrit, en attente d'abonnement"}
                        {referral.status === "converted" && "Converti ✅"}
                      </p>
                    </div>
                    <div className="text-right">
                      {referral.convertedAt && (
                        <p className="text-sm font-semibold text-green-600">
                          +{referral.creditDays} jours
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {referral.signedUpAt
                          ? new Date(referral.signedUpAt).toLocaleDateString("fr-FR")
                          : "—"}
                      </p>
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
