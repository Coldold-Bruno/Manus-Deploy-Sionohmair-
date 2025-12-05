import { useState } from 'react';
import { ToolHeader } from '@/components/ToolHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  PlayCircle, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Target,
  Users,
  FileText,
  MessageSquare,
  Layout,
  TrendingUp
} from 'lucide-react';

interface Tutorial {
  id: string;
  tool: string;
  icon: any;
  title: string;
  description: string;
  steps: {
    number: number;
    title: string;
    description: string;
    tip?: string;
  }[];
  examples: string[];
  faq: { question: string; answer: string }[];
}

const TUTORIALS: Tutorial[] = [
  {
    id: 'content-analyzer',
    tool: 'Analyseur de Contenu',
    icon: Target,
    title: 'Comment analyser votre contenu marketing',
    description: 'Obtenez une analyse complète en 5 dimensions pour optimiser vos conversions',
    steps: [
      {
        number: 1,
        title: 'Sélectionnez le type de contenu',
        description: 'Choisissez parmi Landing Page, Email, Publicité, Article de Blog, ou Post Social. Le type influence les critères d\'analyse.',
        tip: 'Pour une landing page, l\'analyse se concentrera sur la conversion et les CTA.'
      },
      {
        number: 2,
        title: 'Collez votre contenu',
        description: 'Copiez-collez le texte complet de votre contenu dans la zone de texte. Plus le contenu est complet, plus l\'analyse sera précise.',
        tip: 'Incluez les titres, sous-titres, et CTA pour une analyse complète.'
      },
      {
        number: 3,
        title: '(Optionnel) Sélectionnez un avatar client',
        description: 'Choisissez un avatar client créé dans le Persona Builder pour personnaliser l\'analyse selon votre audience cible.',
        tip: 'L\'analyse sera adaptée aux pain points et désirs de votre avatar.'
      },
      {
        number: 4,
        title: 'Lancez l\'analyse',
        description: 'Cliquez sur "Analyser Mon Contenu" et attendez 10-15 secondes. L\'IA va analyser 5 dimensions : SEO, Conversion, Engagement, Lisibilité, Psychologie.',
        tip: 'L\'analyse utilise la méthodologie Sionohmair pour détecter les 3 frictions.'
      },
      {
        number: 5,
        title: 'Consultez les résultats et recommandations',
        description: 'Vous obtenez un score global /100, des scores par dimension, et des recommandations actionnables classées par priorité (Critique, Important, Mineur).',
        tip: 'Commencez par les recommandations "Critiques" pour un impact maximal.'
      }
    ],
    examples: [
      'Analyser une landing page de formation pour identifier les frictions cognitives',
      'Optimiser un email de prospection B2B pour augmenter le taux de réponse',
      'Améliorer un article de blog pour le SEO et l\'engagement'
    ],
    faq: [
      {
        question: 'Quelle longueur de contenu minimum ?',
        answer: 'Au moins 100 mots pour une analyse pertinente. Pour les landing pages, visez 300-500 mots minimum.'
      },
      {
        question: 'Puis-je analyser du contenu en anglais ?',
        answer: 'Oui, l\'analyseur fonctionne en français et en anglais. Les recommandations seront dans la langue du contenu.'
      },
      {
        question: 'Comment interpréter le score global ?',
        answer: '80-100 = Excellent, 60-79 = Bon, 40-59 = Moyen, <40 = Nécessite des améliorations majeures.'
      }
    ]
  },
  {
    id: 'copy-generator',
    tool: 'Générateur de Copy',
    icon: Sparkles,
    title: 'Comment générer du copy optimisé',
    description: 'Créez du contenu persuasif avec 6 frameworks de copywriting',
    steps: [
      {
        number: 1,
        title: 'Choisissez le framework',
        description: 'Sélectionnez parmi PFPMA, APTEA, AIDA, PAS, PASTOR, ou BAB selon votre objectif. PFPMA pour landing pages, APTEA pour contenus longs, PAS pour cold emails.',
        tip: 'Consultez la Bibliothèque de Frameworks pour comprendre chaque structure.'
      },
      {
        number: 2,
        title: 'Sélectionnez le type de contenu',
        description: 'Choisissez Landing Page, Email, Publicité, Article de Blog, ou Post Social. Le type influence le style et la longueur.',
        tip: 'Un email sera plus court et direct qu\'une landing page.'
      },
      {
        number: 3,
        title: '(Optionnel) Sélectionnez un avatar client',
        description: 'Choisissez un avatar pour personnaliser le copy selon votre audience. Le ton, les pain points, et les bénéfices seront adaptés.',
        tip: 'Un avatar bien défini améliore la pertinence du copy généré.'
      },
      {
        number: 4,
        title: 'Rédigez votre brief',
        description: 'Décrivez votre produit/service, les bénéfices clés, et l\'action désirée. Plus le brief est détaillé, meilleur sera le copy.',
        tip: 'Incluez : Qui, Quoi, Pourquoi, Bénéfice principal, CTA souhaité.'
      },
      {
        number: 5,
        title: 'Ajustez les paramètres',
        description: 'Choisissez le ton (Professionnel, Décontracté, Urgent) et la longueur (Court, Moyen, Long) selon votre besoin.',
        tip: 'Ton Urgent + Longueur Courte = Parfait pour les publicités.'
      },
      {
        number: 6,
        title: 'Générez et copiez',
        description: 'Cliquez sur "Générer Copy" et attendez 15-20 secondes. Copiez le résultat en un clic et adaptez-le si nécessaire.',
        tip: 'Utilisez le copy généré comme base et personnalisez avec vos données.'
      }
    ],
    examples: [
      'Générer une landing page PFPMA pour une formation en ligne',
      'Créer un email PAS pour de la prospection B2B',
      'Rédiger une publicité AIDA pour un produit e-commerce'
    ],
    faq: [
      {
        question: 'Puis-je régénérer si le résultat ne me plaît pas ?',
        answer: 'Oui, cliquez à nouveau sur "Générer Copy" pour obtenir une nouvelle version. Chaque génération est unique.'
      },
      {
        question: 'Le copy généré est-il prêt à l\'emploi ?',
        answer: 'Il constitue une excellente base, mais nous recommandons de le personnaliser avec vos données spécifiques (chiffres, témoignages, offre exacte).'
      },
      {
        question: 'Quel framework choisir pour une page de vente ?',
        answer: 'PFPMA ou PASTOR pour les pages longues, AIDA pour les pages courtes.'
      }
    ]
  },
  {
    id: 'avatar-builder',
    tool: 'Persona Builder',
    icon: Users,
    title: 'Comment créer un avatar client',
    description: 'Définissez votre audience cible pour personnaliser analyses et générations',
    steps: [
      {
        number: 1,
        title: 'Remplissez les informations démographiques',
        description: 'Nom, âge, sexe, localisation, profession, revenu, éducation. Ces données aident à contextualiser le profil.',
        tip: 'Utilisez un nom fictif mais réaliste (ex: "Marie, 35 ans, Chef de projet").'
      },
      {
        number: 2,
        title: 'Définissez les objectifs',
        description: 'Listez 3-5 objectifs principaux de votre avatar. Que veut-il accomplir ? Quels sont ses rêves ?',
        tip: 'Soyez spécifique : "Augmenter son CA de 50%" plutôt que "Gagner plus".'
      },
      {
        number: 3,
        title: 'Identifiez les défis',
        description: 'Quels obstacles rencontre-t-il ? Quelles sont ses frustrations quotidiennes ?',
        tip: 'Les défis sont la source de vos arguments de vente.'
      },
      {
        number: 4,
        title: 'Listez les points de douleur',
        description: 'Qu\'est-ce qui l\'empêche de dormir ? Quelles sont ses peurs et anxiétés ?',
        tip: 'Les pain points créent l\'urgence d\'agir.'
      },
      {
        number: 5,
        title: 'Décrivez les désirs',
        description: 'Quelle est sa situation idéale ? Que veut-il vraiment obtenir ?',
        tip: 'Les désirs sont la destination de votre transformation promise.'
      },
      {
        number: 6,
        title: 'Sauvegardez et utilisez',
        description: 'Cliquez sur "Créer Avatar" pour sauvegarder. Vous pourrez le sélectionner dans l\'Analyseur et le Générateur.',
        tip: 'Créez plusieurs avatars si vous avez différents segments d\'audience.'
      }
    ],
    examples: [
      'Créer un avatar "Entrepreneur Solo" pour une formation business',
      'Définir un avatar "DRH PME" pour un logiciel RH',
      'Construire un avatar "Coach Débutant" pour un programme de certification'
    ],
    faq: [
      {
        question: 'Combien d\'avatars puis-je créer ?',
        answer: 'Illimité. Créez autant d\'avatars que vous avez de segments d\'audience différents.'
      },
      {
        question: 'Dois-je remplir tous les champs ?',
        answer: 'Non, mais plus vous êtes précis, plus les analyses et générations seront pertinentes. Les champs obligatoires sont : Nom, Objectifs, Défis.'
      },
      {
        question: 'Puis-je modifier un avatar après création ?',
        answer: 'Oui, retournez sur le Persona Builder et modifiez les informations. Les changements seront pris en compte dans les prochaines analyses.'
      }
    ]
  },
  {
    id: 'script-analyzer',
    tool: 'Analyseur de Scripts',
    icon: FileText,
    title: 'Comment analyser vos scripts de copywriting',
    description: 'Identifiez automatiquement les frameworks utilisés et obtenez des recommandations',
    steps: [
      {
        number: 1,
        title: 'Collez votre script complet',
        description: 'Copiez-collez le texte intégral de votre script (landing page, email, VSL, etc.) dans la zone de texte.',
        tip: 'Plus le script est long, plus la détection sera précise.'
      },
      {
        number: 2,
        title: 'Lancez l\'analyse',
        description: 'Cliquez sur "Analyser Script" et attendez 10-15 secondes. L\'IA va détecter les 8 frameworks (PFPMA, APTEA, AIDA, PAS, PASTOR, BAB, 4P, QUEST).',
        tip: 'L\'analyse peut détecter plusieurs frameworks dans un même script.'
      },
      {
        number: 3,
        title: 'Consultez les frameworks détectés',
        description: 'Vous obtenez un score de confiance /100 pour chaque framework détecté, les étapes présentes, et les étapes manquantes.',
        tip: 'Un score >60% indique une bonne application du framework.'
      },
      {
        number: 4,
        title: 'Lisez les recommandations',
        description: 'Pour chaque framework, vous recevez des suggestions d\'amélioration pour les étapes manquantes ou faibles.',
        tip: 'Priorisez les étapes critiques (Problème, CTA) avant les étapes secondaires.'
      },
      {
        number: 5,
        title: 'Optimisez votre script',
        description: 'Appliquez les recommandations et relancez l\'analyse pour voir l\'amélioration du score.',
        tip: 'Visez un score >80% pour un script optimisé.'
      }
    ],
    examples: [
      'Analyser une landing page pour vérifier l\'application du PFPMA',
      'Détecter les frameworks utilisés dans un email de vente concurrent',
      'Optimiser un VSL en identifiant les étapes manquantes du PASTOR'
    ],
    faq: [
      {
        question: 'Que signifie le score de confiance ?',
        answer: 'C\'est le pourcentage de correspondance avec le framework. 100% = toutes les étapes présentes et bien appliquées, 0% = aucune correspondance.'
      },
      {
        question: 'Puis-je analyser un script en anglais ?',
        answer: 'Oui, l\'analyseur fonctionne en français et en anglais.'
      },
      {
        question: 'Combien de frameworks peuvent être détectés ?',
        answer: 'Jusqu\'à 8 frameworks simultanément. Un bon script combine souvent plusieurs structures.'
      }
    ]
  },
  {
    id: 'chat-ia',
    tool: 'Chat IA Copywriting',
    icon: MessageSquare,
    title: 'Comment utiliser le Chat IA',
    description: 'Conversation en temps réel pour optimiser vos scripts et répondre à vos questions',
    steps: [
      {
        number: 1,
        title: '(Optionnel) Sélectionnez un avatar client',
        description: 'Choisissez un avatar pour contextualiser la conversation. L\'IA adaptera ses réponses selon votre audience.',
        tip: 'Sans avatar, l\'IA donnera des conseils génériques.'
      },
      {
        number: 2,
        title: 'Posez votre question',
        description: 'Tapez votre question dans la zone de texte. Vous pouvez demander des conseils, des exemples, des optimisations, etc.',
        tip: 'Soyez précis : "Comment améliorer mon hook ?" plutôt que "Aide-moi".'
      },
      {
        number: 3,
        title: 'Utilisez les suggestions rapides',
        description: 'Cliquez sur une suggestion pour démarrer rapidement (ex: "Comment écrire un bon CTA ?").',
        tip: 'Les suggestions changent selon le contexte de la conversation.'
      },
      {
        number: 4,
        title: 'Continuez la conversation',
        description: 'L\'IA garde le contexte de la conversation. Vous pouvez approfondir, demander des variantes, ou changer de sujet.',
        tip: 'Utilisez "Donne-moi 3 variantes" pour obtenir plusieurs options.'
      },
      {
        number: 5,
        title: 'Copiez les réponses utiles',
        description: 'Sélectionnez et copiez les parties pertinentes des réponses de l\'IA pour les utiliser dans vos scripts.',
        tip: 'L\'historique est sauvegardé pendant votre session.'
      }
    ],
    examples: [
      'Demander comment améliorer un hook qui ne convertit pas',
      'Obtenir des exemples de CTA pour une landing page SaaS',
      'Comprendre la différence entre PFPMA et APTEA'
    ],
    faq: [
      {
        question: 'L\'IA connaît-elle la méthodologie Sionohmair ?',
        answer: 'Oui, l\'IA est formée sur la méthodologie Sionohmair (3 frictions, Facteur Alpha, PFPMA, APTEA) et tous les frameworks de copywriting.'
      },
      {
        question: 'Puis-je coller un script complet pour analyse ?',
        answer: 'Oui, mais utilisez plutôt l\'Analyseur de Scripts pour une analyse structurée. Le Chat IA est meilleur pour des questions spécifiques.'
      },
      {
        question: 'Les conversations sont-elles sauvegardées ?',
        answer: 'Pendant votre session uniquement. Fermez le chat pour effacer l\'historique.'
      }
    ]
  },
  {
    id: 'editor',
    tool: 'Éditeur de Copy en Temps Réel',
    icon: Layout,
    title: 'Comment utiliser l\'Éditeur en temps réel',
    description: 'Écrivez avec des suggestions IA instantanées et un score de qualité live',
    steps: [
      {
        number: 1,
        title: 'Sélectionnez le type de contenu',
        description: 'Choisissez parmi Landing Page, Email, Publicité, Article de Blog, ou Post Social. Le type influence les suggestions.',
        tip: 'Les critères de qualité changent selon le type (ex: longueur optimale).'
      },
      {
        number: 2,
        title: 'Commencez à écrire',
        description: 'Tapez votre copy dans l\'éditeur. Les suggestions apparaissent automatiquement après 1 seconde d\'inactivité.',
        tip: 'Écrivez naturellement, l\'IA s\'adapte à votre style.'
      },
      {
        number: 3,
        title: 'Consultez le score de qualité',
        description: 'Le score /100 se met à jour en temps réel. Il évalue la lisibilité, les CTA, la personnalisation, les chiffres, etc.',
        tip: 'Visez un score >80 pour un copy optimisé.'
      },
      {
        number: 4,
        title: 'Lisez les suggestions',
        description: 'Les suggestions sont classées par type : Erreur (rouge), Avertissement (jaune), Conseil (bleu). Corrigez les erreurs en priorité.',
        tip: 'Cliquez sur une suggestion pour voir où dans le texte elle s\'applique.'
      },
      {
        number: 5,
        title: 'Vérifiez les frameworks détectés',
        description: 'L\'IA détecte automatiquement les frameworks que vous utilisez (PFPMA, AIDA, etc.) et indique les étapes manquantes.',
        tip: 'Si aucun framework n\'est détecté, votre structure peut manquer de clarté.'
      },
      {
        number: 6,
        title: 'Copiez ou téléchargez',
        description: 'Une fois satisfait, copiez le texte en un clic ou téléchargez-le en .txt.',
        tip: 'Sauvegardez régulièrement votre travail localement.'
      }
    ],
    examples: [
      'Écrire une landing page PFPMA avec suggestions en direct',
      'Rédiger un email de prospection avec score de qualité live',
      'Optimiser un article de blog en temps réel'
    ],
    faq: [
      {
        question: 'Les suggestions ralentissent-elles l\'écriture ?',
        answer: 'Non, elles apparaissent après 1 seconde d\'inactivité pour ne pas vous interrompre.'
      },
      {
        question: 'Puis-je désactiver les suggestions ?',
        answer: 'Non actuellement, mais vous pouvez les ignorer. Elles sont là pour vous aider, pas vous contraindre.'
      },
      {
        question: 'Le contenu est-il sauvegardé automatiquement ?',
        answer: 'Non, pensez à copier ou télécharger régulièrement votre travail.'
      }
    ]
  }
];

export default function Guide() {
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial>(TUTORIALS[0]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <ToolHeader />
      <div className="py-12">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
            Guide d'Utilisation
          </div>
          <h1 className="text-5xl font-bold mb-4">
            Maîtrisez la <span className="text-accent">Plateforme Sionohmair</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tutoriels détaillés, exemples concrets, et FAQ pour utiliser chaque outil de manière optimale.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Liste des outils */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Outils</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {TUTORIALS.map((tutorial) => {
                  const Icon = tutorial.icon;
                  return (
                    <Button
                      key={tutorial.id}
                      variant={selectedTutorial.id === tutorial.id ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => setSelectedTutorial(tutorial)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {tutorial.tool}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-3 space-y-6">
            {/* En-tête du tutoriel */}
            <Card className="border-accent/20">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  {(() => {
                    const Icon = selectedTutorial.icon;
                    return <Icon className="h-8 w-8 text-accent" />;
                  })()}
                  <div>
                    <Badge className="mb-2">{selectedTutorial.tool}</Badge>
                    <CardTitle className="text-3xl">{selectedTutorial.title}</CardTitle>
                  </div>
                </div>
                <CardDescription className="text-base">
                  {selectedTutorial.description}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Étapes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlayCircle className="h-6 w-6 text-accent" />
                  Étapes d'utilisation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedTutorial.steps.map((step) => (
                  <div key={step.number} className="flex gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-lg">
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                      <p className="text-muted-foreground mb-2">{step.description}</p>
                      {step.tip && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                          <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-blue-900">
                            <strong>Astuce :</strong> {step.tip}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Exemples d'utilisation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-accent" />
                  Exemples d'utilisation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {selectedTutorial.examples.map((example, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-accent" />
                  Questions Fréquentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedTutorial.faq.map((item, i) => (
                  <div key={i} className="border-l-4 border-accent/20 pl-4">
                    <h4 className="font-semibold mb-2">{item.question}</h4>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="bg-accent/5 border-accent/20">
              <CardContent className="py-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Prêt à essayer ?</h3>
                <p className="text-muted-foreground mb-6">
                  Mettez en pratique ce que vous venez d'apprendre
                </p>
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <a href={`/${selectedTutorial.id}`}>
                    Utiliser {selectedTutorial.tool}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      </div>
    </div>
  );
}
