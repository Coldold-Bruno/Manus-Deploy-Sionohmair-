import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowLeft, Crown, FileText, Award, TrendingUp, Target, Zap, Shield, BarChart3 } from "lucide-react";
import { Link } from "wouter";

export default function Niveau3() {
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
              Niveau 3 : Partenariat Stratégique
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Directeur de la Clarté + NFT Architecte
            </h1>
            <p className="text-2xl text-muted-foreground">
              Transformation complète de votre organisation avec accompagnement stratégique 12 mois
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <span className="text-5xl font-bold text-accent">50 000 €</span>
              <span className="text-xl text-muted-foreground">Sur devis personnalisé</span>
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
                Ce que vous recevez avec le Partenariat Stratégique
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-accent/20">
                <CardHeader>
                  <Target className="h-12 w-12 text-accent mb-4" />
                  <CardTitle className="text-2xl">Roadmap Clarté 12 mois</CardTitle>
                  <CardDescription className="text-base">T1 → T4 : Fondations, Diffusion, Optimisation, Pérennisation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>Plan stratégique complet pour transformer votre organisation en 4 trimestres.</p>
                  <p className="font-semibold">Structure de la roadmap :</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• <strong>T1 (mois 1-3) :</strong> Diagnostic complet + Formation équipe (20 personnes) + KPIs</li>
                    <li>• <strong>T2 (mois 4-6) :</strong> Refonte supports + Code PFPMA + Optimisation tunnels</li>
                    <li>• <strong>T3 (mois 7-9) :</strong> Analyse fractale + A/B testing + Dashboards temps réel</li>
                    <li>• <strong>T4 (mois 10-12) :</strong> Ancrage culture + Certification + Éligibilité NFT</li>
                  </ul>
                  <p className="text-xs italic pt-2">La roadmap suit une logique inductive : fondations → diffusion → optimisation → pérennisation.</p>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <FileText className="h-12 w-12 text-accent mb-4" />
                  <CardTitle className="text-2xl">Playbook de Clarté</CardTitle>
                  <CardDescription className="text-base">Document stratégique personnalisé</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>Manuel complet de la méthodologie Sionohmair adaptée à votre organisation.</p>
                  <p className="font-semibold">Contenu du Playbook :</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Carte PFPMA de votre système complet</li>
                    <li>• Bibliothèque de vos Artefacts de Clarté</li>
                    <li>• Processus de validation interne (checklist)</li>
                    <li>• KPIs de Clarté personnalisés</li>
                    <li>• Templates et exemples concrets</li>
                    <li>• Guide de formation pour nouveaux collaborateurs</li>
                  </ul>
                  <p className="text-xs italic pt-2">Le Playbook devient le référentiel interne de votre organisation pour maintenir la clarté à long terme.</p>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <Award className="h-12 w-12 text-accent mb-4" />
                  <CardTitle className="text-2xl">NFT "Architecte de la Clarté"</CardTitle>
                  <CardDescription className="text-base">Statut + utilité blockchain</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>Certification blockchain de votre maîtrise de la méthodologie Sionohmair.</p>
                  <p className="font-semibold">Ce que le NFT prouve :</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Maîtrise complète de la méthodologie</li>
                    <li>• Capacité à diagnostiquer les 3 frictions</li>
                    <li>• Résultats mesurables sur 5+ projets clients</li>
                  </ul>
                  <p className="font-semibold pt-2">Ce à quoi il donne accès :</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Communauté privée des Architectes certifiés</li>
                    <li>• Accès prioritaire aux nouvelles formations</li>
                    <li>• Licence d'utilisation commerciale</li>
                    <li>• Support technique illimité</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <BarChart3 className="h-12 w-12 text-accent mb-4" />
                  <CardTitle className="text-2xl">Dashboards récurrents</CardTitle>
                  <CardDescription className="text-base">Synthèses de décision en moins de 60 secondes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>Tableaux de bord de Clarté avec KPIs mesurables en temps réel.</p>
                  <p className="font-semibold">KPI principaux affichés :</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• <strong>Score de Clarté moyen :</strong> /20 (évolution mensuelle)</li>
                    <li>• <strong>Taux de compréhension :</strong> % qui comprend en moins de 5 secondes</li>
                    <li>• <strong>Taux d&apos;adoption :</strong> % qui passe à l&apos;action</li>
                    <li>• <strong>Taux de conversion :</strong> % qui achète/s&apos;engage</li>
                  </ul>
                  <p className="font-semibold pt-2">Comment lire en 60 secondes :</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>1. Vue d&apos;ensemble : Score global + tendance (hausse ou baisse)</li>
                    <li>2. Signaux d'alerte : Frictions détectées (rouge/orange)</li>
                    <li>3. Actions prioritaires : Top 3 des leviers</li>
                    <li>4. Projections : Impact estimé des actions</li>
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
                Les outils que nous utilisons pour garantir la qualité du Partenariat Stratégique
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="text-2xl">Formulaire de rapport N3</CardTitle>
                  <CardDescription>Partenariat stratégique structuré</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>Grille d'analyse complète pour le suivi du partenariat 12 mois.</p>
                  <p className="font-semibold">Sections :</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Informations générales (client, secteur, durée, date)</li>
                    <li>• Objectifs stratégiques de clarté (3 max)</li>
                    <li>• KPIs de Clarté suivis (4 principaux + sources)</li>
                    <li>• Éligibilité au NFT "Architecte de la Clarté" (critères)</li>
                    <li>• Rituels & Points de contact (comités, revues, workshops)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="text-2xl">Playbook interne "Directeur de la Clarté"</CardTitle>
                  <CardDescription>Guide pour l'expert Sionohmair</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>Manuel opérationnel pour piloter un partenariat stratégique.</p>
                  <p className="font-semibold">Contenu du Playbook interne :</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Cadrage initial (diagnostic + objectifs)</li>
                    <li>• Rituels mensuels (comités de pilotage)</li>
                    <li>• Livrables trimestriels (T1 → T4)</li>
                    <li>• Critères d'éligibilité au NFT</li>
                    <li>• Gestion des signaux de friction</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="text-2xl">Grille d'éligibilité au NFT</CardTitle>
                  <CardDescription>"Architecte de la Clarté"</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>Critères objectifs pour obtenir la certification blockchain.</p>
                  <p className="font-semibold">Critères d'éligibilité :</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>✓ Roadmap 12 mois structurée en 4 temps (T1→T4)</li>
                    <li>✓ KPIs de Clarté mesurés réellement (compréhension, adoption, conversion)</li>
                    <li>✓ Critères d'obtention du NFT clairs, mesurables, réalistes</li>
                    <li>✓ Dashboards lisibles en moins de 60 secondes</li>
                    <li>✓ Résultats mesurables sur au moins 5 projets</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="text-2xl">Templates de dashboards et KPIs</CardTitle>
                  <CardDescription>Modèles personnalisables</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>Bibliothèque de templates pour créer les dashboards clients.</p>
                  <p className="font-semibold">Templates disponibles :</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Dashboard Score de Clarté /20 (évolution)</li>
                    <li>• Dashboard Taux de compréhension (moins de 5 sec)</li>
                    <li>• Dashboard Taux d'adoption (passage à l'action)</li>
                    <li>• Dashboard Taux de conversion (achat/engagement)</li>
                    <li>• Dashboard Signaux de friction (alertes)</li>
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
                Comment savoir si votre Partenariat Stratégique est réussi
              </p>
            </div>

            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle className="text-2xl">Les 4 critères de validation</CardTitle>
                <CardDescription>Tous ces critères doivent être remplis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    title: "Roadmap 12 mois suit la logique : fondations → diffusion → optimisation → pérennisation",
                    description: "Les 4 trimestres sont séquencés de manière inductive. On ne diffuse pas avant d'avoir posé les fondations. On n'optimise pas avant d'avoir diffusé. On ne pérennise pas avant d'avoir optimisé. Logique respectée."
                  },
                  {
                    title: "Les KPIs choisis mesurent réellement la clarté (compréhension, adoption, conversion)",
                    description: "Pas de vanity metrics. Les KPIs mesurent la clarté réelle : % qui comprend en < 5 secondes, % qui passe à l'action, % qui achète. Pas juste des vues ou des likes."
                  },
                  {
                    title: "Les critères d'obtention du NFT sont clairs, mesurables et réalistes",
                    description: "Pas de critères flous ou subjectifs. Chaque critère est mesurable (ex : 5 projets minimum, Score de Clarté > 15/20, Taux de conversion > +50%). Réaliste et atteignable."
                  },
                  {
                    title: "Les dashboards sont lisibles en moins de 60 secondes par un décideur",
                    description: "Un CEO doit pouvoir ouvrir le dashboard et comprendre la situation en moins d'une minute : score global, tendance, signaux d'alerte, actions prioritaires. Pas de complexité inutile."
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
              <h2 className="text-4xl font-bold">Bloc Recommandation IA – Niveau 3</h2>
              <p className="text-xl text-muted-foreground">
                Analyse augmentée par intelligence artificielle pour piloter le partenariat
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-accent/20">
                <CardHeader>
                  <Target className="h-10 w-10 text-accent mb-4" />
                  <CardTitle className="text-xl">Récit de la roadmap en 4 actes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="font-semibold">Structure narrative :</p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li><strong>Acte 1 :</strong> Prendre conscience (diagnostic)</li>
                    <li><strong>Acte 2 :</strong> Transformer (refonte)</li>
                    <li><strong>Acte 3 :</strong> Mesurer (optimisation)</li>
                    <li><strong>Acte 4 :</strong> Ancrer (pérennisation)</li>
                  </ul>
                  <p className="text-xs italic">L'IA génère une narrative cohérente pour présenter la transformation 12 mois au client.</p>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <Award className="h-10 w-10 text-accent mb-4" />
                  <CardTitle className="text-xl">Argumentaire simple du NFT</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="font-semibold">3 dimensions du NFT :</p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li><strong>Preuve :</strong> Ce que le NFT prouve (maîtrise, résultats)</li>
                    <li><strong>Statut :</strong> Ce à quoi il donne accès (communauté, formations)</li>
                    <li><strong>Utilité :</strong> Avantage compétitif concret (différenciation, crédibilité)</li>
                  </ul>
                  <p className="text-xs italic">L'IA structure l'argumentaire pour maximiser la désirabilité du NFT.</p>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <Shield className="h-10 w-10 text-accent mb-4" />
                  <CardTitle className="text-xl">3 signaux de friction + actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="font-semibold">Surveillance proactive :</p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li><strong>Signal 1 :</strong> Baisse du taux de compréhension → Action corrective</li>
                    <li><strong>Signal 2 :</strong> Stagnation du taux d'adoption → Action corrective</li>
                    <li><strong>Signal 3 :</strong> Chute du taux de conversion → Action corrective</li>
                  </ul>
                  <p className="text-xs italic">L'IA détecte les signaux faibles et propose des actions avant que le problème ne s'aggrave.</p>
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
              Prêt à transformer votre organisation ?
            </h2>
            <p className="text-xl text-muted-foreground">
              Partenariat Stratégique 12 mois avec Directeur de la Clarté dédié
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8">
                Demander un Devis Personnalisé
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8">
                <Link href="/services">
                  <a>Comparer les 3 Niveaux</a>
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Accompagnement 12 mois • Formation équipe (20 personnes) • NFT Architecte inclus • Support illimité
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
