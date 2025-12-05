/**
 * Page de gestion des segments personnalisés avancés
 */

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Users, TrendingUp, RefreshCw, Trash2, Edit, BarChart3 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

type Criterion = {
  field: 'leadScore' | 'leadTemperature' | 'interests' | 'engagementScore' | 'subscribedAt' | 'status';
  operator: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'contains' | 'notContains' | 'between';
  value: string | number | (string | number)[];
};

export default function CustomSegments() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedSegmentId, setSelectedSegmentId] = useState<number | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logic, setLogic] = useState<'AND' | 'OR'>('AND');
  const [criteria, setCriteria] = useState<Criterion[]>([
    { field: 'leadScore', operator: 'greaterThan', value: 80 }
  ]);

  // Récupérer tous les segments
  const { data: segments, isLoading, refetch } = trpc.customSegments.getAllSegments.useQuery();

  // Récupérer l'analyse d'un segment
  const { data: analysis, isLoading: loadingAnalysis } = trpc.customSegments.analyzeSegment.useQuery(
    { id: selectedSegmentId! },
    { enabled: !!selectedSegmentId }
  );

  // Mutations
  const createMutation = trpc.customSegments.createSegment.useMutation({
    onSuccess: () => {
      toast.success('Segment créé avec succès !');
      setIsCreateDialogOpen(false);
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error('Erreur lors de la création', { description: error.message });
    }
  });

  const deleteMutation = trpc.customSegments.deleteSegment.useMutation({
    onSuccess: () => {
      toast.success('Segment supprimé');
      refetch();
    },
    onError: (error) => {
      toast.error('Erreur lors de la suppression', { description: error.message });
    }
  });

  const refreshMutation = trpc.customSegments.refreshSegmentCount.useMutation({
    onSuccess: (data) => {
      toast.success(`Segment mis à jour : ${data.count} leads`);
      refetch();
    },
    onError: (error) => {
      toast.error('Erreur lors du rafraîchissement', { description: error.message });
    }
  });

  const resetForm = () => {
    setName('');
    setDescription('');
    setLogic('AND');
    setCriteria([{ field: 'leadScore', operator: 'greaterThan', value: 80 }]);
  };

  const handleCreateSegment = () => {
    if (!name) {
      toast.error('Le nom est requis');
      return;
    }

    createMutation.mutate({
      name,
      description,
      criteria,
      logic
    });
  };

  const addCriterion = () => {
    setCriteria([...criteria, { field: 'leadScore', operator: 'greaterThan', value: 0 }]);
  };

  const removeCriterion = (index: number) => {
    setCriteria(criteria.filter((_, i) => i !== index));
  };

  const updateCriterion = (index: number, updates: Partial<Criterion>) => {
    const newCriteria = [...criteria];
    newCriteria[index] = { ...newCriteria[index], ...updates };
    setCriteria(newCriteria);
  };

  const fieldLabels: Record<Criterion['field'], string> = {
    leadScore: 'Score de Lead',
    leadTemperature: 'Température',
    interests: 'Intérêts',
    engagementScore: 'Score d\'Engagement',
    subscribedAt: 'Date d\'Inscription',
    status: 'Statut'
  };

  const operatorLabels: Record<Criterion['operator'], string> = {
    equals: 'Égal à',
    notEquals: 'Différent de',
    greaterThan: 'Supérieur à',
    lessThan: 'Inférieur à',
    contains: 'Contient',
    notContains: 'Ne contient pas',
    between: 'Entre'
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 space-y-8">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="h-8 w-8" />
              Segments Personnalisés
            </h1>
            <p className="text-muted-foreground mt-2">
              Créez des segments avancés avec critères multiples pour cibler vos campagnes
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Créer un Segment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Créer un Nouveau Segment</DialogTitle>
                <DialogDescription>
                  Définissez les critères pour segmenter vos leads
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Nom et description */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom du segment *</Label>
                    <Input
                      id="name"
                      placeholder="Ex: Leads chauds intéressés par N2"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Décrivez ce segment..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logic">Logique de combinaison</Label>
                    <Select value={logic} onValueChange={(v) => setLogic(v as 'AND' | 'OR')}>
                      <SelectTrigger id="logic">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AND">ET (tous les critères doivent être vrais)</SelectItem>
                        <SelectItem value="OR">OU (au moins un critère doit être vrai)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Critères */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Critères</Label>
                    <Button variant="outline" size="sm" onClick={addCriterion}>
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter un critère
                    </Button>
                  </div>

                  {criteria.map((criterion, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Champ</Label>
                            <Select 
                              value={criterion.field} 
                              onValueChange={(v) => updateCriterion(index, { field: v as Criterion['field'] })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(fieldLabels).map(([value, label]) => (
                                  <SelectItem key={value} value={value}>{label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Opérateur</Label>
                            <Select 
                              value={criterion.operator} 
                              onValueChange={(v) => updateCriterion(index, { operator: v as Criterion['operator'] })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(operatorLabels).map(([value, label]) => (
                                  <SelectItem key={value} value={value}>{label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label>Valeur</Label>
                              {criteria.length > 1 && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => removeCriterion(index)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              )}
                            </div>
                            <Input
                              value={criterion.value as string}
                              onChange={(e) => updateCriterion(index, { value: e.target.value })}
                              placeholder="Valeur..."
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Button 
                  onClick={handleCreateSegment} 
                  disabled={createMutation.isPending}
                  className="w-full"
                >
                  {createMutation.isPending ? 'Création...' : 'Créer le Segment'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Liste des segments */}
        {isLoading ? (
          <div className="text-center py-12">
            <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Chargement des segments...</p>
          </div>
        ) : segments && segments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {segments.map((segment) => (
              <Card key={segment.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{segment.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedSegmentId(segment.id)}
                    >
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                  {segment.description && (
                    <CardDescription className="line-clamp-2">{segment.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Leads :</span>
                    <span className="font-semibold text-lg">{segment.leadCount}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Logique :</span>
                    <span className="font-medium">{segment.logic}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Critères :</span>
                    <span className="font-medium">{segment.criteria.length}</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => refreshMutation.mutate({ id: segment.id })}
                      disabled={refreshMutation.isPending}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Rafraîchir
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate({ id: segment.id })}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Aucun segment personnalisé</h3>
              <p className="text-muted-foreground mb-4">
                Créez votre premier segment pour commencer à cibler vos campagnes
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Créer un Segment
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Analyse du segment sélectionné */}
        {selectedSegmentId && (
          <Dialog open={!!selectedSegmentId} onOpenChange={() => setSelectedSegmentId(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Analyse du Segment</DialogTitle>
                <DialogDescription>
                  Performance et statistiques détaillées
                </DialogDescription>
              </DialogHeader>
              
              {loadingAnalysis ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground">Analyse en cours...</p>
                </div>
              ) : analysis && (
                <div className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{analysis.totalLeads}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Score Moyen</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{analysis.avgScore}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Engagement Moyen</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{analysis.avgEngagement}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Leads Chauds</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-orange-600">{analysis.hotLeads}</div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Répartition par Température</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Chaud</span>
                          <span className="font-medium">{analysis.hotLeads}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Tiède</span>
                          <span className="font-medium">{analysis.warmLeads}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Froid</span>
                          <span className="font-medium">{analysis.coldLeads}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
}
