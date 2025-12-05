import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowLeft, TrendingUp, Zap, Target, Award, BarChart3, Lightbulb } from "lucide-react";
import { Link } from "wouter";
import { APP_LOGO } from "@/const";

export default function LoiClarte() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-background/95 bg-background/98 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <a className="flex items-center space-x-3">
              <img src={APP_LOGO} alt="Sionohmair Insight Academy" className="h-12 w-auto" />
              <span className="font-bold text-xl hidden md:inline">Sionohmair Insight Academy</span>
            </a>
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/">
              <a className="text-sm font-medium hover:text-accent transition-colors flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour à l'accueil
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
              La Science de la Clarté
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              La Loi de la Clarté
            </h1>
            <p className="text-2xl text-muted-foreground">
              Pourquoi votre gain n'est pas 15% mais 340%
            </p>
            
            {/* Formule Principale */}
            <div className="mt-8 p-8 bg-accent/10 border-2 border-accent/30 rounded-2xl">
              <p className="text-4xl font-bold text-accent mb-4">
                α = 22.67
              </p>
              <p className="text-2xl font-semibold mb-2">
                340% = 15% × 22.67
              </p>
              <p className="text-lg text-muted-foreground">
                Le <strong>Facteur d'Amplification d'Insight</strong> transforme un gain linéaire en gain exponentiel
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Explication */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Le Problème : La Dissipation Intellectuelle</h2>
              <p className="text-xl text-muted-foreground">
                Vous n'êtes pas le problème. C'est la friction invisible qui bloque votre génie.
              </p>
            </div>

            <Card className="border-accent/20">
              <CardHeader>
                <Lightbulb className="h-12 w-12 text-accent mb-4" />
                <CardTitle className="text-2xl">L'Assertion Scientifique</CardTitle>
                <CardDescription>La vérité douloureuse sur la communication</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-base">
                <p>
                  <strong>90% des idées brillantes meurent dans la confusion.</strong> Pas par manque de valeur, 
                  mais par manque de clarté. La <strong className="text-accent">Dissipation Intellectuelle</strong> (DI) 
                  est la friction invisible qui détruit vos conversions, vos ventes, et votre impact.
                </p>
                <p>
                  Cette friction est <strong>entièrement mesurable</strong> grâce au Score PFPMA (0-20 points). 
                  Chaque point perdu représente du <strong className="text-accent">Joule Informatique</strong> gaspillé 
                  — l'énergie cognitive que votre audience dépense à essayer de comprendre votre message.
                </p>
                <p className="text-lg font-semibold text-accent pt-4">
                  🎯 La révélation : Vous n'êtes pas le problème. C'est la friction qui bloque votre génie.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section Facteur Alpha */}
      <section className="py-20 bg-secondary/20">
        <div className="container">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Le Facteur Alpha (α = 22.67)</h2>
              <p className="text-xl text-muted-foreground">
                La constante qui transforme votre communication en science de la performance
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-accent/20">
                <CardHeader>
                  <Target className="h-12 w-12 text-accent mb-4" />
                  <CardTitle className="text-2xl">Gain Linéaire</CardTitle>
                  <CardDescription>Correction standard</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-4xl font-bold text-muted-foreground">15%</p>
                  <p className="text-sm">
                    Lorsque vous corrigez 3 points de friction PFPMA, la théorie classique prédit un gain de 15%.
                  </p>
                  <p className="text-xs text-muted-foreground italic">
                    C'est le gain attendu selon les modèles traditionnels de conversion.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-accent/20 bg-accent/5">
                <CardHeader>
                  <Zap className="h-12 w-12 text-accent mb-4" />
                  <CardTitle className="text-2xl">Facteur Alpha</CardTitle>
                  <CardDescription>Multiplicateur Sionohmair</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-4xl font-bold text-accent">× 22.67</p>
                  <p className="text-sm">
                    Le Facteur d'Amplification d'Insight est calculé à partir de 50+ clients ayant complété le Sprint de Clarté.
                  </p>
                  <p className="text-xs text-muted-foreground italic">
                    α = Moyenne(Gain Réel / Gain Théorique) = 22.67
                  </p>
                </CardContent>
              </Card>

              <Card className="border-accent/20 bg-accent/10">
                <CardHeader>
                  <TrendingUp className="h-12 w-12 text-accent mb-4" />
                  <CardTitle className="text-2xl">Gain Réel</CardTitle>
                  <CardDescription>Impact mesuré</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-4xl font-bold text-accent">340%</p>
                  <p className="text-sm">
                    Le gain réel observé chez les clients après correction des frictions avec la méthodologie Sionohmair.
                  </p>
                  <p className="text-xs text-muted-foreground italic">
                    340% = 15% × 22.67 (Loi de la Clarté)
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Section TVA NI */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Le TVA NI : Taux de Valeur Ajoutée Non-Intuitive</h2>
              <p className="text-xl text-muted-foreground">
                La métrique qui prouve que votre génie était simplement enfermé
              </p>
            </div>

            <Card className="border-accent/20">
              <CardHeader>
                <Award className="h-12 w-12 text-accent mb-4" />
                <CardTitle className="text-2xl">Qu'est-ce que le TVA NI ?</CardTitle>
                <CardDescription>La preuve que vous n'êtes pas le problème</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-base">
                <p>
                  Le <strong className="text-accent">TVA NI</strong> est la différence entre ce que vous pensiez gagner (15%) 
                  et ce que vous gagnez réellement (340%) après avoir éliminé les frictions.
                </p>
                <p>
                  Cette métrique révèle une vérité fondamentale : <strong>votre idée était brillante dès le départ</strong>. 
                  Ce n'était pas un problème de qualité, mais un problème de <strong className="text-accent">Dissipation Intellectuelle</strong>.
                </p>
                <div className="p-6 bg-accent/10 border border-accent/20 rounded-xl mt-6">
                  <p className="text-xl font-bold text-accent mb-2">
                    TVA NI = Gain Réel - Gain Attendu
                  </p>
                  <p className="text-lg">
                    TVA NI = 340% - 15% = <strong className="text-accent">325%</strong>
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    C'est le <strong>potentiel caché</strong> qui était bloqué par les frictions cognitives.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section Joule Informatique */}
      <section className="py-20 bg-secondary/20">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Le Joule Informatique</h2>
              <p className="text-xl text-muted-foreground">
                L'analogie scientifique qui rend la clarté mesurable
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="text-xl">Informatique Physique</CardTitle>
                  <CardDescription>Efficacité énergétique</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p><strong>Joule :</strong> Unité d'énergie consommée</p>
                  <p><strong>Dissipation Thermique :</strong> Chaleur perdue</p>
                  <p><strong>Loi de Koomey :</strong> Efficacité double tous les 1,57 ans</p>
                  <p><strong>Refroidissement Liquide :</strong> Optimisation hardware</p>
                </CardContent>
              </Card>

              <Card className="border-accent/20 bg-accent/5">
                <CardHeader>
                  <CardTitle className="text-xl">Informatique Cognitive</CardTitle>
                  <CardDescription>Efficacité de la clarté</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p><strong>Joule Informatique :</strong> Énergie cognitive gaspillée</p>
                  <p><strong>Dissipation Intellectuelle :</strong> Clarté perdue</p>
                  <p><strong>Loi de la Clarté :</strong> Efficacité × 22.67 avec α</p>
                  <p><strong>Correction PFPMA :</strong> Optimisation message</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-accent/20">
              <CardContent className="pt-6 text-base">
                <p>
                  Tout comme un processeur gaspille de l'énergie en chaleur (dissipation thermique), 
                  un message confus gaspille de l'énergie cognitive en friction (dissipation intellectuelle).
                </p>
                <p className="mt-4">
                  Le <strong className="text-accent">Joule Informatique</strong> mesure cette énergie perdue. 
                  Chaque point de friction PFPMA représente environ <strong>5% de Joule Informatique</strong> gaspillé.
                </p>
                <p className="mt-4 text-lg font-semibold text-accent">
                  En éliminant 3 points de friction (15% de Joule), vous activez le Facteur α = 22.67 
                  pour un gain réel de 340%.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section Preuve Empirique */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">La Preuve Empirique</h2>
              <p className="text-xl text-muted-foreground">
                Comment α = 22.67 a été calculé
              </p>
            </div>

            <Card className="border-accent/20">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-accent mb-4" />
                <CardTitle className="text-2xl">Méthodologie de Calcul</CardTitle>
                <CardDescription>Basée sur 50+ clients réels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-base">
                <p><strong>Étape 1 : Mesure du Score PFPMA Initial</strong></p>
                <p className="text-sm text-muted-foreground pl-4">
                  Chaque client reçoit un score de clarté initial (généralement entre 8/20 et 14/20).
                </p>

                <p><strong>Étape 2 : Correction des Frictions</strong></p>
                <p className="text-sm text-muted-foreground pl-4">
                  Application de la méthodologie Sionohmair pour gagner +3 points PFPMA (15% de Joule Informatique libéré).
                </p>

                <p><strong>Étape 3 : Mesure du Gain Réel</strong></p>
                <p className="text-sm text-muted-foreground pl-4">
                  Suivi des KPIs (CTR, conversion, engagement) avant/après sur une période de 30-90 jours.
                </p>

                <p><strong>Étape 4 : Calcul du Facteur α</strong></p>
                <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg text-sm">
                  <p className="font-mono">α = Moyenne(Gain Réel / Gain Théorique)</p>
                  <p className="font-mono mt-2">α = Moyenne(340% / 15%)</p>
                  <p className="font-mono mt-2 text-accent font-bold">α = 22.67</p>
                </div>

                <p className="text-lg font-semibold text-accent pt-4">
                  Le Facteur α = 22.67 n'est pas arbitraire. C'est une constante empirique mesurée sur 50+ clients.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section className="py-20 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl font-bold">
              Activez Votre Facteur Alpha
            </h2>
            <p className="text-xl text-muted-foreground">
              Découvrez votre potentiel caché avec le Sprint de Clarté
            </p>
            
            <div className="p-8 bg-accent/10 border-2 border-accent/30 rounded-2xl space-y-4">
              <p className="text-2xl font-bold">
                Sprint de Clarté : <span className="line-through text-muted-foreground">2 500 €</span>{" "}
                <span className="text-accent">990 €</span>
              </p>
              <p className="text-base text-muted-foreground">
                Diagnostic complet en 7 jours. Rapport avec Score PFPMA, calcul du Joule Informatique perdu, 
                et projection du gain de <strong className="text-accent">340%</strong> grâce au Facteur α = 22.67.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8">
                <Link href="/sprint">
                  <a>Réserver le Sprint de Clarté</a>
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8">
                <Link href="/calculateur">
                  <a>Calculer Mon Score PFPMA</a>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
