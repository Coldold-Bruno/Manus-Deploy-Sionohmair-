import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, Sparkles, Check, ArrowLeft, Download } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function VisualGraphic() {
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    quantity: "1",
    deadline: "",
    description: "",
  });

  const portfolioImages = [
    { src: "/logo-sionohmair.png", title: "Logo Sionohmair", category: "Logo" },
    { src: "/logo-3d-dore.jpg", title: "Logo 3D Doré", category: "Logo 3D" },
    { src: "/logo-3d-texte.jpg", title: "Logo 3D Texte", category: "Logo 3D" },
    { src: "/logo-violet-jaune.jpg", title: "Logo Violet Jaune", category: "Logo" },
    { src: "/logo-abstract.png", title: "Logo Abstract", category: "Logo" },
    { src: "/logo-combination.png", title: "Logo Combination", category: "Logo" },
    { src: "/logo-coach-premium.jpg", title: "Logo Coach Premium", category: "Logo" },
    { src: "/design-abstract-1.png", title: "Design Abstract", category: "Design" },
    { src: "/design-creative-1.webp", title: "Design Créatif 1", category: "Design" },
    { src: "/design-creative-2.png", title: "Design Créatif 2", category: "Design" },
    { src: "/design-graphic-1.webp", title: "Design Graphique 1", category: "Design" },
    { src: "/design-graphic-2.webp", title: "Design Graphique 2", category: "Design" },
    { src: "/design-marketing-1.png", title: "Design Marketing", category: "Marketing" },
    { src: "/design-modern-1.webp", title: "Design Moderne 1", category: "Design" },
    { src: "/design-modern-2.webp", title: "Design Moderne 2", category: "Design" },
    { src: "/design-pro-1.png", title: "Design Pro", category: "Design" },
    { src: "/design-visual-1.webp", title: "Design Visual 1", category: "Design" },
    { src: "/design-visual-2.webp", title: "Design Visual 2", category: "Design" },
    { src: "/bruno-digital-active.jpg", title: "Bruno Digital Active", category: "Projet Client" },
    { src: "/digital-active-v2.png", title: "Digital Active V2", category: "Projet Client" },
    { src: "/rootsneg-journal.jpg", title: "Rootsneg Journal", category: "Projet Client" },
    { src: "/parfum-boite-1.png", title: "Packaging Parfum 1", category: "Packaging" },
    { src: "/parfum-boite-2.png", title: "Packaging Parfum 2", category: "Packaging" },
    { src: "/parfum-manchon.png", title: "Manchon Parfum", category: "Packaging" },
    { src: "/instagram-post.png", title: "Post Instagram", category: "Social Media" },
    { src: "/linkedin-banner.png", title: "Bannière LinkedIn", category: "Social Media" },
    { src: "/website-header.png", title: "Header Website", category: "Web" },
    { src: "/sprint-clarte-promo.png", title: "Promo Sprint Clarté", category: "Marketing" },
    { src: "/sionohmair-academy-3d.png", title: "Sionohmair Academy 3D", category: "3D" },
    { src: "/citation-logo-identite.jpg", title: "Citation Identité", category: "Design" },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "25€",
      description: "Pour les petits projets",
      features: [
        "1 design au choix",
        "2 révisions incluses",
        "Formats PNG/JPG",
        "Livraison sous 3 jours",
        "Support par email",
      ],
    },
    {
      name: "Intermédiaire",
      price: "45€",
      description: "Pour les projets moyens",
      features: [
        "2-3 designs au choix",
        "5 révisions incluses",
        "Tous formats (PNG/JPG/SVG/PDF)",
        "Livraison sous 5 jours",
        "Support prioritaire",
        "Fichiers sources inclus",
      ],
      popular: true,
    },
    {
      name: "Premium",
      price: "100€",
      description: "Pour les projets complexes",
      features: [
        "5+ designs au choix",
        "Révisions illimitées",
        "Tous formats + fichiers sources",
        "Livraison sous 7 jours",
        "Support dédié 24/7",
        "Charte graphique complète",
        "Mockups 3D inclus",
      ],
    },
  ];

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Envoyer le formulaire au backend pour générer le devis PDF
    alert("Devis en cours de génération ! Vous recevrez un email avec le PDF dans quelques instants.");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Link>
          </Button>
          <h1 className="text-xl font-bold">Visual Graphic</h1>
          <Button onClick={() => setShowQuoteForm(true)}>
            Demander un devis
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-yellow-50 dark:from-purple-950/20 dark:via-background dark:to-yellow-950/20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge className="mb-4">
              <Palette className="mr-2 h-4 w-4" />
              Design Graphique Professionnel
            </Badge>
            <h1 className="text-5xl font-bold tracking-tight">
              Donnez vie à votre <span className="text-accent">identité visuelle</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Logos, designs, packaging, social media... Créations sur-mesure pour faire briller votre marque.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button size="lg" onClick={() => setShowQuoteForm(true)} className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Sparkles className="mr-2 h-5 w-5" />
                Demander un devis gratuit
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#portfolio">Voir le portfolio</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tarifs sur-mesure</h2>
            <p className="text-muted-foreground">
              Choisissez la formule adaptée à votre projet. Tous les prix sont indicatifs et ajustables selon vos besoins.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card key={plan.name} className={plan.popular ? "border-2 border-accent shadow-lg" : ""}>
                {plan.popular && (
                  <div className="bg-accent text-accent-foreground text-center py-2 rounded-t-lg font-semibold">
                    Plus populaire
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="text-4xl font-bold mt-4">{plan.price}</div>
                  <p className="text-sm text-muted-foreground">À partir de</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => setShowQuoteForm(true)}
                  >
                    Commander
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="py-20 bg-secondary/20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Portfolio</h2>
            <p className="text-muted-foreground">
              Plus de 30 créations pour nos clients. Logos, designs, packaging, social media...
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {portfolioImages.map((image, i) => (
              <Card key={i} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                <div className="aspect-square relative overflow-hidden bg-muted">
                  <img 
                    src={image.src} 
                    alt={image.title}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-center text-white p-4">
                      <p className="font-semibold">{image.title}</p>
                      <Badge variant="secondary" className="mt-2">{image.category}</Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Form Modal */}
      {showQuoteForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Demander un devis</CardTitle>
                  <CardDescription>Remplissez le formulaire et recevez votre devis par email</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowQuoteForm(false)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitQuote} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input 
                      id="name" 
                      required 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      required 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service">Type de service *</Label>
                  <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisissez un service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="logo">Logo</SelectItem>
                      <SelectItem value="design">Design graphique</SelectItem>
                      <SelectItem value="packaging">Packaging</SelectItem>
                      <SelectItem value="social-media">Social Media</SelectItem>
                      <SelectItem value="web">Design Web</SelectItem>
                      <SelectItem value="3d">Modélisation 3D</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantité</Label>
                    <Input 
                      id="quantity" 
                      type="number" 
                      min="1" 
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Délai souhaité</Label>
                    <Input 
                      id="deadline" 
                      type="date" 
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description du projet *</Label>
                  <Textarea 
                    id="description" 
                    rows={5} 
                    required
                    placeholder="Décrivez votre projet en détail : style souhaité, couleurs, inspirations..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowQuoteForm(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">
                    <Download className="mr-2 h-4 w-4" />
                    Recevoir le devis
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t py-12 bg-secondary/20 mt-auto">
        <div className="container">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 Bruno Coldold | Sionohmair Insight Academy. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
