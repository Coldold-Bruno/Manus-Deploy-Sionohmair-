import { useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Play, Pause, Users, Mail, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function EmailWorkflows() {
  const [, setLocation] = useLocation();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [workflowTrigger, setWorkflowTrigger] = useState<'manual' | 'new_subscriber' | 'interest_sprint' | 'interest_n3' | 'interest_ia' | 'inactive_30d'>('manual');
  const [steps, setSteps] = useState<Array<{ delayHours: number; templateId: number }>>([
    { delayHours: 0, templateId: 0 },
  ]);

  // Queries
  const { data: workflows, refetch: refetchWorkflows } = trpc.emailWorkflows.getWorkflows.useQuery();
  const { data: templates } = trpc.emailTemplates.getTemplates.useQuery();

  // Mutations
  const createWorkflowMutation = trpc.emailWorkflows.createWorkflow.useMutation({
    onSuccess: () => {
      toast.success('Workflow créé avec succès !');
      setShowCreateForm(false);
      resetForm();
      refetchWorkflows();
    },
    onError: (error) => {
      toast.error(`Erreur : ${error.message}`);
    },
  });

  const toggleWorkflowMutation = trpc.emailWorkflows.toggleWorkflow.useMutation({
    onSuccess: () => {
      toast.success('Statut du workflow mis à jour');
      refetchWorkflows();
    },
  });

  const processWorkflowsMutation = trpc.emailWorkflows.processWorkflows.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.emailsSent} emails envoyés, ${data.errors} erreurs`);
    },
  });

  const resetForm = () => {
    setWorkflowName('');
    setWorkflowDescription('');
    setWorkflowTrigger('manual');
    setSteps([{ delayHours: 0, templateId: 0 }]);
  };

  const handleAddStep = () => {
    setSteps([...steps, { delayHours: 24, templateId: 0 }]);
  };

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleStepChange = (index: number, field: 'delayHours' | 'templateId', value: number) => {
    const newSteps = [...steps];
    newSteps[index][field] = value;
    setSteps(newSteps);
  };

  const handleCreateWorkflow = () => {
    if (!workflowName.trim()) {
      toast.error('Le nom du workflow est requis');
      return;
    }

    const validSteps = steps.filter(s => s.templateId > 0);
    if (validSteps.length === 0) {
      toast.error('Au moins une étape avec un template est requise');
      return;
    }

    createWorkflowMutation.mutate({
      name: workflowName,
      description: workflowDescription,
      trigger: workflowTrigger,
      steps: validSteps,
    });
  };

  const triggerLabels = {
    manual: 'Manuel',
    new_subscriber: 'Nouvel abonné',
    interest_sprint: 'Intérêt Sprint de Clarté',
    interest_n3: 'Intérêt Niveau 3',
    interest_ia: 'Intérêt Automatisation IA',
    inactive_30d: 'Inactif 30 jours',
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation('/admin')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Workflows d'Emails Automatiques</h1>
              <p className="text-muted-foreground">
                Créez des séquences d'emails automatisées pour nurturing
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => processWorkflowsMutation.mutate()}
              disabled={processWorkflowsMutation.isPending}
            >
              <Clock className="h-4 w-4 mr-2" />
              Traiter maintenant
            </Button>
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Workflow
            </Button>
          </div>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Créer un Nouveau Workflow</CardTitle>
              <CardDescription>
                Définissez une séquence d'emails automatique
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Nom du Workflow</Label>
                <Input
                  id="name"
                  placeholder="Ex: Séquence de bienvenue"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (optionnel)</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez l'objectif de ce workflow..."
                  value={workflowDescription}
                  onChange={(e) => setWorkflowDescription(e.target.value)}
                  rows={2}
                />
              </div>

              {/* Trigger */}
              <div className="space-y-2">
                <Label htmlFor="trigger">Déclencheur</Label>
                <Select
                  value={workflowTrigger}
                  onValueChange={(value: any) => setWorkflowTrigger(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(triggerLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Steps */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Étapes du Workflow</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddStep}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une étape
                  </Button>
                </div>

                <div className="space-y-3">
                  {steps.map((step, index) => (
                    <div key={index} className="flex gap-3 items-end p-4 border rounded-lg">
                      <div className="flex-1 space-y-2">
                        <Label className="text-sm">Étape {index + 1}</Label>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs text-muted-foreground">Délai (heures)</Label>
                            <Input
                              type="number"
                              min="0"
                              value={step.delayHours}
                              onChange={(e) => handleStepChange(index, 'delayHours', parseInt(e.target.value) || 0)}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Template</Label>
                            <Select
                              value={step.templateId.toString()}
                              onValueChange={(value) => handleStepChange(index, 'templateId', parseInt(value))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner..." />
                              </SelectTrigger>
                              <SelectContent>
                                {templates?.map((template) => (
                                  <SelectItem key={template.id} value={template.id.toString()}>
                                    {template.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      {steps.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveStep(index)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleCreateWorkflow}
                  disabled={createWorkflowMutation.isPending}
                >
                  Créer le Workflow
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    resetForm();
                  }}
                >
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Workflows List */}
        <div className="grid gap-4">
          {workflows?.map((workflow) => (
            <Card key={workflow.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <CardTitle>{workflow.name}</CardTitle>
                      <Badge variant={workflow.active ? "default" : "secondary"}>
                        {workflow.active ? 'Actif' : 'Inactif'}
                      </Badge>
                      <Badge variant="outline">
                        {triggerLabels[workflow.trigger]}
                      </Badge>
                    </div>
                    {workflow.description && (
                      <CardDescription className="mt-2">
                        {workflow.description}
                      </CardDescription>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleWorkflowMutation.mutate({
                      id: workflow.id,
                      active: !workflow.active,
                    })}
                  >
                    {workflow.active ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Désactiver
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Activer
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm font-medium">Étapes ({workflow.steps?.length || 0})</div>
                  <div className="space-y-2">
                    {workflow.steps?.map((step: any, index: number) => {
                      const template = templates?.find(t => t.id === step.templateId);
                      return (
                        <div key={step.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{template?.name || 'Template inconnu'}</div>
                            <div className="text-xs text-muted-foreground">
                              Délai : {step.delayHours}h {index === 0 ? '(depuis le début)' : '(depuis l\'étape précédente)'}
                            </div>
                          </div>
                          <Mail className="h-4 w-4 text-muted-foreground" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {workflows?.length === 0 && !showCreateForm && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Mail className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">Aucun workflow créé</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Créez votre premier workflow d'emails automatiques
                </p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un Workflow
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
