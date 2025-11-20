import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowLeft, FileText, CheckCircle, Target, AlertCircle, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function Niveau1() {
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
            <Link href="/services">
              <a className="text-sm font-medium hover:text-accent transition-colors flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour aux Services
              </a>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge className="bg-accent/10 text-accent hover:bg-accent/20 text-sm px-4 py-2">
              Niveau 1 : Diagnostic de Clarté
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Sprint de Clarté
            </h1>
            <p className="text-2xl text-muted-foreground">
              Transformez votre message en 7 jours avec un diagnostic complet et un plan d'action prioritaire
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <span className="text-3xl line-through text-muted-foreground">1 500 €</span>
              <span className="text-5xl font-bold text-accent">490 €</span>
            </div>
          </div>
        </div>
      </section>

      {/* Artefacts Usage Client */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Artefacts livrés (Usage Client)</h2>
              <p className="text-xl text-muted-foreground">
                Ce que vous recevez à la fin du Sprint de Clarté
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-accent/20">
                <CardHeader>
                  <FileText className="h-12 w-12 text-accent mb-4" />
                  <CardTitle className="text-2xl">Rapport Sprint de Clarté</CardTitle>
                  <CardDescription className="text-base">1-3 pages</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>Document complet analysant votre message selon la méthodologie PFPMA.</p>
                  <p className="font-semibold">Contenu :</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Analyse du message actuel</li>
                    <li>• Identification des 3 frictions</li>
                    <li>• Score de Clarté /20 justifié</li>
                    <li>• Recommandations détaillées</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <CheckCircle className="h-12 w-12 text-accent mb-4" />
                  <CardTitle className="text-2xl">Synthèse Exécutive</CardTitle>
                  <CardDescription className="text-base">1 page orientée décision</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>Vue d'ensemble pour les décideurs, lisible en moins de 2 minutes.</p>
                  <p className="font-semibold">Contenu :</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Problème central en 2-3 phrases</li>
                    <li>• Score de Clarté /20</li>
                    <li>• Axe de Clarté (nouveau pitch)</li>
                    <li>• Action prioritaire unique</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <Target className="h-12 w-12 text-accent mb-4" />
                  <CardTitle className="text-2xl">Recommandation Actionnable</CardTitle>
                  <CardDescription className="text-base">Levier principal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>L'action unique qui aura le plus d'impact sur votre clarté.</p>
                  <p className="font-semibold">Contenu :</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Action spécifique et mesurable</li>
                    <li>• Impact estimé (CTR, conversion)</li>
                    <li>• Effort requis (temps, ressources)</li>
                    <li>• Ordre de priorité justifié</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Artefacts Usage Interne */}
      <section className="py-20 bg-secondary/20">
        <div className="container">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Artefacts internes (Méthodologie)</h2>
              <p className="text-xl text-muted-foreground">
                Les outils que nous utilisons pour garantir la qualité du diagnostic
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="text-2xl">Formulaire de rapport N1</CardTitle>
                  <CardDescription>Diagnostic de Clarté structuré</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>Grille d'analyse complète pour garantir l'exhaustivité du diagnostic.</p>
                  <p className="font-semibold">Sections :</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Message actuel (AVANT)</li>
                    <li>• Analyse PFPMA détaillée</li>
                    <li>• Identification des 3 frictions</li>
                    <li>• Score de Clarté /20 avec justification</li>
                    <li>• Axe de Clarté (message APRÈS)</li>
                    <li>• Plan d'action priorisé</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="text-2xl">Grille de Score de Clarté /20</CardTitle>
                  <CardDescription>Évaluation PFPMA</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>Système de notation objectif basé sur le Code PFPMA.</p>
                  <p className="font-semibold">Critères (4 points chacun) :</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• <strong>P</strong> - Problème : clarté et résonance</li>
                    <li>• <strong>F</strong> - Formule : mémorabilité et différenciation</li>
                    <li>• <strong>P</strong> - Preuve : crédibilité et spécificité</li>
                    <li>• <strong>M</strong> - Méthode : simplicité et actionnabilité</li>
                    <li>• <strong>A</strong> - Appel : friction zéro et clarté</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="text-2xl">Checklist avant restitution</CardTitle>
                  <CardDescription>10 points de contrôle qualité</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>Validation finale avant livraison au client.</p>
                  <p className="font-semibold">Points de contrôle :</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>✓ Problème formulé en 2-3 phrases</li>
                    <li>✓ 3 frictions nommées et illustrées</li>
                    <li>✓ Score /20 justifié (commentaire PFPMA)</li>
                    <li>✓ Axe de Clarté = titre/pitch mémorable</li>
                    <li>✓ Actions ordonnées par impact/effort</li>
                    <li>✓ Projections KPI réalistes</li>
                    <li>✓ Synthèse exécutive lisible en 2 min</li>
                    <li>✓ Recommandation unique claire</li>
                    <li>✓ Relecture orthographe/grammaire</li>
                    <li>✓ Validation cohérence PFPMA</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="text-2xl">Note interne de synthèse</CardTitle>
                  <CardDescription>Narrative AVANT/APRÈS</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>Récit du point de bascule identifié dans le message.</p>
                  <p className="font-semibold">Structure :</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• <strong>AVANT</strong> : Situation actuelle (frictions)</li>
                    <li>• <strong>Point de bascule</strong> : Insight clé découvert</li>
                    <li>• <strong>APRÈS</strong> : Message transformé (clarté)</li>
                    <li>• <strong>Impact estimé</strong> : Projections KPI</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Critères Prévisibles */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Critères prévisibles de réussite</h2>
              <p className="text-xl text-muted-foreground">
                Comment savoir si votre Sprint de Clarté est réussi
              </p>
            </div>

            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle className="text-2xl">Les 5 critères de validation</CardTitle>
                <CardDescription>Tous ces critères doivent être remplis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    title: "Problème central formulé clairement",
                    description: "Le problème tient en 2-3 phrases maximum et résonne immédiatement avec votre audience cible."
                  },
                  {
                    title: "Les 3 frictions sont nommées et illustrées",
                    description: "Friction d'Attention, Friction Cognitive, et Friction Émotionnelle sont identifiées avec des exemples concrets tirés de votre message."
                  },
                  {
                    title: "Score de Clarté /20 justifié",
                    description: "Chaque point est expliqué selon la grille PFPMA (Problème, Formule, Preuve, Méthode, Appel). Vous comprenez pourquoi vous avez ce score."
                  },
                  {
                    title: "Axe de Clarté = titre/pitch mémorable",
                    description: "Le message transformé tient en 1-2 phrases et peut devenir votre nouveau titre, slogan ou pitch. Il est mémorable et différenciant."
                  },
                  {
                    title: "Plan d'action priorisé par impact",
                    description: "1 à 3 actions concrètes, ordonnées par impact et effort. Vous savez exactement par où commencer."
                  }
                ].map((critere, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-secondary/20 rounded-lg">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent font-bold shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{critere.title}</h3>
                      <p className="text-sm text-muted-foreground">{critere.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Bloc Recommandation IA */}
      <section className="py-20 bg-secondary/20">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <Badge className="bg-accent/10 text-accent">Bonus Inclus</Badge>
              <h2 className="text-4xl font-bold">Bloc Recommandation IA</h2>
              <p className="text-xl text-muted-foreground">
                Analyse augmentée par intelligence artificielle pour maximiser l'impact
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-accent/20">
                <CardHeader>
                  <AlertCircle className="h-10 w-10 text-accent mb-4" />
                  <CardTitle className="text-xl">Synthèse IA en 3 phrases</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="font-semibold">Structure :</p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li><strong>Situation :</strong> État actuel du message</li>
                    <li><strong>Blocage :</strong> Friction principale identifiée</li>
                    <li><strong>Levier :</strong> Action à impact maximal</li>
                  </ul>
                  <p className="text-xs italic">Permet une compréhension immédiate du diagnostic en moins de 30 secondes.</p>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <TrendingUp className="h-10 w-10 text-accent mb-4" />
                  <CardTitle className="text-xl">Variantes d'Axe de Clarté</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="font-semibold">2 versions optimisées :</p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li><strong>Version A :</strong> Orientée bénéfice direct</li>
                    <li><strong>Version B :</strong> Orientée transformation</li>
                  </ul>
                  <p className="text-xs italic">L'IA génère des alternatives plus percutantes que vous pouvez A/B tester.</p>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <CheckCircle className="h-10 w-10 text-accent mb-4" />
                  <CardTitle className="text-xl">Vérification de séquence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="font-semibold">Validation automatique :</p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>✓ Ordre inductif respecté</li>
                    <li>✓ Actions faisables et mesurables</li>
                    <li>✓ Cohérence avec le Code PFPMA</li>
                  </ul>
                  <p className="text-xs italic">Garantit que le plan d'action est logique et applicable immédiatement.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl font-bold">
              Prêt à transformer votre message ?
            </h2>
            <p className="text-xl text-muted-foreground">
              Réservez votre Sprint de Clarté maintenant : 490 € au lieu de 1 500 €
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8">
                <Link href="/sprint">
                  <a>Réserver mon Sprint (490 €)</a>
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8">
                <Link href="/services">
                  <a>Comparer les 3 Niveaux</a>
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Garantie satisfait ou remboursé • Livraison en 7 jours • Suivi à J+30 inclus
            </p>
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
