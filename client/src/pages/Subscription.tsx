import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, XCircle, AlertCircle, CreditCard, Calendar, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import DurationSelector from '@/components/DurationSelector';

/**
 * Page de gestion de l'abonnement
 * Affiche le statut de l'abonnement, les jours restants de l'essai gratuit,
 * et permet de s'abonner ou de gérer l'abonnement
 */
export default function Subscription() {
  const [, navigate] = useLocation();
  const [isCreatingTrial, setIsCreatingTrial] = useState(false);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [isCreatingPortal, setIsCreatingPortal] = useState(false);

  // Récupérer l'utilisateur connecté
  const { data: user, isLoading: isLoadingUser } = trpc.auth.me.useQuery();

  // Récupérer l'abonnement de l'utilisateur
  const { data: subscription, isLoading: isLoadingSubscription, refetch } = trpc.subscription.getMySubscription.useQuery(
    undefined,
    { enabled: !!user }
  );

  // Mutation pour créer un essai gratuit
  const createTrialMutation = trpc.subscription.createTrialSubscription.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Mutation pour créer une session Stripe Checkout
  const createCheckoutMutation = trpc.subscription.createSubscriptionCheckout.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Mutation pour créer une session Stripe Billing Portal
  const createPortalMutation = trpc.subscription.createBillingPortalSession.useMutation({
    onSuccess: (data) => {
      if (data.portalUrl) {
        window.location.href = data.portalUrl;
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Gérer les paramètres de l'URL (success, cancelled)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      toast.success('Abonnement activé avec succès ! Bienvenue 🎉');
      // Nettoyer l'URL
      window.history.replaceState({}, '', '/subscription');
      refetch();
    } else if (params.get('cancelled') === 'true') {
      toast.error('Paiement annulé');
      // Nettoyer l'URL
      window.history.replaceState({}, '', '/subscription');
    }
  }, [refetch]);

  // Gérer la création d'un essai gratuit
  const handleCreateTrial = async () => {
    setIsCreatingTrial(true);
    try {
      await createTrialMutation.mutateAsync();
    } finally {
      setIsCreatingTrial(false);
    }
  };

  // Gérer la création d'une session Stripe Checkout avec priceId
  const handleSubscribe = async (priceId: string) => {
    setIsCreatingCheckout(true);
    try {
      await createCheckoutMutation.mutateAsync({ priceId });
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  // Gérer la création d'une session Stripe Billing Portal
  const handleManageSubscription = async () => {
    setIsCreatingPortal(true);
    try {
      await createPortalMutation.mutateAsync();
    } finally {
      setIsCreatingPortal(false);
    }
  };

  // Afficher un loader pendant le chargement
  if (isLoadingUser || isLoadingSubscription) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  if (!user) {
    navigate('/');
    return null;
  }

  // Calculer le pourcentage de progression de l'essai gratuit
  const trialProgressPercentage = subscription?.status === 'trial' && subscription.daysRemaining !== undefined
    ? Math.max(0, Math.min(100, ((30 - subscription.daysRemaining) / 30) * 100))
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container max-w-4xl py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Mon Abonnement</h1>
          <p className="text-lg text-slate-600">
            Gérez votre abonnement et accédez à tous les outils de Content Marketing & Copywriting
          </p>
        </div>

        {/* Pas d'abonnement : CTA pour créer un essai gratuit */}
        {!subscription && (
          <Card className="border-2 border-amber-500 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8" />
                <div>
                  <CardTitle className="text-2xl">Commencez votre essai gratuit</CardTitle>
                  <CardDescription className="text-amber-50">
                    30 jours d'accès complet à tous les outils, sans carte bancaire
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-slate-700">
                  Profitez de <strong>30 jours gratuits</strong> pour tester tous les outils de Content Marketing & Copywriting :
                </p>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Analyseur de Contenu</strong> : Analyse en 5 dimensions (SEO, Conversion, Engagement, Lisibilité, Psychologie)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Générateur de Copy IA</strong> : 8 frameworks de copywriting (PFPMA, APTEA, AIDA, PAS, PASTOR, BAB, 4P, QUEST)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Persona Builder</strong> : Créez des avatars clients détaillés</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Chat IA personnalisé</strong> : Conversations adaptées à votre audience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Éditeur en temps réel</strong> : Suggestions IA pendant la rédaction</span>
                  </li>
                </ul>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-amber-900">
                    <strong>Aucune carte bancaire requise</strong> pour l'essai gratuit. Après 30 jours, continuez pour seulement <strong>29€/mois</strong> (sans engagement).
                  </p>
                </div>
                <Button
                  onClick={handleCreateTrial}
                  disabled={isCreatingTrial}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-6 text-lg"
                >
                  {isCreatingTrial ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Activation en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Commencer l'essai gratuit (30 jours)
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Essai gratuit en cours */}
        {subscription?.status === 'trial' && (
          <div className="space-y-6">
            <Card className="border-2 border-blue-500 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-8 h-8" />
                    <div>
                      <CardTitle className="text-2xl">Essai Gratuit</CardTitle>
                      <CardDescription className="text-blue-50">
                        {subscription.daysRemaining} jours restants
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-white text-blue-600 text-lg px-4 py-2">
                    Gratuit
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Progression de l'essai</span>
                      <span className="text-sm text-slate-600">{Math.round(trialProgressPercentage)}%</span>
                    </div>
                    <Progress value={trialProgressPercentage} className="h-3" />
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      Votre essai gratuit se termine le <strong>{new Date(subscription.trialEndDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>.
                      Vous recevrez des rappels par email à J-7, J-3, J-1 et J-0.
                    </p>
                  </div>
                  <DurationSelector onSelect={handleSubscribe} isLoading={isCreatingCheckout} />
                </div>
              </CardContent>
            </Card>

            {/* Avantages de l'abonnement */}
            <Card>
              <CardHeader>
                <CardTitle>Pourquoi s'abonner ?</CardTitle>
                <CardDescription>
                  Continuez à profiter de tous les outils après votre essai gratuit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Accès illimité</strong> à tous les outils de Content Marketing & Copywriting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Mises à jour régulières</strong> avec de nouveaux frameworks et fonctionnalités</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Support prioritaire</strong> par email et chat</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Sans engagement</strong> : annulez quand vous voulez</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Prix fixe</strong> : 29€/mois, pas d'augmentation surprise</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Abonnement actif */}
        {subscription?.status === 'active' && (
          <div className="space-y-6">
            <Card className="border-2 border-green-500 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8" />
                    <div>
                      <CardTitle className="text-2xl">Abonnement Actif</CardTitle>
                      <CardDescription className="text-green-50">
                        Accès complet à tous les outils
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-white text-green-600 text-lg px-4 py-2">
                    Premium
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-slate-600" />
                        <span className="text-sm font-medium text-slate-700">Date d'activation</span>
                      </div>
                      <p className="text-lg font-semibold text-slate-900">
                        {subscription.activatedAt
                          ? new Date(subscription.activatedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
                          : 'N/A'}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="w-5 h-5 text-slate-600" />
                        <span className="text-sm font-medium text-slate-700">Montant mensuel</span>
                      </div>
                      <p className="text-lg font-semibold text-slate-900">29€/mois</p>
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-900">
                      <strong>Merci de votre confiance !</strong> Vous avez accès à tous les outils de Content Marketing & Copywriting. Continuez à créer du contenu qui convertit 🚀
                    </p>
                  </div>
                  <Button
                    onClick={handleManageSubscription}
                    disabled={isCreatingPortal}
                    variant="outline"
                    className="w-full border-2 border-slate-300 hover:border-slate-400 font-semibold py-6 text-lg"
                  >
                    {isCreatingPortal ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Redirection vers Stripe...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Gérer mon abonnement (factures, paiement, annulation)
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Essai expiré */}
        {subscription?.status === 'trial_expired' && (
          <Card className="border-2 border-orange-500 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-8 h-8" />
                <div>
                  <CardTitle className="text-2xl">Essai Expiré</CardTitle>
                  <CardDescription className="text-orange-50">
                    Votre essai gratuit de 30 jours est terminé
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-slate-700">
                  Votre essai gratuit s'est terminé le <strong>{new Date(subscription.trialEndDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>.
                </p>
                <p className="text-slate-700">
                  Pour continuer à utiliser tous les outils de Content Marketing & Copywriting, choisissez votre formule d'abonnement :
                </p>
                <DurationSelector onSelect={handleSubscribe} isLoading={isCreatingCheckout} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Abonnement annulé */}
        {subscription?.status === 'cancelled' && (
          <Card className="border-2 border-slate-400 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-slate-500 to-slate-600 text-white">
              <div className="flex items-center gap-3">
                <XCircle className="w-8 h-8" />
                <div>
                  <CardTitle className="text-2xl">Abonnement Annulé</CardTitle>
                  <CardDescription className="text-slate-50">
                    Vous n'avez plus accès aux outils
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-slate-700">
                  Votre abonnement a été annulé. Vous n'avez plus accès aux outils de Content Marketing & Copywriting.
                </p>
                <p className="text-slate-700">
                  Vous pouvez vous réabonner à tout moment en choisissant votre formule :
                </p>
                <DurationSelector onSelect={handleSubscribe} isLoading={isCreatingCheckout} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
