import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Zap, Shield, TrendingUp, Gift, Calendar } from 'lucide-react';
import PricingComparison from '@/components/PricingComparison';

export default function Pricing() {
  const features = [
    '10 outils Content Marketing & Copywriting',
    'Analyseur de contenu en 5 dimensions',
    'Générateur de copy avec 8 frameworks',
    'Persona Builder (avatar client)',
    'Analyseur de scripts marketing',
    'Bibliothèque de frameworks complète',
    'Chat IA personnalisé',
    'Templates de scripts prêts à l\'emploi',
    'Galerie d\'exemples AVANT/APRÈS',
    'Éditeur de copy en temps réel',
    'Dashboard utilisateur complet',
    'Chatbot d\'assistance 24/7',
    'Guide d\'utilisation détaillé',
    'Mises à jour continues',
    'Support prioritaire'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background py-16">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6">
            <Gift className="h-5 w-5" />
            <span className="font-semibold">Essayez gratuitement pendant 30 jours</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Tarification Simple et Transparente
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            30 jours gratuits sans engagement, puis 29€/mois pour continuer. 
            Annulez à tout moment, aucune carte bancaire requise pour l'essai.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-accent shadow-2xl relative overflow-hidden">
            {/* Badge "Populaire" */}
            <div className="absolute top-0 right-0 bg-accent text-accent-foreground px-6 py-2 rounded-bl-lg font-semibold">
              ⭐ Recommandé
            </div>

            <CardHeader className="text-center pt-12 pb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Zap className="h-8 w-8 text-accent" />
                <CardTitle className="text-3xl">Accès Complet</CardTitle>
              </div>
              <CardDescription className="text-lg">
                Tous les outils, toutes les fonctionnalités
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Prix */}
              <div className="text-center space-y-6">
                {/* Essai gratuit + Prix mensuel */}
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <div className="bg-green-100 text-green-800 px-6 py-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Gift className="h-6 w-6" />
                      <span className="text-2xl font-bold">30 jours</span>
                    </div>
                    <p className="text-sm">Gratuits</p>
                    <p className="text-xs mt-1">Sans carte bancaire</p>
                  </div>
                  <div className="text-3xl font-bold text-muted-foreground">puis</div>
                  <div className="bg-accent/10 text-accent px-8 py-4 rounded-lg">
                    <div className="text-5xl font-bold">29€</div>
                    <p className="text-lg mt-1">par mois</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Calendar className="h-5 w-5" />
                  <span>Abonnement mensuel • Annulez quand vous voulez</span>
                </div>

                {/* Tableau comparatif des économies */}
                <PricingComparison />
              </div>

              {/* Fonctionnalités */}
              <div className="border-t pt-8">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Shield className="h-6 w-6 text-accent" />
                  Tout ce qui est inclus :
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="border-t pt-8 space-y-4">
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-lg py-6"
                  asChild
                >
                  <a href="/subscription">
                    <Zap className="mr-2 h-6 w-6" />
                    Commencer l'essai gratuit (30 jours)
                  </a>
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Aucune carte bancaire requise pour l'essai gratuit
                </p>
              </div>

              {/* Garanties */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-3">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900">Annulez à tout moment</h4>
                    <p className="text-sm text-blue-800 mt-1">
                      Pas d'engagement, pas de frais cachés. Annulez votre abonnement en un clic depuis votre dashboard.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900">Mises à jour continues</h4>
                    <p className="text-sm text-blue-800 mt-1">
                      Toutes les nouvelles fonctionnalités, outils, et améliorations sont inclus dans votre abonnement.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Questions fréquentes</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Comment fonctionne l'essai gratuit ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Vous avez accès à tous les outils pendant 30 jours sans aucun paiement et sans fournir de carte bancaire. 
                  Après 30 jours, vous recevrez une notification pour souscrire à l'abonnement mensuel de 29€ si vous souhaitez continuer.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Que se passe-t-il après les 30 jours gratuits ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Vous pouvez souscrire à l'abonnement mensuel de 29€ pour continuer à utiliser la plateforme. 
                  Si vous ne souscrivez pas, votre accès sera simplement suspendu (vos données sont conservées pendant 6 mois).
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Puis-je annuler mon abonnement ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Oui, absolument ! Vous pouvez annuler votre abonnement à tout moment depuis votre dashboard. 
                  Aucun engagement, aucune pénalité. Votre accès restera actif jusqu'à la fin de la période payée.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Y a-t-il des frais cachés ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Non, aucun frais caché. Le prix affiché (29€/mois) est le seul paiement que vous effectuerez. 
                  Pas de frais d'inscription, pas de frais de résiliation, pas de surprise.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Puis-je obtenir un remboursement ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Oui ! Si vous n'êtes pas satisfait pendant votre premier mois d'abonnement (après l'essai gratuit), 
                  contactez-nous et nous vous rembourserons intégralement.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Comment sont traités les paiements ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Les paiements sont sécurisés par Stripe, le leader mondial du paiement en ligne. 
                  Vos informations bancaires sont cryptées et jamais stockées sur nos serveurs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">Prêt à transformer votre copywriting ?</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Rejoignez des centaines de marketeurs qui utilisent Sionohmair Insight Academy pour créer 
            des contenus qui convertissent.
          </p>
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
            <a href="/">
              Commencer mon essai gratuit de 30 jours
            </a>
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Aucune carte bancaire requise • Annulez quand vous voulez
          </p>
        </div>
      </div>
    </div>
  );
}
