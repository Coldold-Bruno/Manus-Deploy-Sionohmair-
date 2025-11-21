import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, ArrowLeft, Calculator, TrendingUp, AlertTriangle, CheckCircle2, Lightbulb } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

interface ScoreResult {
  total: number;
  probleme: number;
  formule: number;
  preuve: number;
  methode: number;
  appel: number;
  frictions: string[];
  recommandations: string[];
}

export default function Calculateur() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeMessage = () => {
    if (!message.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulation d'analyse (en production, ceci appellerait une API IA)
    setTimeout(() => {
      const analysis: ScoreResult = {
        total: 0,
        probleme: 0,
        formule: 0,
        preuve: 0,
        methode: 0,
        appel: 0,
        frictions: [],
        recommandations: []
      };

      // Analyse Problème (0-4 points)
      if (message.toLowerCase().includes("problème") || message.toLowerCase().includes("défi") || message.toLowerCase().includes("difficulté")) {
        analysis.probleme = 4;
      } else if (message.split("?").length > 1) {
        analysis.probleme = 2;
      } else {
        analysis.probleme = 1;
        analysis.frictions.push("Friction Cognitive : Le problème central n'est pas clairement identifié");
        analysis.recommandations.push("Commencez par une question ou une affirmation qui identifie le problème central en 2-3 phrases");
      }

      // Analyse Formule (0-4 points)
      const wordCount = message.split(" ").length;
      if (wordCount < 50 && message.split(".").length <= 3) {
        analysis.formule = 4;
      } else if (wordCount < 100) {
        analysis.formule = 3;
      } else {
        analysis.formule = 1;
        analysis.frictions.push("Friction d'Attention : Le message est trop long (>100 mots)");
        analysis.recommandations.push("Réduisez votre message à moins de 50 mots pour maximiser la clarté");
      }

      // Analyse Preuve (0-4 points)
      const hasNumbers = /\d+/.test(message);
      const hasPercentage = /%/.test(message);
      const hasTestimonial = message.toLowerCase().includes("client") || message.toLowerCase().includes("résultat");
      
      if (hasNumbers && (hasPercentage || hasTestimonial)) {
        analysis.preuve = 4;
      } else if (hasNumbers || hasTestimonial) {
        analysis.preuve = 2;
      } else {
        analysis.preuve = 0;
        analysis.frictions.push("Friction Émotionnelle : Aucune preuve crédible (chiffres, témoignages)");
        analysis.recommandations.push("Ajoutez des preuves mesurables : chiffres, pourcentages, témoignages clients");
      }

      // Analyse Méthode (0-4 points)
      const hasSteps = /\d+\s*(étapes?|phases?|temps)/i.test(message);
      const hasProcess = message.toLowerCase().includes("méthode") || message.toLowerCase().includes("processus");
      
      if (hasSteps && hasProcess) {
        analysis.methode = 4;
      } else if (hasSteps || hasProcess) {
        analysis.methode = 2;
      } else {
        analysis.methode = 1;
        analysis.frictions.push("Friction Cognitive : La méthode n'est pas expliquée en étapes simples");
        analysis.recommandations.push("Expliquez votre méthode en 3 étapes maximum pour rendre le chemin clair et actionnable");
      }

      // Analyse Appel (0-4 points)
      const hasCTA = message.toLowerCase().includes("réserver") || 
                     message.toLowerCase().includes("commencer") || 
                     message.toLowerCase().includes("découvrir") ||
                     message.toLowerCase().includes("télécharger");
      
      if (hasCTA && message.split(" ").slice(-15).some(word => 
          ["réserver", "commencer", "découvrir", "télécharger"].includes(word.toLowerCase()))) {
        analysis.appel = 4;
      } else if (hasCTA) {
        analysis.appel = 2;
      } else {
        analysis.appel = 0;
        analysis.frictions.push("Friction d'Action : Aucun appel à l'action clair");
        analysis.recommandations.push("Terminez par un CTA spécifique et à friction zéro (ex: 'Réserver mon Sprint de Clarté')");
      }

      analysis.total = analysis.probleme + analysis.formule + analysis.preuve + analysis.methode + analysis.appel;

      setResult(analysis);
      setIsAnalyzing(false);
    }, 1500);
  };

  const getScoreColor = (score: number) => {
    if (score >= 16) return "text-green-500";
    if (score >= 12) return "text-amber-500";
    return "text-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 16) return "Excellent";
    if (score >= 12) return "Bon";
    if (score >= 8) return "Moyen";
    return "Faible";
  };

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
              <Calculator className="h-16 w-16 text-accent" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Calculateur de Score de Clarté
            </h1>
            <p className="text-2xl text-muted-foreground">
              Analysez votre message selon la grille PFPMA et obtenez un score /20 avec recommandations IA
            </p>
            <Badge className="bg-accent/10 text-accent text-sm px-4 py-2">
              Analyse gratuite • Résultat instantané
            </Badge>
          </div>
        </div>
      </section>

      {/* Calculateur */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle className="text-2xl">Entrez votre message</CardTitle>
                <CardDescription>
                  Collez votre landing page, email, pitch, ou tout message que vous souhaitez analyser
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Exemple : Votre idée est brillante. Pourquoi personne ne la comprend ? 90% des idées meurent dans la confusion. Transformez votre communication en science de la performance avec le Sprint de Clarté : 7 jours pour un message clair. +250% de conversion moyenne. Réserver mon Sprint de Clarté (490 €)."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[200px] text-base"
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {message.split(" ").filter(w => w).length} mots • {message.length} caractères
                  </span>
                  <Button 
                    onClick={analyzeMessage}
                    disabled={!message.trim() || isAnalyzing}
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    {isAnalyzing ? "Analyse en cours..." : "Analyser mon message"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Résultats */}
            {result && (
              <div className="space-y-6 animate-in fade-in duration-500">
                {/* Score Global */}
                <Card className="border-accent/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl">Score de Clarté</CardTitle>
                        <CardDescription>Analyse selon la grille PFPMA</CardDescription>
                      </div>
                      <div className="text-center">
                        <div className={`text-6xl font-bold ${getScoreColor(result.total)}`}>
                          {result.total}/20
                        </div>
                        <Badge className="mt-2">{getScoreLabel(result.total)}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-5 gap-4">
                      {[
                        { label: "Problème", score: result.probleme, icon: "P" },
                        { label: "Formule", score: result.formule, icon: "F" },
                        { label: "Preuve", score: result.preuve, icon: "P" },
                        { label: "Méthode", score: result.methode, icon: "M" },
                        { label: "Appel", score: result.appel, icon: "A" }
                      ].map((item) => (
                        <div key={item.label} className="text-center p-4 bg-secondary/20 rounded-lg">
                          <div className="text-3xl font-bold text-accent mb-1">{item.icon}</div>
                          <div className="text-sm text-muted-foreground mb-2">{item.label}</div>
                          <div className="text-2xl font-bold">{item.score}/4</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Frictions Détectées */}
                {result.frictions.length > 0 && (
                  <Card className="border-red-500/20">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-8 w-8 text-red-500" />
                        <div>
                          <CardTitle className="text-2xl">Frictions détectées</CardTitle>
                          <CardDescription>Points qui bloquent la clarté de votre message</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {result.frictions.map((friction, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-red-500/5 rounded-lg border border-red-500/20">
                          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                          <p className="text-sm">{friction}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Recommandations */}
                {result.recommandations.length > 0 && (
                  <Card className="border-accent/20">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Lightbulb className="h-8 w-8 text-accent" />
                        <div>
                          <CardTitle className="text-2xl">Recommandations IA</CardTitle>
                          <CardDescription>Actions prioritaires pour améliorer votre score</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {result.recommandations.map((reco, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-accent/5 rounded-lg border border-accent/20">
                          <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                          <p className="text-sm">{reco}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* CTA */}
                <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <h3 className="text-2xl font-bold">Besoin d'aide pour optimiser votre message ?</h3>
                      <p className="text-muted-foreground">
                        Le Sprint de Clarté vous accompagne pendant 7 jours pour transformer votre communication
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                          <Link href="/sprint">
                            <a>Réserver mon Sprint de Clarté (490 €)</a>
                          </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline">
                          <Link href="/services">
                            <a>Découvrir tous les services</a>
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Exemples AVANT/APRÈS */}
      <section className="py-20 bg-secondary/20">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Exemples AVANT / APRÈS</h2>
              <p className="text-xl text-muted-foreground">
                Découvrez comment la méthodologie PFPMA transforme les messages
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-red-500/20">
                <CardHeader>
                  <Badge className="bg-red-500/10 text-red-500 w-fit">AVANT (Score: 6/20)</Badge>
                  <CardTitle className="text-xl mt-4">Message confus</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="italic">
                    "Nous sommes une entreprise innovante qui propose des solutions digitales pour optimiser vos processus métiers grâce à nos technologies de pointe et notre expertise reconnue dans le domaine..."
                  </p>
                  <div className="space-y-2 pt-3 border-t">
                    <p className="text-xs text-red-500">❌ Problème : Non identifié</p>
                    <p className="text-xs text-red-500">❌ Formule : Trop générique</p>
                    <p className="text-xs text-red-500">❌ Preuve : Aucune</p>
                    <p className="text-xs text-red-500">❌ Méthode : Absente</p>
                    <p className="text-xs text-red-500">❌ Appel : Pas de CTA</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-500/20">
                <CardHeader>
                  <Badge className="bg-green-500/10 text-green-500 w-fit">APRÈS (Score: 18/20)</Badge>
                  <CardTitle className="text-xl mt-4">Message clair</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="italic">
                    "Vos équipes perdent 3h/jour dans des tâches répétitives ? Automatisez en 7 jours avec notre méthode en 3 étapes. +250% de productivité moyenne. Réserver votre diagnostic gratuit."
                  </p>
                  <div className="space-y-2 pt-3 border-t">
                    <p className="text-xs text-green-500">✓ Problème : 3h/jour perdues</p>
                    <p className="text-xs text-green-500">✓ Formule : Automatisez en 7 jours</p>
                    <p className="text-xs text-green-500">✓ Preuve : +250% productivité</p>
                    <p className="text-xs text-green-500">✓ Méthode : 3 étapes</p>
                    <p className="text-xs text-green-500">✓ Appel : Réserver diagnostic</p>
                  </div>
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
