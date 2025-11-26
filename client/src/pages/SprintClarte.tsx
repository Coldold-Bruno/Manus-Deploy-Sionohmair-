import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, ArrowLeft, Calendar, FileText, Target, TrendingUp, Zap, Award } from "lucide-react";
import { Link } from "wouter";
import { PaymentButton } from "@/components/PaymentButton";

export default function SprintClarte() {
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
            <Badge className="bg-accent/10 text-accent hover:bg-accent/20 text-sm px-4 py-2">
              Offre de Lancement : -67%
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Sprint de Clarté
            </h1>
            <p className="text-2xl text-muted-foreground">
              Transformez votre message en machine à conversion en 7 jours
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <span className="text-3xl line-through text-muted-foreground">2 500 €</span>
              <span className="text-5xl font-bold text-accent">990 €</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Garantie satisfait ou remboursé à 100% • Paiement sécurisé
            </p>
          </div>
        </div>
      </section>

      {/* Ce que vous recevez */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Ce que vous recevez</h2>
              <p className="text-xl text-muted-foreground">
                Un audit complet de votre message avec plan d'action mesurable
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-accent/20">
                <CardHeader>
                  <FileText className="h-12 w-12 text-accent mb-4" />
                  <CardTitle className="text-2xl">Rapport de 10 pages</CardTitle>
                  <CardDescription className="text-base">
                    Analyse complète de votre message selon la méthodologie Sionohmair Insight
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      "Score de Clarté sur 20 points",
                      "Analyse PFPMA détaillée",
                      "Identification des 3 frictions",
                      "Calcul du potentiel d'Insight (Hi)",
                      "Analyse fractale de votre message",
                      "Recommandations priorisées"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <Target className="h-12 w-12 text-accent mb-4" />
                  <CardTitle className="text-2xl">Plan d'action 30 jours</CardTitle>
                  <CardDescription className="text-base">
                    Feuille de route concrète pour éliminer les frictions et maximiser l'impact
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      "Refonte du message central",
                      "Corrections priorisées par impact",
                      "Projections KPI (CTR, conversion)",
                      "Templates de copywriting",
                      "Checklist d'implémentation",
                      "Suivi à J+30 inclus"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Processus en 7 jours */}
      <section className="py-20 bg-secondary/20">
        <div className="container">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Le processus en 7 jours</h2>
              <p className="text-xl text-muted-foreground">
                De l'audit initial à la livraison du rapport complet
              </p>
            </div>

            <div className="grid gap-6">
              {[
                {
                  day: "Jour 1",
                  title: "Briefing initial",
                  description: "Questionnaire détaillé sur votre offre, votre audience, et vos objectifs. Collecte de vos supports actuels (landing page, pitch, emails).",
                  icon: Calendar
                },
                {
                  day: "Jours 2-3",
                  title: "Analyse PFPMA",
                  description: "Déconstruction de votre message selon le Code PFPMA. Identification des 3 types de frictions (Attention, Cognitive, Émotionnelle). Calcul du Score de Clarté.",
                  icon: Target
                },
                {
                  day: "Jours 4-5",
                  title: "Calcul du potentiel d'Insight",
                  description: "Application du Théorème de la Genèse : Hi = An × Pn × Tn × En. Analyse fractale pour identifier les leviers d'optimisation. Projection des gains potentiels en KPI.",
                  icon: Zap
                },
                {
                  day: "Jour 6",
                  title: "Plan d'action",
                  description: "Refonte du message central. Recommandations priorisées par impact. Templates de copywriting prêts à l'emploi. Checklist d'implémentation sur 30 jours.",
                  icon: TrendingUp
                },
                {
                  day: "Jour 7",
                  title: "Livraison & Débriefing",
                  description: "Envoi du rapport complet de 10 pages. Session de débriefing de 30 minutes en visio. Réponses à vos questions. Planification du suivi à J+30.",
                  icon: Award
                }
              ].map((item, index) => (
                <Card key={index} className="border-l-4 border-l-accent">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent shrink-0">
                        <item.icon className="h-7 w-7" />
                      </div>
                      <div className="flex-1">
                        <Badge className="mb-2 bg-accent/10 text-accent hover:bg-accent/20">{item.day}</Badge>
                        <CardTitle className="text-2xl mb-2">{item.title}</CardTitle>
                        <CardDescription className="text-base">{item.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Garanties */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Garanties</h2>
              <p className="text-xl text-muted-foreground">
                Zéro risque pour vous
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                    <Check className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-xl">100% Satisfait ou Remboursé</CardTitle>
                  <CardDescription className="text-base">
                    Si vous n'êtes pas satisfait du rapport, remboursement intégral sans justification.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                    <Calendar className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-xl">Livraison en 7 jours</CardTitle>
                  <CardDescription className="text-base">
                    Garantie de livraison sous 7 jours ouvrés ou remboursement de 50%.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                    <Award className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-xl">Suivi à J+30 inclus</CardTitle>
                  <CardDescription className="text-base">
                    Session de suivi gratuite 30 jours après implémentation pour mesurer les résultats.
                  </CardDescription>
                </CardHeader>
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
              Prêt à transformer votre message ?
            </h2>
            <p className="text-xl text-muted-foreground">
              Places limitées : 5 Sprints de Clarté par mois pour garantir la qualité
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <PaymentButton
                productId="SPRINT_CLARTE"
                label="Réserver mon Sprint (990 €)"
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8"
              />
              <Button asChild size="lg" variant="outline" className="text-lg px-8">
                <Link href="/">
                  <a>En savoir plus</a>
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Paiement sécurisé • Garantie satisfait ou remboursé • Facture fournie
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
