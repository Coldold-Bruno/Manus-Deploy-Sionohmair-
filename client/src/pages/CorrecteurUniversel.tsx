import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, FileText, DollarSign, Globe, CheckCircle, AlertCircle, TrendingUp, Download } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Link } from "wouter";

/**
 * Page Correcteur Universel de Contenu
 * 
 * Principe : Gratuité initiale + Redevabilité si bénéfices générés
 * 
 * Types de correction :
 * - Texte simple (landing page, email, pitch)
 * - Bilan prévisionnel (analyse financière)
 * - Site web complet (SEO, UX, structure)
 */

export default function CorrecteurUniversel() {
  const [activeTab, setActiveTab] = useState<"text" | "financial" | "website">("text");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<any>(null);

  const correctTextMutation = trpc.correcteur.correctText.useMutation();
  const correctFinancialMutation = trpc.correcteur.correctFinancial.useMutation();
  const correctWebsiteMutation = trpc.correcteur.correctWebsite.useMutation();

  const { data: myStats } = trpc.correcteur.getMyStats.useQuery();
  const { data: myCorrections } = trpc.correcteur.getMyCorrections.useQuery();

  const handleCorrect = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setResult(null);

    try {
      let response;
      if (activeTab === "text") {
        response = await correctTextMutation.mutateAsync({ title, content });
      } else if (activeTab === "financial") {
        response = await correctFinancialMutation.mutateAsync({ title, content });
      } else {
        response = await correctWebsiteMutation.mutateAsync({ title, content, url: url || undefined });
      }

      setResult(response);
      toast.success("Correction terminée !");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la correction");
    }
  };

  const isLoading = correctTextMutation.isPending || correctFinancialMutation.isPending || correctWebsiteMutation.isPending;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <Link href="/">
            <a className="text-xl font-bold hover:text-accent transition-colors">
              Sionohmair Insight Academy
            </a>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/dashboard/nft-gratitude">
              <Button variant="outline">NFT Gratitude</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-background to-secondary/20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge className="bg-accent/10 text-accent text-sm px-4 py-2">
              🎁 Gratuit au départ • Redevabilité si bénéfices
            </Badge>
            <h1 className="text-5xl font-bold tracking-tight">
              Correcteur Universel de Contenu
            </h1>
            <p className="text-2xl text-muted-foreground">
              Corrige n'importe quel contenu : texte, bilan prévisionnel, site web.
              <br />
              Analyse PFPMA + IA + Recommandations actionnables.
            </p>

            {/* Stats */}
            {myStats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-accent">{myStats.totalCorrections}</div>
                    <p className="text-sm text-muted-foreground mt-1">Corrections</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-orange-600">{myStats.avgScoreBefore}/20</div>
                    <p className="text-sm text-muted-foreground mt-1">Score Avant</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-green-600">{myStats.avgScoreAfter}/20</div>
                    <p className="text-sm text-muted-foreground mt-1">Score Après</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-blue-600">+{myStats.avgImprovement}</div>
                    <p className="text-sm text-muted-foreground mt-1">Amélioration</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Correcteur */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="text">
                  <FileText className="h-4 w-4 mr-2" />
                  Texte Simple
                </TabsTrigger>
                <TabsTrigger value="financial">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Bilan Prévisionnel
                </TabsTrigger>
                <TabsTrigger value="website">
                  <Globe className="h-4 w-4 mr-2" />
                  Site Web
                </TabsTrigger>
              </TabsList>

              {/* Texte Simple */}
              <TabsContent value="text" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Corriger un texte simple</CardTitle>
                    <CardDescription>
                      Landing page, email, pitch, article... Analyse PFPMA complète.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title-text">Titre du contenu</Label>
                      <Input
                        id="title-text"
                        placeholder="Ex: Landing page produit SaaS"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="content-text">Contenu à corriger (min. 50 caractères)</Label>
                      <Textarea
                        id="content-text"
                        placeholder="Collez votre texte ici..."
                        className="min-h-[200px]"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={handleCorrect}
                      disabled={isLoading}
                      size="lg"
                      className="w-full"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Analyse en cours...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Analyser et Corriger
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Bilan Prévisionnel */}
              <TabsContent value="financial" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Corriger un bilan prévisionnel</CardTitle>
                    <CardDescription>
                      Analyse financière : hypothèses, projections, risques, trésorerie.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title-financial">Titre du bilan</Label>
                      <Input
                        id="title-financial"
                        placeholder="Ex: Bilan prévisionnel 2025-2027"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="content-financial">Contenu du bilan (min. 50 caractères)</Label>
                      <Textarea
                        id="content-financial"
                        placeholder="Collez votre bilan prévisionnel ici..."
                        className="min-h-[200px]"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={handleCorrect}
                      disabled={isLoading}
                      size="lg"
                      className="w-full"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Analyse en cours...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Analyser et Corriger
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Site Web */}
              <TabsContent value="website" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Corriger un site web</CardTitle>
                    <CardDescription>
                      Analyse complète : SEO, UX, clarté, conversion.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title-website">Titre du site</Label>
                      <Input
                        id="title-website"
                        placeholder="Ex: Site vitrine entreprise"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="url-website">URL du site (optionnel)</Label>
                      <Input
                        id="url-website"
                        type="url"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="content-website">Contenu du site (min. 50 caractères)</Label>
                      <Textarea
                        id="content-website"
                        placeholder="Collez le contenu de votre site ici (texte, structure, navigation)..."
                        className="min-h-[200px]"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={handleCorrect}
                      disabled={isLoading}
                      size="lg"
                      className="w-full"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Analyse en cours...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Analyser et Corriger
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Résultats */}
            {result && (
              <div className="mt-8 space-y-6">
                {/* Scores */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-muted-foreground">Score AVANT</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-orange-600">{result.scoreBefore}/20</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-muted-foreground">Score APRÈS</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-green-600">{result.scoreAfter}/20</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-muted-foreground">Amélioration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-blue-600">
                        +{result.scoreAfter - result.scoreBefore}
                        <span className="text-lg ml-2">
                          ({Math.round(((result.scoreAfter - result.scoreBefore) / result.scoreBefore) * 100)}%)
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Frictions / Problèmes */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {activeTab === "text" ? "Frictions Identifiées" : 
                       activeTab === "financial" ? "Erreurs Identifiées" : 
                       "Problèmes Identifiés"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {activeTab === "text" && result.frictions && (
                      <>
                        <div>
                          <h4 className="font-semibold text-sm mb-2">🔴 Friction d'Attention</h4>
                          <p className="text-sm text-muted-foreground">{result.frictions.attention}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-2">🧠 Friction Cognitive</h4>
                          <p className="text-sm text-muted-foreground">{result.frictions.cognitive}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-2">💔 Friction Émotionnelle</h4>
                          <p className="text-sm text-muted-foreground">{result.frictions.emotional}</p>
                        </div>
                      </>
                    )}
                    {activeTab === "financial" && result.errors && (
                      <>
                        {result.errors.coherence?.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2">⚠️ Erreurs de Cohérence</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                              {result.errors.coherence.map((err: string, i: number) => (
                                <li key={i}>{err}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {result.errors.realism?.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2">📊 Hypothèses Irréalistes</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                              {result.errors.realism.map((err: string, i: number) => (
                                <li key={i}>{err}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                    {activeTab === "website" && result.issues && (
                      <>
                        {result.issues.seo?.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2">🔍 Problèmes SEO</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                              {result.issues.seo.map((issue: string, i: number) => (
                                <li key={i}>{issue}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {result.issues.ux?.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2">🎨 Problèmes UX</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                              {result.issues.ux.map((issue: string, i: number) => (
                                <li key={i}>{issue}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Recommandations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recommandations Prioritaires</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Version Corrigée */}
                <Card>
                  <CardHeader>
                    <CardTitle>Version Corrigée</CardTitle>
                    <CardDescription>
                      Les recommandations ont été appliquées automatiquement
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-secondary/20 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm">{result.correctedContent}</pre>
                    </div>
                  </CardContent>
                </Card>

                {/* Principe NFT Gratitude */}
                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Principe NFT de Gratitude :</strong> Cette correction est gratuite. Si vous l'utilisez et générez des bénéfices,
                    vous pourrez déclarer vos gains et contribuer proportionnellement (3-10% selon le type de ressource).
                    Cela enrichit le NFT source et permet à d'autres d'en bénéficier gratuitement. 🎁
                  </AlertDescription>
                </Alert>

                <div className="flex gap-4">
                  <Button asChild variant="outline" className="flex-1">
                    <Link href="/dashboard/nft-gratitude">
                      Voir mes NFT de Gratitude
                    </Link>
                  </Button>
                  <Button variant="default" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter en PDF
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Historique */}
      {myCorrections && myCorrections.length > 0 && (
        <section className="py-16 bg-secondary/20">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Mes Corrections Récentes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myCorrections.slice(0, 6).map((correction) => (
                  <Card key={correction.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{correction.title}</CardTitle>
                        <Badge variant={correction.contentType === "text" ? "default" : correction.contentType === "financial" ? "secondary" : "outline"}>
                          {correction.contentType === "text" ? "Texte" : correction.contentType === "financial" ? "Bilan" : "Site"}
                        </Badge>
                      </div>
                      <CardDescription>
                        {new Date(correction.createdAt).toLocaleDateString("fr-FR")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-muted-foreground">Score</div>
                          <div className="text-2xl font-bold">
                            <span className="text-orange-600">{correction.scoreBefore}</span>
                            <span className="mx-2">→</span>
                            <span className="text-green-600">{correction.scoreAfter}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Amélioration</div>
                          <div className="text-2xl font-bold text-blue-600">
                            +{correction.scoreAfter - correction.scoreBefore}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
