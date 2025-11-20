import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowLeft, Bot, Zap, CheckCircle, XCircle, Workflow, Shield, FileCode, Lightbulb } from "lucide-react";
import { Link } from "wouter";

export default function AutomatisationIA() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <a className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-accent" />
              <span className="font-bold text-xl">Sionohmair Insight Academy</span>
            </a>
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/">
              <a className="text-sm font-medium hover:text-accent transition-colors flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour
              </a>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Bot className="h-16 w-16 text-accent" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Automatisation IA Sionohmair
            </h1>
            <p className="text-2xl text-muted-foreground">
              Optimisation et automatisation des artefacts de clarté par intelligence artificielle
            </p>
          </div>
        </div>
      </section>

      {/* Section 1 : Positionnement & Promesse */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <Badge className="bg-accent/10 text-accent">Section 1</Badge>
              <h2 className="text-4xl font-bold">Positionnement & Promesse</h2>
              <p className="text-xl text-muted-foreground">
                L'IA au service de la clarté : automatiser sans perdre l'essence humaine
              </p>
            </div>

            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle className="text-2xl">Notre promesse IA</CardTitle>
                <CardDescription>Comment l'intelligence artificielle optimise les artefacts de clarté</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <Zap className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold text-lg">Accélération</h3>
                    <p className="text-sm text-muted-foreground">
                      L'IA génère des variantes d'artefacts en quelques secondes, permettant de tester rapidement différentes approches.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <Lightbulb className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold text-lg">Optimisation</h3>
                    <p className="text-sm text-muted-foreground">
                      L'IA analyse les frictions (attention, cognitive, émotionnelle) et propose des corrections ciblées pour maximiser la clarté.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold text-lg">Validation</h3>
                    <p className="text-sm text-muted-foreground">
                      L'IA vérifie automatiquement la cohérence PFPMA, l'ordre inductif des actions, et la mesurabilité des KPIs.
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <h3 className="font-semibold text-lg mb-4">Ce que l'IA ne remplace pas</h3>
                  <p className="text-muted-foreground">
                    L'intelligence artificielle est un <strong>outil d'amplification</strong>, pas de remplacement. Elle ne remplace jamais l'expertise humaine dans l'identification du problème central, la compréhension du contexte client, et la validation finale de la pertinence stratégique. L'IA optimise, l'humain décide.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 2 : Périmètre de l'automatisation IA */}
      <section className="py-20 bg-secondary/20">
        <div className="container">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <Badge className="bg-accent/10 text-accent">Section 2</Badge>
              <h2 className="text-4xl font-bold">Périmètre de l'automatisation IA</h2>
              <p className="text-xl text-muted-foreground">
                Ce que l'IA fait et ne fait pas dans la méthodologie Sionohmair
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="h-10 w-10 text-green-500" />
                    <CardTitle className="text-2xl">Ce que l'IA fait</CardTitle>
                  </div>
                  <CardDescription>Tâches automatisées par l'intelligence artificielle</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <p><strong>Génération de variantes</strong> : Crée 2-3 versions alternatives d'un message, titre, ou CTA</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <p><strong>Analyse PFPMA</strong> : Identifie automatiquement les éléments Problème, Formule, Preuve, Méthode, Appel</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <p><strong>Détection des frictions</strong> : Repère les frictions d'attention, cognitives, et émotionnelles dans un texte</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <p><strong>Score de Clarté /20</strong> : Calcule automatiquement le score selon la grille PFPMA</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <p><strong>Vérification de cohérence</strong> : Valide que les 5 Artefacts (N2) incarnent le même Axe de Clarté</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <p><strong>Priorisation des actions</strong> : Ordonne les recommandations par impact et effort estimés</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <p><strong>Synthèse en 3 phrases</strong> : Résume le diagnostic en situation → blocage → levier</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <XCircle className="h-10 w-10 text-red-500" />
                    <CardTitle className="text-2xl">Ce que l'IA ne fait pas</CardTitle>
                  </div>
                  <CardDescription>Tâches qui restent exclusivement humaines</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <p><strong>Identifier le problème central</strong> : Nécessite une compréhension profonde du contexte client</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <p><strong>Valider la pertinence stratégique</strong> : L'IA ne connaît pas les objectifs business réels du client</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <p><strong>Décider de l'Axe de Clarté final</strong> : Choix stratégique qui engage la marque sur le long terme</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <p><strong>Mener les entretiens clients</strong> : L'écoute active et l'empathie restent humaines</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <p><strong>Garantir la cohérence de marque</strong> : Ton, valeurs, positionnement nécessitent un jugement humain</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <p><strong>Prendre la décision finale</strong> : L'IA propose, l'expert Sionohmair dispose</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <p><strong>Adapter au contexte culturel</strong> : Nuances linguistiques et culturelles nécessitent une expertise humaine</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 : Présentoir des artefacts par niveau */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <Badge className="bg-accent/10 text-accent">Section 3</Badge>
              <h2 className="text-4xl font-bold">Présentoir des artefacts par niveau</h2>
              <p className="text-xl text-muted-foreground">
                Comment l'IA intervient à chaque niveau de service (N1, N2, N3)
              </p>
            </div>

            <div className="space-y-6">
              <Card className="border-accent/20">
                <CardHeader>
                  <Badge className="mb-2 bg-primary/10 text-primary w-fit">Niveau 1 : Diagnostic de Clarté</Badge>
                  <CardTitle className="text-2xl">Intervention IA au Niveau 1</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Artefacts générés par l'IA :</h3>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Synthèse IA en 3 phrases (situation → blocage → levier)</li>
                        <li>• 2 variantes d'Axe de Clarté optimisées</li>
                        <li>• Vérification de la séquence d'actions (ordre inductif)</li>
                        <li>• Score de Clarté /20 automatique avec justification</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">Validation humaine requise :</h3>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Formulation du Problème central (2-3 phrases)</li>
                        <li>• Identification des 3 frictions spécifiques au client</li>
                        <li>• Choix de l'Axe de Clarté final parmi les variantes IA</li>
                        <li>• Validation de la pertinence des actions recommandées</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <Badge className="mb-2 bg-primary/10 text-primary w-fit">Niveau 2 : Architecture de l'Insight</Badge>
                  <CardTitle className="text-2xl">Intervention IA au Niveau 2</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Artefacts générés par l'IA :</h3>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Micro-story AVANT / APRÈS selon PFPMA</li>
                        <li>• Vérification de cohérence des 5 Artefacts (Problème, Promesse, CTA)</li>
                        <li>• Matrice Effort / Impact pour prioriser les Étapes 1 → 5</li>
                        <li>• Génération de variantes pour chaque Artefact de Clarté</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">Validation humaine requise :</h3>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Sélection des 5 Artefacts de Clarté à produire</li>
                        <li>• Validation de la Carte PFPMA du système</li>
                        <li>• Choix du message central AVANT / APRÈS</li>
                        <li>• Adaptation de la Roadmap d'implémentation au contexte client</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <Badge className="mb-2 bg-primary/10 text-primary w-fit">Niveau 3 : Partenariat Stratégique</Badge>
                  <CardTitle className="text-2xl">Intervention IA au Niveau 3</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Artefacts générés par l'IA :</h3>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Récit de la roadmap en 4 actes (Prendre conscience, Transformer, Mesurer, Ancrer)</li>
                        <li>• Argumentaire simple du NFT (preuve, statut, utilité)</li>
                        <li>• Liste de 3 signaux de friction à surveiller + 1 action par signal</li>
                        <li>• Dashboards de Clarté avec KPIs automatisés</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">Validation humaine requise :</h3>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Définition des objectifs stratégiques 12 mois</li>
                        <li>• Choix des KPIs de Clarté à suivre (personnalisés)</li>
                        <li>• Critères d'éligibilité au NFT "Architecte de la Clarté"</li>
                        <li>• Adaptation du Playbook de Clarté à la culture d'entreprise</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 : Workflow IA Sionohmair */}
      <section className="py-20 bg-secondary/20">
        <div className="container">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <Badge className="bg-accent/10 text-accent">Section 4</Badge>
              <h2 className="text-4xl font-bold">Workflow IA Sionohmair</h2>
              <p className="text-xl text-muted-foreground">
                Processus étape par étape de l'automatisation IA
              </p>
            </div>

            <Card className="border-accent/20">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Workflow className="h-10 w-10 text-accent" />
                  <CardTitle className="text-2xl">Les 7 étapes du Workflow IA</CardTitle>
                </div>
                <CardDescription>Du diagnostic initial à la livraison des artefacts optimisés</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    step: 1,
                    title: "Collecte des données client",
                    description: "L'expert Sionohmair recueille le message actuel, le contexte, les objectifs, et les contraintes du client.",
                    ia: false
                  },
                  {
                    step: 2,
                    title: "Analyse PFPMA automatique",
                    description: "L'IA analyse le message et identifie les éléments Problème, Formule, Preuve, Méthode, Appel.",
                    ia: true
                  },
                  {
                    step: 3,
                    title: "Détection des 3 frictions",
                    description: "L'IA repère les frictions d'Attention, Cognitives, et Émotionnelles dans le message.",
                    ia: true
                  },
                  {
                    step: 4,
                    title: "Génération de variantes optimisées",
                    description: "L'IA propose 2-3 versions alternatives du message, du titre, ou du CTA pour maximiser la clarté.",
                    ia: true
                  },
                  {
                    step: 5,
                    title: "Validation et ajustement humain",
                    description: "L'expert Sionohmair valide, ajuste, et choisit la meilleure variante en fonction du contexte stratégique.",
                    ia: false
                  },
                  {
                    step: 6,
                    title: "Génération du Bloc Recommandation IA",
                    description: "L'IA produit la synthèse en 3 phrases, la matrice Effort/Impact, et les actions prioritaires.",
                    ia: true
                  },
                  {
                    step: 7,
                    title: "Livraison des artefacts finaux",
                    description: "L'expert Sionohmair livre les artefacts validés au client avec les recommandations actionnables.",
                    ia: false
                  }
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4 p-4 bg-background rounded-lg border">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent font-bold shrink-0">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        {item.ia ? (
                          <Badge className="bg-accent/10 text-accent">IA</Badge>
                        ) : (
                          <Badge className="bg-primary/10 text-primary">Humain</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 5 : Clauses IA */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <Badge className="bg-accent/10 text-accent">Section 5</Badge>
              <h2 className="text-4xl font-bold">Clauses IA (Client & Interne)</h2>
              <p className="text-xl text-muted-foreground">
                Conditions d'utilisation de l'intelligence artificielle dans les artefacts de clarté
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-accent/20">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="h-10 w-10 text-accent" />
                    <CardTitle className="text-2xl">Clauses Client</CardTitle>
                  </div>
                  <CardDescription>Transparence et garanties pour les clients</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="space-y-2">
                    <h3 className="font-semibold">1. Transparence de l'utilisation IA</h3>
                    <p className="text-muted-foreground">
                      Nous informons systématiquement nos clients que l'intelligence artificielle est utilisée pour optimiser leurs artefacts de clarté. L'IA est un outil d'amplification, pas de remplacement de l'expertise humaine.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">2. Validation humaine garantie</h3>
                    <p className="text-muted-foreground">
                      Tous les artefacts générés par l'IA sont systématiquement validés, ajustés, et personnalisés par un expert Sionohmair certifié. Aucun livrable n'est envoyé au client sans validation humaine.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">3. Propriété intellectuelle</h3>
                    <p className="text-muted-foreground">
                      Le client conserve l'entière propriété intellectuelle des artefacts livrés, qu'ils aient été générés par IA ou non. Les données client ne sont jamais utilisées pour entraîner des modèles IA tiers.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">4. Confidentialité des données</h3>
                    <p className="text-muted-foreground">
                      Les données client transmises à l'IA sont traitées de manière confidentielle et ne sont jamais partagées avec des tiers. Nous utilisons des modèles IA respectueux de la confidentialité.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">5. Droit de refus de l'IA</h3>
                    <p className="text-muted-foreground">
                      Le client peut à tout moment demander que ses artefacts soient produits exclusivement par des humains, sans intervention de l'IA. Cette option est disponible sur simple demande.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <FileCode className="h-10 w-10 text-accent" />
                    <CardTitle className="text-2xl">Clauses Internes</CardTitle>
                  </div>
                  <CardDescription>Règles d'utilisation pour les experts Sionohmair</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="space-y-2">
                    <h3 className="font-semibold">1. L'IA est un outil, pas un remplaçant</h3>
                    <p className="text-muted-foreground">
                      Les experts Sionohmair utilisent l'IA pour accélérer et optimiser leur travail, jamais pour le remplacer. L'expertise humaine reste au cœur de chaque diagnostic et recommandation.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">2. Validation obligatoire avant livraison</h3>
                    <p className="text-muted-foreground">
                      Tout artefact généré par l'IA doit être relu, validé, et ajusté par un expert Sionohmair avant d'être livré au client. Aucune exception n'est tolérée.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">3. Personnalisation systématique</h3>
                    <p className="text-muted-foreground">
                      Les variantes générées par l'IA doivent être adaptées au contexte spécifique du client (ton, valeurs, positionnement, contraintes). L'IA propose, l'expert adapte.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">4. Traçabilité des interventions IA</h3>
                    <p className="text-muted-foreground">
                      Chaque utilisation de l'IA doit être documentée dans le formulaire de rapport interne (N1, N2, ou N3) pour garantir la traçabilité et l'amélioration continue.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">5. Formation continue obligatoire</h3>
                    <p className="text-muted-foreground">
                      Les experts Sionohmair doivent suivre une formation continue sur l'utilisation éthique et efficace de l'IA dans la méthodologie de clarté. Mise à jour trimestrielle.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6 : Bloc Recommandation IA Générique */}
      <section className="py-20 bg-secondary/20">
        <div className="container">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <Badge className="bg-accent/10 text-accent">Section 6</Badge>
              <h2 className="text-4xl font-bold">Bloc Recommandation IA Générique</h2>
              <p className="text-xl text-muted-foreground">
                Template standard à intégrer dans tous les artefacts de clarté
              </p>
            </div>

            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle className="text-2xl">Structure du Bloc Recommandation IA</CardTitle>
                <CardDescription>À intégrer dans chaque rapport (N1, N2, N3)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-background p-6 rounded-lg border-l-4 border-l-accent">
                  <h3 className="font-semibold text-lg mb-4">Critères de Clarté & Recommandation IA</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Ce que cet artefact doit rendre évident :</h4>
                      <p className="text-sm text-muted-foreground italic">[À définir selon l'artefact]</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Deux critères principaux de réussite :</h4>
                      <ol className="text-sm text-muted-foreground space-y-1">
                        <li>1. [Critère 1 spécifique à l'artefact]</li>
                        <li>2. [Critère 2 spécifique à l'artefact]</li>
                      </ol>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Suggestion IA – axe d'amélioration principal :</h4>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li>• <strong>Formulation :</strong> [Version optimisée du message générée par l'IA]</li>
                        <li>• <strong>Structure :</strong> [Ordre recommandé des éléments pour maximiser la clarté]</li>
                        <li>• <strong>Preuve :</strong> [Type de preuve à ajouter pour renforcer la crédibilité]</li>
                        <li>• <strong>CTA :</strong> [Call-to-action recommandé avec friction zéro]</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-3">Exemple concret (Niveau 1 - Sprint de Clarté)</h3>
                  <div className="bg-background p-4 rounded-lg text-sm space-y-3">
                    <p><strong>Ce que cet artefact doit rendre évident :</strong> Le problème central du client et l'action prioritaire unique à entreprendre.</p>
                    <p><strong>Deux critères principaux de réussite :</strong></p>
                    <ol className="ml-4 space-y-1 text-muted-foreground">
                      <li>1. Le problème est formulé en 2-3 phrases et résonne immédiatement avec l'audience.</li>
                      <li>2. L'action prioritaire est spécifique, mesurable, et ordonnée par impact/effort.</li>
                    </ol>
                    <p><strong>Suggestion IA – axe d'amélioration principal :</strong></p>
                    <ul className="ml-4 space-y-1 text-muted-foreground">
                      <li>• <strong>Formulation :</strong> "Transformez votre idée brillante en message clair en 7 jours"</li>
                      <li>• <strong>Structure :</strong> Problème → Formule → Preuve → Méthode → Appel (PFPMA)</li>
                      <li>• <strong>Preuve :</strong> "+250% de conversion moyenne après optimisation"</li>
                      <li>• <strong>CTA :</strong> "Réserver mon Sprint de Clarté (490 €)"</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 7 : Utilisation Concrète */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <Badge className="bg-accent/10 text-accent">Section 7</Badge>
              <h2 className="text-4xl font-bold">Utilisation Concrète</h2>
              <p className="text-xl text-muted-foreground">
                Annexes, référentiel interne, et cas d'usage pratiques
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="text-xl">Annexes disponibles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>• Templates de prompts IA optimisés</p>
                  <p>• Bibliothèque de variantes testées</p>
                  <p>• Grilles d'évaluation automatiques</p>
                  <p>• Checklist de validation IA</p>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="text-xl">Référentiel interne</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>• Playbook IA Sionohmair (usage interne)</p>
                  <p>• Guide de personnalisation des outputs IA</p>
                  <p>• FAQ IA pour experts certifiés</p>
                  <p>• Bonnes pratiques et anti-patterns</p>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="text-xl">Cas d'usage pratiques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>• Optimisation d'une landing page (N1)</p>
                  <p>• Refonte d'un tunnel email (N2)</p>
                  <p>• Transformation d'une marque (N3)</p>
                  <p>• A/B testing automatisé avec IA</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl font-bold">
              Découvrez la puissance de l'IA Sionohmair
            </h2>
            <p className="text-xl text-muted-foreground">
              Optimisez vos artefacts de clarté avec l'intelligence artificielle
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8">
                <Link href="/sprint">
                  <a>Tester avec le Sprint de Clarté (490 €)</a>
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8">
                <Link href="/services">
                  <a>Voir tous les services</a>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-secondary/20">
        <div className="container">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 Bruno Coldold | Sionohmair Insight Academy. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
