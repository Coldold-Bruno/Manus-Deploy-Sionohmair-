import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, Download, Sparkles, FileText, Star } from 'lucide-react';
import { toast } from 'sonner';
import { toggleTemplateFavorite, isTemplateFavorite, getFavorites } from '@/lib/favorites';

interface Template {
  id: string;
  name: string;
  framework: string;
  category: string;
  type: string;
  description: string;
  content: string;
  variables: string[];
}

const TEMPLATES: Template[] = [
  // PFPMA Templates
  {
    id: 'pfpma-landing',
    name: 'Landing Page PFPMA',
    framework: 'PFPMA',
    category: 'sionohmair',
    type: 'Landing Page',
    description: 'Template de landing page optimisé avec le framework PFPMA (Facteur Alpha α = 22.67)',
    variables: ['[PROBLÈME]', '[FORMULE]', '[PREUVE_CHIFFRE]', '[MÉTHODE_ÉTAPE1]', '[MÉTHODE_ÉTAPE2]', '[MÉTHODE_ÉTAPE3]', '[CTA]', '[PRIX]', '[URGENCE]'],
    content: `# [FORMULE] : La Solution à [PROBLÈME]

## Le Problème Que Vous Vivez Chaque Jour

[PROBLÈME]

Vous n'êtes pas seul. 85% des entrepreneurs rencontrent ce même obstacle.

## La Formule Qui Change Tout

Découvrez **[FORMULE]** : la méthode qui élimine les 3 frictions (Attention, Cognitive, Émotionnelle) pour transformer votre [DOMAINE].

## La Preuve Que Ça Fonctionne

[PREUVE_CHIFFRE]

Nos clients obtiennent en moyenne +340% de résultats grâce au Facteur Alpha (α = 22.67).

## La Méthode en 3 Étapes

### Étape 1 : [MÉTHODE_ÉTAPE1]
Diagnostic rapide de votre situation actuelle

### Étape 2 : [MÉTHODE_ÉTAPE2]  
Élimination des frictions identifiées

### Étape 3 : [MÉTHODE_ÉTAPE3]
Amplification des résultats par la clarté

## Passez à l'Action Maintenant

[CTA]

**Prix spécial** : [PRIX] au lieu de [PRIX_BARRÉ]  
⏰ [URGENCE]

[BOUTON_CTA]`
  },
  {
    id: 'pfpma-email',
    name: 'Email de Vente PFPMA',
    framework: 'PFPMA',
    category: 'sionohmair',
    type: 'Email',
    description: 'Email de conversion optimisé avec PFPMA pour maximiser les ventes',
    variables: ['[PRÉNOM]', '[PROBLÈME]', '[FORMULE]', '[PREUVE]', '[CTA]', '[LIEN]'],
    content: `Objet : [PRÉNOM], votre [PROBLÈME] a une solution (et elle est simple)

Bonjour [PRÉNOM],

Je sais que vous vivez [PROBLÈME] au quotidien.

Chaque jour, vous perdez du temps, de l'énergie, et des opportunités à cause de ce blocage.

Mais j'ai une bonne nouvelle.

J'ai créé **[FORMULE]** : une méthode qui élimine ce problème en 3 étapes simples.

La preuve ? [PREUVE]

Voici comment ça fonctionne :
1. Vous identifiez votre friction principale
2. Vous appliquez la formule adaptée
3. Vous amplifiez les résultats

C'est aussi simple que ça.

[CTA] : [LIEN]

À très vite,
[SIGNATURE]

PS : Cette offre expire dans 48h. Ne laissez pas passer cette opportunité.`
  },
  // APTEA Templates
  {
    id: 'aptea-article',
    name: 'Article de Blog APTEA',
    framework: 'APTEA',
    category: 'sionohmair',
    type: 'Article',
    description: 'Structure d\'article longue forme avec progression spirale ×81',
    variables: ['[HOOK]', '[PROBLÈME]', '[TRANSFORMATION]', '[PREUVE]', '[CTA]'],
    content: `# [HOOK]

## Introduction : Le Problème Invisible

[PROBLÈME]

90% des gens ne réalisent pas l'impact de ce problème sur leur vie quotidienne.

## La Transformation Possible

Imaginez si vous pouviez [TRANSFORMATION].

Votre vie serait radicalement différente. Voici comment.

## La Preuve Que C'est Possible

[PREUVE]

Des milliers de personnes ont déjà vécu cette transformation.

## Comment Passer à l'Action

[CTA]

Commencez dès aujourd'hui avec notre méthode éprouvée.

## Conclusion

La transformation commence maintenant. Êtes-vous prêt ?`
  },
  // AIDA Templates
  {
    id: 'aida-ad',
    name: 'Publicité AIDA',
    framework: 'AIDA',
    category: 'classique',
    type: 'Publicité',
    description: 'Template de publicité court et percutant avec AIDA',
    variables: ['[ATTENTION]', '[INTÉRÊT]', '[DÉSIR]', '[ACTION]'],
    content: `🚀 [ATTENTION]

[INTÉRÊT]

Imaginez [DÉSIR]...

👉 [ACTION]

[LIEN]`
  },
  // PAS Templates
  {
    id: 'pas-email',
    name: 'Cold Email PAS',
    framework: 'PAS',
    category: 'classique',
    type: 'Email',
    description: 'Email de prospection avec framework Problème-Agitation-Solution',
    variables: ['[PRÉNOM]', '[PROBLÈME]', '[AGITATION]', '[SOLUTION]', '[CTA]'],
    content: `Objet : [PRÉNOM], ce problème vous coûte cher

Bonjour [PRÉNOM],

J'ai remarqué que [PROBLÈME].

Savez-vous combien cela vous coûte ?

[AGITATION]

Chaque jour qui passe, vous perdez des opportunités.

Heureusement, il existe une solution simple : [SOLUTION].

[CTA]

Cordialement,
[SIGNATURE]`
  },
  // PASTOR Templates
  {
    id: 'pastor-vsl',
    name: 'VSL PASTOR',
    framework: 'PASTOR',
    category: 'classique',
    type: 'VSL',
    description: 'Script de Video Sales Letter complet avec PASTOR',
    variables: ['[PROBLÈME]', '[AMPLIFICATION]', '[SOLUTION]', '[TRANSFORMATION]', '[OFFRE]', '[GARANTIE]'],
    content: `# Script VSL PASTOR

## Problème (0:00-1:00)
[PROBLÈME]

## Amplification (1:00-2:30)
[AMPLIFICATION]

Pendant que vous regardez cette vidéo, le problème s'aggrave.

## Solution (2:30-4:00)
Mais j'ai découvert [SOLUTION].

## Transformation (4:00-6:00)
Imaginez [TRANSFORMATION].

C'est exactement ce que mes clients vivent chaque jour.

## Offre (6:00-8:00)
Aujourd'hui, je vous propose [OFFRE].

Prix spécial : [PRIX]

## Réponse (8:00-10:00)
Vous vous demandez peut-être...

[OBJECTIONS]

C'est pourquoi je vous offre [GARANTIE].

## CTA Final
Cliquez maintenant pour commencer votre transformation.`
  },
  // BAB Templates
  {
    id: 'bab-testimonial',
    name: 'Témoignage BAB',
    framework: 'BAB',
    category: 'classique',
    type: 'Témoignage',
    description: 'Structure de témoignage Before-After-Bridge',
    variables: ['[AVANT]', '[APRÈS]', '[MÉTHODE]'],
    content: `## Avant

[AVANT]

Ma situation était catastrophique. Je travaillais 60h/semaine pour des résultats médiocres.

## Après

[APRÈS]

Aujourd'hui, je travaille 25h/semaine et mes résultats ont triplé.

## Comment J'ai Fait

[MÉTHODE]

Grâce à cette méthode, ma vie a complètement changé.

Si vous vivez la même situation que moi "avant", je vous recommande vivement d'essayer.`
  }
];

export default function Templates() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Charger les favoris au montage
  useState(() => {
    if (typeof window !== 'undefined') {
      const { templates } = getFavorites();
      setFavorites(templates);
    }
  });

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success('Template copié dans le presse-papiers !');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (template: Template) => {
    const blob = new Blob([template.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.id}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Template téléchargé !');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
            Bibliothèque de Templates
          </div>
          <h1 className="text-5xl font-bold mb-4">
            Templates de <span className="text-accent">Scripts Copywriting</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Modèles prêts à l'emploi pour chaque framework. Copiez, personnalisez, et convertissez.
          </p>
        </div>

        {/* Tabs par catégorie */}
        <Tabs defaultValue="sionohmair" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="sionohmair">Sionohmair</TabsTrigger>
            <TabsTrigger value="classique">Classiques</TabsTrigger>
          </TabsList>

          <TabsContent value="sionohmair" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {TEMPLATES.filter(t => t.category === 'sionohmair').map((template) => (
                <Card key={template.id} className="border-accent/20">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-accent/10 text-accent">{template.framework}</Badge>
                      <Badge variant="outline">{template.type}</Badge>
                    </div>
                    <CardTitle className="text-2xl">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Variables */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Variables à personnaliser :</h4>
                      <div className="flex flex-wrap gap-2">
                        {template.variables.map((variable, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {variable}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="bg-secondary/10 p-4 rounded-lg border max-h-40 overflow-y-auto">
                      <pre className="text-xs whitespace-pre-wrap font-mono">
                        {template.content.substring(0, 200)}...
                      </pre>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleCopy(template.content, template.id)}
                        variant="default"
                        className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                      >
                        {copiedId === template.id ? (
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
                      <Button
                        onClick={() => handleDownload(template)}
                        variant="outline"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => {
                          const isFavorite = toggleTemplateFavorite(template.id);
                          setFavorites(prev => 
                            isFavorite 
                              ? [...prev, template.id] 
                              : prev.filter(id => id !== template.id)
                          );
                          toast.success(isFavorite ? 'Ajouté aux favoris' : 'Retiré des favoris');
                        }}
                        variant={favorites.includes(template.id) ? 'default' : 'outline'}
                        size="icon"
                      >
                        <Star className={`h-4 w-4 ${favorites.includes(template.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="classique" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {TEMPLATES.filter(t => t.category === 'classique').map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{template.framework}</Badge>
                      <Badge variant="secondary">{template.type}</Badge>
                    </div>
                    <CardTitle className="text-2xl">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Variables */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Variables à personnaliser :</h4>
                      <div className="flex flex-wrap gap-2">
                        {template.variables.map((variable, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {variable}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="bg-secondary/10 p-4 rounded-lg border max-h-40 overflow-y-auto">
                      <pre className="text-xs whitespace-pre-wrap font-mono">
                        {template.content.substring(0, 200)}...
                      </pre>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleCopy(template.content, template.id)}
                        variant="default"
                        className="flex-1"
                      >
                        {copiedId === template.id ? (
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
                      <Button
                        onClick={() => handleDownload(template)}
                        variant="outline"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => {
                          const isFavorite = toggleTemplateFavorite(template.id);
                          setFavorites(prev => 
                            isFavorite 
                              ? [...prev, template.id] 
                              : prev.filter(id => id !== template.id)
                          );
                          toast.success(isFavorite ? 'Ajouté aux favoris' : 'Retiré des favoris');
                        }}
                        variant={favorites.includes(template.id) ? 'default' : 'outline'}
                        size="icon"
                      >
                        <Star className={`h-4 w-4 ${favorites.includes(template.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <Card className="bg-accent/5 border-accent/20 text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Besoin d'Aide Pour Personnaliser ?</CardTitle>
            <CardDescription>
              Utilisez nos outils IA pour générer du contenu optimisé automatiquement
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4 justify-center">
            <a href="/copy-generator" className="inline-flex items-center justify-center rounded-md bg-accent text-accent-foreground px-6 py-3 font-medium hover:bg-accent/90 transition-colors">
              <Sparkles className="mr-2 h-5 w-5" />
              Générateur de Copy IA
            </a>
            <a href="/chat-ia" className="inline-flex items-center justify-center rounded-md border border-accent text-accent px-6 py-3 font-medium hover:bg-accent/10 transition-colors">
              <FileText className="mr-2 h-5 w-5" />
              Chat IA Copywriting
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
