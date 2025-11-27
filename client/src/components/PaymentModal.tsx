import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CreditCard, X, Calendar, Zap } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: {
    plan: string;
    monthlyPrice: number;
    nextPaymentDate: Date;
    status: string;
    daysUntilExpiration: number;
  };
  onAuthorizePayment: () => void;
  onSuspendAccess: () => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  subscription,
  onAuthorizePayment,
  onSuspendAccess
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const getPlanName = (plan: string) => {
    const names: Record<string, string> = {
      free: 'Gratuit',
      starter: 'Starter',
      pro: 'Pro',
      enterprise: 'Enterprise'
    };
    return names[plan] || plan;
  };

  const formatPrice = (cents: number) => {
    return `${(cents / 100).toFixed(2)}€`;
  };

  const getUrgencyColor = (days: number) => {
    if (days <= 0) return 'bg-red-100 text-red-800 border-red-200';
    if (days <= 1) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (days <= 3) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const getUrgencyMessage = (days: number) => {
    if (days <= 0) return 'Votre abonnement a expiré';
    if (days === 1) return 'Votre abonnement expire dans 24h';
    if (days <= 3) return `Votre abonnement expire dans ${days} jours`;
    return `Renouvellement dans ${days} jours`;
  };

  const handleAuthorizePayment = async () => {
    setIsProcessing(true);
    try {
      await onAuthorizePayment();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuspendAccess = async () => {
    if (confirm('Êtes-vous sûr de vouloir suspendre votre accès ? Vous pourrez le réactiver à tout moment.')) {
      await onSuspendAccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 shadow-2xl">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4"
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-6 w-6 text-orange-600" />
            <CardTitle className="text-2xl">Renouvellement requis</CardTitle>
          </div>
          <CardDescription>
            Votre abonnement {getPlanName(subscription.plan)} nécessite un renouvellement
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Statut d'urgence */}
          <div className={`border rounded-lg p-4 ${getUrgencyColor(subscription.daysUntilExpiration)}`}>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5" />
              <h3 className="font-semibold">{getUrgencyMessage(subscription.daysUntilExpiration)}</h3>
            </div>
            <p className="text-sm">
              {subscription.daysUntilExpiration <= 0
                ? 'Renouvelez maintenant pour réactiver votre accès à tous les outils.'
                : 'Renouvelez dès maintenant pour éviter toute interruption de service.'}
            </p>
          </div>

          {/* Détails de l'abonnement */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Plan actuel</span>
              <Badge variant="outline">{getPlanName(subscription.plan)}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Montant du renouvellement</span>
              <span className="font-semibold text-lg">{formatPrice(subscription.monthlyPrice)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Prochaine échéance</span>
              <span className="font-medium">
                {new Date(subscription.nextPaymentDate).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4 border-t">
            <Button
              onClick={handleAuthorizePayment}
              disabled={isProcessing}
              size="lg"
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {isProcessing ? (
                <>
                  <Zap className="mr-2 h-5 w-5 animate-pulse" />
                  Traitement en cours...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Autoriser le paiement ({formatPrice(subscription.monthlyPrice)})
                </>
              )}
            </Button>

            <Button
              onClick={handleSuspendAccess}
              variant="outline"
              size="lg"
              className="w-full"
            >
              Suspendre mon accès temporairement
            </Button>
          </div>

          {/* Informations supplémentaires */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-900">
              <strong>💡 Bon à savoir :</strong> En suspendant votre accès, vous conservez votre NFT de licence. 
              Vous pourrez réactiver votre abonnement à tout moment. Vos données (avatars, analyses, copies) 
              sont conservées pendant 6 mois.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
