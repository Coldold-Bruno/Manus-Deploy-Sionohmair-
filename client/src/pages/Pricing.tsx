import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Sparkles, Shield, Zap, Crown, Infinity } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  icon: any;
  price: string;
  nftPrice?: string;
  redevance: string;
  description: string;
  features: string[];
  limitations?: string[];
  popular?: boolean;
  cta: string;
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Gratuit',
    icon: Sparkles,
    price: '0€',
    redevance: '0€/mois',
    description: 'Découvrez la plateforme avec les fonctionnalités de base',
    features: [
      '5 analyses de contenu par mois',
      '3 copies générées par mois',
      '2 avatars clients',
      'Accès à la Bibliothèque de Frameworks',
      'Accès aux Templates (lecture seule)',
      'Chat IA (10 messages/jour)',
      'Guide d\'utilisation complet'
    ],
    limitations: [
      'Pas d\'export PDF',
      'Pas d\'accès à l\'Éditeur en temps réel',
      'Pas d\'accès aux Exemples AVANT/APRÈS'
    ],
    cta: 'Commencer Gratuitement'
  },
  {
    id: 'starter',
    name: 'Starter',
    icon: Zap,
    price: '29€',
    nftPrice: '99€',
    redevance: '29€/mois',
    description: 'Pour les entrepreneurs et freelances qui démarrent',
    features: [
      '50 analyses de contenu par mois',
      '30 copies générées par mois',
      '10 avatars clients',
      'Export PDF illimité',
      'Accès complet aux Templates',
      'Chat IA illimité',
      'Éditeur en temps réel',
      'Accès aux Exemples AVANT/APRÈS',
      'Support email prioritaire'
    ],
    cta: 'Acheter NFT Starter'
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: Crown,
    price: '79€',
    nftPrice: '299€',
    redevance: '79€/mois',
    description: 'Pour les professionnels du marketing et copywriters',
    features: [
      'Analyses de contenu illimitées',
      'Copies générées illimitées',
      'Avatars clients illimités',
      'Export PDF avancé (branding personnalisé)',
      'Templates exclusifs Pro',
      'Chat IA avec modèle avancé',
      'Éditeur en temps réel avec suggestions premium',
      'Analyseur de Scripts illimité',
      'Accès anticipé aux nouvelles fonctionnalités',
      'Support prioritaire (réponse <24h)',
      'Formation mensuelle en live'
    ],
    popular: true,
    cta: 'Acheter NFT Pro'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: Infinity,
    price: '199€',
    nftPrice: '999€',
    redevance: '199€/mois',
    description: 'Pour les agences et équipes marketing',
    features: [
      'Tout du plan Pro',
      '5 sièges inclus (utilisateurs supplémentaires +29€/mois)',
      'API access pour intégrations',
      'Whitelabel (branding personnalisé)',
      'Bibliothèque de templates personnalisée',
      'Dashboard équipe avec analytics',
      'Collaboration en temps réel',
      'Support dédié (réponse <4h)',
      'Formation équipe sur-mesure',
      'Consultation stratégique mensuelle (1h)',
      'Accès aux bêtas privées'
    ],
    cta: 'Acheter NFT Enterprise'
  }
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
            Modèle NFT + Redevance
          </div>
          <h1 className="text-5xl font-bold mb-4">
            Accédez à la <span className="text-accent">Plateforme Sionohmair</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Achetez votre NFT de licence d'utilisation et payez une redevance mensuelle pour maintenir l'accès.
          </p>

          {/* Explication du modèle */}
          <Card className="max-w-3xl mx-auto mb-12 border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 justify-center">
                <Shield className="h-6 w-6 text-accent" />
                Comment fonctionne le modèle NFT + Redevance ?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Achetez votre NFT de licence</h3>
                  <p className="text-sm text-muted-foreground">
                    Paiement unique pour acquérir le NFT qui sert de clé d'accès à la plateforme. Le NFT est stocké sur la blockchain et vous appartient.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Payez la redevance mensuelle</h3>
                  <p className="text-sm text-muted-foreground">
                    Souscrivez à la redevance récurrente (29€, 79€, ou 199€/mois selon votre plan) pour maintenir l'accès actif à la plateforme.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Accédez à toutes les fonctionnalités</h3>
                  <p className="text-sm text-muted-foreground">
                    Tant que votre redevance est active, vous avez accès complet aux fonctionnalités de votre plan. Vous pouvez annuler à tout moment.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Revendez ou transférez votre NFT</h3>
                  <p className="text-sm text-muted-foreground">
                    Votre NFT est un actif numérique. Vous pouvez le revendre sur les marketplaces NFT ou le transférer à un autre utilisateur. Le nouveau propriétaire devra souscrire à la redevance pour activer l'accès.
                  </p>
                </div>
              </div>

              <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mt-6">
                <p className="text-sm">
                  <strong>💡 Avantage :</strong> Le NFT est un investissement. Sa valeur peut augmenter si la plateforme gagne en popularité. Vous pouvez le revendre plus cher que le prix d'achat initial.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card
                key={plan.id}
                className={`relative ${
                  plan.popular
                    ? 'border-accent shadow-lg scale-105'
                    : 'border-border'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-accent text-accent-foreground">
                      Le Plus Populaire
                    </Badge>
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-6 w-6 text-accent" />
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>

                  <div className="mt-4">
                    {plan.nftPrice && (
                      <div className="text-sm text-muted-foreground mb-2">
                        NFT : <span className="font-semibold text-foreground">{plan.nftPrice}</span> (paiement unique)
                      </div>
                    )}
                    <div className="text-4xl font-bold">
                      {plan.price}
                      <span className="text-lg text-muted-foreground font-normal">/mois</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Redevance : {plan.redevance}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Fonctionnalités */}
                  <div className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Limitations */}
                  {plan.limitations && plan.limitations.length > 0 && (
                    <div className="space-y-2 pt-4 border-t">
                      <p className="text-xs text-muted-foreground font-semibold">Limitations :</p>
                      {plan.limitations.map((limitation, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-sm text-muted-foreground">• {limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CTA */}
                  <Button
                    className={`w-full mt-6 ${
                      plan.popular
                        ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                        : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Questions Fréquentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Pourquoi un NFT + Redevance plutôt qu'un simple abonnement ?</h3>
              <p className="text-sm text-muted-foreground">
                Le NFT est un actif numérique qui vous appartient. Vous pouvez le revendre, le transférer, ou le conserver comme investissement. Sa valeur peut augmenter si la plateforme gagne en popularité. C'est un modèle plus équitable qu'un abonnement classique où vous ne possédez rien.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Que se passe-t-il si j'arrête de payer la redevance ?</h3>
              <p className="text-sm text-muted-foreground">
                Votre accès à la plateforme est suspendu, mais vous conservez votre NFT. Vous pouvez réactiver l'accès à tout moment en reprenant le paiement de la redevance. Vos données (avatars, analyses, copies) sont conservées pendant 6 mois.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Puis-je changer de plan ?</h3>
              <p className="text-sm text-muted-foreground">
                Oui. Pour upgrader, achetez le NFT du plan supérieur et annulez l'ancien. Pour downgrader, vendez votre NFT actuel et achetez celui du plan inférieur. La différence de redevance s'applique immédiatement.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Comment acheter un NFT ?</h3>
              <p className="text-sm text-muted-foreground">
                Cliquez sur "Acheter NFT" et suivez les instructions. Vous aurez besoin d'un wallet crypto (MetaMask, Coinbase Wallet, etc.) et de la cryptomonnaie correspondante (ETH, USDC, etc.). Le NFT sera transféré dans votre wallet après paiement.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Puis-je essayer avant d'acheter ?</h3>
              <p className="text-sm text-muted-foreground">
                Oui ! Le plan Gratuit vous permet de tester la plateforme sans engagement. Vous pouvez upgrader à tout moment vers un plan payant.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA Final */}
        <div className="text-center mt-12">
          <h2 className="text-3xl font-bold mb-4">Prêt à multiplier vos conversions ?</h2>
          <p className="text-muted-foreground mb-6">
            Rejoignez les entrepreneurs et marketeurs qui utilisent la méthodologie Sionohmair
          </p>
          <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <a href="/content-analyzer">
              Commencer Gratuitement
              <Sparkles className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
