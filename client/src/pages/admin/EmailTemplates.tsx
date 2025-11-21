import { useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Edit, Trash2, Eye, FileText } from 'lucide-react';

const CATEGORIES = [
  { value: 'welcome', label: 'Bienvenue', color: 'bg-blue-500' },
  { value: 'resource', label: 'Ressource Gratuite', color: 'bg-green-500' },
  { value: 'promotion', label: 'Promotion Sprint', color: 'bg-orange-500' },
  { value: 'reactivation', label: 'Relance Inactifs', color: 'bg-red-500' },
  { value: 'newsletter', label: 'Newsletter', color: 'bg-purple-500' },
] as const;

const AVAILABLE_VARIABLES = [
  { key: 'nom', description: 'Nom du destinataire' },
  { key: 'email', description: 'Email du destinataire' },
  { key: 'score', description: 'Score du lead (0-100)' },
  { key: 'interets', description: 'Intérêts du lead' },
];

export default function EmailTemplates() {
  const [, setLocation] = useLocation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'welcome' | 'resource' | 'promotion' | 'reactivation' | 'newsletter'>('welcome');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  // Queries
  const { data: templates, refetch } = trpc.emailTemplates.getTemplates.useQuery(
    filterCategory !== 'all' ? { category: filterCategory as any } : undefined
  );

  // Mutations
  const createMutation = trpc.emailTemplates.createTemplate.useMutation({
    onSuccess: () => {
      toast.success('Template créé avec succès');
      refetch();
      resetForm();
      setIsCreateDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Erreur : ${error.message}`);
    },
  });

  const updateMutation = trpc.emailTemplates.updateTemplate.useMutation({
    onSuccess: () => {
      toast.success('Template mis à jour avec succès');
      refetch();
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Erreur : ${error.message}`);
    },
  });

  const deleteMutation = trpc.emailTemplates.deleteTemplate.useMutation({
    onSuccess: () => {
      toast.success('Template supprimé avec succès');
      refetch();
    },
    onError: (error) => {
      toast.error(`Erreur : ${error.message}`);
    },
  });

  const { data: preview } = trpc.emailTemplates.previewTemplate.useQuery(
    {
      subject: selectedTemplate?.subject || '',
      content: selectedTemplate?.content || '',
      variables: {
        nom: 'Jean Dupont',
        email: 'jean.dupont@example.com',
        score: '85',
        interets: 'Sprint de Clarté, Niveau 3',
      },
    },
    { enabled: !!selectedTemplate && isPreviewDialogOpen }
  );

  const resetForm = () => {
    setName('');
    setCategory('welcome');
    setSubject('');
    setContent('');
  };

  const handleCreate = () => {
    createMutation.mutate({
      name,
      category,
      subject,
      content,
      variables: AVAILABLE_VARIABLES.map(v => v.key),
    });
  };

  const handleEdit = (template: any) => {
    setSelectedTemplate(template);
    setName(template.name);
    setCategory(template.category);
    setSubject(template.subject);
    setContent(template.content);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedTemplate) return;

    updateMutation.mutate({
      id: selectedTemplate.id,
      name,
      category,
      subject,
      content,
      variables: AVAILABLE_VARIABLES.map(v => v.key),
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) {
      deleteMutation.mutate({ id });
    }
  };

  const handlePreview = (template: any) => {
    setSelectedTemplate(template);
    setIsPreviewDialogOpen(true);
  };

  const getCategoryLabel = (cat: string) => {
    return CATEGORIES.find(c => c.value === cat)?.label || cat;
  };

  const getCategoryColor = (cat: string) => {
    return CATEGORIES.find(c => c.value === cat)?.color || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation('/admin')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Templates d'Emails</h1>
            <p className="text-gray-600 mt-1">Gérez votre bibliothèque de templates réutilisables</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nouveau Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Créer un Nouveau Template</DialogTitle>
                <DialogDescription>
                  Créez un template d'email réutilisable avec des variables dynamiques
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="name">Nom du Template</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Email de bienvenue"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Catégorie</Label>
                  <Select value={category} onValueChange={(value: any) => setCategory(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subject">Sujet de l'Email</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Ex: Bienvenue {{nom}} chez Sionohmair Insight Academy !"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Utilisez les variables : {AVAILABLE_VARIABLES.map(v => `{{${v.key}}}`).join(', ')}
                  </p>
                </div>

                <div>
                  <Label htmlFor="content">Contenu HTML</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="<h1>Bonjour {{nom}} !</h1><p>Bienvenue dans notre communauté...</p>"
                    rows={12}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Variables Disponibles</h4>
                  <div className="space-y-1">
                    {AVAILABLE_VARIABLES.map((variable) => (
                      <div key={variable.key} className="text-sm">
                        <code className="bg-blue-100 px-2 py-1 rounded text-blue-900">
                          {`{{${variable.key}}}`}
                        </code>
                        <span className="text-gray-600 ml-2">- {variable.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setIsCreateDialogOpen(false);
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleCreate}
                    disabled={!name || !subject || !content || createMutation.isPending}
                  >
                    {createMutation.isPending ? 'Création...' : 'Créer le Template'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Label>Filtrer par catégorie :</Label>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={filterCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterCategory('all')}
                >
                  Toutes
                </Button>
                {CATEGORIES.map((cat) => (
                  <Button
                    key={cat.value}
                    variant={filterCategory === cat.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterCategory(cat.value)}
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Templates List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates?.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription className="mt-1">
                      <Badge className={`${getCategoryColor(template.category)} text-white`}>
                        {getCategoryLabel(template.category)}
                      </Badge>
                    </CardDescription>
                  </div>
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Sujet :</p>
                    <p className="text-sm text-gray-600 truncate">{template.subject}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => handlePreview(template)}
                    >
                      <Eye className="h-4 w-4" />
                      Prévisualiser
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(template)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(template.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {templates?.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                {filterCategory === 'all' 
                  ? 'Aucun template créé pour le moment'
                  : `Aucun template dans la catégorie "${getCategoryLabel(filterCategory)}"`
                }
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                Créer votre premier template
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier le Template</DialogTitle>
              <DialogDescription>
                Modifiez les informations de votre template
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="edit-name">Nom du Template</Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="edit-category">Catégorie</Label>
                <Select value={category} onValueChange={(value: any) => setCategory(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-subject">Sujet de l'Email</Label>
                <Input
                  id="edit-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="edit-content">Contenu HTML</Label>
                <Textarea
                  id="edit-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleUpdate}
                  disabled={!name || !subject || !content || updateMutation.isPending}
                >
                  {updateMutation.isPending ? 'Mise à jour...' : 'Mettre à Jour'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Prévisualisation du Template</DialogTitle>
              <DialogDescription>
                Aperçu avec des données d'exemple
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-2">Sujet :</p>
                <p className="text-gray-900">{preview?.subject}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-2">Contenu :</p>
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: preview?.content || '' }}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-900 mb-2">Données d'exemple utilisées :</p>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>Nom :</strong> Jean Dupont</p>
                  <p><strong>Email :</strong> jean.dupont@example.com</p>
                  <p><strong>Score :</strong> 85</p>
                  <p><strong>Intérêts :</strong> Sprint de Clarté, Niveau 3</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
