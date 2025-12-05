import { useState, useEffect } from 'react';
import { ToolHeader } from '@/components/ToolHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Wand2, Copy, Check, Sparkles } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

const FRAMEWORKS = [
  {
    id: 'pfpma',
    name: 'PFPMA',
    category: 'sionohmair',
    description: 'Problème - Formule - Preuve - Méthode - Appel. Framework propriétaire Sionohmair basé sur le théorème spiralo-exponentiel (α = 22.67).',
    bestFor: ['Landing pages', 'Pages de vente', 'Emails de conversion']
  },
  {
    id: 'aptea',
    name: 'APTEA',
    category: 'sionohmair',
    description: 'Attention - Problème - Transformation - Évidence - Action. Optimisé pour contenus longs (progression ×81).',
    bestFor: ['Articles de blog', 'Webinaires', 'Formations']
  },
  {
    id: 'aida',
    name: 'AIDA',
    category: 'classique',
    description: 'Attention - Intérêt - Désir - Action. Framework classique simple et efficace.',
    bestFor: ['Emails', 'Publicités', 'Posts sociaux']
  },
  {
    id: 'pas',
    name: 'PAS',
    category: 'classique',
    description: 'Problème - Agitation - Solution. Orienté problème pour audiences conscientes.',
    bestFor: ['Emails de vente', 'Pages de capture', 'Cold emails']
  },
  {
    id: 'pastor',
    name: 'PASTOR',
    category: 'classique',
    description: 'Problème - Amplifier - Solution - Transformation - Offre - Réponse. Complet pour pages longues.',
    bestFor: ['Pages de vente longues', 'Webinaires', 'VSL']
  },
  {
    id: 'bab',
    name: 'BAB',
    category: 'classique',
    description: 'Before - After - Bridge. Simple et puissant pour montrer la transformation.',
    bestFor: ['Témoignages', 'Études de cas', 'Posts sociaux']
  }
];

export default function CopyGenerator() {
  const [selectedFramework, setSelectedFramework] = useState('pfpma');
  const [brief, setBrief] = useState('');
  const [tone, setTone] = useState('professionnel');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [keywords, setKeywords] = useState('');
  const [selectedAvatarId, setSelectedAvatarId] = useState<number | undefined>(undefined);
  const [generatedCopy, setGeneratedCopy] = useState('');
  const [copied, setCopied] = useState(false);

  const framework = FRAMEWORKS.find(f => f.id === selectedFramework);
  
  // Récupérer les avatars clients
  const { data: avatars = [] } = trpc.contentMarketing.getMyAvatars.useQuery();

  const generateCopyMutation = trpc.contentMarketing.generateCopy.useMutation({
    onSuccess: (data) => {
      setGeneratedCopy(data.generatedContent);
      toast.success('Copy générée avec succès !');
    },
    onError: (error) => {
      toast.error(`Erreur : ${error.message}`);
    }
  });

  const handleGenerate = () => {
    if (!brief.trim()) {
      toast.error('Veuillez entrer un brief');
      return;
    }

    generateCopyMutation.mutate({
      contentType: 'landing_page',
      brief,
      tone,
      length,
      keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
      avatarId: selectedAvatarId,
      frameworkName: framework?.name || 'PFPMA',
      frameworkDescription: framework?.description || ''
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCopy);
    setCopied(true);
    toast.success('Copy copiée dans le presse-papiers !');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <ToolHeader />
      <div className="py-12">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
            Générateur de Copy IA
          </div>
          <h1 className="text-5xl font-bold mb-4">
            Générez du Copy <span className="text-accent">Haute Conversion</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choisissez un framework de copywriting (PFPMA, APTEA, AIDA...), entrez votre brief, et laissez l'IA créer votre copy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sélection du framework */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Frameworks de Copywriting</CardTitle>
                <CardDescription>
                  Sélectionnez le framework adapté à votre objectif
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {FRAMEWORKS.map((fw) => (
                  <button
                    key={fw.id}
                    onClick={() => setSelectedFramework(fw.id)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedFramework === fw.id
                        ? 'border-accent bg-accent/5'
                        : 'border-border hover:border-accent/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold">{fw.name}</h3>
                      <Badge variant={fw.category === 'sionohmair' ? 'default' : 'secondary'}>
                        {fw.category === 'sionohmair' ? '⚡ Sionohmair' : 'Classique'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {fw.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {fw.bestFor.slice(0, 2).map((use, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {use}
                        </Badge>
                      ))}
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Formulaire et résultat */}
          <div className="lg:col-span-2 space-y-6">
            {/* Paramètres */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-accent" />
                  Framework sélectionné : {framework?.name}
                </CardTitle>
                <CardDescription>
                  {framework?.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="brief">Brief de votre contenu *</Label>
                  <Textarea
                    id="brief"
                    placeholder="Ex: Landing page pour un logiciel SaaS d'automatisation marketing. Cible : entrepreneurs et PME qui perdent du temps dans des tâches répétitives. Promesse : gagner 15h/semaine grâce à l'IA."
                    value={brief}
                    onChange={(e) => setBrief(e.target.value)}
                    rows={6}
                  />
                  <p className="text-sm text-muted-foreground">
                    Décrivez votre produit/service, votre audience cible, et votre promesse principale
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tone">Ton</Label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professionnel">Professionnel</SelectItem>
                        <SelectItem value="amical">Amical</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="inspirant">Inspirant</SelectItem>
                        <SelectItem value="educatif">Éducatif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="length">Longueur</Label>
                    <Select value={length} onValueChange={(value) => setLength(value as 'short' | 'medium' | 'long')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Court (100-200 mots)</SelectItem>
                        <SelectItem value="medium">Moyen (200-400 mots)</SelectItem>
                        <SelectItem value="long">Long (400-800 mots)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="avatar">Avatar Client (optionnel)</Label>
                    <Select value={selectedAvatarId?.toString()} onValueChange={(value) => setSelectedAvatarId(value === 'none' ? undefined : parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un avatar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Aucun avatar</SelectItem>
                        {avatars.map((avatar: any) => (
                          <SelectItem key={avatar.id} value={avatar.id.toString()}>
                            {avatar.name} ({avatar.age} ans - {avatar.occupation})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Personnalisez le copy selon votre audience cible
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="keywords">Mots-clés (optionnel)</Label>
                    <Input
                      id="keywords"
                      placeholder="Ex: automation, IA, productivité (séparés par des virgules)"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={generateCopyMutation.isPending}
                  size="lg"
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {generateCopyMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-5 w-5" />
                      Générer la copy
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Résultat */}
            {generatedCopy && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Copy Générée</CardTitle>
                    <Button
                      onClick={handleCopy}
                      variant="outline"
                      size="sm"
                    >
                      {copied ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Copié !
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copier
                        </>
                      )}
                    </Button>
                  </div>
                  <CardDescription>
                    Framework : {framework?.name} | Ton : {tone} | Longueur : {length}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-secondary/50 p-6 rounded-lg whitespace-pre-wrap font-serif text-base leading-relaxed">
                    {generatedCopy}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Guide du framework */}
            {!generatedCopy && (
              <Card className="bg-accent/5 border-accent/20">
                <CardHeader>
                  <CardTitle className="text-accent">
                    Guide du framework {framework?.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm">
                      <strong>Idéal pour :</strong> {framework?.bestFor.join(', ')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {framework?.description}
                    </p>
                    {framework?.category === 'sionohmair' && (
                      <div className="bg-background/50 p-4 rounded-lg border border-accent/20">
                        <p className="text-sm font-medium text-accent mb-2">
                          ⚡ Méthodologie Sionohmair Insight Academy
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {framework.id === 'pfpma' && (
                            'Élimine les 3 frictions (Attention, Cognitive, Émotionnelle) pour maximiser la clarté et la conversion. Facteur Alpha α = 22.67 : chaque friction corrigée multiplie l\'impact.'
                          )}
                          {framework.id === 'aptea' && (
                            'Progression spirale exponentielle : Attention (×1) → Problème (×3) → Transformation (×9) → Évidence (×27) → Action (×81). Idéal pour contenus longs et éducatifs.'
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
