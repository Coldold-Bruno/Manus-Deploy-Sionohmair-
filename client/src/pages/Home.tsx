import { useAuth } from "@/_core/hooks/useAuth";
import { SEO } from "@/components/SEO";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Sparkles, Target, TrendingUp, Zap } from "lucide-react";
import { Link } from "wouter";
import { APP_LOGO } from "@/const";

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
            <a className="flex items-center space-x-3">
              <img src={APP_LOGO} alt="Sionohmair Insight Academy" className="h-12 w-auto" />
              <span className="font-bold text-xl hidden md:inline">Sionohmair Insight Academy</span>
            </a>
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/content-analyzer">
              <a className="text-sm font-medium hover:text-accent transition-colors">Analyseur</a>
            </Link>
            <Link href="/copy-generator">
              <a className="text-sm font-medium hover:text-accent transition-colors">Générateur</a>
            </Link>
            <Link href="/avatar-builder">
              <a className="text-sm font-medium hover:text-accent transition-colors">Avatar Client</a>
            </Link>
            <Link href="/script-analyzer">
              <a className="text-sm font-medium hover:text-accent transition-colors">Scripts</a>
            </Link>
            <Link href="/frameworks">
              <a className="text-sm font-medium hover:text-accent transition-colors">Frameworks</a>
            </Link>
            <Link href="/chat-ia">
              <a className="text-sm font-medium hover:text-accent transition-colors">Chat IA</a>
            </Link>
            <Link href="/templates">
              <a className="text-sm font-medium hover:text-accent transition-colors">Templates</a>
            </Link>
            <Link href="/exemples">
              <a className="text-sm font-medium hover:text-accent transition-colors">Exemples</a>
            </Link>
            <Link href="/editor">
              <a className="text-sm font-medium hover:text-accent transition-colors">Éditeur</a>
            </Link>
            <Link href="/guide">
              <a className="text-sm font-medium hover:text-accent transition-colors">Guide</a>
            </Link>
            <Link href="/pricing">
              <a className="text-sm font-medium hover:text-accent transition-colors">Tarifs</a>
            </Link>
            <Link href="/blog">
              <a className="text-sm font-medium hover:text-accent transition-colors">Blog</a>
            </Link>
            <Link href="/about">
              <a className="text-sm font-medium hover:text-accent transition-colors">À Propos</a>
            </Link>
            {isAuthenticated && (
              <Link href="/subscription">
                <a className="text-sm font-medium hover:text-accent transition-colors flex items-center gap-2">
                  Mon abonnement
                  <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-semibold rounded-full">
                    Essai gratuit
                  </span>
                </a>
              </Link>
            )}
            {!isAuthenticated && (
              <Button asChild variant="default" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold">
                <Link href="/subscription">
                  <a className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Essai gratuit (30j)
                  </a>
                </Link>
              </Button>
            )}
            {isAuthenticated && (
              <Button asChild variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/content-analyzer">
                  <a>Analyser mon contenu →</a>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section - Content Marketing & Copywriting */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-background to-secondary/20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Problème */}
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 bg-destructive/10 text-destructive rounded-full text-sm font-medium mb-4">
                Le Problème : Votre Message Se Perd
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                Votre contenu est <span className="text-accent">invisible</span>.
                <br />
                Vos conversions stagnent.
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                90% des contenus marketing échouent. Pas par manque de qualité, mais par manque de <strong>méthodologie</strong>. 
                Les 3 frictions invisibles (Attention, Cognitive, Émotionnelle) tuent vos conversions.
              </p>
              <p className="text-lg text-accent font-semibold mt-4">
                🎯 La vérité : vous avez besoin d'une science, pas d'un art.
              </p>
            </div>

            {/* Formule */}
            <div className="space-y-4 pt-8">
              <div className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium">
                La Solution : Frameworks de Copywriting Scientifiques
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                PFPMA & APTEA : Les frameworks qui multiplient vos conversions
                <br />
                en une <span className="text-accent">science de la performance</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                La méthodologie Sionohmair Insight élimine les 3 frictions qui tuent vos messages : 
                Friction d'Attention, Friction Cognitive, et Friction Émotionnelle.
              </p>
              <div className="mt-6 p-6 bg-accent/10 border border-accent/20 rounded-xl">
                <p className="text-2xl font-bold text-accent mb-2">Le Facteur Alpha (α = 22.67)</p>
                <p className="text-lg">
                  Chaque point de friction corrigé ne produit pas un gain linéaire de 15%, mais un <strong className="text-accent">gain exponentiel de 340%</strong> grâce au Facteur d'Amplification α = 22.67.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  C'est la <strong>Loi de la Clarté</strong> : 340% = 15% × 22.67
                </p>
              </div>
            </div>

            {/* P - Preuve */}
            <div className="grid md:grid-cols-3 gap-6 pt-8">
              <Card className="border-accent/20 bg-accent/5">
                <CardHeader>
                  <CardTitle className="text-4xl font-bold text-accent">+340%</CardTitle>
                  <CardDescription>Gain réel grâce au Facteur α = 22.67</CardDescription>
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

            {/* Visuels Promotionnels */}
            <div className="grid md:grid-cols-2 gap-8 pt-12">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-accent/20 transition-shadow duration-300">
                <img 
                  src="/sprint-clarte-promo.png" 
                  alt="Sprint de Clarté - Offre de lancement 490€" 
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-accent/20 transition-shadow duration-300">
                <img 
                  src="/sionohmair-academy-3d.png" 
                  alt="Sionohmair Insight Academy - Analyse, Stratégisation, Amplification" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* 3 Outils Content Marketing */}
            <div className="space-y-6 pt-12">
              <h3 className="text-2xl font-bold">3 Outils Puissants pour Maximiser Vos Conversions</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="hover:border-accent/50 transition-colors cursor-pointer" onClick={() => window.location.href = '/content-analyzer'}>
                  <CardHeader>
                    <Target className="h-10 w-10 text-accent mb-2" />
                    <CardTitle>Analyseur de Contenu</CardTitle>
                    <CardDescription>
                      Analysez votre contenu en 5 dimensions : SEO, Conversion, Engagement, Lisibilité, Psychologie.
                      Score global + recommandations actionnables.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card className="hover:border-accent/50 transition-colors cursor-pointer" onClick={() => window.location.href = '/copy-generator'}>
                  <CardHeader>
                    <Zap className="h-10 w-10 text-accent mb-2" />
                    <CardTitle>Générateur de Copy</CardTitle>
                    <CardDescription>
                      Créez du copy haute conversion avec PFPMA, APTEA, AIDA, PAS, PASTOR, BAB.
                      IA optimisée pour la méthodologie Sionohmair.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card className="hover:border-accent/50 transition-colors cursor-pointer" onClick={() => window.location.href = '/avatar-builder'}>
                  <CardHeader>
                    <TrendingUp className="h-10 w-10 text-accent mb-2" />
                    <CardTitle>Persona Builder</CardTitle>
                    <CardDescription>
                      Définissez votre avatar client idéal : démographiques, psychographiques, comportement.
                      Messages ultra-personnalisés garantis.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>

            {/* Appel à l'action */}
            <div className="space-y-6 pt-12">
              <div className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium">
                Commencez Maintenant
              </div>
              <h3 className="text-3xl font-bold">
                Analysez Votre Contenu en <span className="text-accent">5 Dimensions</span>
              </h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Obtenez un score global, des recommandations actionnables, et générez du copy haute conversion
                avec les frameworks <strong className="text-accent">PFPMA & APTEA</strong> (Facteur α = 22.67).
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Gratuit pour les 100 premiers utilisateurs. Aucune carte bancaire requise.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8">
                  <Link href="/content-analyzer">
                    <a className="flex items-center gap-2">
                      Analyser Mon Contenu Maintenant
                      <ArrowRight className="h-5 w-5" />
                    </a>
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8">
                  <Link href="/copy-generator">
                    <a>Générer du Copy</a>
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
                  example: '"+340% de conversion grâce au Facteur α = 22.67 (mesure sur 50+ clients)."'
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

      {/* CTA Essai Gratuit */}
      <section className="py-20 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-8 text-white">
            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur rounded-full text-sm font-medium mb-4">
              🎉 Offre de lancement
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              Testez GRATUITEMENT pendant 30 jours
            </h2>
            <p className="text-xl md:text-2xl font-semibold">
              ✅ Sans engagement &nbsp;•&nbsp; ✅ Sans carte bancaire &nbsp;•&nbsp; ✅ Accès complet
            </p>
            <p className="text-lg max-w-2xl mx-auto">
              Découvrez tous les outils de Content Marketing & Copywriting : Analyseur de Contenu, Générateur de Copy (8 frameworks), Persona Builder, Chat IA, et Éditeur en temps réel.
            </p>
            <div className="bg-white/10 backdrop-blur border border-white/30 rounded-xl p-6 max-w-2xl mx-auto">
              <p className="text-sm mb-4">
                <strong className="text-lg">🔒 Aucune carte bancaire requise</strong><br />
                Commencez votre essai gratuit en 1 clic. Après 30 jours, continuez pour seulement <strong>36€/mois</strong> (sans engagement, annulez quand vous voulez).
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-white/90 font-bold text-lg px-8 py-6">
                  <Link href="/subscription">
                    <a className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Commencer l'essai gratuit (30 jours)
                    </a>
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-semibold text-lg px-8 py-6">
                  <Link href="/pricing">
                    <a>Voir les tarifs</a>
                  </Link>
                </Button>
              </div>
            </div>
            <p className="text-sm opacity-90">
              📧 Vous recevrez des rappels par email à J-7, J-3, J-1 et J-0 avant la fin de votre essai.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-secondary/20">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
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
            <div>
              <h4 className="font-semibold mb-4">Newsletter</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Recevez le Manuel PFPMA gratuit + études de cas exclusives.
              </p>
              <NewsletterForm />
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
