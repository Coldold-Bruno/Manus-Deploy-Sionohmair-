import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  FileText, 
  Users, 
  Sparkles,
  TrendingUp,
  Eye,
  Copy,
  Search
} from 'lucide-react';
import { trpc } from '@/lib/trpc';

export default function UserDashboard() {
  // Récupérer les données utilisateur
  const { data: analyses = [] } = trpc.contentMarketing.getMyAnalyses.useQuery();
  const { data: copies = [] } = trpc.contentMarketing.getMyCopies.useQuery();
  const { data: avatars = [] } = trpc.contentMarketing.getMyAvatars.useQuery();

  // Calculer les statistiques
  const totalAnalyses = analyses.length;
  const totalCopies = copies.length;
  const totalAvatars = avatars.length;
  
  // Score moyen des analyses
  const avgScore = analyses.length > 0
    ? Math.round(analyses.reduce((sum: number, a: any) => sum + (a.globalScore || 0), 0) / analyses.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">
            Votre <span className="text-accent">Dashboard</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Suivez vos analyses, copies générées, et avatars clients en un coup d'œil
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Analyses de Contenu</CardDescription>
              <CardTitle className="text-4xl flex items-center gap-2">
                {totalAnalyses}
                <Search className="h-6 w-6 text-accent" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Score moyen : <span className="font-semibold text-accent">{avgScore}/100</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Copies Générées</CardDescription>
              <CardTitle className="text-4xl flex items-center gap-2">
                {totalCopies}
                <FileText className="h-6 w-6 text-accent" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Prêtes à utiliser
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Avatars Clients</CardDescription>
              <CardTitle className="text-4xl flex items-center gap-2">
                {totalAvatars}
                <Users className="h-6 w-6 text-accent" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Personas créés
              </p>
            </CardContent>
          </Card>

          <Card className="bg-accent/5 border-accent/20">
            <CardHeader className="pb-3">
              <CardDescription>Progression</CardDescription>
              <CardTitle className="text-4xl flex items-center gap-2 text-accent">
                <TrendingUp className="h-8 w-8" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Vous progressez ! 🚀
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs : Historique */}
        <Tabs defaultValue="analyses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
            <TabsTrigger value="analyses">Analyses</TabsTrigger>
            <TabsTrigger value="copies">Copies</TabsTrigger>
            <TabsTrigger value="avatars">Avatars</TabsTrigger>
          </TabsList>

          {/* Tab Analyses */}
          <TabsContent value="analyses" className="space-y-4">
            {analyses.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Aucune analyse pour le moment
                  </p>
                  <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <a href="/content-analyzer">Analyser du contenu</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              analyses.map((analysis: any) => (
                <Card key={analysis.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{analysis.title || 'Analyse sans titre'}</CardTitle>
                        <CardDescription>
                          {new Date(analysis.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </CardDescription>
                      </div>
                      <Badge className={
                        analysis.globalScore >= 80 ? 'bg-green-100 text-green-800' :
                        analysis.globalScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {analysis.globalScore}/100
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-5 gap-4 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">SEO</p>
                        <p className="font-semibold">{analysis.seoScore || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Conversion</p>
                        <p className="font-semibold">{analysis.conversionScore || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Engagement</p>
                        <p className="font-semibold">{analysis.engagementScore || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Lisibilité</p>
                        <p className="font-semibold">{analysis.readabilityScore || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Psychologie</p>
                        <p className="font-semibold">{analysis.psychologyScore || 0}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href="/content-analyzer">Voir détails</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Tab Copies */}
          <TabsContent value="copies" className="space-y-4">
            {copies.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Aucune copy générée pour le moment
                  </p>
                  <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <a href="/copy-generator">Générer du copy</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              copies.map((copy: any) => (
                <Card key={copy.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{copy.brief?.substring(0, 60)}...</CardTitle>
                        <CardDescription>
                          {new Date(copy.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">{copy.contentType}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-secondary/10 p-4 rounded-lg border mb-4 max-h-32 overflow-y-auto">
                      <p className="text-sm whitespace-pre-wrap">
                        {copy.generatedContent?.substring(0, 300)}...
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(copy.generatedContent);
                        }}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copier
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href="/copy-generator">Voir détails</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Tab Avatars */}
          <TabsContent value="avatars" className="space-y-4">
            {avatars.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Aucun avatar client créé pour le moment
                  </p>
                  <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <a href="/avatar-builder">Créer un avatar</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {avatars.map((avatar: any) => (
                  <Card key={avatar.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{avatar.name}</CardTitle>
                        <Badge>{avatar.age} ans</Badge>
                      </div>
                      <CardDescription>{avatar.occupation}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm font-semibold mb-1">Problème principal</p>
                        <p className="text-sm text-muted-foreground">{avatar.painPoints}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-1">Objectifs</p>
                        <p className="text-sm text-muted-foreground">{avatar.goals}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-1">Comportement</p>
                        <p className="text-sm text-muted-foreground">{avatar.behavior}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild className="w-full mt-4">
                        <a href="/avatar-builder">Modifier</a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <Card className="mt-8 bg-accent/5 border-accent/20 text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Continuez à Optimiser Votre Copywriting</CardTitle>
            <CardDescription>
              Utilisez nos outils pour créer du contenu qui convertit
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4 justify-center">
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <a href="/content-analyzer">
                <Search className="mr-2 h-5 w-5" />
                Analyser du contenu
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="/copy-generator">
                <Sparkles className="mr-2 h-5 w-5" />
                Générer du copy
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="/avatar-builder">
                <Users className="mr-2 h-5 w-5" />
                Créer un avatar
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
