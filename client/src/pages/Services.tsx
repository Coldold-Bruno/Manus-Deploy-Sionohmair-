import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, ArrowLeft, Zap, Rocket, Crown } from "lucide-react";
import { Link } from "wouter";

export default function Services() {
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
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Nos Services
            </h1>
            <p className="text-2xl text-muted-foreground">
              3 niveaux d'accompagnement pour transformer votre communication en science de la performance
            </p>
          </div>
        </div>
      </section>

      {/* Les 3 Offres */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            {/* Sprint de Clarté */}
            <Card className="border-accent/20 relative">
              <div className="absolute top-4 right-4">
                <Badge className="bg-accent/10 text-accent hover:bg-accent/20">
                  Offre de Lancement
                </Badge>
              </div>
              <CardHeader className="text-center pb-8 pt-12">
                <div className="mx-auto h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <Zap className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-3xl mb-2">Sprint de Clarté</CardTitle>
                <CardDescription className="text-base mb-4">
                  Audit complet de votre message en 7 jours
                </CardDescription>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-accent">490 €</div>
                  <div className="text-sm text-muted-foreground line-through">1 500 €</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <p className="font-semibold text-sm">Ce qui est inclus :</p>
                  <ul className="space-y-2">
                    {[
                      "Rapport de 10 pages",
                      "Score de Clarté sur 20 points",
                      "Analyse PFPMA complète",
                      "Identification des 3 frictions",
                      "Calcul du Hi (potentiel d'Insight)",
                      "Plan d'action 30 jours",
                      "Projections KPI (CTR, conversion)",
                      "Session de débriefing 30 min",
                      "Suivi à J+30 inclus",
                      "Garantie satisfait ou remboursé"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="/sprint">
                    <a>Réserver mon Sprint</a>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Formation Architecte de Clarté */}
            <Card className="border-accent/20 relative shadow-lg scale-105">
              <div className="absolute top-4 right-4">
                <Badge className="bg-accent text-accent-foreground">
                  Recommandé
                </Badge>
              </div>
              <CardHeader className="text-center pb-8 pt-12">
                <div className="mx-auto h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <Rocket className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-3xl mb-2">Formation Architecte</CardTitle>
                <CardDescription className="text-base mb-4">
                  Formation complète sur 6 mois
                </CardDescription>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-accent">10 000 €</div>
                  <div className="text-sm text-muted-foreground">ou 3 × 3 500 €</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <p className="font-semibold text-sm">Ce qui est inclus :</p>
                  <ul className="space-y-2">
                    {[
                      "Sprint de Clarté initial inclus",
                      "12 sessions de coaching (2h/mois)",
                      "Accès au mémoire complet (310 pages)",
                      "Formation au Code PFPMA",
                      "Maîtrise du Théorème de la Genèse",
                      "Analyse fractale avancée",
                      "Certification Architecte de Clarté",
                      "Accès à la communauté privée",
                      "Templates et outils exclusifs",
                      "Support prioritaire 6 mois"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  Candidater à la Formation
                </Button>
              </CardContent>
            </Card>

            {/* Transformation Organisationnelle */}
            <Card className="border-accent/20 relative">
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                  Entreprises
                </Badge>
              </div>
              <CardHeader className="text-center pb-8 pt-12">
                <div className="mx-auto h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <Crown className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-3xl mb-2">Transformation</CardTitle>
                <CardDescription className="text-base mb-4">
                  Accompagnement sur-mesure pour organisations
                </CardDescription>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-accent">50 000 €</div>
                  <div className="text-sm text-muted-foreground">Sur devis personnalisé</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <p className="font-semibold text-sm">Ce qui est inclus :</p>
                  <ul className="space-y-2">
                    {[
                      "Audit complet de l'organisation",
                      "Formation de l'équipe (jusqu'à 20 personnes)",
                      "Refonte de tous les supports",
                      "Implémentation du Code PFPMA",
                      "Optimisation des tunnels de conversion",
                      "Suivi mensuel pendant 12 mois",
                      "Analyse fractale de tous les messages",
                      "Dashboards de performance",
                      "Support dédié illimité",
                      "Garantie de résultats contractuelle"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button variant="outline" className="w-full">
                  Demander un Devis
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparatif */}
      <section className="py-20 bg-secondary/20">
        <div className="container">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Quelle offre choisir ?</h2>
              <p className="text-xl text-muted-foreground">
                Trouvez l'accompagnement adapté à votre situation
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Sprint de Clarté</CardTitle>
                  <CardDescription>Idéal pour :</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>• Entrepreneurs et freelances</p>
                  <p>• Lancement d'un nouveau produit</p>
                  <p>• Optimisation d'une landing page</p>
                  <p>• Besoin d'un diagnostic rapide</p>
                  <p>• Budget limité (490 €)</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Formation Architecte</CardTitle>
                  <CardDescription>Idéal pour :</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>• Consultants et coachs</p>
                  <p>• Copywriters et marketeurs</p>
                  <p>• Dirigeants de PME</p>
                  <p>• Volonté de maîtriser la méthode</p>
                  <p>• Investissement dans la compétence</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Transformation</CardTitle>
                  <CardDescription>Idéal pour :</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>• Entreprises de 20+ employés</p>
                  <p>• Refonte complète de la communication</p>
                  <p>• Besoin d'accompagnement long terme</p>
                  <p>• Objectifs de croissance ambitieux</p>
                  <p>• Budget conséquent disponible</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Garanties */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Toutes nos offres incluent</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                    <Check className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-xl">Garantie Résultats</CardTitle>
                  <CardDescription className="text-base">
                    Satisfaction garantie ou remboursement intégral
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                    <Zap className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-xl">Méthodologie Éprouvée</CardTitle>
                  <CardDescription className="text-base">
                    310 pages de théorie documentée et testée
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                    <Rocket className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-xl">Résultats Mesurables</CardTitle>
                  <CardDescription className="text-base">
                    Projections KPI et suivi de performance inclus
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
              Prêt à transformer votre communication ?
            </h2>
            <p className="text-xl text-muted-foreground">
              Commencez par le Sprint de Clarté à 490 € (au lieu de 1 500 €)
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8">
                <Link href="/sprint">
                  <a>Réserver mon Sprint (490 €)</a>
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8">
                <Link href="/">
                  <a>Retour à l'accueil</a>
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
