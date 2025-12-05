import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, ArrowLeft, Calculator, TrendingUp, AlertTriangle, CheckCircle2, Lightbulb } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { analyzeContent, type AnalysisResult } from "@shared/contentAnalyzer";
import { rewriteContentAdaptive, generateRewriteSuggestionsAdaptive, generateDiff } from "@shared/contentAnalyzerRewrite";
import { APP_LOGO } from "@/const";

export default function Calculateur() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [rewrittenText, setRewrittenText] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const analyzeMessage = () => {
    if (!message.trim() || message.length < 50) {
      alert("Veuillez entrer au moins 50 caractères pour une analyse pertinente.");
      return;
    }
    
    setIsAnalyzing(true);
    
    // Analyse avec la nouvelle logique complète
    setTimeout(() => {
      const analysis = analyzeContent(message);
      setResult(analysis);
      setIsAnalyzing(false);
    }, 1500);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Bon";
    if (score >= 40) return "Moyen";
    return "Faible";
  };

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
                  placeholder="Exemple : Votre idée est brillante. Pourquoi personne ne la comprend ? 90% des idées meurent dans la confusion. Transformez votre communication en science de la performance avec le Sprint de Clarté : 7 jours pour un message clair. +250% de conversion moyenne. Réserver mon Sprint de Clarté (990 €)."
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
                        <div className={`text-6xl font-bold ${getScoreColor(result.clarityScore)}`}>
                          {result.clarityScore}/100
                        </div>
                        <Badge className="mt-2">{getScoreLabel(result.clarityScore)}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-5 gap-4">
                      {[
                        { label: "Problème", score: result.pfpma.probleme.score, icon: "P" },
                        { label: "Formule", score: result.pfpma.formule.score, icon: "F" },
                        { label: "Preuve", score: result.pfpma.preuve.score, icon: "P" },
                        { label: "Méthode", score: result.pfpma.methode.score, icon: "M" },
                        { label: "Appel", score: result.pfpma.appel.score, icon: "A" }
                      ].map((item) => (
                        <div key={item.label} className="text-center p-4 bg-secondary/20 rounded-lg">
                          <div className="text-3xl font-bold text-accent mb-1">{item.icon}</div>
                          <div className="text-sm text-muted-foreground mb-2">{item.label}</div>
                          <div className="text-2xl font-bold">{item.score}/100</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Frictions Détectées */}
                {(result.frictions.attention.issues.length > 0 || result.frictions.cognitive.issues.length > 0 || result.frictions.emotionnelle.issues.length > 0) && (
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
                      {[
                        ...result.frictions.attention.issues.map(issue => ({ type: 'Attention', issue })),
                        ...result.frictions.cognitive.issues.map(issue => ({ type: 'Cognitive', issue })),
                        ...result.frictions.emotionnelle.issues.map(issue => ({ type: 'Émotionnelle', issue }))
                      ].map((friction, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-red-500/5 rounded-lg border border-red-500/20">
                          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold">Friction {friction.type}</p>
                            <p className="text-sm text-muted-foreground">{friction.issue}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Recommandations */}
                {result.suggestions.length > 0 && (
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
                      {result.suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-accent/5 rounded-lg border border-accent/20">
                          <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{suggestion.issue}</p>
                            <p className="text-sm text-muted-foreground mt-1">{suggestion.suggestion}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Calculateur TVA NI */}
                <Card className="border-accent/20 bg-accent/10">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-8 w-8 text-accent" />
                      <div>
                        <CardTitle className="text-2xl">Votre TVA NI (Taux de Valeur Ajoutée Non-Intuitive)</CardTitle>
                        <CardDescription>Le potentiel caché qui était bloqué par les frictions</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-6 bg-background rounded-xl border-2 border-accent/30">
                      <div className="grid md:grid-cols-3 gap-6 text-center">
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Gain Attendu (Linéaire)</p>
                          <p className="text-3xl font-bold text-muted-foreground">15%</p>
                          <p className="text-xs text-muted-foreground mt-1">Correction standard</p>
                        </div>
                        <div>
                          <p className="text-sm text-accent mb-2">Facteur Alpha</p>
                          <p className="text-4xl font-bold text-accent">× 22.67</p>
                          <p className="text-xs text-muted-foreground mt-1">Multiplicateur Sionohmair</p>
                        </div>
                        <div>
                          <p className="text-sm text-accent mb-2">Gain Réel (Exponentiel)</p>
                          <p className="text-4xl font-bold text-accent">340%</p>
                          <p className="text-xs text-muted-foreground mt-1">Impact mesuré</p>
                        </div>
                      </div>
                      <div className="mt-6 p-4 bg-accent/10 rounded-lg">
                        <p className="text-center text-lg font-semibold">
                          TVA NI = 340% - 15% = <span className="text-accent text-2xl">325%</span>
                        </p>
                        <p className="text-center text-sm text-muted-foreground mt-2">
                          C'est le <strong>potentiel caché</strong> qui était bloqué par les {result.frictions.attention.issues.length + result.frictions.cognitive.issues.length + result.frictions.emotionnelle.issues.length} friction(s) détectée(s).
                        </p>
                      </div>
                    </div>
                    <div className="p-4 bg-background rounded-lg border border-accent/20">
                      <p className="text-sm">
                        <strong className="text-accent">🎯 La vérité :</strong> Votre idée était brillante dès le départ. Ce n'est pas un problème de qualité, mais de <strong>Dissipation Intellectuelle</strong>. Le Sprint de Clarté active le <strong className="text-accent">Facteur α = 22.67</strong> pour libérer vos 325% de TVA NI.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Réécriture Automatique */}
                <Card className="border-2 border-accent">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-8 w-8 text-accent" />
                      <div>
                        <CardTitle className="text-2xl">Générer la version corrigée</CardTitle>
                        <CardDescription>Obtenez une version améliorée de votre texte selon le Code PFPMA</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => {
                        const rewritten = rewriteContentAdaptive(message, result);
                        setRewrittenText(rewritten);
                        setShowComparison(true);
                        // Scroll vers la comparaison (compatible Android)
                        setTimeout(() => {
                          const element = document.getElementById('comparison');
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }, 100);
                      }}
                      size="lg"
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                      Générer la version corrigée
                    </Button>
                    <p className="text-sm text-muted-foreground mt-3 text-center">
                      Notre IA va appliquer automatiquement les recommandations PFPMA à votre texte
                    </p>
                  </CardContent>
                </Card>

                {/* CTA */}
                <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <h3 className="text-2xl font-bold">Activez votre Facteur Alpha (α = 22.67)</h3>
                      <p className="text-muted-foreground">
                        Le Sprint de Clarté vous accompagne pendant 7 jours pour transformer votre communication et débloquer vos 325% de TVA NI
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                          <Link href="/sprint">
                            <a>Réserver mon Sprint de Clarté (990 €)</a>
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

                {/* Comparaison AVANT/APRÈS */}
                {showComparison && rewrittenText && (
                  <Card id="comparison" className="border-2 border-accent">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-2xl flex items-center gap-3">
                            <TrendingUp className="h-6 w-6 text-accent" />
                            Comparaison AVANT / APRÈS
                          </CardTitle>
                          <CardDescription>
                            Votre texte a été réorganisé selon la prévalence PFPMA détectée
                          </CardDescription>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(rewrittenText);
                            alert("Version corrigée copiée dans le presse-papier !");
                          }}
                        >
                          Copier la version corrigée
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* AVANT */}
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="destructive">AVANT</Badge>
                            <span className="text-sm text-muted-foreground">
                              {message.split(' ').length} mots
                            </span>
                          </div>
                          <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                            <pre className="whitespace-pre-wrap text-sm font-sans">{message}</pre>
                          </div>
                        </div>

                        {/* APRÈS */}
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="default" className="bg-green-600">APRÈS</Badge>
                            <span className="text-sm text-muted-foreground">
                              {rewrittenText.split(' ').length} mots
                            </span>
                          </div>
                          <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                            <pre className="whitespace-pre-wrap text-sm font-sans">{rewrittenText}</pre>
                          </div>
                        </div>
                      </div>

                      {/* Suggestions détaillées */}
                      <div className="mt-6 space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-accent" />
                          Modifications appliquées
                        </h4>
                        {generateRewriteSuggestionsAdaptive(message, result).map((suggestion, i) => (
                          <Alert key={i} variant={suggestion.priority === 'high' ? 'default' : 'default'}>
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertDescription>
                              <div className="flex items-start gap-2">
                                <Badge variant={suggestion.priority === 'high' ? 'default' : 'secondary'}>
                                  {suggestion.section}
                                </Badge>
                                <div className="flex-1">
                                  <p className="font-semibold text-sm">{suggestion.reason}</p>
                                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                      <span className="text-muted-foreground">Avant :</span>
                                      <p className="text-red-600 dark:text-red-400">{suggestion.before.substring(0, 80)}...</p>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Après :</span>
                                      <p className="text-green-600 dark:text-green-400">{suggestion.after.substring(0, 80)}...</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
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
