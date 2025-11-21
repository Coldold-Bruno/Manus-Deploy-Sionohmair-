import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowLeft, Rocket, FileText, CheckCircle, Target, TrendingUp, Layers, Map } from "lucide-react";
import { Link } from "wouter";

export default function Niveau2() {
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
              Niveau 2 : Architecture de l'Insight
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              5 Artefacts de Clarté + Formation
            </h1>
            <p className="text-2xl text-muted-foreground">
              Transformez votre communication complète avec 5 artefacts optimisés et une formation de 6 mois
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <span className="text-5xl font-bold text-accent">10 000 €</span>
              <span className="text-xl text-muted-foreground">ou 3 × 3 500 €</span>
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
                Ce que vous recevez avec l'Architecture de l'Insight
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-accent/20">
                <CardHeader>
                  <TrendingUp className="h-12 w-12 text-accent mb-4" />
                  <CardTitle className="text-2xl">Message AVANT / APRÈS</CardTitle>
                  <CardDescription className="text-base">Avec point de bascule identifié</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>Transformation narrative de votre message selon la méthodologie PFPMA.</p>
                  <p className="font-semibold">Contenu :</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• <strong>Message AVANT :</strong> Analyse de la situation actuelle (frictions)</li>
                    <li>• <strong>Point de bascule :</strong> L'insight clé qui change tout</li>
                    <li>• <strong>Message APRÈS :</strong> Version optimisée (clarté maximale)</li>
                    <li>• <strong>Impact estimé :</strong> Projections KPI (CTR, conversion, engagement)</li>
                  </ul>
                  <p className="text-xs italic pt-2">Le message APRÈS est lisible en moins de 5 secondes et orienté résultat immédiat.</p>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <Layers className="h-12 w-12 text-accent mb-4" />
                  <CardTitle className="text-2xl">5 Artefacts de Clarté</CardTitle>
                  <CardDescription className="text-base">Landing, emails, pitch, etc.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>Ensemble cohérent de 5 artefacts incarnant le même Axe de Clarté.</p>
                  <p className="font-semibold">Exemples d'artefacts :</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Landing page optimisée (hero + CTA)</li>
                    <li>• Séquence email (3-5 emails)</li>
                    <li>• Pitch deck (présentation 10 slides)</li>
                    <li>• Page de vente (sales page longue)</li>
                    <li>• Publicités (Facebook, LinkedIn, Google)</li>
                  </ul>
                  <p className="text-xs italic pt-2">Chaque artefact a un objectif unique et un CTA principal clairement défini.</p>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <Map className="h-12 w-12 text-accent mb-4" />
                  <CardTitle className="text-2xl">Carte PFPMA du système</CardTitle>
                  <CardDescription className="text-base">Expliquée au client</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>Visualisation complète de votre architecture de clarté selon le Code PFPMA.</p>
                  <p className="font-semibold">Éléments de la carte :</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• <strong>P</strong> - Problème central unique (cohérence)</li>
                    <li>• <strong>F</strong> - Formule mémorable (différenciation)</li>
                    <li>• <strong>P</strong> - Preuves crédibles (chiffres, témoignages)</li>
                    <li>• <strong>M</strong> - Méthode simple (3 étapes maximum)</li>
                    <li>• <strong>A</strong> - Appel à friction zéro (CTA clair)</li>
                  </ul>
                  <p className="text-xs italic pt-2">La carte garantit que tous vos artefacts parlent le même langage et poursuivent le même objectif.</p>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <Target className="h-12 w-12 text-accent mb-4" />
                  <CardTitle className="text-2xl">Roadmap d'implémentation</CardTitle>
                  <CardDescription className="text-base">Étapes 1 → 5 séquencées</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>Plan d'action détaillé pour déployer vos 5 Artefacts de Clarté.</p>
                  <p className="font-semibold">Structure de la roadmap :</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• <strong>Étape 1 :</strong> Fondations (message central + positionnement)</li>
                    <li>• <strong>Étape 2 :</strong> Diffusion (landing page + emails)</li>
                    <li>• <strong>Étape 3 :</strong> Amplification (publicités + réseaux sociaux)</li>
                    <li>• <strong>Étape 4 :</strong> Conversion (page de vente + tunnel)</li>
                    <li>• <strong>Étape 5 :</strong> Optimisation (A/B testing + itérations)</li>
                  </ul>
                  <p className="text-xs italic pt-2">La séquence respecte une logique inductive : fondations avant amplification.</p>
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
                Les outils que nous utilisons pour garantir la qualité de l'Architecture de l'Insight
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="text-2xl">Formulaire de rapport N2</CardTitle>
                  <CardDescription>Architecture de l'Insight structurée</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>Grille d'analyse complète pour garantir la cohérence des 5 Artefacts.</p>
                  <p className="font-semibold">Sections :</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Message central AVANT (situation actuelle)</li>
                    <li>• Point de bascule identifié (insight clé)</li>
                    <li>• Message central APRÈS (transformation)</li>
                    <li>• Liste des 5 Artefacts de Clarté choisis</li>
                    <li>• Carte PFPMA du système (cohérence)</li>
                    <li>• Séquence des Étapes 1 → 5 (roadmap)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="text-2xl">Bibliothèque des 5 Artefacts</CardTitle>
                  <CardDescription>Artefacts de Clarté possibles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>Catalogue complet des artefacts disponibles avec critères de sélection.</p>
                  <p className="font-semibold">Catégories d'artefacts :</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• <strong>Web :</strong> Landing page, page de vente, site vitrine</li>
                    <li>• <strong>Email :</strong> Séquence nurturing, newsletter, campagne</li>
                    <li>• <strong>Pitch :</strong> Deck investisseurs, présentation commerciale</li>
                    <li>• <strong>Publicité :</strong> Facebook Ads, LinkedIn Ads, Google Ads</li>
                    <li>• <strong>Contenu :</strong> Articles de blog, vidéos, podcasts</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="text-2xl">Carte PFPMA du système</CardTitle>
                  <CardDescription>Problème, Formule, Preuve, Méthode, Appel</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>Visualisation de la cohérence entre tous les artefacts.</p>
                  <p className="font-semibold">Validation de cohérence :</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>✓ Un seul Problème central pour tous les artefacts</li>
                    <li>✓ La même Formule (Axe de Clarté) partout</li>
                    <li>✓ Preuves adaptées à chaque canal</li>
                    <li>✓ Méthode simplifiée (3 étapes max)</li>
                    <li>✓ CTA unique par artefact (pas de confusion)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="text-2xl">Séquence des recommandations</CardTitle>
                  <CardDescription>Étapes 1 → 5 inductives</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>Ordre logique de déploiement des artefacts pour maximiser l'impact.</p>
                  <p className="font-semibold">Principes de séquençage :</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Fondations avant amplification</li>
                    <li>• Message central avant artefacts spécifiques</li>
                    <li>• Test avant scale (A/B testing)</li>
                    <li>• Mesure continue (KPIs de Clarté)</li>
                    <li>• Itération basée sur les données</li>
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
                Comment savoir si votre Architecture de l'Insight est réussie
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
                    title: "Message APRÈS plus spécifique et orienté résultat",
                    description: "Le message transformé est lisible en moins de 5 secondes, orienté vers un résultat concret, et élimine toute ambiguïté."
                  },
                  {
                    title: "Chaque Artefact a un objectif et un CTA uniques",
                    description: "Pas de confusion : chaque artefact poursuit un objectif clair (notoriété, conversion, engagement) avec un seul appel à l'action principal."
                  },
                  {
                    title: "Les 5 Artefacts incarnent le même Axe de Clarté",
                    description: "Cohérence totale : tous les artefacts utilisent la même Formule (message central) et poursuivent le même Problème. Pas de dissonance."
                  },
                  {
                    title: "La Carte PFPMA est cohérente (un seul Problème central)",
                    description: "Tous les artefacts partent du même Problème central. Pas de multiplication des messages qui diluerait la clarté."
                  },
                  {
                    title: "La séquence Étapes 1→5 respecte la logique inductive",
                    description: "Fondations avant amplification. On ne scale pas avant d'avoir testé. On ne teste pas avant d'avoir posé les bases. Ordre logique respecté."
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
              <h2 className="text-4xl font-bold">Bloc Recommandation IA – Niveau 2</h2>
              <p className="text-xl text-muted-foreground">
                Analyse augmentée par intelligence artificielle pour maximiser la cohérence
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-accent/20">
                <CardHeader>
                  <TrendingUp className="h-10 w-10 text-accent mb-4" />
                  <CardTitle className="text-xl">Micro-story AVANT / APRÈS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="font-semibold">Structure selon PFPMA :</p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li><strong>AVANT :</strong> Problème + Frictions identifiées</li>
                    <li><strong>Point de bascule :</strong> Insight clé découvert</li>
                    <li><strong>APRÈS :</strong> Formule + Preuve + Méthode + Appel</li>
                  </ul>
                  <p className="text-xs italic">L'IA génère une narrative cohérente pour présenter la transformation au client.</p>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <CheckCircle className="h-10 w-10 text-accent mb-4" />
                  <CardTitle className="text-xl">Vérification de cohérence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="font-semibold">Validation automatique :</p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>✓ Même Problème dans les 5 Artefacts</li>
                    <li>✓ Même Promesse (Formule) partout</li>
                    <li>✓ CTA unique par artefact (pas de confusion)</li>
                  </ul>
                  <p className="text-xs italic">L'IA détecte les incohérences avant livraison au client.</p>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <Target className="h-10 w-10 text-accent mb-4" />
                  <CardTitle className="text-xl">Matrice Effort / Impact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="font-semibold">Priorisation des Étapes 1→5 :</p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li><strong>Quick wins :</strong> Impact élevé, effort faible</li>
                    <li><strong>Projets majeurs :</strong> Impact élevé, effort élevé</li>
                    <li><strong>À éviter :</strong> Impact faible, effort élevé</li>
                  </ul>
                  <p className="text-xs italic">L'IA classe les actions par ROI estimé pour maximiser l'efficacité.</p>
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
              Prêt à construire votre Architecture de l'Insight ?
            </h2>
            <p className="text-xl text-muted-foreground">
              Transformez votre communication complète avec 5 Artefacts de Clarté cohérents
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8">
                Candidater au Niveau 2 (10 000 €)
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8">
                <Link href="/services">
                  <a>Comparer les 3 Niveaux</a>
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Paiement en 3 fois possible (3 × 3 500 €) • Formation de 6 mois incluse • Suivi personnalisé
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
