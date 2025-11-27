import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Sparkles, 
  CheckCircle, 
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Copy,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

interface Suggestion {
  type: 'error' | 'warning' | 'tip';
  message: string;
  position?: { start: number; end: number };
}

interface FrameworkDetection {
  name: string;
  confidence: number;
  steps: { step: string; present: boolean }[];
}

export default function CopyEditor() {
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState<string>('landing_page');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [detectedFrameworks, setDetectedFrameworks] = useState<FrameworkDetection[]>([]);
  const [qualityScore, setQualityScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Analyse en temps réel (debounced)
  useEffect(() => {
    if (!content.trim()) {
      setSuggestions([]);
      setDetectedFrameworks([]);
      setQualityScore(0);
      return;
    }

    const timer = setTimeout(() => {
      analyzeContent();
    }, 1000); // Attendre 1s après la dernière frappe

    return () => clearTimeout(timer);
  }, [content, contentType]);

  const analyzeContent = () => {
    setIsAnalyzing(true);
    
    // Analyse simple côté client (sans IA pour la démo)
    const newSuggestions: Suggestion[] = [];
    const wordCount = content.split(/\s+/).length;
    const sentenceCount = content.split(/[.!?]+/).length;
    const avgWordsPerSentence = wordCount / sentenceCount;
    
    // Vérifications de base
    if (wordCount < 50) {
      newSuggestions.push({
        type: 'warning',
        message: `Contenu trop court (${wordCount} mots). Visez au moins 100 mots pour un ${contentType}.`
      });
    }
    
    if (avgWordsPerSentence > 25) {
      newSuggestions.push({
        type: 'warning',
        message: `Phrases trop longues (moyenne ${Math.round(avgWordsPerSentence)} mots/phrase). Visez 15-20 mots maximum.`
      });
    }
    
    if (!content.match(/\?/)) {
      newSuggestions.push({
        type: 'tip',
        message: 'Ajoutez des questions pour augmenter l\'engagement.'
      });
    }
    
    if (!content.match(/\b(vous|votre|vos)\b/gi)) {
      newSuggestions.push({
        type: 'error',
        message: 'Utilisez "vous" pour personnaliser le message et créer une connexion.'
      });
    }
    
    const ctaMatches = content.match(/\b(cliquez|téléchargez|inscrivez|découvrez|commencez|réservez)\b/gi);
    if (!ctaMatches || ctaMatches.length === 0) {
      newSuggestions.push({
        type: 'error',
        message: 'Aucun CTA (Call-To-Action) détecté. Ajoutez un appel à l\'action clair.'
      });
    }
    
    if (!content.match(/\b(\d+%|\d+x|€|\$)\b/)) {
      newSuggestions.push({
        type: 'tip',
        message: 'Ajoutez des chiffres concrets pour renforcer la crédibilité.'
      });
    }
    
    // Détection de frameworks (simple)
    const frameworks: FrameworkDetection[] = [];
    
    // PFPMA
    const hasProblem = content.toLowerCase().includes('problème') || content.toLowerCase().includes('difficulté');
    const hasFormula = content.toLowerCase().includes('méthode') || content.toLowerCase().includes('formule') || content.toLowerCase().includes('solution');
    const hasProof = content.match(/\b(\d+%|\d+x)\b/) !== null;
    const hasMethod = content.toLowerCase().includes('étape') || content.toLowerCase().includes('processus');
    const hasAppeal = ctaMatches !== null;
    
    if (hasProblem || hasFormula) {
      frameworks.push({
        name: 'PFPMA',
        confidence: [hasProblem, hasFormula, hasProof, hasMethod, hasAppeal].filter(Boolean).length * 20,
        steps: [
          { step: 'Problème', present: hasProblem },
          { step: 'Formule', present: hasFormula },
          { step: 'Preuve', present: hasProof },
          { step: 'Méthode', present: hasMethod },
          { step: 'Appel', present: hasAppeal }
        ]
      });
    }
    
    // AIDA
    const hasAttention = content.split('\n')[0]?.match(/[!?]/) !== null;
    const hasInterest = content.toLowerCase().includes('découvrez') || content.toLowerCase().includes('imaginez');
    const hasDesire = content.toLowerCase().includes('bénéfice') || content.toLowerCase().includes('avantage');
    
    if (hasAttention || hasInterest) {
      frameworks.push({
        name: 'AIDA',
        confidence: [hasAttention, hasInterest, hasDesire, hasAppeal].filter(Boolean).length * 25,
        steps: [
          { step: 'Attention', present: hasAttention },
          { step: 'Intérêt', present: hasInterest },
          { step: 'Désir', present: hasDesire },
          { step: 'Action', present: hasAppeal }
        ]
      });
    }
    
    setSuggestions(newSuggestions);
    setDetectedFrameworks(frameworks.sort((a, b) => b.confidence - a.confidence));
    
    // Calculer le score de qualité
    let score = 50; // Base
    if (wordCount >= 100) score += 10;
    if (avgWordsPerSentence <= 20) score += 10;
    if (content.match(/\?/)) score += 5;
    if (content.match(/\b(vous|votre|vos)\b/gi)) score += 10;
    if (ctaMatches && ctaMatches.length > 0) score += 15;
    if (content.match(/\b(\d+%|\d+x|€|\$)\b/)) score += 10;
    
    setQualityScore(Math.min(100, score));
    setIsAnalyzing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast.success('Contenu copié dans le presse-papiers !');
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `copy-${contentType}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Contenu téléchargé !');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
            Éditeur de Copy en Temps Réel
          </div>
          <h1 className="text-5xl font-bold mb-4">
            Écrivez avec l'<span className="text-accent">IA Sionohmair</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Suggestions en direct, détection de frameworks, et score de qualité pendant que vous écrivez.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Éditeur */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Votre Copy</CardTitle>
                <CardDescription>
                  Écrivez votre contenu et recevez des suggestions en temps réel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Type de contenu */}
                <div className="space-y-2">
                  <Label htmlFor="contentType">Type de contenu</Label>
                  <Select value={contentType} onValueChange={setContentType}>
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

                {/* Éditeur */}
                <div className="space-y-2">
                  <Label htmlFor="content">Contenu</Label>
                  <Textarea
                    id="content"
                    placeholder="Commencez à écrire votre copy ici..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={20}
                    className="font-mono text-sm"
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{content.split(/\s+/).filter(Boolean).length} mots • {content.length} caractères</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleCopy} disabled={!content}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copier
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleDownload} disabled={!content}>
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panneau de suggestions */}
          <div className="space-y-6">
            {/* Score de qualité */}
            <Card className={
              qualityScore >= 80 ? 'border-green-200 bg-green-50' :
              qualityScore >= 60 ? 'border-yellow-200 bg-yellow-50' :
              'border-red-200 bg-red-50'
            }>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Score de Qualité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">
                    {qualityScore}<span className="text-2xl text-muted-foreground">/100</span>
                  </div>
                  <div className="w-full bg-secondary/20 rounded-full h-3 mb-2">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        qualityScore >= 80 ? 'bg-green-600' :
                        qualityScore >= 60 ? 'bg-yellow-600' :
                        'bg-red-600'
                      }`}
                      style={{ width: `${qualityScore}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {qualityScore >= 80 ? 'Excellent !' :
                     qualityScore >= 60 ? 'Bon, mais améliorable' :
                     'Nécessite des améliorations'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Frameworks détectés */}
            {detectedFrameworks.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-accent" />
                    Frameworks Détectés
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {detectedFrameworks.map((framework, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{framework.name}</span>
                        <Badge variant={framework.confidence >= 60 ? 'default' : 'secondary'}>
                          {framework.confidence}%
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        {framework.steps.map((step, j) => (
                          <div key={j} className="flex items-center gap-2 text-sm">
                            {step.present ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            )}
                            <span className={step.present ? 'text-foreground' : 'text-muted-foreground'}>
                              {step.step}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-accent" />
                    Suggestions ({suggestions.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {suggestions.map((suggestion, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-2 p-3 rounded-lg border ${
                        suggestion.type === 'error' ? 'bg-red-50 border-red-200' :
                        suggestion.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                        'bg-blue-50 border-blue-200'
                      }`}
                    >
                      {suggestion.type === 'error' ? (
                        <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      ) : suggestion.type === 'warning' ? (
                        <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      )}
                      <p className="text-sm">{suggestion.message}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* État vide */}
            {content.trim() === '' && (
              <Card>
                <CardContent className="py-12 text-center">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Commencez à écrire pour recevoir des suggestions en temps réel
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
