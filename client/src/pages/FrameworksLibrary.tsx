import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ToolHeader } from '@/components/ToolHeader';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, BookOpen, TrendingUp, Zap, Target, Users, Heart, MessageSquare } from 'lucide-react';

const FRAMEWORKS = [
  {
    id: 'pfpma',
    name: 'PFPMA',
    category: 'sionohmair',
    acronym: 'Problème - Formule - Preuve - Méthode - Appel',
    icon: Sparkles,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    description: 'Framework propriétaire Sionohmair Insight Academy basé sur le théorème spiralo-exponentiel. Élimine les 3 frictions (Attention, Cognitive, Émotionnelle) pour atteindre +340% de conversion grâce au Facteur Alpha (α = 22.67).',
    theory: 'Le PFPMA repose sur le Théorème de la Genèse de l\'Insight : **Hi = An × Pn × Tn × En** où chaque friction éliminée multiplie l\'impact du message. La progression spirale garantit une amplification exponentielle de la clarté.',
    steps: [
      {
        letter: 'P',
        name: 'Problème',
        description: 'Identifiez la douleur n°1 de votre audience. Créez une résonance émotionnelle immédiate.',
        example: '"Votre landing page génère 1000 visites mais seulement 10 conversions."',
        friction: 'Friction Émotionnelle',
        goal: 'Créer une connexion instantanée avec le lecteur'
      },
      {
        letter: 'F',
        name: 'Formule',
        description: 'Nommez votre solution de manière mémorable et unique. Créez un désir irrésistible.',
        example: '"Le Sprint de Clarté : 3 frictions éliminées en 7 jours."',
        friction: 'Friction Cognitive',
        goal: 'Simplifier la compréhension de la solution'
      },
      {
        letter: 'P',
        name: 'Preuve',
        description: 'Apportez une preuve crédible (chiffre, témoignage, autorité). Éliminez le scepticisme.',
        example: '"+340% de conversion grâce au Facteur α = 22.67 (mesure sur 50+ clients)."',
        friction: 'Friction d\'Attention',
        goal: 'Valider la crédibilité de la solution'
      },
      {
        letter: 'M',
        name: 'Méthode',
        description: 'Expliquez le processus en 3 étapes maximum. Rendez le chemin clair et actionnable.',
        example: '"1. Diagnostiquer → 2. Éliminer → 3. Amplifier"',
        friction: 'Friction Cognitive',
        goal: 'Rendre l\'action évidente et accessible'
      },
      {
        letter: 'A',
        name: 'Appel',
        description: 'Proposez une action claire et irrésistible. Créez l\'urgence et la facilité.',
        example: '"Réservez votre Sprint de Clarté maintenant : 990€ au lieu de 2500€ (offre limitée)."',
        friction: 'Friction d\'Attention',
        goal: 'Déclencher l\'action immédiate'
      }
    ],
    bestFor: ['Landing pages', 'Pages de vente', 'Emails de conversion', 'Webinaires'],
    metrics: {
      avgConversion: '+340%',
      alphaFactor: '22.67',
      frictions: '3 éliminées'
    }
  },
  {
    id: 'aptea',
    name: 'APTEA',
    category: 'sionohmair',
    acronym: 'Attention - Problème - Transformation - Évidence - Action',
    icon: TrendingUp,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    description: 'Variante PFPMA optimisée pour contenus longs. Progression spirale ×81 pour articles, formations et webinaires. Maintient l\'attention sur la durée grâce à une structure narrative amplifiée.',
    theory: 'L\'APTEA applique le même théorème spiralo-exponentiel que PFPMA mais avec une progression narrative adaptée aux formats longs. Chaque section amplifie la précédente selon un facteur ×3 (3^4 = 81).',
    steps: [
      {
        letter: 'A',
        name: 'Attention',
        description: 'Captez l\'attention avec un hook puissant. Créez la curiosité immédiate.',
        example: '"90% des formations en ligne ne sont jamais terminées. Voici pourquoi."',
        friction: 'Friction d\'Attention',
        goal: 'Stopper le scroll et créer l\'engagement'
      },
      {
        letter: 'P',
        name: 'Problème',
        description: 'Développez le problème en profondeur. Agitez la douleur avec empathie.',
        example: '"Vous achetez une formation à 2000€, vous la regardez 2 fois, puis elle prend la poussière..."',
        friction: 'Friction Émotionnelle',
        goal: 'Créer une identification forte'
      },
      {
        letter: 'T',
        name: 'Transformation',
        description: 'Montrez la transformation possible. Peignez le futur désirable.',
        example: '"Imaginez terminer chaque formation en 7 jours et appliquer immédiatement les résultats."',
        friction: 'Friction Cognitive',
        goal: 'Créer le désir de changement'
      },
      {
        letter: 'E',
        name: 'Évidence',
        description: 'Apportez les preuves (études de cas, témoignages, data). Validez la transformation.',
        example: '"Sarah a terminé 12 formations en 3 mois et augmenté son chiffre de 180%."',
        friction: 'Friction d\'Attention',
        goal: 'Prouver que c\'est possible'
      },
      {
        letter: 'A',
        name: 'Action',
        description: 'Guidez vers l\'action avec clarté. Éliminez les obstacles.',
        example: '"Commencez aujourd\'hui avec notre méthode Sprint Learning (garantie 30 jours)."',
        friction: 'Friction Cognitive',
        goal: 'Faciliter le passage à l\'action'
      }
    ],
    bestFor: ['Articles de blog', 'Webinaires', 'Formations', 'Livres blancs'],
    metrics: {
      avgConversion: '+180%',
      alphaFactor: '×81',
      frictions: '3 éliminées'
    }
  },
  {
    id: 'aida',
    name: 'AIDA',
    category: 'classique',
    acronym: 'Attention - Intérêt - Désir - Action',
    icon: Zap,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    description: 'Framework classique créé en 1898 par Elias St. Elmo Lewis. Simple, efficace, universel. Idéal pour contenus courts et publicités.',
    theory: 'AIDA suit le parcours psychologique naturel de la décision d\'achat : capter l\'attention, susciter l\'intérêt, créer le désir, déclencher l\'action. Chaque étape prépare la suivante.',
    steps: [
      {
        letter: 'A',
        name: 'Attention',
        description: 'Captez l\'attention avec un élément visuel ou verbal fort.',
        example: '"NOUVEAU : Doublez votre productivité en 30 jours"',
        friction: 'Friction d\'Attention',
        goal: 'Arrêter le lecteur'
      },
      {
        letter: 'I',
        name: 'Intérêt',
        description: 'Suscitez l\'intérêt en montrant la pertinence pour le lecteur.',
        example: '"Découvrez comment 10 000+ entrepreneurs gagnent 2h par jour"',
        friction: 'Friction Cognitive',
        goal: 'Créer la curiosité'
      },
      {
        letter: 'D',
        name: 'Désir',
        description: 'Créez le désir en montrant les bénéfices et la transformation.',
        example: '"Imaginez terminer votre journée à 16h au lieu de 20h, sans stress"',
        friction: 'Friction Émotionnelle',
        goal: 'Créer l\'envie'
      },
      {
        letter: 'A',
        name: 'Action',
        description: 'Déclenchez l\'action avec un CTA clair et simple.',
        example: '"Essayez gratuitement pendant 14 jours (sans carte bancaire)"',
        friction: 'Friction Cognitive',
        goal: 'Faciliter l\'action'
      }
    ],
    bestFor: ['Emails', 'Publicités', 'Posts sociaux', 'Pages de capture'],
    metrics: {
      avgConversion: '+120%',
      complexity: 'Simple',
      length: 'Court'
    }
  },
  {
    id: 'pas',
    name: 'PAS',
    category: 'classique',
    acronym: 'Problème - Agitation - Solution',
    icon: Target,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    description: 'Framework orienté problème. Agite la douleur avant de proposer la solution. Très efficace pour audiences conscientes du problème.',
    theory: 'PAS exploite le biais de négativité : nous sommes plus motivés à éviter la douleur qu\'à rechercher le plaisir. L\'agitation amplifie l\'urgence de résoudre le problème.',
    steps: [
      {
        letter: 'P',
        name: 'Problème',
        description: 'Identifiez le problème principal de votre audience.',
        example: '"Vos emails de prospection ont un taux d\'ouverture de 5%"',
        friction: 'Friction Émotionnelle',
        goal: 'Créer la reconnaissance du problème'
      },
      {
        letter: 'A',
        name: 'Agitation',
        description: 'Agitez le problème en montrant les conséquences négatives.',
        example: '"Chaque jour, vous perdez 10 opportunités de vente. En 1 an, c\'est 240 000€ de CA perdu."',
        friction: 'Friction Émotionnelle',
        goal: 'Amplifier l\'urgence'
      },
      {
        letter: 'S',
        name: 'Solution',
        description: 'Présentez votre solution comme le remède évident.',
        example: '"Notre template d\'email atteint 47% d\'ouverture et 12% de réponse"',
        friction: 'Friction Cognitive',
        goal: 'Positionner la solution comme évidente'
      }
    ],
    bestFor: ['Emails de vente', 'Pages de capture', 'Cold emails', 'Publicités'],
    metrics: {
      avgConversion: '+150%',
      complexity: 'Simple',
      length: 'Court'
    }
  },
  {
    id: 'pastor',
    name: 'PASTOR',
    category: 'classique',
    acronym: 'Problème - Amplifier - Solution - Transformation - Offre - Réponse',
    icon: BookOpen,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    description: 'Framework complet créé par Ray Edwards. Idéal pour pages de vente longues et webinaires. Couvre tous les aspects de la persuasion.',
    theory: 'PASTOR combine PAS (Problème-Agitation-Solution) avec des éléments de transformation et de réponse aux objections. Structure complète pour conversions complexes.',
    steps: [
      {
        letter: 'P',
        name: 'Problème',
        description: 'Identifiez le problème principal.',
        example: '"Vous travaillez 60h/semaine mais votre CA stagne"',
        friction: 'Friction Émotionnelle',
        goal: 'Créer l\'identification'
      },
      {
        letter: 'A',
        name: 'Amplifier',
        description: 'Amplifiez le problème et ses conséquences.',
        example: '"Pendant ce temps, vos concurrents automatisent et vous dépassent"',
        friction: 'Friction Émotionnelle',
        goal: 'Créer l\'urgence'
      },
      {
        letter: 'S',
        name: 'Solution',
        description: 'Présentez votre solution unique.',
        example: '"Notre système d\'automatisation IA réduit votre temps de travail de 50%"',
        friction: 'Friction Cognitive',
        goal: 'Positionner la solution'
      },
      {
        letter: 'T',
        name: 'Transformation',
        description: 'Montrez la transformation possible.',
        example: '"Imaginez travailler 30h/semaine et doubler votre CA"',
        friction: 'Friction Cognitive',
        goal: 'Créer le désir'
      },
      {
        letter: 'O',
        name: 'Offre',
        description: 'Présentez votre offre avec valeur et urgence.',
        example: '"Accès à vie + 50 templates : 497€ au lieu de 1997€ (48h seulement)"',
        friction: 'Friction d\'Attention',
        goal: 'Créer l\'irrésistibilité'
      },
      {
        letter: 'R',
        name: 'Réponse',
        description: 'Répondez aux objections et facilitez l\'action.',
        example: '"Garantie 60 jours satisfait ou remboursé + support prioritaire"',
        friction: 'Friction Cognitive',
        goal: 'Éliminer les freins'
      }
    ],
    bestFor: ['Pages de vente longues', 'Webinaires', 'VSL', 'Lancements'],
    metrics: {
      avgConversion: '+200%',
      complexity: 'Complexe',
      length: 'Long'
    }
  },
  {
    id: 'bab',
    name: 'BAB',
    category: 'classique',
    acronym: 'Before - After - Bridge',
    icon: Users,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    description: 'Framework simple et puissant pour montrer la transformation. Idéal pour témoignages et études de cas.',
    theory: 'BAB exploite le pouvoir de la narration : montrer le contraste avant/après crée un désir puissant de transformation. Le bridge rend la transformation accessible.',
    steps: [
      {
        letter: 'B',
        name: 'Before',
        description: 'Décrivez la situation avant (problème, douleur).',
        example: '"Il y a 6 mois, je travaillais 70h/semaine pour 3000€/mois"',
        friction: 'Friction Émotionnelle',
        goal: 'Créer l\'identification'
      },
      {
        letter: 'A',
        name: 'After',
        description: 'Montrez la situation après (résultat, transformation).',
        example: '"Aujourd\'hui, je travaille 25h/semaine pour 12 000€/mois"',
        friction: 'Friction Cognitive',
        goal: 'Créer le désir'
      },
      {
        letter: 'B',
        name: 'Bridge',
        description: 'Expliquez comment passer de Before à After.',
        example: '"Grâce à la méthode d\'automatisation IA que je vais vous montrer"',
        friction: 'Friction Cognitive',
        goal: 'Rendre la transformation accessible'
      }
    ],
    bestFor: ['Témoignages', 'Études de cas', 'Posts sociaux', 'Emails'],
    metrics: {
      avgConversion: '+140%',
      complexity: 'Simple',
      length: 'Court'
    }
  }
];

export default function FrameworksLibrary() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <ToolHeader />
      <div className="py-12">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
            Bibliothèque de Frameworks
          </div>
          <h1 className="text-5xl font-bold mb-4">
            Les <span className="text-accent">8 Frameworks</span> de Copywriting Essentiels
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Maîtrisez les structures qui multiplient vos conversions. De PFPMA (Sionohmair) aux classiques AIDA, PAS, PASTOR.
          </p>
        </div>

        {/* Tabs par catégorie */}
        <Tabs defaultValue="sionohmair" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="sionohmair">Sionohmair</TabsTrigger>
            <TabsTrigger value="classique">Classiques</TabsTrigger>
          </TabsList>

          <TabsContent value="sionohmair" className="space-y-6">
            {FRAMEWORKS.filter(f => f.category === 'sionohmair').map((framework) => {
              const Icon = framework.icon;
              return (
                <Card key={framework.id} className="border-2 border-accent/20">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-2">
                      <div className={`p-3 rounded-lg ${framework.bgColor}`}>
                        <Icon className={`h-8 w-8 ${framework.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-3xl">{framework.name}</CardTitle>
                        <CardDescription className="text-base">{framework.acronym}</CardDescription>
                      </div>
                      <Badge className="ml-auto bg-accent text-accent-foreground">
                        Sionohmair Propriétaire
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mt-4">{framework.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Théorie */}
                    <div className="bg-accent/5 p-4 rounded-lg border border-accent/20">
                      <h3 className="font-semibold text-accent mb-2">📐 Théorie</h3>
                      <p className="text-sm text-muted-foreground">{framework.theory}</p>
                    </div>

                    {/* Étapes */}
                    <div>
                      <h3 className="font-semibold mb-4">Structure en {framework.steps.length} étapes</h3>
                      <div className="space-y-4">
                        {framework.steps.map((step, i) => (
                          <div key={i} className="border-l-4 border-accent pl-4">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="font-bold">
                                {step.letter}
                              </Badge>
                              <h4 className="font-semibold">{step.name}</h4>
                              <Badge variant="secondary" className="ml-auto text-xs">
                                {step.friction}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                            <p className="text-sm italic text-accent">
                              Exemple : {step.example}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              🎯 {step.goal}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Métriques */}
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(framework.metrics).map(([key, value]) => (
                        <Card key={key}>
                          <CardHeader className="pb-2">
                            <CardDescription className="text-xs uppercase">
                              {key === 'avgConversion' && 'Conversion Moyenne'}
                              {key === 'alphaFactor' && 'Facteur Alpha'}
                              {key === 'frictions' && 'Frictions'}
                            </CardDescription>
                            <CardTitle className="text-2xl text-accent">{value}</CardTitle>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>

                    {/* Meilleur pour */}
                    <div>
                      <h3 className="font-semibold mb-2">✅ Meilleur pour</h3>
                      <div className="flex flex-wrap gap-2">
                        {framework.bestFor.map((use, i) => (
                          <Badge key={i} variant="secondary">
                            {use}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="classique" className="space-y-6">
            {FRAMEWORKS.filter(f => f.category === 'classique').map((framework) => {
              const Icon = framework.icon;
              return (
                <Card key={framework.id}>
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-2">
                      <div className={`p-3 rounded-lg ${framework.bgColor}`}>
                        <Icon className={`h-8 w-8 ${framework.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-3xl">{framework.name}</CardTitle>
                        <CardDescription className="text-base">{framework.acronym}</CardDescription>
                      </div>
                      <Badge className="ml-auto" variant="outline">
                        Classique
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mt-4">{framework.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Théorie */}
                    <div className="bg-secondary/20 p-4 rounded-lg border">
                      <h3 className="font-semibold mb-2">📐 Théorie</h3>
                      <p className="text-sm text-muted-foreground">{framework.theory}</p>
                    </div>

                    {/* Étapes */}
                    <div>
                      <h3 className="font-semibold mb-4">Structure en {framework.steps.length} étapes</h3>
                      <div className="space-y-4">
                        {framework.steps.map((step, i) => (
                          <div key={i} className="border-l-4 border-muted pl-4">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="font-bold">
                                {step.letter}
                              </Badge>
                              <h4 className="font-semibold">{step.name}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                            <p className="text-sm italic">
                              Exemple : {step.example}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Métriques */}
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(framework.metrics).map(([key, value]) => (
                        <Card key={key}>
                          <CardHeader className="pb-2">
                            <CardDescription className="text-xs uppercase">
                              {key === 'avgConversion' && 'Conversion Moyenne'}
                              {key === 'complexity' && 'Complexité'}
                              {key === 'length' && 'Longueur'}
                            </CardDescription>
                            <CardTitle className="text-2xl">{value}</CardTitle>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>

                    {/* Meilleur pour */}
                    <div>
                      <h3 className="font-semibold mb-2">✅ Meilleur pour</h3>
                      <div className="flex flex-wrap gap-2">
                        {framework.bestFor.map((use, i) => (
                          <Badge key={i} variant="secondary">
                            {use}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <Card className="bg-accent/5 border-accent/20 text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Prêt à Appliquer Ces Frameworks ?</CardTitle>
            <CardDescription>
              Utilisez nos outils pour analyser vos scripts, générer du copy optimisé, et identifier les frameworks utilisés
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4 justify-center">
            <a href="/script-analyzer" className="inline-flex items-center justify-center rounded-md bg-accent text-accent-foreground px-6 py-3 font-medium hover:bg-accent/90 transition-colors">
              Analyser un Script
            </a>
            <a href="/copy-generator" className="inline-flex items-center justify-center rounded-md border border-accent text-accent px-6 py-3 font-medium hover:bg-accent/10 transition-colors">
              Générer du Copy
            </a>
            <a href="/content-analyzer" className="inline-flex items-center justify-center rounded-md border px-6 py-3 font-medium hover:bg-secondary transition-colors">
              Analyser du Contenu
            </a>
          </CardContent>
        </Card>
      </div>

      </div>
    </div>
  );
}
