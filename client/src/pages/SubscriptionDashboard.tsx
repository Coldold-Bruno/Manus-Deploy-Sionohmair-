import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Clock,
  CreditCard,
  Calendar,
  TrendingUp,
  Shield,
  Zap,
  RefreshCw
} from 'lucide-react';
import PaymentModal from '@/components/PaymentModal';

// Types pour la démo
interface Subscription {
  id: number;
  plan: 'free' | 'starter' | 'pro' | 'enterprise';
  status: 'trial' | 'active' | 'pending_payment' | 'suspended' | 'expired' | 'cancelled';
  monthlyPrice: number;
  trialEndDate?: Date;
  nextPaymentDate?: Date;
  lastPaymentDate?: Date;
  expirationDate?: Date;
  nftId?: string;
}

interface PaymentRecord {
  id: number;
  date: Date;
  amount: number;
  status: 'succeeded' | 'failed' | 'refunded';
  periodStart: Date;
  periodEnd: Date;
}

// Données de démo
const DEMO_SUBSCRIPTION: Subscription = {
  id: 1,
  plan: 'pro',
  status: 'active',
  monthlyPrice: 7900, // 79€ en centimes
  lastPaymentDate: new Date('2025-10-27'),
  nextPaymentDate: new Date('2025-12-27'),
  nftId: '0x1234...5678'
};

const DEMO_PAYMENTS: PaymentRecord[] = [
  {
    id: 1,
    date: new Date('2025-10-27'),
    amount: 7900,
    status: 'succeeded',
    periodStart: new Date('2025-10-27'),
    periodEnd: new Date('2025-11-27')
  },
  {
    id: 2,
    date: new Date('2025-09-27'),
    amount: 7900,
    status: 'succeeded',
    periodStart: new Date('2025-09-27'),
    periodEnd: new Date('2025-10-27')
  },
  {
    id: 3,
    date: new Date('2025-08-27'),
    amount: 7900,
    status: 'succeeded',
    periodStart: new Date('2025-08-27'),
    periodEnd: new Date('2025-09-27')
  }
];

export default function SubscriptionDashboard() {
  const [subscription] = useState<Subscription>(DEMO_SUBSCRIPTION);
  const [payments] = useState<PaymentRecord[]>(DEMO_PAYMENTS);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const getPlanName = (plan: string) => {
    const names: Record<string, string> = {
      free: 'Gratuit',
      starter: 'Starter',
      pro: 'Pro',
      enterprise: 'Enterprise'
    };
    return names[plan] || plan;
  };

  const getStatusInfo = (status: string) => {
    const info: Record<string, { label: string; color: string; icon: any; description: string }> = {
      trial: {
        label: 'Essai gratuit',
        color: 'bg-blue-100 text-blue-800',
        icon: Clock,
        description: 'Profitez de 14 jours d\'essai gratuit'
      },
      active: {
        label: 'Actif',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle,
        description: 'Votre abonnement est actif et à jour'
      },
      pending_payment: {
        label: 'En attente de paiement',
        color: 'bg-yellow-100 text-yellow-800',
        icon: AlertCircle,
        description: 'Un paiement est requis pour maintenir l\'accès'
      },
      suspended: {
        label: 'Suspendu',
        color: 'bg-orange-100 text-orange-800',
        icon: XCircle,
        description: 'Accès suspendu - Réactivez pour continuer'
      },
      expired: {
        label: 'Expiré',
        color: 'bg-red-100 text-red-800',
        icon: XCircle,
        description: 'Votre abonnement a expiré'
      },
      cancelled: {
        label: 'Annulé',
        color: 'bg-gray-100 text-gray-800',
        icon: XCircle,
        description: 'Abonnement annulé définitivement'
      }
    };
    return info[status] || info.active;
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

  const getDaysUntilExpiration = () => {
    if (!subscription.nextPaymentDate) return 0;
    const now = new Date();
    const next = new Date(subscription.nextPaymentDate);
    const diff = next.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const statusInfo = getStatusInfo(subscription.status);
  const StatusIcon = statusInfo.icon;
  const daysUntilExpiration = getDaysUntilExpiration();

  const handleAuthorizePayment = () => {
    console.log('Redirecting to Stripe Checkout...');
    // TODO: Intégrer Stripe Checkout
    alert('Redirection vers Stripe Checkout (à implémenter)');
  };

  const handleSuspendAccess = () => {
    console.log('Suspending access...');
    // TODO: Appeler l\'API pour suspendre
    alert('Accès suspendu (à implémenter)');
  };

  const handleReactivate = () => {
    setShowPaymentModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Mon Abonnement</h1>
          <p className="text-muted-foreground">
            Gérez votre abonnement NFT et consultez l'historique de vos paiements
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
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Plan actuel</p>
                    <p className="text-2xl font-bold">{getPlanName(subscription.plan)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tarif mensuel</p>
                    <p className="text-2xl font-bold">{formatPrice(subscription.monthlyPrice)}</p>
                  </div>
                </div>

                {subscription.nftId && (
                  <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-accent" />
                      <h3 className="font-semibold">NFT de Licence</h3>
                    </div>
                    <p className="text-sm text-muted-foreground font-mono">{subscription.nftId}</p>
                  </div>
                )}

                {subscription.status === 'suspended' && (
                  <Button
                    onClick={handleReactivate}
                    size="lg"
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Réactiver mon abonnement
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Historique des paiements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-6 w-6 text-accent" />
                  Historique des paiements
                </CardTitle>
                <CardDescription>
                  Tous vos paiements pour l'abonnement {getPlanName(subscription.plan)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/20 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          payment.status === 'succeeded' ? 'bg-green-100' :
                          payment.status === 'failed' ? 'bg-red-100' : 'bg-gray-100'
                        }`}>
                          {payment.status === 'succeeded' ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{formatDate(payment.date)}</p>
                          <p className="text-sm text-muted-foreground">
                            Période : {formatDate(payment.periodStart)} - {formatDate(payment.periodEnd)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">{formatPrice(payment.amount)}</p>
                        <Badge variant="outline" className={
                          payment.status === 'succeeded' ? 'bg-green-50 text-green-700' :
                          payment.status === 'failed' ? 'bg-red-50 text-red-700' : ''
                        }>
                          {payment.status === 'succeeded' ? 'Réussi' :
                           payment.status === 'failed' ? 'Échoué' : 'Remboursé'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Prochain paiement */}
            {subscription.nextPaymentDate && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-accent" />
                    Prochain paiement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Date</p>
                    <p className="font-semibold">{formatDate(subscription.nextPaymentDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Montant</p>
                    <p className="text-2xl font-bold">{formatPrice(subscription.monthlyPrice)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Dans</p>
                    <p className="font-semibold">
                      {daysUntilExpiration > 0 ? `${daysUntilExpiration} jours` : 'Aujourd\'hui'}
                    </p>
                  </div>

                  {daysUntilExpiration <= 7 && daysUntilExpiration > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-xs text-yellow-900">
                        <strong>⚠️ Attention :</strong> Votre renouvellement approche. Assurez-vous que votre moyen de paiement est à jour.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Statistiques */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  Statistiques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Paiements réussis</span>
                  <span className="font-semibold">{payments.filter(p => p.status === 'succeeded').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total dépensé</span>
                  <span className="font-semibold">
                    {formatPrice(payments.reduce((sum, p) => p.status === 'succeeded' ? sum + p.amount : sum, 0))}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Membre depuis</span>
                  <span className="font-semibold">
                    {payments.length > 0 ? formatDate(payments[payments.length - 1].date) : '-'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/pricing">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Changer de plan
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/guide">
                    <Shield className="mr-2 h-4 w-4" />
                    Guide d'utilisation
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de paiement */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          subscription={{
            plan: subscription.plan,
            monthlyPrice: subscription.monthlyPrice,
            nextPaymentDate: subscription.nextPaymentDate || new Date(),
            status: subscription.status,
            daysUntilExpiration
          }}
          onAuthorizePayment={handleAuthorizePayment}
          onSuspendAccess={handleSuspendAccess}
        />
      )}
    </div>
  );
}
