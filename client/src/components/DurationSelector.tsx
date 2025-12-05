import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, TrendingDown } from 'lucide-react';
import { SUBSCRIPTION_PRICES, type SubscriptionDuration } from '../../../shared/subscriptionPrices';
import { useTranslation } from 'react-i18next';

interface DurationSelectorProps {
  onSelect: (priceId: string) => void;
  isLoading?: boolean;
}

export default function DurationSelector({ onSelect, isLoading = false }: DurationSelectorProps) {
  const { t } = useTranslation();
  const [selectedDuration, setSelectedDuration] = useState<SubscriptionDuration>('biannual');
  
  const durations: SubscriptionDuration[] = ['monthly', 'quarterly', 'biannual', 'annual'];
  const selectedPlan = SUBSCRIPTION_PRICES[selectedDuration];

  const handleSubscribe = () => {
    onSelect(selectedPlan.priceId);
  };

  return (
    <div className="space-y-6">
      {/* Sélecteur de durée */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {durations.map((duration) => {
          const plan = SUBSCRIPTION_PRICES[duration];
          const isSelected = selectedDuration === duration;
          const pricePerMonth = (plan.price / plan.intervalCount).toFixed(2);

          return (
            <button
              key={duration}
              onClick={() => setSelectedDuration(duration)}
              className={`relative border-2 rounded-lg p-4 transition-all text-left ${
                isSelected
                  ? 'border-accent bg-accent/10 shadow-lg scale-105'
                  : 'border-accent/30 hover:border-accent hover:shadow-md'
              }`}
            >
              {/* Badge de sélection */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full p-1">
                  <Check className="h-4 w-4" />
                </div>
              )}

              {/* Badge de réduction */}
              {plan.badge && (
                <div
                  className={`inline-block text-xs font-semibold px-2 py-1 rounded-full mb-2 ${
                    duration === 'quarterly'
                      ? 'bg-green-100 text-green-700'
                      : duration === 'biannual'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {plan.badge}
                </div>
              )}

              <div className="text-center">
                {/* Nom de la formule */}
                <div className="text-lg font-bold mb-1">{plan.name}</div>

                {/* Prix total */}
                <div className="text-3xl font-bold text-accent mb-1">{plan.price}€</div>

                {/* Durée */}
                <p className="text-sm text-muted-foreground mb-2">
                  {plan.intervalCount} {plan.interval}
                </p>

                {/* Prix par mois */}
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold">{pricePerMonth}€/mois</span>
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Récapitulatif de la sélection */}
      <Card className="border-2 border-accent bg-gradient-to-r from-accent/5 to-accent/10">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                Votre sélection : {selectedPlan.name}
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">Prix total :</span> {selectedPlan.price}€ 
                  {selectedPlan.intervalCount > 1 && ` pour ${selectedPlan.intervalCount} ${selectedPlan.interval}`}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Prix mensuel équivalent :</span>{' '}
                  {(selectedPlan.price / selectedPlan.intervalCount).toFixed(2)}€/mois
                </p>
                {selectedPlan.savingsAmount && (
                  <div className="flex items-center gap-2 text-green-600 font-semibold">
                    <TrendingDown className="h-4 w-4" />
                    <span>Vous économisez {selectedPlan.savingsAmount}€ ({selectedPlan.savings}%)</span>
                  </div>
                )}
              </div>
            </div>
            
            <Button
              size="lg"
              onClick={handleSubscribe}
              disabled={isLoading}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-8"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  {t('common.loading', 'Chargement...')}
                </>
              ) : (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  {t('subscription.subscribeNow')}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Informations supplémentaires */}
      <div className="text-center text-sm text-muted-foreground space-y-1">
        <p>✅ Paiement sécurisé par Stripe</p>
        <p>✅ Annulation possible à tout moment</p>
        <p>✅ Accès immédiat à tous les outils</p>
      </div>
    </div>
  );
}
