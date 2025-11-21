import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowLeft, Mail, Send, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

export default function Contact() {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    entreprise: "",
    service: "sprint",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.nom || !formData.email || !formData.message) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSubmitting(true);

    // Simulation d'envoi (en production, ceci appellerait une API)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success("Message envoyé avec succès !");
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (isSubmitted) {
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

        {/* Confirmation */}
        <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <div className="flex items-center justify-center">
                <div className="h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">Message envoyé !</h1>
              <p className="text-xl text-muted-foreground">
                Merci pour votre intérêt. Nous vous répondrons dans les 24 heures.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="/">
                    <a>Retour à l'accueil</a>
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/services">
                    <a>Découvrir nos services</a>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

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
            <div className="flex items-center justify-center gap-3 mb-4">
              <Mail className="h-16 w-16 text-accent" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Contactez-nous
            </h1>
            <p className="text-2xl text-muted-foreground">
              Prêt à transformer votre communication ? Réservez votre Sprint de Clarté ou posez-nous vos questions
            </p>
            <Badge className="bg-accent/10 text-accent text-sm px-4 py-2">
              Réponse sous 24h • Devis gratuit
            </Badge>
          </div>
        </div>
      </section>

      {/* Formulaire */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle className="text-2xl">Formulaire de contact</CardTitle>
                <CardDescription>
                  Remplissez ce formulaire et nous vous répondrons dans les 24 heures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom complet *</Label>
                    <Input
                      id="nom"
                      name="nom"
                      type="text"
                      placeholder="Jean Dupont"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="jean.dupont@exemple.fr"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="entreprise">Entreprise</Label>
                    <Input
                      id="entreprise"
                      name="entreprise"
                      type="text"
                      placeholder="Ma Startup SAS"
                      value={formData.entreprise}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service">Service souhaité *</Label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="sprint">Sprint de Clarté (490 €)</option>
                      <option value="niveau2">Architecture de l'Insight (10 000 €)</option>
                      <option value="niveau3">Partenariat Stratégique (50 000 €)</option>
                      <option value="autre">Autre demande</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Décrivez votre projet, vos objectifs, et vos questions..."
                      value={formData.message}
                      onChange={handleChange}
                      className="min-h-[150px]"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    size="lg"
                  >
                    {isSubmitting ? (
                      "Envoi en cours..."
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Envoyer le message
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    En soumettant ce formulaire, vous acceptez d'être contacté par Sionohmair Insight Academy concernant votre demande.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Informations de contact */}
      <section className="py-20 bg-secondary/20">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Autres moyens de nous contacter</h2>
              <p className="text-xl text-muted-foreground">
                Choisissez le canal qui vous convient le mieux
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-accent/20">
                <CardHeader>
                  <Mail className="h-10 w-10 text-accent mb-4" />
                  <CardTitle className="text-xl">Email</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    Pour toute question ou demande de devis
                  </p>
                  <p className="font-semibold">
                    <a href="mailto:bruno.coldold@sionohmair.com" className="text-accent hover:underline">
                      bruno.coldold@sionohmair.com
                    </a>
                  </p>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <svg className="h-10 w-10 text-accent mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <CardTitle className="text-xl">LinkedIn</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    Suivez nos actualités et contenus exclusifs
                  </p>
                  <p className="font-semibold">
                    <a href="https://linkedin.com/in/brunocoldold" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                      linkedin.com/in/brunocoldold
                    </a>
                  </p>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <Sparkles className="h-10 w-10 text-accent mb-4" />
                  <CardTitle className="text-xl">Communauté</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    Rejoignez la communauté des Architectes de la Clarté
                  </p>
                  <p className="font-semibold text-accent">
                    Bientôt disponible
                  </p>
                </CardContent>
              </Card>
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
