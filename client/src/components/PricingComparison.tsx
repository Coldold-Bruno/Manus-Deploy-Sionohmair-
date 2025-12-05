import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, TrendingDown } from 'lucide-react';
import { SUBSCRIPTION_PRICES, type SubscriptionDuration } from '../../../shared/subscriptionPrices';

export default function PricingComparison() {
  const durations: SubscriptionDuration[] = ['monthly', 'quarterly', 'biannual', 'annual'];

  return (
    <div className="border-t pt-6 mt-6">
      <h3 className="text-lg font-semibold mb-4 text-accent flex items-center gap-2">
        <TrendingDown className="h-5 w-5" />
        Économisez avec un abonnement long terme
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {durations.map((duration) => {
          const plan = SUBSCRIPTION_PRICES[duration];
          const isPopular = duration === 'biannual';
          const pricePerMonth = (plan.price / plan.intervalCount).toFixed(2);

          return (
            <div
              key={duration}
              className={`border-2 rounded-lg p-4 transition-all ${
                isPopular
                  ? 'border-accent bg-accent/5 shadow-lg relative'
                  : 'border-accent/30 hover:border-accent'
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  ⭐ POPULAIRE
                </div>
              )}
              
              <div className="text-center">
                {/* Badge de réduction */}
                {plan.badge && (
                  <div
                    className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-2 ${
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
                
                {/* Nom de la formule */}
                <div className="text-lg font-bold mb-1">{plan.name}</div>
                
                {/* Prix total */}
                <div className="text-3xl font-bold text-accent mb-1">{plan.price}€</div>
                
                {/* Durée */}
                <p className="text-sm text-muted-foreground mb-2">
                  pour {plan.intervalCount} {plan.interval}
                  {plan.intervalCount > 1 ? '' : ''}
                </p>
                
                {/* Prix par mois */}
                <p className="text-xs text-muted-foreground">
                  soit <span className="font-semibold text-accent">{pricePerMonth}€/mois</span>
                </p>
                
                {/* Économies */}
                {plan.savingsAmount && (
                  <div className="mt-3 pt-3 border-t border-accent/20">
                    <div className="flex items-center justify-center gap-1 text-green-600 text-sm font-semibold">
                      <Check className="h-4 w-4" />
                      <span>Économie : {plan.savingsAmount}€</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Récapitulatif des économies */}
      <Card className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-green-800 flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Récapitulatif des économies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">30€</div>
              <p className="text-sm text-green-800">Économie trimestrielle</p>
              <p className="text-xs text-green-600 mt-1">vs mensuel (3×36€)</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-700">68€</div>
              <p className="text-sm text-orange-800">Économie semestrielle</p>
              <p className="text-xs text-orange-600 mt-1">vs mensuel (6×36€)</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-700">154€</div>
              <p className="text-sm text-red-800">Économie annuelle</p>
              <p className="text-xs text-red-600 mt-1">vs mensuel (12×36€)</p>
            </div>
          </div>
          <p className="text-center text-sm text-green-800 mt-4 font-semibold">
            💡 Plus vous vous engagez longtemps, plus vous économisez !
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
