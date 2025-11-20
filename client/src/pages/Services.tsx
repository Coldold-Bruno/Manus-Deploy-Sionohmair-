import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, ArrowLeft, Zap, Rocket, Crown, FileText, Target, TrendingUp, Award } from "lucide-react";
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
              Les 3 Niveaux de Service
            </h1>
            <p className="text-2xl text-muted-foreground">
              De l'audit ponctuel au partenariat stratégique : choisissez votre niveau de transformation
            </p>
          </div>
        </div>
      </section>

      {/* Les 3 Niveaux */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            {/* Niveau 1 : Diagnostic de Clarté */}
            <Card className="border-accent/20 relative">
              <div className="absolute top-4 right-4">
                <Badge className="bg-accent/10 text-accent hover:bg-accent/20">
                  Offre de Lancement -67%
                </Badge>
              </div>
              <CardHeader className="text-center pb-8 pt-12">
                <div className="mx-auto h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <Zap className="h-8 w-8 text-accent" />
                </div>
                <Badge className="mb-2 bg-primary/10 text-primary">Niveau 1</Badge>
                <CardTitle className="text-3xl mb-2">Diagnostic de Clarté</CardTitle>
                <CardDescription className="text-base mb-4">
                  Sprint de Clarté en 7 jours
                </CardDescription>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-accent">490 €</div>
                  <div className="text-sm text-muted-foreground line-through">1 500 €</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <p className="font-semibold text-sm">Artefacts livrés (usage client) :</p>
                  <ul className="space-y-2">
                    {[
                      "Rapport Sprint de Clarté (1-3 pages)",
                      "Synthèse exécutive (1 page décision)",
                      "Recommandation actionnable unique",
                      "Score de Clarté /20 (PFPMA)",
                      "Identification des 3 frictions",
                      "Plan d'action 1-3 actions prioritaires"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-2 pt-4 border-t">
                  <p className="font-semibold text-sm">Critères de réussite :</p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>• Problème formulé en 2-3 phrases</li>
                    <li>• Frictions nommées et illustrées</li>
                    <li>• Axe de Clarté = titre/pitch</li>
                    <li>• Actions ordonnées par impact</li>
                  </ul>
                </div>

                <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="/sprint">
                    <a>Réserver mon Sprint</a>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Niveau 2 : Architecture de l'Insight */}
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
                <Badge className="mb-2 bg-primary/10 text-primary">Niveau 2</Badge>
                <CardTitle className="text-3xl mb-2">Architecture de l'Insight</CardTitle>
                <CardDescription className="text-base mb-4">
                  5 Artefacts de Clarté + Formation 6 mois
                </CardDescription>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-accent">10 000 €</div>
                  <div className="text-sm text-muted-foreground">ou 3 × 3 500 €</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <p className="font-semibold text-sm">Artefacts livrés (usage client) :</p>
                  <ul className="space-y-2">
                    {[
                      "Message AVANT / APRÈS (point de bascule)",
                      "5 Artefacts de Clarté (landing, emails, pitch)",
                      "Carte PFPMA du système expliquée",
                      "Roadmap d'implémentation (Étapes 1→5)",
                      "Bibliothèque des Artefacts possibles",
                      "Séquence inductive des recommandations"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-2 pt-4 border-t">
                  <p className="font-semibold text-sm">Critères de réussite :</p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>• Message APRÈS lisible en &lt; 5 secondes</li>
                    <li>• 5 Artefacts = même Axe de Clarté</li>
                    <li>• Carte PFPMA cohérente (1 Problème)</li>
                    <li>• Séquence Étapes 1→5 inductive</li>
                  </ul>
                </div>

                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  Candidater au Niveau 2
                </Button>
              </CardContent>
            </Card>

            {/* Niveau 3 : Partenariat Stratégique */}
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
                <Badge className="mb-2 bg-primary/10 text-primary">Niveau 3</Badge>
                <CardTitle className="text-3xl mb-2">Partenariat Stratégique</CardTitle>
                <CardDescription className="text-base mb-4">
                  Directeur de la Clarté + NFT Architecte
                </CardDescription>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-accent">50 000 €</div>
                  <div className="text-sm text-muted-foreground">Sur devis personnalisé</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <p className="font-semibold text-sm">Artefacts livrés (usage client) :</p>
                  <ul className="space-y-2">
                    {[
                      "Roadmap Clarté 12 mois (T1→T4)",
                      "Playbook de Clarté (document stratégique)",
                      "NFT \"Architecte de la Clarté\" (statut + utilité)",
                      "Dashboards récurrents (KPIs de Clarté)",
                      "Synthèses de décision (< 60 secondes)",
                      "Support dédié illimité 12 mois"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-2 pt-4 border-t">
                  <p className="font-semibold text-sm">Critères de réussite :</p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>• Roadmap : fondations→diffusion→optimisation→pérennisation</li>
                    <li>• KPIs mesurent la clarté réelle</li>
                    <li>• Critères NFT clairs et mesurables</li>
                    <li>• Dashboards lisibles en 60 secondes</li>
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

      {/* Roadmap 12 mois (Niveau 3) */}
      <section className="py-20 bg-secondary/20">
        <div className="container">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <Badge className="bg-primary/10 text-primary">Niveau 3 : Partenariat Stratégique</Badge>
              <h2 className="text-4xl font-bold">Roadmap Clarté 12 mois</h2>
              <p className="text-xl text-muted-foreground">
                Transformation complète en 4 temps : Fondations → Diffusion → Optimisation → Pérennisation
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-l-4 border-l-accent">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <Target className="h-5 w-5 text-accent" />
                    </div>
                    <Badge className="bg-accent/10 text-accent">T1</Badge>
                  </div>
                  <CardTitle className="text-2xl">Fondations (mois 1-3)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>• Diagnostic complet de l'organisation</p>
                  <p>• Formation de l'équipe (jusqu'à 20 personnes)</p>
                  <p>• Mise en place des KPIs de Clarté</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-accent">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-accent" />
                    </div>
                    <Badge className="bg-accent/10 text-accent">T2</Badge>
                  </div>
                  <CardTitle className="text-2xl">Diffusion (mois 4-6)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>• Refonte de tous les supports de communication</p>
                  <p>• Implémentation du Code PFPMA</p>
                  <p>• Optimisation des tunnels de conversion</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-accent">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-accent" />
                    </div>
                    <Badge className="bg-accent/10 text-accent">T3</Badge>
                  </div>
                  <CardTitle className="text-2xl">Optimisation (mois 7-9)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>• Analyse fractale de tous les messages</p>
                  <p>• A/B testing et itérations</p>
                  <p>• Dashboards de performance en temps réel</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-accent">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <Award className="h-5 w-5 text-accent" />
                    </div>
                    <Badge className="bg-accent/10 text-accent">T4</Badge>
                  </div>
                  <CardTitle className="text-2xl">Pérennisation (mois 10-12)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>• Ancrage dans la culture d'entreprise</p>
                  <p>• Certification interne des équipes</p>
                  <p>• Éligibilité au NFT "Architecte de la Clarté"</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* NFT Architecte de la Clarté */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <Badge className="bg-primary/10 text-primary">Niveau 3 : Partenariat Stratégique</Badge>
              <h2 className="text-4xl font-bold">NFT "Architecte de la Clarté"</h2>
              <p className="text-xl text-muted-foreground">
                Certification blockchain de votre maîtrise de la méthodologie Sionohmair
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-xl">Ce que ce NFT prouve</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>• Maîtrise complète de la méthodologie</p>
                  <p>• Capacité à diagnostiquer les 3 frictions</p>
                  <p>• Résultats mesurables sur 5+ projets</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                    <Award className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-xl">Ce à quoi il donne accès</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>• Communauté privée des Architectes</p>
                  <p>• Accès prioritaire aux formations</p>
                  <p>• Licence d'utilisation commerciale</p>
                  <p>• Support technique illimité</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                    <Crown className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-xl">Avantage compétitif</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>• Différenciation immédiate</p>
                  <p>• Crédibilité renforcée</p>
                  <p>• Réseau d'experts de haut niveau</p>
                  <p>• Reconnaissance officielle</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Comparatif des 3 Niveaux */}
      <section className="py-20 bg-secondary/20">
        <div className="container">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Quel niveau choisir ?</h2>
              <p className="text-xl text-muted-foreground">
                Trouvez l'accompagnement adapté à votre situation
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <Badge className="mb-2 bg-accent/10 text-accent">Niveau 1</Badge>
                  <CardTitle className="text-xl">Diagnostic de Clarté</CardTitle>
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
                  <Badge className="mb-2 bg-accent/10 text-accent">Niveau 2</Badge>
                  <CardTitle className="text-xl">Architecture de l'Insight</CardTitle>
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
                  <Badge className="mb-2 bg-accent/10 text-accent">Niveau 3</Badge>
                  <CardTitle className="text-xl">Partenariat Stratégique</CardTitle>
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

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl font-bold">
              Prêt à transformer votre communication ?
            </h2>
            <p className="text-xl text-muted-foreground">
              Commencez par le Niveau 1 à 490 € (au lieu de 1 500 €)
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
