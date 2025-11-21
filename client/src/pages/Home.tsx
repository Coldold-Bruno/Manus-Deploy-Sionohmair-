import { useAuth } from "@/_core/hooks/useAuth";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Sparkles, Target, TrendingUp, Zap } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen">
      <SEO
        title="L'Ingénierie du Génie"
        description="Transformez la communication d'un art subjectif en une science de la performance. Sprint de Clarté : 3 frictions éliminées en 7 jours. +250% de conversion en moyenne."
        keywords={['clarté', 'communication', 'conversion', 'PFPMA', 'insight', 'sprint de clarté', 'méthodologie Sionohmair', 'Bruno Coldold']}
      />
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
            <Link href="/sprint">
              <a className="text-sm font-medium hover:text-accent transition-colors">Sprint de Clarté</a>
            </Link>
            <Link href="/theoreme">
              <a className="text-sm font-medium hover:text-accent transition-colors">Théorème</a>
            </Link>
            <Link href="/services">
              <a className="text-sm font-medium hover:text-accent transition-colors">Services</a>
            </Link>
            <Link href="/ressources">
              <a className="text-sm font-medium hover:text-accent transition-colors">Ressources</a>
            </Link>
            <Link href="/automatisation-ia">
              <a className="text-sm font-medium hover:text-accent transition-colors">Automatisation IA</a>
            </Link>
            <Link href="/calculateur">
              <a className="text-sm font-medium hover:text-accent transition-colors">Calculateur</a>
            </Link>
            <Link href="/blog">
              <a className="text-sm font-medium hover:text-accent transition-colors">Blog</a>
            </Link>
            <Button asChild variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/sprint">
                <a>Commencer →</a>
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - PFPMA Structure */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-background to-secondary/20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* P - Problème */}
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 bg-destructive/10 text-destructive rounded-full text-sm font-medium mb-4">
                Le Problème : La Dissipation Intellectuelle
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                Votre idée est <span className="text-accent">brillante</span>.
                <br />
                Pourquoi personne ne la comprend ?
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                90% des idées meurent dans la confusion. Pas par manque de valeur, mais par manque de clarté. 
                La Dissipation Intellectuelle détruit vos conversions, vos ventes, et votre impact.
              </p>
            </div>

            {/* F - Formule */}
            <div className="space-y-4 pt-8">
              <div className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium">
                La Solution : L'Ingénierie du Génie
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                Transformez la communication d'un art subjectif
                <br />
                en une <span className="text-accent">science de la performance</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                La méthodologie Sionohmair Insight élimine les 3 frictions qui tuent vos messages : 
                Friction d'Attention, Friction Cognitive, et Friction Émotionnelle.
              </p>
            </div>

            {/* P - Preuve */}
            <div className="grid md:grid-cols-3 gap-6 pt-8">
              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="text-4xl font-bold text-accent">+250%</CardTitle>
                  <CardDescription>Augmentation de conversion moyenne</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="text-4xl font-bold text-accent">7 jours</CardTitle>
                  <CardDescription>Pour transformer votre message</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="text-4xl font-bold text-accent">310 pages</CardTitle>
                  <CardDescription>De méthodologie documentée</CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* M - Méthode */}
            <div className="space-y-6 pt-12">
              <h3 className="text-2xl font-bold">La Méthode en 3 Étapes</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <Target className="h-10 w-10 text-accent mb-2" />
                    <CardTitle>1. Diagnostiquer</CardTitle>
                    <CardDescription>
                      Analyse PFPMA complète de votre message. Identification des 3 types de frictions.
                      Score de Clarté sur 20 points.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <Zap className="h-10 w-10 text-accent mb-2" />
                    <CardTitle>2. Éliminer</CardTitle>
                    <CardDescription>
                      Correction des frictions selon le Théorème de la Genèse de l'Insight (Hi = An × Pn × Tn × En).
                      Refonte du message central.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <TrendingUp className="h-10 w-10 text-accent mb-2" />
                    <CardTitle>3. Amplifier</CardTitle>
                    <CardDescription>
                      Plan d'action sur 30 jours. Recommandations mesurables.
                      Projection en KPI (CTR, conversion, engagement).
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>

            {/* A - Appel */}
            <div className="space-y-6 pt-12">
              <div className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium">
                Offre de Lancement
              </div>
              <h3 className="text-3xl font-bold">
                Sprint de Clarté : <span className="line-through text-muted-foreground">1 500 €</span>{" "}
                <span className="text-accent">490 €</span>
              </h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Diagnostic complet en 7 jours. Rapport de 10 pages avec Score de Clarté, analyse des frictions,
                et plan d'action. Garantie de résultats mesurables ou remboursement intégral.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8">
                  <Link href="/sprint">
                    <a className="flex items-center gap-2">
                      Accéder au Sprint de Clarté
                      <ArrowRight className="h-5 w-5" />
                    </a>
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8">
                  <Link href="/ressources">
                    <a>Télécharger le Manuel Gratuit</a>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Méthodologie */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Le Code PFPMA : La Grammaire de la Clarté</h2>
              <p className="text-xl text-muted-foreground">
                Tout message qui convertit suit cette structure, consciemment ou non.
              </p>
            </div>

            <div className="grid gap-6">
              {[
                {
                  letter: "P",
                  title: "Problème",
                  description: "Identifiez la douleur n°1 de votre audience. Créez une résonance émotionnelle immédiate.",
                  example: '"Votre landing page génère 1000 visites mais seulement 10 conversions."'
                },
                {
                  letter: "F",
                  title: "Formule",
                  description: "Nommez votre solution de manière mémorable et unique. Créez un désir irrésistible.",
                  example: '"Le Sprint de Clarté : 3 frictions éliminées en 7 jours."'
                },
                {
                  letter: "P",
                  title: "Preuve",
                  description: "Apportez une preuve crédible (chiffre, témoignage, autorité). Éliminez le scepticisme.",
                  example: '"+250% de conversion en moyenne sur 50 clients."'
                },
                {
                  letter: "M",
                  title: "Méthode",
                  description: "Expliquez le processus en 3 étapes maximum. Rendez le chemin clair et actionnable.",
                  example: '"1) Diagnostiquer, 2) Éliminer, 3) Amplifier."'
                },
                {
                  letter: "A",
                  title: "Appel",
                  description: "Proposez une action spécifique et à friction zéro. Rendez le refus irrationnel.",
                  example: '"Téléchargez le diagnostic gratuit en 1 clic."'
                }
              ].map((item, index) => (
                <Card key={index} className="border-l-4 border-l-accent">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent font-bold text-xl">
                        {item.letter}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{item.title}</CardTitle>
                        <CardDescription className="text-base mb-3">{item.description}</CardDescription>
                        <p className="text-sm italic text-muted-foreground">Exemple : {item.example}</p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-secondary/20">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="h-6 w-6 text-accent" />
                <span className="font-bold text-lg">Sionohmair Insight Academy</span>
              </div>
              <p className="text-sm text-muted-foreground">
                L'Ingénierie du Génie : Transformez la communication en science de la performance.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/sprint"><a className="text-muted-foreground hover:text-accent">Sprint de Clarté</a></Link></li>
                <li><Link href="/theoreme"><a className="text-muted-foreground hover:text-accent">Théorème de la Genèse</a></Link></li>
                <li><Link href="/services"><a className="text-muted-foreground hover:text-accent">Services</a></Link></li>
                <li><Link href="/ressources"><a className="text-muted-foreground hover:text-accent">Ressources</a></Link></li>
                <li><Link href="/about"><a className="text-muted-foreground hover:text-accent">À Propos</a></Link></li>
                <li><Link href="/contact"><a className="text-muted-foreground hover:text-accent">Contact</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Bruno Coldold<br />
                Fondateur, Sionohmair Insight Academy
              </p>
              <p className="text-sm text-muted-foreground">
                LinkedIn: <a href="https://www.linkedin.com/in/brunocoldold" className="text-accent hover:underline">linkedin.com/in/brunocoldold</a>
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2025 Bruno Coldold | Sionohmair Insight Academy. Tous droits réservés. Propriété intellectuelle protégée.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
