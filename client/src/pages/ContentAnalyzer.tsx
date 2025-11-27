import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, Search, TrendingUp, Eye, BookOpen, Brain, Sparkles } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function ContentAnalyzer() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [contentType, setContentType] = useState<'landing_page' | 'email' | 'ad' | 'blog_post' | 'social_post'>('landing_page');
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const analyzeContentMutation = trpc.contentMarketing.analyzeContent.useMutation({
    onSuccess: (data) => {
      setAnalysisResult(data);
      toast.success('Analyse terminée !');
    },
    onError: (error) => {
      toast.error(`Erreur : ${error.message}`);
    }
  });

  const handleAnalyze = () => {
    if (!content.trim()) {
      toast.error('Veuillez entrer du contenu à analyser');
      return;
    }

    analyzeContentMutation.mutate({
      content,
      title: title || undefined,
      url: url || undefined,
      contentType
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
            Analyseur de Contenu Marketing
          </div>
          <h1 className="text-5xl font-bold mb-4">
            Analysez Votre Contenu en <span className="text-accent">5 Dimensions</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            SEO, Conversion, Engagement, Lisibilité, Psychologie. Obtenez un score global et des recommandations actionnables.
          </p>
        </div>

        {/* Formulaire d'analyse */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Entrez votre contenu</CardTitle>
            <CardDescription>
              Collez votre landing page, email, publicité, article de blog ou post social pour une analyse complète
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre (optionnel)</Label>
                <Input
                  id="title"
                  placeholder="Ex: Doublez vos ventes en 30 jours"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL (optionnel)</Label>
                <Input
                  id="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contentType">Type de contenu</Label>
              <Select value={contentType} onValueChange={(value: any) => setContentType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="landing_page">Landing Page</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="ad">Publicité</SelectItem>
                  <SelectItem value="blog_post">Article de Blog</SelectItem>
                  <SelectItem value="social_post">Post Social</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Contenu *</Label>
              <Textarea
                id="content"
                placeholder="Collez votre contenu ici..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground">
                {content.length} caractères
              </p>
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={analyzeContentMutation.isPending}
              size="lg"
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {analyzeContentMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Analyser le contenu
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Résultats de l'analyse */}
        {analysisResult && (
          <div className="space-y-6">
            {/* Scores globaux */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-accent" />
                  Scores Globaux
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { label: 'Global', score: analysisResult.overallScore, icon: Sparkles },
                    { label: 'SEO', score: analysisResult.seoScore, icon: Search },
                    { label: 'Conversion', score: analysisResult.conversionScore, icon: TrendingUp },
                    { label: 'Engagement', score: analysisResult.engagementScore, icon: Eye },
                    { label: 'Lisibilité', score: analysisResult.readabilityScore, icon: BookOpen },
                    { label: 'Psychologie', score: analysisResult.psychologyScore, icon: Brain }
                  ].map(({ label, score, icon: Icon }) => (
                    <div key={label} className="text-center space-y-2">
                      <Icon className="h-6 w-6 mx-auto text-muted-foreground" />
                      <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
                        {score}
                      </div>
                      <div className="text-sm text-muted-foreground">{label}</div>
                      <Progress value={score} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Analyses détaillées */}
            <Tabs defaultValue="seo" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="conversion">Conversion</TabsTrigger>
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
                <TabsTrigger value="readability">Lisibilité</TabsTrigger>
                <TabsTrigger value="psychology">Psychologie</TabsTrigger>
              </TabsList>

              {/* SEO */}
              <TabsContent value="seo">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Analyse SEO
                      <Badge className={getScoreBadge(analysisResult.seoScore)}>
                        {analysisResult.seoScore}/100
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysisResult.seoAnalysis?.recommendations?.map((rec: string, i: number) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-accent mt-2" />
                        <p className="text-sm">{rec}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Conversion */}
              <TabsContent value="conversion">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Analyse de Conversion
                      <Badge className={getScoreBadge(analysisResult.conversionScore)}>
                        {analysisResult.conversionScore}/100
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysisResult.conversionAnalysis?.recommendations?.map((rec: string, i: number) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-accent mt-2" />
                        <p className="text-sm">{rec}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Engagement */}
              <TabsContent value="engagement">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Analyse d'Engagement
                      <Badge className={getScoreBadge(analysisResult.engagementScore)}>
                        {analysisResult.engagementScore}/100
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysisResult.engagementAnalysis?.recommendations?.map((rec: string, i: number) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-accent mt-2" />
                        <p className="text-sm">{rec}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Lisibilité */}
              <TabsContent value="readability">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Analyse de Lisibilité
                      <Badge className={getScoreBadge(analysisResult.readabilityScore)}>
                        {analysisResult.readabilityScore}/100
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysisResult.readabilityAnalysis?.recommendations?.map((rec: string, i: number) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-accent mt-2" />
                        <p className="text-sm">{rec}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Psychologie */}
              <TabsContent value="psychology">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      Analyse Psychologique
                      <Badge className={getScoreBadge(analysisResult.psychologyScore)}>
                        {analysisResult.psychologyScore}/100
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysisResult.psychologyAnalysis?.recommendations?.map((rec: string, i: number) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-accent mt-2" />
                        <p className="text-sm">{rec}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Suggestions d'amélioration */}
            <Card>
              <CardHeader>
                <CardTitle>Suggestions d'Amélioration</CardTitle>
                <CardDescription>
                  Recommandations prioritaires pour maximiser l'impact de votre contenu
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {analysisResult.suggestions?.critical && analysisResult.suggestions.critical.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-red-600 mb-2">🔴 Critiques (à corriger immédiatement)</h3>
                    <ul className="space-y-2">
                      {analysisResult.suggestions.critical.map((s: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="h-2 w-2 rounded-full bg-red-600 mt-2" />
                          <p className="text-sm">{s}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysisResult.suggestions?.important && analysisResult.suggestions.important.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-yellow-600 mb-2">🟡 Importantes (impact significatif)</h3>
                    <ul className="space-y-2">
                      {analysisResult.suggestions.important.map((s: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="h-2 w-2 rounded-full bg-yellow-600 mt-2" />
                          <p className="text-sm">{s}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysisResult.suggestions?.minor && analysisResult.suggestions.minor.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-blue-600 mb-2">🔵 Mineures (optimisations)</h3>
                    <ul className="space-y-2">
                      {analysisResult.suggestions.minor.map((s: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-600 mt-2" />
                          <p className="text-sm">{s}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
