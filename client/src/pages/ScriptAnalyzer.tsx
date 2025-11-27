import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, FileSearch, CheckCircle2, AlertCircle, TrendingUp, Sparkles } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

const FRAMEWORKS = [
  { id: 'pfpma', name: 'PFPMA', steps: ['Problème', 'Formule', 'Preuve', 'Méthode', 'Appel'], category: 'sionohmair' },
  { id: 'aptea', name: 'APTEA', steps: ['Attention', 'Problème', 'Transformation', 'Évidence', 'Action'], category: 'sionohmair' },
  { id: 'aida', name: 'AIDA', steps: ['Attention', 'Intérêt', 'Désir', 'Action'], category: 'classique' },
  { id: 'pas', name: 'PAS', steps: ['Problème', 'Agitation', 'Solution'], category: 'classique' },
  { id: 'pastor', name: 'PASTOR', steps: ['Problème', 'Amplifier', 'Solution', 'Transformation', 'Offre', 'Réponse'], category: 'classique' },
  { id: 'bab', name: 'BAB', steps: ['Before', 'After', 'Bridge'], category: 'classique' },
  { id: '4p', name: '4P', steps: ['Picture', 'Promise', 'Prove', 'Push'], category: 'classique' },
  { id: 'quest', name: 'QUEST', steps: ['Qualify', 'Understand', 'Educate', 'Stimulate', 'Transition'], category: 'classique' }
];

export default function ScriptAnalyzer() {
  const [scriptTitle, setScriptTitle] = useState('');
  const [scriptContent, setScriptContent] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const analyzeScriptMutation = trpc.contentMarketing.analyzeScript.useMutation({
    onSuccess: (data) => {
      setAnalysisResult(data);
      toast.success('Analyse de script terminée !');
    },
    onError: (error) => {
      toast.error(`Erreur : ${error.message}`);
    }
  });

  const handleAnalyze = () => {
    if (!scriptContent.trim()) {
      toast.error('Veuillez entrer un script à analyser');
      return;
    }

    analyzeScriptMutation.mutate({
      title: scriptTitle || undefined,
      content: scriptContent
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
            Analyseur de Scripts
          </div>
          <h1 className="text-5xl font-bold mb-4">
            Identifiez les <span className="text-accent">Méthodes Structurelles</span> de Vos Scripts
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Analysez automatiquement vos scripts de vente, pages de capture, emails pour identifier les frameworks utilisés (PFPMA, APTEA, AIDA, PAS...) et évaluer leur qualité d'application.
          </p>
        </div>

        {/* Formulaire d'analyse */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Entrez votre script</CardTitle>
            <CardDescription>
              Collez votre script de vente, page de capture, email marketing, ou tout contenu persuasif
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scriptTitle">Titre du script (optionnel)</Label>
              <Input
                id="scriptTitle"
                placeholder="Ex: Landing page SaaS - Offre de lancement"
                value={scriptTitle}
                onChange={(e) => setScriptTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scriptContent">Contenu du script *</Label>
              <Textarea
                id="scriptContent"
                placeholder="Collez votre script ici..."
                value={scriptContent}
                onChange={(e) => setScriptContent(e.target.value)}
                rows={15}
                className="font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground">
                {scriptContent.length} caractères
              </p>
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={analyzeScriptMutation.isPending}
              size="lg"
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {analyzeScriptMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <FileSearch className="mr-2 h-5 w-5" />
                  Analyser le script
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Résultats de l'analyse */}
        {analysisResult && (
          <div className="space-y-6">
            {/* Méthodes détectées */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-accent" />
                  Méthodes Structurelles Détectées
                </CardTitle>
                <CardDescription>
                  Frameworks de copywriting identifiés dans votre script
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analysisResult.detectedFrameworks?.map((framework: any) => (
                    <Card key={framework.name} className={`border-2 ${
                      framework.confidence >= 80 ? 'border-green-500/50 bg-green-50/50' :
                      framework.confidence >= 60 ? 'border-yellow-500/50 bg-yellow-50/50' :
                      'border-red-500/50 bg-red-50/50'
                    }`}>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <CardTitle className="text-lg">{framework.name}</CardTitle>
                          <Badge className={getScoreBadge(framework.confidence)}>
                            {framework.confidence}%
                          </Badge>
                        </div>
                        <Progress value={framework.confidence} className="h-2" />
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">
                          Étapes détectées :
                        </p>
                        <div className="space-y-1">
                          {framework.stepsFound?.map((step: any, i: number) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              {step.present ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-red-600" />
                              )}
                              <span className={step.present ? 'text-foreground' : 'text-muted-foreground line-through'}>
                                {step.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Score global */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-accent" />
                  Score Global d'Application
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className={`text-6xl font-bold ${getScoreColor(analysisResult.overallScore)}`}>
                    {analysisResult.overallScore}/100
                  </div>
                  <p className="text-lg text-muted-foreground">
                    {analysisResult.overallScore >= 80 && 'Excellent ! Votre script applique très bien les méthodes structurelles.'}
                    {analysisResult.overallScore >= 60 && analysisResult.overallScore < 80 && 'Bien ! Quelques améliorations possibles.'}
                    {analysisResult.overallScore < 60 && 'À améliorer. Votre script manque de structure claire.'}
                  </p>
                  <Progress value={analysisResult.overallScore} className="h-4" />
                </div>
              </CardContent>
            </Card>

            {/* Analyses détaillées par framework */}
            <Tabs defaultValue={analysisResult.detectedFrameworks?.[0]?.name.toLowerCase()} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                {analysisResult.detectedFrameworks?.slice(0, 4).map((fw: any) => (
                  <TabsTrigger key={fw.name} value={fw.name.toLowerCase()}>
                    {fw.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {analysisResult.detectedFrameworks?.map((framework: any) => (
                <TabsContent key={framework.name} value={framework.name.toLowerCase()}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        Analyse {framework.name}
                        <Badge className={getScoreBadge(framework.confidence)}>
                          {framework.confidence}%
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Points forts */}
                      {framework.strengths && framework.strengths.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-green-600 mb-2">✅ Points forts</h3>
                          <ul className="space-y-2">
                            {framework.strengths.map((s: string, i: number) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm">{s}</p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Points à améliorer */}
                      {framework.improvements && framework.improvements.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-yellow-600 mb-2">⚠️ Points à améliorer</h3>
                          <ul className="space-y-2">
                            {framework.improvements.map((s: string, i: number) => (
                              <li key={i} className="flex items-start gap-2">
                                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm">{s}</p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Recommandations */}
                      {framework.recommendations && framework.recommendations.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-accent mb-2">💡 Recommandations</h3>
                          <ul className="space-y-2">
                            {framework.recommendations.map((s: string, i: number) => (
                              <li key={i} className="flex items-start gap-2">
                                <div className="h-2 w-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                                <p className="text-sm">{s}</p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>

            {/* Recommandations globales */}
            <Card>
              <CardHeader>
                <CardTitle>Recommandations Globales</CardTitle>
                <CardDescription>
                  Suggestions pour maximiser l'impact de votre script
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysisResult.globalRecommendations?.map((rec: string, i: number) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-accent mt-2" />
                    <p className="text-sm">{rec}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Guide */}
        {!analysisResult && (
          <Card className="bg-accent/5 border-accent/20">
            <CardHeader>
              <CardTitle className="text-accent">💡 Comment fonctionne l'Analyseur de Scripts ?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">
                L'Analyseur de Scripts utilise l'IA pour identifier automatiquement les frameworks de copywriting utilisés dans votre contenu et évaluer la qualité de leur application.
              </p>
              <div className="space-y-2">
                <p className="text-sm font-medium">Frameworks détectés :</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {FRAMEWORKS.map((fw) => (
                    <Badge key={fw.id} variant={fw.category === 'sionohmair' ? 'default' : 'secondary'}>
                      {fw.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="bg-background/50 p-4 rounded-lg border border-accent/20">
                <p className="text-sm font-medium text-accent mb-2">
                  ⚡ Méthodologie Sionohmair
                </p>
                <p className="text-sm text-muted-foreground">
                  L'analyse identifie non seulement les frameworks utilisés, mais évalue aussi la <strong>qualité d'application</strong> de chaque étape. Un script PFPMA parfait élimine les 3 frictions (Attention, Cognitive, Émotionnelle) et peut atteindre +340% de conversion grâce au Facteur Alpha (α = 22.67).
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
