import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, TrendingUp, CheckCircle, XCircle, Sparkles, Star } from 'lucide-react';

interface Example {
  id: string;
  title: string;
  framework: string;
  category: string;
  type: string;
  before: {
    content: string;
    conversionRate: string;
    issues: string[];
  };
  after: {
    content: string;
    conversionRate: string;
    improvements: string[];
  };
  results: {
    conversionIncrease: string;
    revenueIncrease: string;
    timeToOptimize: string;
  };
}

const EXAMPLES: Example[] = [
  {
    id: 'pfpma-landing-1',
    title: 'Landing Page SaaS Automation',
    framework: 'PFPMA',
    category: 'sionohmair',
    type: 'Landing Page',
    before: {
      content: `# Automatisez Votre Marketing

Notre outil d'automatisation marketing vous aide à gagner du temps.

Fonctionnalités :
- Emails automatiques
- Séquences personnalisées
- Rapports analytics

Prix : 99€/mois

[S'inscrire maintenant]`,
      conversionRate: '1.2%',
      issues: [
        'Pas de problème clairement identifié',
        'Pas de preuve sociale ou chiffres',
        'CTA générique sans urgence',
        'Bénéfices vagues ("gagner du temps")',
        'Pas de méthode expliquée'
      ]
    },
    after: {
      content: `# Vous Perdez 15h/Semaine Sur Des Tâches Marketing Répétitives

## Le Problème Que Vous Vivez

Chaque lundi, vous passez 3h à préparer vos emails. Chaque mercredi, 4h à segmenter vos listes. Chaque vendredi, 8h à analyser vos résultats.

**Résultat** : 60h/mois de travail manuel qui ne génère aucun revenu supplémentaire.

## La Formule Sprint Automation

Découvrez **Sprint Automation** : la méthode qui élimine 95% de votre travail manuel en 3 étapes simples.

## La Preuve Que Ça Fonctionne

+340% de conversion en moyenne pour nos 847 clients.  
Sarah (e-commerce) : "J'ai récupéré 12h/semaine et doublé mon CA."

## La Méthode en 3 Étapes

1. **Diagnostic** : Identifiez vos tâches répétitives (5 min)
2. **Automatisation** : Activez nos templates pré-configurés (10 min)
3. **Amplification** : L'IA optimise en continu vos campagnes

## Passez à l'Action Maintenant

**Offre de lancement** : 49€/mois au lieu de 99€  
⏰ Plus que 12 places à ce tarif

[Démarrer Mon Sprint Automation →]

🔒 Garantie 30 jours satisfait ou remboursé`,
      conversionRate: '8.9%',
      improvements: [
        'Problème quantifié précisément (15h/semaine)',
        'Formule nommée et mémorable',
        'Preuve chiffrée (+340%) + témoignage',
        'Méthode en 3 étapes claires',
        'CTA avec urgence et réduction de friction'
      ]
    },
    results: {
      conversionIncrease: '+641%',
      revenueIncrease: '+127 000€/mois',
      timeToOptimize: '2 heures'
    }
  },
  {
    id: 'aptea-article-1',
    title: 'Article de Blog Formation',
    framework: 'APTEA',
    category: 'sionohmair',
    type: 'Article',
    before: {
      content: `# Comment Terminer Vos Formations En Ligne

Beaucoup de gens achètent des formations mais ne les terminent pas.

Voici quelques conseils :
- Bloquez du temps dans votre agenda
- Prenez des notes
- Appliquez ce que vous apprenez

Conclusion : Soyez discipliné et vous réussirez.`,
      conversionRate: '0.8%',
      issues: [
        'Pas de hook accrocheur',
        'Problème mentionné mais pas développé',
        'Conseils génériques sans méthode',
        'Pas de transformation montrée',
        'Pas de preuve ou exemple concret'
      ]
    },
    after: {
      content: `# 90% Des Formations En Ligne Ne Sont Jamais Terminées. Voici Pourquoi.

## Le Problème Invisible

Vous avez acheté 7 formations cette année. Vous en avez terminé... zéro.

Ce n'est pas un problème de motivation. C'est un problème de **friction cognitive**.

Chaque formation vous demande :
- 40h de visionnage
- 120 pages de notes
- 0 structure d'application

Résultat : vous abandonnez au module 3.

## La Transformation Possible

Imaginez terminer chaque formation en 7 jours et appliquer immédiatement les résultats.

Pas de procrastination. Pas de culpabilité. Juste des résultats mesurables.

## La Preuve Que C'est Possible

Sarah a terminé 12 formations en 3 mois avec la méthode Sprint Learning.  
Son CA a augmenté de 180% grâce aux compétences acquises.

## La Méthode Sprint Learning

1. **Extraction** : Identifiez les 20% qui génèrent 80% des résultats
2. **Application** : Créez un projet concret dès le jour 1
3. **Itération** : Testez, mesurez, ajustez en temps réel

## Passez à l'Action

Téléchargez notre guide gratuit "Sprint Learning : Terminer N'importe Quelle Formation En 7 Jours"

[Télécharger Le Guide →]`,
      conversionRate: '6.4%',
      improvements: [
        'Hook statistique puissant (90%)',
        'Problème développé avec empathie',
        'Transformation concrète et désirable',
        'Preuve avec témoignage chiffré',
        'Méthode claire en 3 étapes'
      ]
    },
    results: {
      conversionIncrease: '+700%',
      revenueIncrease: '+45 000€/mois',
      timeToOptimize: '3 heures'
    }
  },
  {
    id: 'pas-email-1',
    title: 'Email de Prospection B2B',
    framework: 'PAS',
    category: 'classique',
    type: 'Email',
    before: {
      content: `Objet : Découvrez notre solution

Bonjour,

Je vous contacte pour vous présenter notre solution d'automatisation.

Nous aidons les entreprises à optimiser leurs processus.

Seriez-vous disponible pour un appel ?

Cordialement,
Jean`,
      conversionRate: '0.3%',
      issues: [
        'Objet générique',
        'Pas de problème identifié',
        'Proposition vague',
        'Pas d\'agitation',
        'CTA faible'
      ]
    },
    after: {
      content: `Objet : [PRÉNOM], vous perdez 240 000€/an

Bonjour [PRÉNOM],

J'ai remarqué que [ENTREPRISE] utilise encore des processus manuels pour [TÂCHE].

Savez-vous combien cela vous coûte ?

**20h/semaine × 50€/h × 52 semaines = 52 000€/an**

Et ce n'est que pour 1 employé. Multipliez par votre équipe de 5 personnes : **260 000€/an** de coût caché.

Pendant ce temps, vos concurrents automatisent et vous dépassent.

Heureusement, nous avons créé **AutoFlow** : une solution qui élimine 95% de ce travail manuel en 48h.

Résultat pour nos clients : -85% de coûts opérationnels en moyenne.

Seriez-vous disponible mardi 15h pour un audit gratuit de 15 min ?

Cordialement,
Jean

PS : L'audit identifiera exactement combien vous perdez chaque mois.`,
      conversionRate: '4.2%',
      improvements: [
        'Objet chiffré et percutant',
        'Problème quantifié précisément',
        'Agitation avec coût annuel',
        'Solution nommée et prouvée',
        'CTA avec valeur (audit gratuit)'
      ]
    },
    results: {
      conversionIncrease: '+1300%',
      revenueIncrease: '+89 000€/mois',
      timeToOptimize: '1 heure'
    }
  }
];

import { toggleExampleFavorite, getFavorites } from '@/lib/favorites';
import { toast } from 'sonner';

export default function Exemples() {
  const [selectedExample, setSelectedExample] = useState<Example | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Charger les favoris au montage
  useState(() => {
    if (typeof window !== 'undefined') {
      const { examples } = getFavorites();
      setFavorites(examples);
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
            Galerie AVANT / APRÈS
          </div>
          <h1 className="text-5xl font-bold mb-4">
            Exemples <span className="text-accent">Réels</span> d'Optimisation
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez comment les frameworks PFPMA, APTEA et PAS transforment des scripts médiocres en machines à conversion.
          </p>
        </div>

        {/* Tabs par catégorie */}
        <Tabs defaultValue="sionohmair" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="sionohmair">Sionohmair</TabsTrigger>
            <TabsTrigger value="classique">Classiques</TabsTrigger>
          </TabsList>

          <TabsContent value="sionohmair" className="space-y-8">
            {EXAMPLES.filter(e => e.category === 'sionohmair').map((example) => (
              <Card key={example.id} className="border-accent/20">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-accent/10 text-accent">{example.framework}</Badge>
                      <Badge variant="outline">{example.type}</Badge>
                    </div>
                    <Button
                      onClick={() => {
                        const isFavorite = toggleExampleFavorite(example.id);
                        setFavorites(prev => 
                          isFavorite 
                            ? [...prev, example.id] 
                            : prev.filter(id => id !== example.id)
                        );
                        toast.success(isFavorite ? 'Ajouté aux favoris' : 'Retiré des favoris');
                      }}
                      variant={favorites.includes(example.id) ? 'default' : 'outline'}
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Star className={`h-4 w-4 ${favorites.includes(example.id) ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                  <CardTitle className="text-3xl">{example.title}</CardTitle>
                  <CardDescription>
                    Conversion : {example.before.conversionRate} → {example.after.conversionRate} ({example.results.conversionIncrease})
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Résultats */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="bg-green-50 border-green-200">
                      <CardHeader className="pb-2">
                        <CardDescription className="text-xs">Conversion</CardDescription>
                        <CardTitle className="text-2xl text-green-700">{example.results.conversionIncrease}</CardTitle>
                      </CardHeader>
                    </Card>
                    <Card className="bg-blue-50 border-blue-200">
                      <CardHeader className="pb-2">
                        <CardDescription className="text-xs">Revenu</CardDescription>
                        <CardTitle className="text-2xl text-blue-700">{example.results.revenueIncrease}</CardTitle>
                      </CardHeader>
                    </Card>
                    <Card className="bg-purple-50 border-purple-200">
                      <CardHeader className="pb-2">
                        <CardDescription className="text-xs">Temps d'optimisation</CardDescription>
                        <CardTitle className="text-2xl text-purple-700">{example.results.timeToOptimize}</CardTitle>
                      </CardHeader>
                    </Card>
                  </div>

                  {/* AVANT / APRÈS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* AVANT */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">AVANT</Badge>
                        <span className="text-sm text-muted-foreground">{example.before.conversionRate}</span>
                      </div>
                      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                        <pre className="text-xs whitespace-pre-wrap font-mono text-red-900">
                          {example.before.content}
                        </pre>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-red-700">❌ Problèmes :</p>
                        {example.before.issues.map((issue, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-muted-foreground">{issue}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* APRÈS */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-600">APRÈS</Badge>
                        <span className="text-sm text-muted-foreground">{example.after.conversionRate}</span>
                        <ArrowRight className="h-4 w-4 text-accent" />
                        <span className="text-sm font-semibold text-accent">{example.results.conversionIncrease}</span>
                      </div>
                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <pre className="text-xs whitespace-pre-wrap font-mono text-green-900">
                          {example.after.content}
                        </pre>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-green-700">✅ Améliorations :</p>
                        {example.after.improvements.map((improvement, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-muted-foreground">{improvement}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="classique" className="space-y-8">
            {EXAMPLES.filter(e => e.category === 'classique').map((example) => (
              <Card key={example.id}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{example.framework}</Badge>
                    <Badge variant="secondary">{example.type}</Badge>
                  </div>
                  <CardTitle className="text-3xl">{example.title}</CardTitle>
                  <CardDescription>
                    Conversion : {example.before.conversionRate} → {example.after.conversionRate} ({example.results.conversionIncrease})
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Résultats */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="bg-green-50 border-green-200">
                      <CardHeader className="pb-2">
                        <CardDescription className="text-xs">Conversion</CardDescription>
                        <CardTitle className="text-2xl text-green-700">{example.results.conversionIncrease}</CardTitle>
                      </CardHeader>
                    </Card>
                    <Card className="bg-blue-50 border-blue-200">
                      <CardHeader className="pb-2">
                        <CardDescription className="text-xs">Revenu</CardDescription>
                        <CardTitle className="text-2xl text-blue-700">{example.results.revenueIncrease}</CardTitle>
                      </CardHeader>
                    </Card>
                    <Card className="bg-purple-50 border-purple-200">
                      <CardHeader className="pb-2">
                        <CardDescription className="text-xs">Temps d'optimisation</CardDescription>
                        <CardTitle className="text-2xl text-purple-700">{example.results.timeToOptimize}</CardTitle>
                      </CardHeader>
                    </Card>
                  </div>

                  {/* AVANT / APRÈS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* AVANT */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">AVANT</Badge>
                        <span className="text-sm text-muted-foreground">{example.before.conversionRate}</span>
                      </div>
                      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                        <pre className="text-xs whitespace-pre-wrap font-mono text-red-900">
                          {example.before.content}
                        </pre>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-red-700">❌ Problèmes :</p>
                        {example.before.issues.map((issue, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-muted-foreground">{issue}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* APRÈS */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-600">APRÈS</Badge>
                        <span className="text-sm text-muted-foreground">{example.after.conversionRate}</span>
                        <ArrowRight className="h-4 w-4 text-accent" />
                        <span className="text-sm font-semibold text-accent">{example.results.conversionIncrease}</span>
                      </div>
                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <pre className="text-xs whitespace-pre-wrap font-mono text-green-900">
                          {example.after.content}
                        </pre>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-green-700">✅ Améliorations :</p>
                        {example.after.improvements.map((improvement, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-muted-foreground">{improvement}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <Card className="bg-accent/5 border-accent/20 text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Obtenez Les Mêmes Résultats</CardTitle>
            <CardDescription>
              Utilisez nos outils pour optimiser vos scripts et multiplier vos conversions
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4 justify-center">
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <a href="/script-analyzer">
                <TrendingUp className="mr-2 h-5 w-5" />
                Analyser Mon Script
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="/copy-generator">
                <Sparkles className="mr-2 h-5 w-5" />
                Générer du Copy Optimisé
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
