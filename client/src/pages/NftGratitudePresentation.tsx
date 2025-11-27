import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Gift, Heart, TrendingUp, Users, Zap } from "lucide-react";
import { Link } from "wouter";

export default function NftGratitudePresentation() {
  const nftLevels = [
    {
      name: "Bronze",
      image: "/nft-badge-bronze.png",
      range: "100€ - 999€",
      percentage: "3%",
      color: "from-orange-400 to-orange-600",
    },
    {
      name: "Argent",
      image: "/nft-badge-argent.png",
      range: "1 000€ - 4 999€",
      percentage: "5%",
      color: "from-gray-300 to-gray-500",
    },
    {
      name: "Or",
      image: "/nft-badge-or.png",
      range: "5 000€ - 19 999€",
      percentage: "7%",
      color: "from-yellow-400 to-yellow-600",
    },
    {
      name: "Platine",
      image: "/nft-badge-platine.png",
      range: "20 000€ - 99 999€",
      percentage: "10%",
      color: "from-blue-300 to-blue-500",
    },
    {
      name: "Diamant",
      image: "/nft-badge-diamant.png",
      range: "100 000€+",
      percentage: "10%",
      color: "from-cyan-300 via-blue-400 to-purple-500",
    },
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title="NFT de Gratitude Économique"
        description="Un système révolutionnaire basé sur la gratuité initiale et la redevabilité proportionnelle. Accédez gratuitement aux ressources, contribuez selon vos bénéfices réels."
        keywords={['NFT', 'gratitude', 'redevabilité', 'gratuité', 'économie', 'contribution', 'Sionohmair']}
      />

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-background to-secondary/20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="mb-4 text-lg px-6 py-2">NFT de Gratitude Économique 💎</Badge>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              La <span className="text-accent">Gratitude</span> comme
              <br />
              Modèle Économique
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Un système révolutionnaire qui transforme la gratuité en enrichissement collectif. 
              Accédez <strong>gratuitement</strong> aux ressources, contribuez <strong>proportionnellement</strong> à vos bénéfices réels.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/correcteur">
                  <a>Essayer Gratuitement <ArrowRight className="ml-2 h-5 w-5" /></a>
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/dashboard/nft-gratitude">
                  <a>Mon NFT</a>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Principe Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Le Principe</h2>
              <p className="text-xl text-muted-foreground">
                Un contrat tacite entre bénéficiaires, fondé sur la gratitude et la redevabilité
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2 border-accent/20">
                <CardHeader>
                  <Gift className="h-12 w-12 text-accent mb-4" />
                  <CardTitle>1. Gratuité Initiale</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Accédez <strong>gratuitement</strong> au Correcteur Universel, aux formations Sprint de Clarté, 
                    et à toutes les ressources Sionohmair.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-accent/20">
                <CardHeader>
                  <TrendingUp className="h-12 w-12 text-accent mb-4" />
                  <CardTitle>2. Bénéfices Générés</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Vous utilisez les ressources et générez des <strong>bénéfices réels</strong> : 
                    conversions, ventes, clients, revenus.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-accent/20">
                <CardHeader>
                  <Heart className="h-12 w-12 text-accent mb-4" />
                  <CardTitle>3. Redevabilité</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Vous contribuez <strong>proportionnellement</strong> (3-10%) à vos gains, 
                    enrichissant le NFT source et l'écosystème.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* NFT Levels Section */}
      <section className="py-20 bg-secondary/10">
        <div className="container">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Les 5 Niveaux de Gratitude</h2>
              <p className="text-xl text-muted-foreground">
                Votre NFT évolue avec vos contributions, reflétant votre gratitude envers l'écosystème
              </p>
            </div>

            <div className="grid md:grid-cols-5 gap-6">
              {nftLevels.map((level) => (
                <Card key={level.name} className="text-center hover:scale-105 transition-transform">
                  <CardHeader>
                    <div className={`w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br ${level.color} p-1`}>
                      <img 
                        src={level.image} 
                        alt={`Badge ${level.name}`} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <CardTitle className="text-2xl">{level.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground font-semibold">{level.range}</p>
                    <Badge variant="secondary" className="text-lg">{level.percentage}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                <strong>Facteur Alpha (α) = 22.67</strong> : Chaque contribution enrichit le NFT source de 22,67×
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnement Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Comment ça Fonctionne ?</h2>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-accent">1</span>
                    </div>
                    <div>
                      <CardTitle>Utilisez Gratuitement</CardTitle>
                      <CardDescription className="mt-2">
                        Accédez au Correcteur Universel, corrigez vos textes, bilans prévisionnels, contenus de site web. 
                        Aucun paiement initial requis.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-accent">2</span>
                    </div>
                    <div>
                      <CardTitle>Générez des Bénéfices</CardTitle>
                      <CardDescription className="mt-2">
                        Utilisez les ressources corrigées pour générer des conversions, ventes, clients. 
                        Le système détecte automatiquement vos bénéfices (Stripe, PayPal, Google Analytics).
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-accent">3</span>
                    </div>
                    <div>
                      <CardTitle>Recevez une Notification</CardTitle>
                      <CardDescription className="mt-2">
                        Vous recevez une notification de redevabilité avec le montant calculé (3-10% selon votre catégorie). 
                        Vous avez 30 jours pour contribuer.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-accent">4</span>
                    </div>
                    <div>
                      <CardTitle>Contribuez et Enrichissez</CardTitle>
                      <CardDescription className="mt-2">
                        Vous payez votre contribution via Stripe. Le NFT source s'enrichit (×22.67), 
                        votre niveau de gratitude augmente, et l'écosystème prospère.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages Section */}
      <section className="py-20 bg-secondary/10">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Pourquoi ce Système ?</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <Zap className="h-8 w-8 text-accent mb-2" />
                  <CardTitle>Accès Immédiat</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Pas de barrière financière. Vous commencez gratuitement, payez seulement si vous générez des bénéfices.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <TrendingUp className="h-8 w-8 text-accent mb-2" />
                  <CardTitle>Alignement d'Intérêts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Nous réussissons ensemble. Plus vous gagnez, plus l'écosystème s'enrichit. Zéro conflit d'intérêts.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="h-8 w-8 text-accent mb-2" />
                  <CardTitle>Enrichissement Collectif</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Chaque contribution enrichit le NFT source (×22.67), permettant de créer plus de ressources gratuites.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Heart className="h-8 w-8 text-accent mb-2" />
                  <CardTitle>Gratitude Matérialisée</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Votre NFT reflète votre gratitude envers l'écosystème. Un symbole de reconnaissance mutuelle.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-background to-accent/5">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              Prêt à Rejoindre l'Écosystème ?
            </h2>
            <p className="text-xl text-muted-foreground">
              Commencez gratuitement. Contribuez selon vos bénéfices. Enrichissez l'écosystème.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/correcteur">
                  <a>Essayer le Correcteur <ArrowRight className="ml-2 h-5 w-5" /></a>
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/dashboard/nft-gratitude">
                  <a>Voir Mon NFT</a>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
