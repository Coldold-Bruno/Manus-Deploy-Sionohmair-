import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock,
  CreditCard,
  Calendar,
  Shield,
  Zap,
  Gift,
  Infinity
} from 'lucide-react';

// Types pour la démo
interface Subscription {
  id: number;
  status: 'trial' | 'active' | 'trial_expired' | 'cancelled';
  trialStartDate: Date;
  trialEndDate: Date;
  paymentDate?: Date;
  oneTimePaymentAmount: number;
}

// Données de démo - Essai gratuit en cours
const DEMO_SUBSCRIPTION_TRIAL: Subscription = {
  id: 1,
  status: 'trial',
  trialStartDate: new Date('2025-10-28'),
  trialEndDate: new Date('2025-11-27'),
  oneTimePaymentAmount: 9900 // 99€
};

// Données de démo - Accès permanent
const DEMO_SUBSCRIPTION_PAID: Subscription = {
  id: 1,
  status: 'active',
  trialStartDate: new Date('2025-09-27'),
  trialEndDate: new Date('2025-10-27'),
  paymentDate: new Date('2025-10-25'),
  oneTimePaymentAmount: 9900 // 99€
};

export default function SubscriptionDashboard() {
  // Changez cette ligne pour tester les 2 états
  const [subscription] = useState<Subscription>(DEMO_SUBSCRIPTION_TRIAL); // ou DEMO_SUBSCRIPTION_PAID

  const getStatusInfo = (status: string) => {
    const info: Record<string, { label: string; color: string; icon: any; description: string }> = {
      trial: {
        label: 'Essai gratuit en cours',
        color: 'bg-blue-100 text-blue-800',
        icon: Gift,
        description: 'Profitez de tous les outils gratuitement pendant 30 jours'
      },
      active: {
        label: 'Accès permanent',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle,
        description: 'Vous avez un accès illimité à la plateforme'
      },
      trial_expired: {
        label: 'Essai expiré',
        color: 'bg-orange-100 text-orange-800',
        icon: AlertCircle,
        description: 'Effectuez le paiement unique pour continuer'
      },
      cancelled: {
        label: 'Accès annulé',
        color: 'bg-gray-100 text-gray-800',
        icon: AlertCircle,
        description: 'Votre accès a été annulé'
      }
    };
    return info[status] || info.trial;
  };

  const formatPrice = (cents: number) => {
    return `${(cents / 100).toFixed(2)}€`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getDaysRemaining = () => {
    const now = new Date();
    const end = new Date(subscription.trialEndDate);
    const diff = end.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const getTrialProgress = () => {
    const start = new Date(subscription.trialStartDate).getTime();
    const end = new Date(subscription.trialEndDate).getTime();
    const now = new Date().getTime();
    const total = end - start;
    const elapsed = now - start;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  const statusInfo = getStatusInfo(subscription.status);
  const StatusIcon = statusInfo.icon;
  const daysRemaining = getDaysRemaining();
  const trialProgress = getTrialProgress();

  const handlePayNow = () => {
    console.log('Redirecting to Stripe Checkout...');
    alert('Redirection vers Stripe Checkout (à implémenter)');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12">
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Mon Abonnement</h1>
          <p className="text-muted-foreground">
            Gérez votre accès à Sionohmair Insight Academy
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statut de l'abonnement */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-accent" />
                    Statut de l'abonnement
                  </CardTitle>
                  <Badge className={statusInfo.color}>
                    <StatusIcon className="mr-1 h-4 w-4" />
                    {statusInfo.label}
                  </Badge>
                </div>
                <CardDescription>{statusInfo.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Essai gratuit en cours */}
                {subscription.status === 'trial' && (
                  <>
                    <div className="bg-gradient-to-r from-blue-50 to-accent/5 border border-blue-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <Gift className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">Essai gratuit</h3>
                            <p className="text-sm text-muted-foreground">
                              {daysRemaining} jours restants sur 30
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-blue-600">{daysRemaining}</div>
                          <p className="text-xs text-muted-foreground">jours</p>
                        </div>
                      </div>

                      {/* Barre de progression */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progression</span>
                          <span className="font-semibold">{Math.round(trialProgress)}%</span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-accent transition-all duration-500"
                            style={{ width: `${trialProgress}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-4 text-sm text-muted-foreground">
                        Fin de l'essai : <strong>{formatDate(subscription.trialEndDate)}</strong>
                      </div>
                    </div>

                    {/* Alerte si moins de 7 jours */}
                    {daysRemaining <= 7 && daysRemaining > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-yellow-900">Votre essai se termine bientôt</h4>
                            <p className="text-sm text-yellow-800 mt-1">
                              Il vous reste {daysRemaining} jour{daysRemaining > 1 ? 's' : ''} d'essai gratuit. 
                              Effectuez le paiement unique de {formatPrice(subscription.oneTimePaymentAmount)} pour continuer à profiter de tous les outils.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CTA Paiement */}
                    <div className="border-t pt-6">
                      <h3 className="font-semibold mb-3">Continuer après l'essai</h3>
                      <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">Paiement unique</p>
                            <p className="text-sm text-muted-foreground">Accès permanent à tous les outils</p>
                          </div>
                          <div className="text-2xl font-bold text-accent">
                            {formatPrice(subscription.oneTimePaymentAmount)}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={handlePayNow}
                        size="lg"
                        className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                      >
                        <CreditCard className="mr-2 h-5 w-5" />
                        Payer maintenant et obtenir l'accès permanent
                      </Button>
                      <p className="text-center text-sm text-muted-foreground mt-3">
                        Garantie satisfait ou remboursé 14 jours
                      </p>
                    </div>
                  </>
                )}

                {/* Accès permanent */}
                {subscription.status === 'active' && (
                  <>
                    <div className="bg-gradient-to-r from-green-50 to-accent/5 border border-green-200 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                          <Infinity className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Accès permanent activé</h3>
                          <p className="text-sm text-muted-foreground">
                            Vous avez un accès illimité à tous les outils
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Date de paiement</p>
                          <p className="font-semibold">{subscription.paymentDate ? formatDate(subscription.paymentDate) : '-'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Montant payé</p>
                          <p className="font-semibold">{formatPrice(subscription.oneTimePaymentAmount)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-blue-900">Aucun paiement récurrent</h4>
                          <p className="text-sm text-blue-800 mt-1">
                            Vous avez payé une seule fois et gardez l'accès pour toujours. Toutes les mises à jour futures sont incluses gratuitement.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Essai expiré */}
                {subscription.status === 'trial_expired' && (
                  <>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                          <AlertCircle className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Votre essai a expiré</h3>
                          <p className="text-sm text-muted-foreground">
                            Effectuez le paiement pour continuer
                          </p>
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        Fin de l'essai : <strong>{formatDate(subscription.trialEndDate)}</strong>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="font-semibold mb-3">Réactiver votre accès</h3>
                      <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">Paiement unique</p>
                            <p className="text-sm text-muted-foreground">Accès permanent à tous les outils</p>
                          </div>
                          <div className="text-2xl font-bold text-accent">
                            {formatPrice(subscription.oneTimePaymentAmount)}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={handlePayNow}
                        size="lg"
                        className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                      >
                        <CreditCard className="mr-2 h-5 w-5" />
                        Payer et réactiver l'accès
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Avantages inclus */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-accent" />
                  Ce qui est inclus
                </CardTitle>
                <CardDescription>
                  Tous les outils et fonctionnalités de la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    'Analyseur de contenu',
                    'Générateur de copy',
                    'Persona Builder',
                    'Analyseur de scripts',
                    'Bibliothèque de frameworks',
                    'Chat IA personnalisé',
                    'Templates de scripts',
                    'Galerie d\'exemples',
                    'Éditeur en temps réel',
                    'Dashboard utilisateur',
                    'Chatbot d\'assistance',
                    'Mises à jour gratuites'
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-accent" />
                  Informations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Début de l'essai</p>
                  <p className="font-semibold">{formatDate(subscription.trialStartDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Fin de l'essai</p>
                  <p className="font-semibold">{formatDate(subscription.trialEndDate)}</p>
                </div>
                {subscription.paymentDate && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Date de paiement</p>
                    <p className="font-semibold">{formatDate(subscription.paymentDate)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/guide">
                    <Shield className="mr-2 h-4 w-4" />
                    Guide d'utilisation
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/pricing">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Voir les tarifs
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Besoin d'aide ?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Notre équipe est là pour vous aider. Contactez-nous si vous avez des questions.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <a href="mailto:support@sionohmair.com">
                    Contacter le support
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
