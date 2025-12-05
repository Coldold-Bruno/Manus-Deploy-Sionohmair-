import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowLeft, BookOpen, Download, FileText, Calculator, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { APP_LOGO } from "@/const";

export default function Ressources() {
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
              Ressources Gratuites
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Ressources & Outils
            </h1>
            <p className="text-2xl text-muted-foreground">
              Découvrez la méthodologie Sionohmair Insight avec nos ressources gratuites
            </p>
          </div>
        </div>
      </section>

      {/* Manuel de Référence */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <Card className="border-accent/20 shadow-lg">
              <CardHeader className="text-center pb-8">
                <div className="mx-auto h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                  <BookOpen className="h-10 w-10 text-accent" />
                </div>
                <Badge className="mb-4 bg-accent/10 text-accent hover:bg-accent/20">
                  Gratuit • 310 pages
                </Badge>
                <CardTitle className="text-4xl mb-4">Manuel de Référence Complet</CardTitle>
                <CardDescription className="text-lg">
                  Le guide complet de la méthodologie Sionohmair Insight Academy : 
                  de la théorie à la pratique, tout ce dont vous avez besoin pour éliminer la Dissipation Intellectuelle.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Ce que vous allez apprendre :</h3>
                    <ul className="space-y-2">
                      {[
                        "Le Théorème de la Genèse de l'Insight (Hi = An × Pn × Tn × En)",
                        "Le Code PFPMA : la grammaire de la clarté",
                        "Les 3 types de frictions (Attention, Cognitive, Émotionnelle)",
                        "Le Sprint de Clarté en 7 jours",
                        "Le Score de Clarté sur 20 points",
                        "L'analyse fractale des messages"
                      ].map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Structure du manuel :</h3>
                    <ul className="space-y-2 text-sm">
                      <li><strong>Partie I :</strong> Fondations Théoriques (80 pages)</li>
                      <li><strong>Partie II :</strong> Outils d'Analyse & Mesure (60 pages)</li>
                      <li><strong>Partie III :</strong> Applications Pratiques (70 pages)</li>
                      <li><strong>Partie IV :</strong> Stratégie & Business (40 pages)</li>
                      <li><strong>Partie V :</strong> Devenir Architecte de Clarté (30 pages)</li>
                      <li><strong>Annexes :</strong> Glossaire, Templates, Bibliographie (30 pages)</li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8">
                    <Download className="h-5 w-5 mr-2" />
                    Télécharger le Manuel (PDF)
                  </Button>
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    <Download className="h-5 w-5 mr-2" />
                    Version Audio (MP3)
                  </Button>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  Aucune inscription requise • Téléchargement immédiat • Format PDF et Audio
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Outils Gratuits */}
      <section className="py-20 bg-secondary/20">
        <div className="container">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Outils & Templates Gratuits</h2>
              <p className="text-xl text-muted-foreground">
                Commencez à appliquer la méthodologie dès aujourd'hui
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-accent/20">
                <CardHeader>
                  <Calculator className="h-12 w-12 text-accent mb-4" />
                  <CardTitle className="text-2xl">Calculateur de Hi</CardTitle>
                  <CardDescription className="text-base">
                    Calculez le potentiel d'Insight de votre message en quelques clics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Entrez les valeurs d'Ambition (An), Profondeur (Pn), Tension (Tn) et Élégance (En) 
                    pour obtenir instantanément le score Hi de votre message.
                  </p>
                  <Button variant="outline" className="w-full">
                    Accéder au Calculateur
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <FileText className="h-12 w-12 text-accent mb-4" />
                  <CardTitle className="text-2xl">Grille d'Analyse PFPMA</CardTitle>
                  <CardDescription className="text-base">
                    Template pour analyser vos messages selon le Code PFPMA
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Décortiquez n'importe quel message en 5 composantes : Problème, Formule, Preuve, Méthode, Appel. 
                    Format Google Sheets et Excel.
                  </p>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger le Template
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <CheckCircle className="h-12 w-12 text-accent mb-4" />
                  <CardTitle className="text-2xl">Score de Clarté</CardTitle>
                  <CardDescription className="text-base">
                    Évaluez votre message sur 20 points en 5 minutes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Questionnaire de 20 questions pour obtenir un diagnostic rapide de votre message. 
                    Résultats instantanés avec recommandations.
                  </p>
                  <Button variant="outline" className="w-full">
                    Faire le Test Gratuit
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <FileText className="h-12 w-12 text-accent mb-4" />
                  <CardTitle className="text-2xl">Glossaire des Concepts</CardTitle>
                  <CardDescription className="text-base">
                    Tous les termes de la méthodologie Sionohmair expliqués
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    De "Dissipation Intellectuelle" à "Friction Émotionnelle", maîtrisez le vocabulaire 
                    de l'Ingénierie du Génie.
                  </p>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger le Glossaire
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Études de Cas */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Études de Cas</h2>
              <p className="text-xl text-muted-foreground">
                Découvrez comment la méthodologie transforme les messages
              </p>
            </div>

            <div className="grid gap-6">
              <Card className="border-l-4 border-l-accent">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Badge className="mb-2 bg-accent/10 text-accent">Hi = 6 → Hi = 162</Badge>
                      <CardTitle className="text-2xl mb-2">Cas #1 : SaaS B2B</CardTitle>
                      <CardDescription className="text-base">
                        Transformation d'une landing page générique en machine à conversion
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold text-sm mb-2">Avant :</p>
                      <p className="text-sm text-muted-foreground italic">
                        "Nous aidons les entreprises à améliorer leur communication."
                      </p>
                      <p className="text-sm mt-2">
                        <strong>Résultats :</strong> 1,2% de conversion • 3s temps moyen
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-2">Après :</p>
                      <p className="text-sm text-muted-foreground italic">
                        "Éliminez les 3 frictions qui tuent vos conversions. Audit PFPMA en 7 jours."
                      </p>
                      <p className="text-sm mt-2">
                        <strong>Résultats :</strong> 4,8% de conversion (+300%) • 45s temps moyen
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Lire l'Étude Complète
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-accent">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Badge className="mb-2 bg-accent/10 text-accent">Hi = 12 → Hi = 88</Badge>
                      <CardTitle className="text-2xl mb-2">Cas #2 : Coach Business</CardTitle>
                      <CardDescription className="text-base">
                        Refonte complète du positionnement et du message
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold text-sm mb-2">Avant :</p>
                      <p className="text-sm text-muted-foreground italic">
                        "Coach certifié pour entrepreneurs ambitieux. Développez votre mindset."
                      </p>
                      <p className="text-sm mt-2">
                        <strong>Résultats :</strong> 2 clients/mois • 3 000 € CA
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-2">Après :</p>
                      <p className="text-sm text-muted-foreground italic">
                        "Transformez votre expertise en offre premium à 10K€. Méthode en 90 jours."
                      </p>
                      <p className="text-sm mt-2">
                        <strong>Résultats :</strong> 8 clients/mois • 25 000 € CA (+733%)
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Lire l'Étude Complète
                  </Button>
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
              Prêt à passer à l'action ?
            </h2>
            <p className="text-xl text-muted-foreground">
              Commencez par télécharger le manuel gratuit, puis réservez votre Sprint de Clarté
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8">
                <Download className="h-5 w-5 mr-2" />
                Télécharger le Manuel
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8">
                <Link href="/sprint">
                  <a>Réserver mon Sprint (990 €)</a>
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
