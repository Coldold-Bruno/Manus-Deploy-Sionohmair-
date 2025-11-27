import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Zap, Shield, TrendingUp, Gift, Infinity } from 'lucide-react';

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
    'Mises à jour gratuites à vie',
    'Support prioritaire'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background py-16">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6">
            <Gift className="h-5 w-5" />
            <span className="font-semibold">Offre de lancement</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Tarification Simple et Transparente
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Essayez gratuitement pendant 30 jours, puis un paiement unique pour un accès permanent. 
            Pas d'abonnement, pas de redevance mensuelle, pas d'engagement.
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
                Tous les outils, toutes les fonctionnalités, pour toujours
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Prix */}
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Gift className="h-5 w-5" />
                      <span className="font-semibold">30 jours gratuits</span>
                    </div>
                    <p className="text-xs mt-1">Sans carte bancaire</p>
                  </div>
                  <div className="text-2xl font-bold text-muted-foreground">puis</div>
                  <div className="bg-accent/10 text-accent px-6 py-3 rounded-lg">
                    <div className="text-4xl font-bold">99€</div>
                    <p className="text-sm mt-1">Paiement unique</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Infinity className="h-5 w-5" />
                  <span>Accès permanent • Pas d'abonnement • Pas de redevance</span>
                </div>
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
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-6"
                  asChild
                >
                  <a href="/">
                    <Zap className="mr-2 h-6 w-6" />
                    Commencer gratuitement (30 jours)
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
                    <h4 className="font-semibold text-blue-900">Garantie satisfait ou remboursé 14 jours</h4>
                    <p className="text-sm text-blue-800 mt-1">
                      Si vous n'êtes pas satisfait après votre paiement, nous vous remboursons intégralement sous 14 jours.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900">Mises à jour gratuites à vie</h4>
                    <p className="text-sm text-blue-800 mt-1">
                      Toutes les nouvelles fonctionnalités, outils, et améliorations sont inclus sans frais supplémentaires.
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
                  Après 30 jours, vous recevrez une notification pour effectuer le paiement unique de 99€ si vous souhaitez continuer.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Que se passe-t-il après le paiement unique ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Vous obtenez un accès permanent et illimité à la plateforme. Aucun abonnement mensuel, aucune redevance. 
                  Vous payez une seule fois et gardez l'accès pour toujours, avec toutes les mises à jour futures incluses.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Puis-je annuler pendant l'essai gratuit ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Oui, absolument ! L'essai gratuit est sans engagement. Si vous décidez de ne pas continuer, 
                  vous n'avez rien à faire et aucun paiement ne sera demandé.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Y a-t-il des frais cachés ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Non, aucun frais caché. Le prix affiché (99€) est le seul et unique paiement que vous effectuerez. 
                  Toutes les fonctionnalités actuelles et futures sont incluses sans coût supplémentaire.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Puis-je obtenir un remboursement ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Oui ! Nous offrons une garantie satisfait ou remboursé de 14 jours après votre paiement. 
                  Si vous n'êtes pas satisfait, contactez-nous et nous vous rembourserons intégralement.
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
        </div>
      </div>
    </div>
  );
}
