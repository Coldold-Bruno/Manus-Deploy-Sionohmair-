import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ArrowRight, ArrowLeft, CheckCircle, Sparkles } from 'lucide-react';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  image?: string;
  tips: string[];
  action?: {
    label: string;
    url: string;
  };
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: 'Bienvenue sur Sionohmair Insight Academy ! 🎉',
    description: 'La plateforme complète de Content Marketing & Copywriting basée sur la méthodologie Sionohmair. Découvrez comment multiplier vos conversions par 3 grâce à l\'élimination des 3 frictions.',
    tips: [
      '11 outils puissants à votre disposition',
      'Méthodologie scientifique basée sur le Facteur Alpha (α = 22.67)',
      '8 frameworks de copywriting (PFPMA, APTEA, AIDA, PAS, etc.)',
      'Analyses IA en temps réel'
    ]
  },
  {
    id: 2,
    title: 'Créez votre premier Avatar Client',
    description: 'Commencez par définir votre audience cible avec le Persona Builder. Un avatar bien défini améliore la pertinence de toutes vos analyses et générations.',
    tips: [
      'Remplissez les informations démographiques (âge, profession, revenu)',
      'Définissez les objectifs, défis, et points de douleur',
      'Listez les désirs et peurs de votre audience',
      'Vous pourrez réutiliser cet avatar dans tous les outils'
    ],
    action: {
      label: 'Créer Mon Premier Avatar',
      url: '/avatar-builder'
    }
  },
  {
    id: 3,
    title: 'Analysez Votre Contenu Existant',
    description: 'Utilisez l\'Analyseur de Contenu pour identifier les 3 frictions dans votre communication actuelle. Obtenez un score /100 et des recommandations actionnables.',
    tips: [
      'Analyse en 5 dimensions : SEO, Conversion, Engagement, Lisibilité, Psychologie',
      'Détection automatique des frictions (Attention, Cognitive, Émotionnelle)',
      'Recommandations classées par priorité (Critique, Important, Mineur)',
      'Sélectionnez votre avatar pour personnaliser l\'analyse'
    ],
    action: {
      label: 'Analyser Mon Contenu',
      url: '/content-analyzer'
    }
  },
  {
    id: 4,
    title: 'Générez du Copy Optimisé',
    description: 'Créez du contenu persuasif avec le Générateur de Copy. Choisissez parmi 6 frameworks (PFPMA, APTEA, AIDA, PAS, PASTOR, BAB) et laissez l\'IA générer un copy optimisé.',
    tips: [
      'Sélectionnez le framework adapté à votre objectif',
      'Rédigez un brief détaillé (produit, bénéfices, CTA)',
      'Choisissez le ton (Professionnel, Décontracté, Urgent)',
      'Copiez et adaptez le résultat à vos besoins'
    ],
    action: {
      label: 'Générer Mon Premier Copy',
      url: '/copy-generator'
    }
  },
  {
    id: 5,
    title: 'Explorez les Autres Outils',
    description: 'Découvrez les 8 autres outils pour maîtriser le copywriting : Analyseur de Scripts, Frameworks, Chat IA, Templates, Exemples, Éditeur, Dashboard, et Guide.',
    tips: [
      'Analyseur de Scripts : Identifiez les frameworks dans vos textes',
      'Bibliothèque de Frameworks : Apprenez la théorie de chaque structure',
      'Chat IA : Posez vos questions en temps réel',
      'Éditeur : Écrivez avec suggestions IA instantanées',
      'Templates : Copiez des modèles prêts à l\'emploi',
      'Exemples : Inspirez-vous de cas réels (+641% à +1300% de conversion)'
    ],
    action: {
      label: 'Voir le Guide Complet',
      url: '/guide'
    }
  }
];

const ONBOARDING_KEY = 'sionohmair_onboarding_completed';

export default function Onboarding() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Vérifier si l'onboarding a déjà été complété
    const completed = localStorage.getItem(ONBOARDING_KEY);
    if (!completed) {
      // Attendre 1 seconde avant d'afficher l'onboarding
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setIsOpen(false);
  };

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const step = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl mx-4 shadow-2xl">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSkip}
            className="absolute top-4 right-4"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline">
              Étape {step.id} sur {ONBOARDING_STEPS.length}
            </Badge>
          </div>
          <CardTitle className="text-3xl">{step.title}</CardTitle>
          <CardDescription className="text-base">
            {step.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Points clés */}
          <div className="space-y-3">
            {step.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{tip}</span>
              </div>
            ))}
          </div>

          {/* Barre de progression */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progression</span>
              <span>{Math.round(((currentStep + 1) / ONBOARDING_STEPS.length) * 100)}%</span>
            </div>
            <div className="w-full bg-secondary/20 rounded-full h-2">
              <div
                className="bg-accent h-2 rounded-full transition-all"
                style={{ width: `${((currentStep + 1) / ONBOARDING_STEPS.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              {currentStep > 0 && (
                <Button variant="outline" onClick={handlePrevious}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Précédent
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={handleSkip}>
                Passer
              </Button>
              {step.action && (
                <Button
                  asChild
                  variant="outline"
                  onClick={handleComplete}
                >
                  <a href={step.action.url}>
                    {step.action.label}
                  </a>
                </Button>
              )}
              {isLastStep ? (
                <Button
                  onClick={handleComplete}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Commencer
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Suivant
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
