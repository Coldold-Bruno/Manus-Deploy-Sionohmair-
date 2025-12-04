import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, Crown, Check, X, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { APP_TITLE } from '@/const';

/**
 * Page Premium - Gestion de l'abonnement et affichage des quotas
 * Sionohmair Insight Academy
 */
export default function Premium() {
  const [isLoading, setIsLoading] = useState(false);

  // Récupérer le statut Premium
  const { data: premiumStatus, isLoading: statusLoading, refetch } = trpc.premium.getMyPremiumStatus.useQuery();

  // Calculer le pourcentage et la couleur de la barre de progression
  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-orange-500';
    return 'bg-green-500';
  };

  // Mutation pour créer une session de paiement
  const createCheckout = trpc.premium.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
      setIsLoading(false);
    },
  });

  // Mutation pour créer un portail de gestion
  const createPortal = trpc.premium.createPortalSession.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
      setIsLoading(false);
    },
  });

  const handleUpgrade = async () => {
    setIsLoading(true);
    
    // Prix Stripe - À remplacer par votre vrai Price ID
    const priceId = import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID || 'price_XXXXXXXXXXXXX';
    
    const baseUrl = window.location.origin;
    
    createCheckout.mutate({
      priceId,
      successUrl: `${baseUrl}/premium?success=true`,
      cancelUrl: `${baseUrl}/premium?canceled=true`,
    });
  };

  const handleManageSubscription = async () => {
    setIsLoading(true);
    
    const baseUrl = window.location.origin;
    
    createPortal.mutate({
      returnUrl: `${baseUrl}/premium`,
    });
  };

  if (statusLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isPremium = premiumStatus?.isPremium || false;
  const quotas = premiumStatus?.quotas;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container max-w-6xl py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Crown className="h-8 w-8 text-amber-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              {APP_TITLE} Premium
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Débloquez tout le potentiel de votre ingénierie du génie avec un accès illimité à tous les outils.
          </p>
        </div>

        {/* Statut actuel */}
        <Card className="mb-8 border-2 hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Statut de votre compte
                  {isPremium && (
                    <Badge variant="default" className="bg-gradient-to-r from-amber-500 to-orange-500">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                  {!isPremium && (
                    <Badge variant="secondary">Gratuit</Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {isPremium
                    ? `Votre abonnement Premium est actif jusqu'au ${new Date(premiumStatus?.premiumUntil || new Date()).toLocaleDateString('fr-FR')}`
                    : 'Passez Premium pour un accès illimité à tous les outils'}
                </CardDescription>
              </div>
              {isPremium && (
                <Button
                  variant="outline"
                  onClick={handleManageSubscription}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Gérer l\'abonnement'
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Quotas */}
        {!isPremium && quotas && (
          <Card className="mb-8 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Vos quotas mensuels</CardTitle>
              <CardDescription>
                Réinitialisation le {new Date(premiumStatus?.resetAt || new Date()).toLocaleDateString('fr-FR')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Générateur de Copy */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Générateur de Copy</span>
                  <span className="text-sm text-muted-foreground">
                    {quotas.copyGenerations.used} / {quotas.copyGenerations.limit}
                  </span>
                </div>
                <Progress
                  value={(quotas.copyGenerations.used / quotas.copyGenerations.limit) * 100}
                  className="h-2"
                />
                {quotas.copyGenerations.used >= quotas.copyGenerations.limit && (
                  <Badge variant="destructive" className="mt-2 w-full justify-center">Quota atteint</Badge>
                )}
              </div>

              {/* Analyseur de Contenu */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Analyseur de Contenu</span>
                  <span className="text-sm text-muted-foreground">
                    {quotas.contentAnalyses.used} / {quotas.contentAnalyses.limit}
                  </span>
                </div>
                <Progress
                  value={(quotas.contentAnalyses.used / quotas.contentAnalyses.limit) * 100}
                  className="h-2"
                />
                {quotas.contentAnalyses.used >= quotas.contentAnalyses.limit && (
                  <Badge variant="destructive" className="mt-2 w-full justify-center">Quota atteint</Badge>
                )}
              </div>

              {/* Persona Builder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Persona Builder (Avatars)</span>
                  <span className="text-sm text-muted-foreground">
                    {quotas.avatars.used} / {quotas.avatars.limit}
                  </span>
                </div>
                <Progress
                  value={(quotas.avatars.used / quotas.avatars.limit) * 100}
                  className="h-2"
                />
                {quotas.avatars.used >= quotas.avatars.limit && (
                  <Badge variant="destructive" className="mt-2 w-full justify-center">Quota atteint</Badge>
                )}
              </div>

              {/* Correcteur */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Correcteur Universel</span>
                  <span className="text-sm text-muted-foreground">
                    {quotas.corrections.used} / {quotas.corrections.limit}
                  </span>
                </div>
                <Progress
                  value={(quotas.corrections.used / quotas.corrections.limit) * 100}
                  className="h-2"
                />
                {quotas.corrections.used >= quotas.corrections.limit && (
                  <Badge variant="destructive" className="mt-2 w-full justify-center">Quota atteint</Badge>
                )}
              </div>

              {/* Générateur de Citations */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Générateur de Citations</span>
                  <span className="text-sm text-muted-foreground">
                    {quotas.quotes.used} / {quotas.quotes.limit}
                  </span>
                </div>
                <Progress
                  value={(quotas.quotes.used / quotas.quotes.limit) * 100}
                  className="h-2"
                />
                {quotas.quotes.used >= quotas.quotes.limit && (
                  <Badge variant="destructive" className="mt-2 w-full justify-center">Quota atteint</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Comparaison Gratuit vs Premium */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Plan Gratuit */}
          <Card className={!isPremium ? 'border-2 border-primary' : ''}>
            <CardHeader>
              <CardTitle>Plan Gratuit</CardTitle>
              <CardDescription>Pour découvrir la plateforme</CardDescription>
              <div className="text-3xl font-bold mt-4">0€<span className="text-base font-normal text-muted-foreground">/mois</span></div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5" />
                <span className="text-sm">5 générations de copy/mois</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5" />
                <span className="text-sm">10 analyses de contenu/mois</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5" />
                <span className="text-sm">3 avatars clients max</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5" />
                <span className="text-sm">5 corrections/mois</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5" />
                <span className="text-sm">5 citations/mois</span>
              </div>
              <div className="flex items-start gap-2">
                <X className="h-5 w-5 text-red-500 mt-0.5" />
                <span className="text-sm text-muted-foreground">Accès aux fonctionnalités avancées</span>
              </div>
            </CardContent>
          </Card>

          {/* Plan Premium */}
          <Card className={isPremium ? 'border-2 border-amber-500 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20' : 'border-2 border-amber-500/50'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-500" />
                Plan Premium
              </CardTitle>
              <CardDescription>Pour les professionnels exigeants</CardDescription>
              <div className="text-3xl font-bold mt-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                29€<span className="text-base font-normal text-muted-foreground">/mois</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <Sparkles className="h-5 w-5 text-amber-500 mt-0.5" />
                <span className="text-sm font-medium">Générations de copy illimitées</span>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="h-5 w-5 text-amber-500 mt-0.5" />
                <span className="text-sm font-medium">Analyses de contenu illimitées</span>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="h-5 w-5 text-amber-500 mt-0.5" />
                <span className="text-sm font-medium">Avatars clients illimités</span>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="h-5 w-5 text-amber-500 mt-0.5" />
                <span className="text-sm font-medium">Corrections illimitées</span>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="h-5 w-5 text-amber-500 mt-0.5" />
                <span className="text-sm font-medium">Citations illimitées</span>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="h-5 w-5 text-amber-500 mt-0.5" />
                <span className="text-sm font-medium">Support prioritaire</span>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="h-5 w-5 text-amber-500 mt-0.5" />
                <span className="text-sm font-medium">Nouvelles fonctionnalités en avant-première</span>
              </div>

              {!isPremium && (
                <Button
                  className="w-full mt-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                  size="lg"
                  onClick={handleUpgrade}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Crown className="h-4 w-4 mr-2" />
                      Passer Premium
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Questions fréquentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Puis-je annuler à tout moment ?</h3>
              <p className="text-sm text-muted-foreground">
                Oui, vous pouvez annuler votre abonnement à tout moment depuis le portail de gestion. 
                Vous conserverez l'accès Premium jusqu'à la fin de votre période de facturation.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Que se passe-t-il si j'annule ?</h3>
              <p className="text-sm text-muted-foreground">
                Vous repasserez automatiquement au plan gratuit avec les quotas mensuels standards. 
                Vos données et configurations seront conservées.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Les quotas gratuits se réinitialisent quand ?</h3>
              <p className="text-sm text-muted-foreground">
                Les quotas se réinitialisent automatiquement tous les 30 jours à partir de votre première utilisation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
