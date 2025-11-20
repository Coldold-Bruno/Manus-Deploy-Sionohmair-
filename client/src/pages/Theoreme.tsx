import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowLeft, Lightbulb, Brain, Zap, Target } from "lucide-react";
import { Link } from "wouter";

export default function Theoreme() {
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
              Théorie Fondamentale
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Le Théorème de la Genèse de l'Insight
            </h1>
            <p className="text-2xl text-muted-foreground">
              La formule mathématique qui prédit le potentiel d'impact de toute idée
            </p>
          </div>
        </div>
      </section>

      {/* La Formule */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-8">
              <h2 className="text-4xl font-bold">La Formule</h2>
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-accent/20 rounded-2xl p-12">
                <div className="text-6xl md:text-7xl font-bold text-center mb-6">
                  <span className="text-accent">Hi</span> = <span className="text-primary">An</span> × <span className="text-primary">Pn</span> × <span className="text-primary">Tn</span> × <span className="text-primary">En</span>
                </div>
                <p className="text-xl text-center text-muted-foreground">
                  Le Potentiel d'Insight (Hi) est le produit de 4 variables exponentielles
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-accent/20">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <Target className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle className="text-3xl">An</CardTitle>
                  </div>
                  <CardTitle className="text-2xl mb-2">Ambition Amplifiée</CardTitle>
                  <CardDescription className="text-base">
                    La portée et l'audace de votre vision. Plus l'ambition est grande et claire, plus le potentiel d'insight est élevé.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-sm mb-1">Exemples :</p>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• An = 1.0 : Ambition floue ou générique</li>
                        <li>• An = 2.0 : Ambition claire et différenciante</li>
                        <li>• An = 3.0 : Ambition révolutionnaire et précise</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <Brain className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle className="text-3xl">Pn</CardTitle>
                  </div>
                  <CardTitle className="text-2xl mb-2">Profondeur</CardTitle>
                  <CardDescription className="text-base">
                    La richesse conceptuelle et la substance de votre idée. Une profondeur élevée crée de la crédibilité et de l'autorité.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-sm mb-1">Exemples :</p>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Pn = 1.0 : Idée superficielle ou banale</li>
                        <li>• Pn = 2.0 : Idée étayée par des preuves</li>
                        <li>• Pn = 3.0 : Idée systémique et documentée</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <Zap className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle className="text-3xl">Tn</CardTitle>
                  </div>
                  <CardTitle className="text-2xl mb-2">Tension Paradoxale</CardTitle>
                  <CardDescription className="text-base">
                    La capacité à synthétiser des opposés apparents. Les insights les plus puissants naissent de la résolution de paradoxes.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-sm mb-1">Exemples :</p>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Tn = 1.0 : Pas de tension, message linéaire</li>
                        <li>• Tn = 2.0 : Tension identifiée mais non résolue</li>
                        <li>• Tn = 3.0 : Synthèse paradoxale révélatrice</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <Lightbulb className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle className="text-3xl">En</CardTitle>
                  </div>
                  <CardTitle className="text-2xl mb-2">Élégance</CardTitle>
                  <CardDescription className="text-base">
                    La simplicité et la clarté de l'expression. Une idée complexe exprimée simplement a un potentiel d'insight maximal.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-sm mb-1">Exemples :</p>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• En = 0.5 : Expression confuse ou jargonneuse</li>
                        <li>• En = 1.0 : Expression claire et accessible</li>
                        <li>• En = 1.5 : Expression limpide et mémorable</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Exemples de Calcul */}
      <section className="py-20 bg-secondary/20">
        <div className="container">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Exemples de Calcul</h2>
              <p className="text-xl text-muted-foreground">
                Comment le Hi prédit le potentiel d'impact d'un message
              </p>
            </div>

            <div className="grid gap-6">
              <Card className="border-l-4 border-l-destructive">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge className="mb-2 bg-destructive/10 text-destructive">Hi = 6 (Faible)</Badge>
                      <CardTitle className="text-2xl mb-2">Message Générique</CardTitle>
                      <CardDescription className="text-base italic mb-4">
                        "Nous aidons les entreprises à améliorer leur communication."
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-background rounded-lg">
                      <p className="text-2xl font-bold text-destructive">An = 1.5</p>
                      <p className="text-xs text-muted-foreground">Ambition floue</p>
                    </div>
                    <div className="text-center p-3 bg-background rounded-lg">
                      <p className="text-2xl font-bold text-destructive">Pn = 1.0</p>
                      <p className="text-xs text-muted-foreground">Pas de preuve</p>
                    </div>
                    <div className="text-center p-3 bg-background rounded-lg">
                      <p className="text-2xl font-bold text-destructive">Tn = 1.0</p>
                      <p className="text-xs text-muted-foreground">Pas de tension</p>
                    </div>
                    <div className="text-center p-3 bg-background rounded-lg">
                      <p className="text-2xl font-bold text-destructive">En = 1.0</p>
                      <p className="text-xs text-muted-foreground">Expression banale</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Résultat :</strong> Message sans différenciation. Taux de conversion faible. Oublié immédiatement.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-amber-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge className="mb-2 bg-amber-500/10 text-amber-600">Hi = 36 (Moyen)</Badge>
                      <CardTitle className="text-2xl mb-2">Message Optimisé</CardTitle>
                      <CardDescription className="text-base italic mb-4">
                        "Éliminez les 3 frictions qui tuent vos conversions. Audit PFPMA en 7 jours."
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-background rounded-lg">
                      <p className="text-2xl font-bold text-amber-600">An = 2.0</p>
                      <p className="text-xs text-muted-foreground">Ambition claire</p>
                    </div>
                    <div className="text-center p-3 bg-background rounded-lg">
                      <p className="text-2xl font-bold text-amber-600">Pn = 2.0</p>
                      <p className="text-xs text-muted-foreground">Méthode nommée</p>
                    </div>
                    <div className="text-center p-3 bg-background rounded-lg">
                      <p className="text-2xl font-bold text-amber-600">Tn = 1.5</p>
                      <p className="text-xs text-muted-foreground">Tension identifiée</p>
                    </div>
                    <div className="text-center p-3 bg-background rounded-lg">
                      <p className="text-2xl font-bold text-amber-600">En = 1.5</p>
                      <p className="text-xs text-muted-foreground">Expression claire</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Résultat :</strong> Message différenciant. Taux de conversion correct. Mémorable à court terme.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-accent">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge className="mb-2 bg-accent/10 text-accent">Hi = 162 (Exceptionnel)</Badge>
                      <CardTitle className="text-2xl mb-2">Message Sionohmairique</CardTitle>
                      <CardDescription className="text-base italic mb-4">
                        "Transformez la communication d'un art subjectif en science de la performance. 
                        L'Ingénierie du Génie élimine la Dissipation Intellectuelle par le Théorème de la Genèse : Hi = An × Pn × Tn × En."
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-background rounded-lg">
                      <p className="text-2xl font-bold text-accent">An = 3.0</p>
                      <p className="text-xs text-muted-foreground">Révolution paradigmatique</p>
                    </div>
                    <div className="text-center p-3 bg-background rounded-lg">
                      <p className="text-2xl font-bold text-accent">Pn = 3.0</p>
                      <p className="text-xs text-muted-foreground">Système documenté</p>
                    </div>
                    <div className="text-center p-3 bg-background rounded-lg">
                      <p className="text-2xl font-bold text-accent">Tn = 3.0</p>
                      <p className="text-xs text-muted-foreground">Synthèse paradoxale</p>
                    </div>
                    <div className="text-center p-3 bg-background rounded-lg">
                      <p className="text-2xl font-bold text-accent">En = 1.5</p>
                      <p className="text-xs text-muted-foreground">Expression limpide</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Résultat :</strong> Message révolutionnaire. Taux de conversion exceptionnel. Mémorable à long terme. Crée une catégorie.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* La Loi de la Friction Élégante */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">La Loi de la Friction Élégante</h2>
              <p className="text-xl text-muted-foreground">
                Pourquoi l'Élégance (En) est le multiplicateur le plus puissant
              </p>
            </div>

            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle className="text-2xl">Le Paradoxe de la Complexité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base">
                <p>
                  Une idée peut avoir une Ambition élevée (An = 3.0), une Profondeur exceptionnelle (Pn = 3.0), 
                  et une Tension paradoxale puissante (Tn = 3.0), mais si elle est exprimée de manière confuse (En = 0.5), 
                  son potentiel d'Insight chute drastiquement :
                </p>
                <div className="bg-destructive/5 border-l-4 border-l-destructive p-4 rounded">
                  <p className="font-mono text-lg">
                    Hi = 3.0 × 3.0 × 3.0 × 0.5 = <strong className="text-destructive">13.5</strong>
                  </p>
                </div>
                <p>
                  En revanche, une idée avec des paramètres plus modestes mais une Élégance maximale (En = 1.5) 
                  peut surpasser la première :
                </p>
                <div className="bg-accent/5 border-l-4 border-l-accent p-4 rounded">
                  <p className="font-mono text-lg">
                    Hi = 2.0 × 2.0 × 2.0 × 1.5 = <strong className="text-accent">12.0</strong>
                  </p>
                </div>
                <p className="font-semibold text-accent">
                  Conclusion : L'Élégance n'est pas un luxe, c'est le multiplicateur critique qui transforme 
                  une idée brillante en Insight actionnable.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl font-bold">
              Calculez le Hi de votre message
            </h2>
            <p className="text-xl text-muted-foreground">
              Le Sprint de Clarté inclut le calcul complet du potentiel d'Insight de votre message
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
