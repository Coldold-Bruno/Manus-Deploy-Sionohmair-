import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowLeft, Target, Eye, Heart, BookOpen, Award, Users } from "lucide-react";
import { Link } from "wouter";

export default function About() {
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
            <Badge className="bg-accent/10 text-accent text-sm px-4 py-2">
              À Propos
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              L'Ingénierie du Génie
            </h1>
            <p className="text-2xl text-muted-foreground">
              Transformer la communication d'un art subjectif en une science de la performance
            </p>
          </div>
        </div>
      </section>

      {/* Bruno Coldold */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Bruno Coldold</h2>
              <p className="text-xl text-muted-foreground">
                Fondateur de Sionohmair Insight Academy
              </p>
            </div>

            <Card className="border-accent/20">
              <CardContent className="pt-6 space-y-6">
                <div className="prose prose-lg max-w-none">
                  <p>
                    Bruno Coldold est l'architecte de la méthodologie Sionohmair, une approche révolutionnaire qui transforme la communication d'un art subjectif en une science de la performance mesurable. Après avoir observé que 90% des idées brillantes meurent dans la confusion, il a consacré des années à décoder les mécanismes de la clarté.
                  </p>
                  
                  <p>
                    Sa découverte majeure : <strong>la Dissipation Intellectuelle</strong>, ce phénomène qui détruit les conversions, les ventes, et l'impact des messages. En identifiant les trois frictions qui tuent la clarté (Attention, Cognitive, Émotionnelle), Bruno a développé le <strong>Code PFPMA</strong>, une grammaire universelle de la clarté applicable à tout message.
                  </p>

                  <p>
                    Aujourd'hui, la méthodologie Sionohmair a permis à des centaines d'entrepreneurs, dirigeants et créateurs de transformer leurs idées en messages qui convertissent. Avec une augmentation moyenne de +250% des taux de conversion, la méthode a fait ses preuves dans des secteurs aussi variés que la tech, le conseil, la formation, et le e-commerce.
                  </p>

                  <p>
                    Bruno Coldold a documenté l'intégralité de sa méthodologie dans un mémoire de 310 pages, désormais référence dans le domaine de l'ingénierie de la clarté. Il forme aujourd'hui une nouvelle génération d'Architectes de la Clarté à travers Sionohmair Insight Academy.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 pt-6 border-t">
                  <div className="text-center p-4 bg-secondary/20 rounded-lg">
                    <BookOpen className="h-8 w-8 text-accent mx-auto mb-2" />
                    <div className="text-2xl font-bold">310 pages</div>
                    <div className="text-sm text-muted-foreground">De méthodologie documentée</div>
                  </div>
                  <div className="text-center p-4 bg-secondary/20 rounded-lg">
                    <Award className="h-8 w-8 text-accent mx-auto mb-2" />
                    <div className="text-2xl font-bold">+250%</div>
                    <div className="text-sm text-muted-foreground">Conversion moyenne</div>
                  </div>
                  <div className="text-center p-4 bg-secondary/20 rounded-lg">
                    <Users className="h-8 w-8 text-accent mx-auto mb-2" />
                    <div className="text-2xl font-bold">500+</div>
                    <div className="text-sm text-muted-foreground">Projets accompagnés</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-secondary/20">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <Target className="h-16 w-16 text-accent mx-auto" />
              <h2 className="text-4xl font-bold">Notre Mission</h2>
              <p className="text-xl text-muted-foreground">
                Éliminer la Dissipation Intellectuelle et rendre la clarté accessible à tous
              </p>
            </div>

            <Card className="border-accent/20">
              <CardContent className="pt-6 space-y-6">
                <div className="prose prose-lg max-w-none">
                  <p>
                    Nous croyons que <strong>chaque idée brillante mérite d'être comprise</strong>. Pourtant, 90% des messages meurent dans la confusion, non pas par manque de valeur, mais par manque de clarté. La Dissipation Intellectuelle détruit les conversions, les ventes, et l'impact.
                  </p>

                  <p>
                    Notre mission est de transformer la communication d'un art subjectif en une <strong>science de la performance</strong>. Grâce à la méthodologie Sionohmair, nous donnons à chaque entrepreneur, dirigeant, et créateur les outils pour diagnostiquer, éliminer, et amplifier la clarté de leurs messages.
                  </p>

                  <p>
                    Nous formons une nouvelle génération d'<strong>Architectes de la Clarté</strong>, capables de maîtriser le Code PFPMA, d'identifier les trois frictions, et de créer des messages qui convertissent. Notre engagement : des résultats mesurables, une méthodologie documentée, et une transformation durable.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 pt-6 border-t">
                  <div className="space-y-2">
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-accent">1</span>
                    </div>
                    <h3 className="font-semibold">Diagnostiquer</h3>
                    <p className="text-sm text-muted-foreground">
                      Identifier les 3 frictions qui tuent votre clarté (Attention, Cognitive, Émotionnelle)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-accent">2</span>
                    </div>
                    <h3 className="font-semibold">Éliminer</h3>
                    <p className="text-sm text-muted-foreground">
                      Corriger les frictions selon le Code PFPMA (Problème, Formule, Preuve, Méthode, Appel)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-accent">3</span>
                    </div>
                    <h3 className="font-semibold">Amplifier</h3>
                    <p className="text-sm text-muted-foreground">
                      Déployer la clarté sur tous vos artefacts (landing, emails, pitch, publicités)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <Eye className="h-16 w-16 text-accent mx-auto" />
              <h2 className="text-4xl font-bold">Notre Vision</h2>
              <p className="text-xl text-muted-foreground">
                Un monde où chaque idée brillante est comprise en moins de 5 secondes
              </p>
            </div>

            <Card className="border-accent/20">
              <CardContent className="pt-6 space-y-6">
                <div className="prose prose-lg max-w-none">
                  <p>
                    Nous imaginons un futur où <strong>la clarté est la norme, pas l'exception</strong>. Un monde où les entrepreneurs n'ont plus besoin de crier pour être entendus, où les créateurs n'ont plus besoin de répéter pour être compris, où les dirigeants n'ont plus besoin de simplifier à outrance pour être suivis.
                  </p>

                  <p>
                    Dans ce monde, la méthodologie Sionohmair est enseignée dès la formation initiale. Le Code PFPMA est aussi naturel que la grammaire. Les trois frictions sont diagnostiquées automatiquement. La clarté est mesurée, optimisée, et célébrée comme un avantage compétitif décisif.
                  </p>

                  <p>
                    Notre vision : <strong>1 million d'Architectes de la Clarté certifiés d'ici 2030</strong>. Chacun capable de transformer n'importe quel message confus en communication qui convertit. Chacun porteur du NFT "Architecte de la Clarté", preuve de sa maîtrise et de son impact mesurable.
                  </p>

                  <p>
                    Nous construisons cette vision pas à pas, un Sprint de Clarté à la fois, une Architecture de l'Insight à la fois, un Partenariat Stratégique à la fois. Rejoignez-nous dans cette transformation.
                  </p>
                </div>

                <div className="pt-6 border-t">
                  <div className="bg-gradient-to-br from-accent/5 to-accent/10 p-6 rounded-lg">
                    <h3 className="text-2xl font-bold mb-4 text-center">Nos Valeurs</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center space-y-2">
                        <Heart className="h-10 w-10 text-accent mx-auto" />
                        <h4 className="font-semibold">Clarté</h4>
                        <p className="text-sm text-muted-foreground">
                          Tout message doit être compris en moins de 5 secondes
                        </p>
                      </div>
                      <div className="text-center space-y-2">
                        <Target className="h-10 w-10 text-accent mx-auto" />
                        <h4 className="font-semibold">Performance</h4>
                        <p className="text-sm text-muted-foreground">
                          Résultats mesurables, pas promesses vagues
                        </p>
                      </div>
                      <div className="text-center space-y-2">
                        <Award className="h-10 w-10 text-accent mx-auto" />
                        <h4 className="font-semibold">Excellence</h4>
                        <p className="text-sm text-muted-foreground">
                          Méthodologie documentée, formation continue
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl font-bold">
              Prêt à rejoindre la révolution de la clarté ?
            </h2>
            <p className="text-xl text-muted-foreground">
              Commencez par le Sprint de Clarté et transformez votre message en 7 jours
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8">
                <Link href="/sprint">
                  <a>Réserver mon Sprint de Clarté (490 €)</a>
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8">
                <Link href="/contact">
                  <a>Nous contacter</a>
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
