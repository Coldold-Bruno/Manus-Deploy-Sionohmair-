import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { 
  ArrowLeft, 
  Mail, 
  Calendar, 
  TrendingUp, 
  Activity, 
  Eye, 
  MousePointer, 
  Download, 
  Calculator, 
  FileText, 
  CreditCard,
  Flame,
  Phone,
  ExternalLink,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { toast } from "sonner";
import { ScoreEvolutionChart } from "@/components/ScoreEvolutionChart";

const ACTIVITY_ICONS: Record<string, any> = {
  page_view: Eye,
  calculator_use: Calculator,
  download: Download,
  form_submit: FileText,
  email_open: Mail,
  email_click: MousePointer,
  payment_intent: CreditCard,
  payment_completed: CreditCard,
};

const ACTIVITY_LABELS: Record<string, string> = {
  page_view: "Page visitée",
  calculator_use: "Calculateur utilisé",
  download: "Téléchargement",
  form_submit: "Formulaire soumis",
  email_open: "Email ouvert",
  email_click: "Email cliqué",
  payment_intent: "Intention de paiement",
  payment_completed: "Paiement complété",
};

const ACTIVITY_COLORS: Record<string, string> = {
  page_view: "bg-blue-100 text-blue-800",
  calculator_use: "bg-purple-100 text-purple-800",
  download: "bg-green-100 text-green-800",
  form_submit: "bg-yellow-100 text-yellow-800",
  email_open: "bg-indigo-100 text-indigo-800",
  email_click: "bg-pink-100 text-pink-800",
  payment_intent: "bg-orange-100 text-orange-800",
  payment_completed: "bg-emerald-100 text-emerald-800",
};

const NOTE_TYPE_LABELS: Record<string, string> = {
  call: "Appel téléphonique",
  email: "Email envoyé",
  meeting: "Rendez-vous",
  objection: "Objection",
  other: "Autre",
};

const NOTE_TYPE_ICONS: Record<string, any> = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  objection: TrendingUp,
  other: MessageSquare,
};

const NOTE_TYPE_COLORS: Record<string, string> = {
  call: "bg-green-100 text-green-800",
  email: "bg-blue-100 text-blue-800",
  meeting: "bg-purple-100 text-purple-800",
  objection: "bg-red-100 text-red-800",
  other: "bg-gray-100 text-gray-800",
};

const TASK_TYPE_LABELS: Record<string, string> = {
  call: "Appel téléphonique",
  email: "Envoyer un email",
  meeting: "Rendez-vous",
  follow_up: "Relance",
  other: "Autre",
};

const TASK_TYPE_ICONS: Record<string, any> = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  follow_up: Clock,
  other: Circle,
};

const TASK_TYPE_COLORS: Record<string, string> = {
  call: "bg-green-100 text-green-800",
  email: "bg-blue-100 text-blue-800",
  meeting: "bg-purple-100 text-purple-800",
  follow_up: "bg-orange-100 text-orange-800",
  other: "bg-gray-100 text-gray-800",
};

export default function LeadProfile() {
  const { user, loading: authLoading } = useAuth();
  const [location] = useLocation();
  
  // Extract email from query params
  const params = new URLSearchParams(location.split('?')[1]);
  const email = params.get('email');

  const { data: profile, isLoading } = trpc.leadScoring.getLeadProfile.useQuery(
    { email: email || '' },
    { enabled: !!email }
  );

  // Notes state
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteType, setNoteType] = useState<"call" | "email" | "meeting" | "objection" | "other">("other");
  const [noteContent, setNoteContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);

  // Tasks state
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskType, setTaskType] = useState<"call" | "email" | "meeting" | "follow_up" | "other">("other");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  // Score history query
  const { data: scoreHistory } = trpc.leadScoring.getScoreHistory.useQuery(
    { email: email || '' },
    { enabled: !!email }
  );

  // Notes queries and mutations
  const { data: notes, refetch: refetchNotes } = trpc.leadNotes.getNotes.useQuery(
    { leadEmail: email || '' },
    { enabled: !!email }
  );
  const addNoteMutation = trpc.leadNotes.addNote.useMutation();
  const updateNoteMutation = trpc.leadNotes.updateNote.useMutation();
  const deleteNoteMutation = trpc.leadNotes.deleteNote.useMutation();

  // Tasks queries and mutations
  const { data: tasks, refetch: refetchTasks } = trpc.leadTasks.getTasksForLead.useQuery(
    { leadEmail: email || '' },
    { enabled: !!email }
  );
  const addTaskMutation = trpc.leadTasks.addTask.useMutation();
  const updateTaskMutation = trpc.leadTasks.updateTask.useMutation();
  const completeTaskMutation = trpc.leadTasks.completeTask.useMutation();
  const deleteTaskMutation = trpc.leadTasks.deleteTask.useMutation();

  const handleAddNote = async () => {
    if (!email || !noteContent.trim()) {
      toast.error("Veuillez remplir le contenu de la note");
      return;
    }

    try {
      if (editingNoteId) {
        await updateNoteMutation.mutateAsync({
          noteId: editingNoteId,
          content: noteContent,
          noteType,
        });
        toast.success("Note mise à jour avec succès");
        setEditingNoteId(null);
      } else {
        await addNoteMutation.mutateAsync({
          leadEmail: email,
          noteType,
          content: noteContent,
        });
        toast.success("Note ajoutée avec succès");
      }
      setNoteContent("");
      setNoteType("other");
      setShowNoteForm(false);
      refetchNotes();
    } catch (error: any) {
      toast.error("Erreur : " + error.message);
    }
  };

  const handleEditNote = (note: any) => {
    setEditingNoteId(note.id);
    setNoteType(note.noteType);
    setNoteContent(note.content);
    setShowNoteForm(true);
  };

  const handleDeleteNote = async (noteId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette note ?")) return;

    try {
      await deleteNoteMutation.mutateAsync({ noteId });
      toast.success("Note supprimée avec succès");
      refetchNotes();
    } catch (error: any) {
      toast.error("Erreur : " + error.message);
    }
  };

  const handleCancelNote = () => {
    setShowNoteForm(false);
    setEditingNoteId(null);
    setNoteContent("");
    setNoteType("other");
  };

  const handleAddTask = async () => {
    if (!email || !taskTitle.trim() || !taskDueDate) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      if (editingTaskId) {
        await updateTaskMutation.mutateAsync({
          taskId: editingTaskId,
          title: taskTitle,
          description: taskDescription,
          dueDate: taskDueDate,
          taskType,
        });
        toast.success("Tâche mise à jour avec succès");
        setEditingTaskId(null);
      } else {
        await addTaskMutation.mutateAsync({
          leadEmail: email,
          taskType,
          title: taskTitle,
          description: taskDescription,
          dueDate: taskDueDate,
        });
        toast.success("Tâche ajoutée avec succès");
      }
      setTaskTitle("");
      setTaskDescription("");
      setTaskDueDate("");
      setTaskType("other");
      setShowTaskForm(false);
      refetchTasks();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'enregistrement de la tâche");
    }
  };

  const handleEditTask = (task: any) => {
    setEditingTaskId(task.id);
    setTaskTitle(task.title);
    setTaskDescription(task.description || "");
    setTaskDueDate(format(new Date(task.dueDate), "yyyy-MM-dd'T'HH:mm"));
    setTaskType(task.taskType);
    setShowTaskForm(true);
  };

  const handleCompleteTask = async (taskId: number) => {
    try {
      await completeTaskMutation.mutateAsync({ taskId });
      toast.success("Tâche marquée comme complétée");
      refetchTasks();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la complétion de la tâche");
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette tâche ?")) return;

    try {
      await deleteTaskMutation.mutateAsync({ taskId });
      toast.success("Tâche supprimée avec succès");
      refetchTasks();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression de la tâche");
    }
  };

  const handleCancelTask = () => {
    setShowTaskForm(false);
    setEditingTaskId(null);
    setTaskTitle("");
    setTaskDescription("");
    setTaskDueDate("");
    setTaskType("other");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Accès Refusé</CardTitle>
            <CardDescription>Vous devez être administrateur pour accéder à cette page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="default">
              <Link href="/">
                <a>Retour à l'accueil</a>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Email Manquant</CardTitle>
            <CardDescription>Aucun email spécifié dans l'URL.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="default">
              <Link href="/admin/hot-leads">
                <a>← Retour aux leads</a>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Lead Non Trouvé</CardTitle>
            <CardDescription>Aucun lead trouvé avec cet email.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="default">
              <Link href="/admin/hot-leads">
                <a>← Retour aux leads</a>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { subscriber, activities } = profile;

  // Calculate stats
  const pageViews = activities.filter(a => a.activityType === 'page_view').length;
  const emailOpens = activities.filter(a => a.activityType === 'email_open').length;
  const emailClicks = activities.filter(a => a.activityType === 'email_click').length;
  const downloads = activities.filter(a => a.activityType === 'download').length;
  const calculatorUses = activities.filter(a => a.activityType === 'calculator_use').length;

  // Get temperature color
  const temperatureColor = 
    subscriber.leadTemperature === 'hot' ? 'text-orange-500' :
    subscriber.leadTemperature === 'warm' ? 'text-yellow-500' :
    'text-blue-500';

  const temperatureBg = 
    subscriber.leadTemperature === 'hot' ? 'bg-orange-500' :
    subscriber.leadTemperature === 'warm' ? 'bg-yellow-500' :
    'bg-blue-500';

  // Generate email template
  const emailSubject = encodeURIComponent(`Sionohmair Insight Academy - Votre Sprint de Clarté`);
  const emailBody = encodeURIComponent(`Bonjour${subscriber.name ? ' ' + subscriber.name : ''},\n\nJe vous contacte suite à votre intérêt pour la méthodologie Sionohmair Insight Academy.\n\nJ'ai remarqué que vous avez ${pageViews > 0 ? `visité ${pageViews} pages` : 'consulté notre site'}${calculatorUses > 0 ? ` et utilisé notre calculateur de clarté` : ''}.\n\nJe serais ravi d'échanger avec vous sur vos besoins en matière de clarté de communication.\n\nSeriez-vous disponible pour un appel de 15 minutes cette semaine ?\n\nCordialement,\nBruno Coldold\nFondateur, Sionohmair Insight Academy`);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Button asChild variant="outline" className="mb-4">
              <Link href="/admin/hot-leads">
                <a className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Retour aux leads
                </a>
              </Link>
            </Button>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Activity className="h-10 w-10 text-accent" />
              Profil de Lead
            </h1>
            <p className="text-xl text-muted-foreground">
              Analyse détaillée du comportement et de l'engagement
            </p>
          </div>
        </div>

        {/* Lead Info Card */}
        <Card className="mb-8 border-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl flex items-center gap-3 mb-2">
                  <Mail className="h-6 w-6 text-accent" />
                  {subscriber.email}
                  {subscriber.name && <span className="text-muted-foreground text-lg">({subscriber.name})</span>}
                </CardTitle>
                <CardDescription className="flex items-center gap-4 flex-wrap text-base">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Inscrit le {format(new Date(subscriber.subscribedAt), 'dd MMMM yyyy', { locale: fr })}
                  </span>
                  <Badge variant="outline" className="capitalize text-sm">
                    Intérêt: {subscriber.interests}
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    Source: {subscriber.source}
                  </Badge>
                </CardDescription>
              </div>
              <div className="text-right">
                <div className={`text-5xl font-bold ${temperatureColor} mb-1`}>
                  {subscriber.leadScore}
                </div>
                <p className="text-sm text-muted-foreground mb-2">points</p>
                <Badge className={`${temperatureBg} text-white`}>
                  <Flame className="h-3 w-3 mr-1" />
                  {subscriber.leadTemperature.toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground">Engagement Newsletter</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Score d'engagement:</span>
                    <span className="font-bold text-accent">{subscriber.engagementScore} pts</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Dernier email:</span>
                    <span className="font-semibold">J+{subscriber.lastEmailSent}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Emails ouverts:</span>
                    <span className="font-semibold">{emailOpens}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Emails cliqués:</span>
                    <span className="font-semibold">{emailClicks}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground">Activité Site Web</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Pages visitées:</span>
                    <span className="font-semibold">{pageViews}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Calculateur utilisé:</span>
                    <span className="font-semibold">{calculatorUses} fois</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Téléchargements:</span>
                    <span className="font-semibold">{downloads}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Total activités:</span>
                    <span className="font-semibold">{activities.length}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground">Actions Rapides</h4>
                <div className="space-y-2">
                  <Button 
                    size="sm" 
                    className="w-full" 
                    asChild
                  >
                    <a 
                      href={`mailto:${subscriber.email}?subject=${emailSubject}&body=${emailBody}`}
                      className="flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      Envoyer un email
                    </a>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    asChild
                  >
                    <a 
                      href={`tel:${subscriber.email}`}
                      className="flex items-center gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      Appeler
                    </a>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    asChild
                  >
                    <Link href={`/admin/newsletter?filter=${subscriber.email}`}>
                      <a className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Voir dans Newsletter
                      </a>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Evolution Chart */}
        <div className="mb-8">
          <ScoreEvolutionChart history={scoreHistory || []} />
        </div>

        {/* Tasks Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent" />
                  Tâches à Venir ({tasks?.filter(t => t.status === 'pending').length || 0})
                </CardTitle>
                <CardDescription>
                  Rappels et actions à effectuer pour ce lead
                </CardDescription>
              </div>
              <Button onClick={() => setShowTaskForm(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle tâche
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Add Task Form */}
            {showTaskForm && (
              <div className="mb-6 p-4 border rounded-lg bg-secondary/20">
                <h4 className="font-semibold mb-4">
                  {editingTaskId ? "Modifier la tâche" : "Nouvelle tâche"}
                </h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="taskType">Type de tâche</Label>
                    <Select value={taskType} onValueChange={(value: any) => setTaskType(value)}>
                      <SelectTrigger id="taskType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="call">Appel téléphonique</SelectItem>
                        <SelectItem value="email">Envoyer un email</SelectItem>
                        <SelectItem value="meeting">Rendez-vous</SelectItem>
                        <SelectItem value="follow_up">Relance</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="taskTitle">Titre *</Label>
                    <Input
                      id="taskTitle"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      placeholder="Ex: Rappeler pour proposer Sprint de Clarté"
                    />
                  </div>
                  <div>
                    <Label htmlFor="taskDescription">Description (optionnel)</Label>
                    <Textarea
                      id="taskDescription"
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                      placeholder="Détails supplémentaires..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="taskDueDate">Échéance *</Label>
                    <Input
                      id="taskDueDate"
                      type="datetime-local"
                      value={taskDueDate}
                      onChange={(e) => setTaskDueDate(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddTask} disabled={addTaskMutation.isPending || updateTaskMutation.isPending}>
                      <Save className="h-4 w-4 mr-2" />
                      {editingTaskId ? "Mettre à jour" : "Enregistrer"}
                    </Button>
                    <Button onClick={handleCancelTask} variant="outline">
                      <X className="h-4 w-4 mr-2" />
                      Annuler
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Tasks List */}
            {!tasks || tasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>Aucune tâche programmée pour ce lead</p>
                <p className="text-sm mt-2">Ajoutez des rappels pour ne rien oublier !</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task: any) => {
                  const TaskIcon = TASK_TYPE_ICONS[task.taskType] || Circle;
                  const isOverdue = new Date(task.dueDate) < new Date() && task.status === 'pending';
                  const isPending = task.status === 'pending';

                  return (
                    <div
                      key={task.id}
                      className={`p-4 border rounded-lg ${
                        task.status === 'completed'
                          ? 'bg-green-50 border-green-200 opacity-60'
                          : isOverdue
                          ? 'bg-red-50 border-red-200'
                          : 'bg-background'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <TaskIcon className="h-4 w-4" />
                            <Badge className={TASK_TYPE_COLORS[task.taskType]}>
                              {TASK_TYPE_LABELS[task.taskType]}
                            </Badge>
                            {task.status === 'completed' && (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Complétée
                              </Badge>
                            )}
                            {isOverdue && (
                              <Badge className="bg-red-100 text-red-800">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                En retard
                              </Badge>
                            )}
                          </div>
                          <h4 className={`font-semibold mb-1 ${
                            task.status === 'completed' ? 'line-through text-muted-foreground' : ''
                          }`}>
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(task.dueDate), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                            </span>
                            {task.completedAt && (
                              <span className="flex items-center gap-1 text-green-600">
                                <CheckCircle2 className="h-3 w-3" />
                                Complétée le {format(new Date(task.completedAt), "dd MMM yyyy", { locale: fr })}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          {isPending && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCompleteTask(task.id)}
                                disabled={completeTaskMutation.isPending}
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditTask(task)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteTask(task.id)}
                            disabled={deleteTaskMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes Commerciales Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Recommandations Commerciales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {subscriber.leadTemperature === 'hot' && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="font-semibold text-orange-800 mb-2">🔥 Lead Chaud - Action Immédiate Recommandée</p>
                  <ul className="text-sm text-orange-700 space-y-1 list-disc list-inside">
                    <li>Contacter dans les 24h pour maximiser les chances de conversion</li>
                    <li>Proposer un appel découverte de 15 minutes</li>
                    <li>Mentionner les pages visitées pour personnaliser l'approche</li>
                    {calculatorUses > 0 && <li>Faire référence au score de clarté obtenu au calculateur</li>}
                  </ul>
                </div>
              )}
              {subscriber.leadTemperature === 'warm' && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="font-semibold text-yellow-800 mb-2">⚡ Lead Tiède - Nurturing Recommandé</p>
                  <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                    <li>Envoyer une étude de cas pertinente (TechFlow ou LearnFast)</li>
                    <li>Proposer le téléchargement du Manuel PFPMA gratuit</li>
                    <li>Inviter à utiliser le calculateur de clarté</li>
                    <li>Planifier un suivi dans 3-5 jours</li>
                  </ul>
                </div>
              )}
              {subscriber.leadTemperature === 'cold' && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="font-semibold text-blue-800 mb-2">❄️ Lead Froid - Réchauffement Progressif</p>
                  <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                    <li>Continuer la séquence d'onboarding newsletter</li>
                    <li>Envoyer du contenu éducatif (Code PFPMA, 3 Frictions)</li>
                    <li>Proposer des ressources gratuites pour créer de la valeur</li>
                    <li>Surveiller l'évolution du score avant contact direct</li>
                  </ul>
                </div>
              )}
              {subscriber.interests === 'diagnostic' && (
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Intérêt principal: Diagnostic</strong> - Ce lead est intéressé par le Sprint de Clarté (490€). Mettre en avant le score /20, l'analyse PFPMA, et les résultats mesurables.
                </p>
              )}
              {subscriber.interests === 'formation' && (
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Intérêt principal: Formation</strong> - Ce lead vise l'Architecture de l'Insight (10k€). Souligner la roadmap, les 5 artefacts, et la transformation durable.
                </p>
              )}
              {subscriber.interests === 'transformation' && (
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Intérêt principal: Transformation</strong> - Ce lead recherche le Partenariat Stratégique (50k€). Présenter le Playbook, le NFT Architecte, et l'accompagnement 12 mois.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notes Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-accent" />
                  Notes Commerciales ({notes?.length || 0})
                </CardTitle>
                <CardDescription>
                  Historique des interactions et commentaires
                </CardDescription>
              </div>
              {!showNoteForm && (
                <Button onClick={() => setShowNoteForm(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une note
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Add Note Form */}
            {showNoteForm && (
              <div className="mb-6 p-4 border rounded-lg bg-secondary/20">
                <h4 className="font-semibold mb-4">
                  {editingNoteId ? "Modifier la note" : "Nouvelle note"}
                </h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="noteType">Type de note</Label>
                    <Select value={noteType} onValueChange={(value: any) => setNoteType(value)}>
                      <SelectTrigger id="noteType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="call">Appel téléphonique</SelectItem>
                        <SelectItem value="email">Émail envoyé</SelectItem>
                        <SelectItem value="meeting">Rendez-vous</SelectItem>
                        <SelectItem value="objection">Objection</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="noteContent">Contenu</Label>
                    <Textarea
                      id="noteContent"
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="Décrivez l'interaction, les objections, les prochaines étapes..."
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddNote} disabled={addNoteMutation.isPending || updateNoteMutation.isPending}>
                      <Save className="h-4 w-4 mr-2" />
                      {editingNoteId ? "Mettre à jour" : "Enregistrer"}
                    </Button>
                    <Button onClick={handleCancelNote} variant="outline">
                      <X className="h-4 w-4 mr-2" />
                      Annuler
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Notes List */}
            {!notes || notes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>Aucune note enregistrée pour ce lead</p>
                <p className="text-sm mt-1">Ajoutez des notes pour garder trace de vos interactions</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notes.map((note, index) => {
                  const Icon = NOTE_TYPE_ICONS[note.noteType] || MessageSquare;
                  const label = NOTE_TYPE_LABELS[note.noteType] || note.noteType;
                  const colorClass = NOTE_TYPE_COLORS[note.noteType] || 'bg-gray-100 text-gray-800';

                  return (
                    <div key={note.id} className="flex gap-4 items-start p-4 border rounded-lg hover:bg-secondary/20 transition-colors">
                      <div className="flex flex-col items-center">
                        <div className={`p-2 rounded-full ${colorClass}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{label}</p>
                            <Badge variant="outline" className="text-xs">
                              {format(new Date(note.createdAt), 'dd MMM yyyy à HH:mm', { locale: fr })}
                            </Badge>
                          </div>
                          {note.userId === user?.id && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditNote(note)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteNote(note.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{note.content}</p>
                        {note.updatedAt !== note.createdAt && (
                          <p className="text-xs text-muted-foreground mt-2 italic">
                            Modifié le {format(new Date(note.updatedAt), 'dd MMM yyyy à HH:mm', { locale: fr })}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-accent" />
              Timeline d'Activité ({activities.length} événements)
            </CardTitle>
            <CardDescription>
              Historique chronologique de toutes les interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>Aucune activité enregistrée pour ce lead</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity, index) => {
                  const Icon = ACTIVITY_ICONS[activity.activityType] || Activity;
                  const label = ACTIVITY_LABELS[activity.activityType] || activity.activityType;
                  const colorClass = ACTIVITY_COLORS[activity.activityType] || 'bg-gray-100 text-gray-800';
                  const activityData = activity.activityData;

                  return (
                    <div key={activity.id} className="flex gap-4 items-start">
                      <div className="flex flex-col items-center">
                        <div className={`p-2 rounded-full ${colorClass}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        {index < activities.length - 1 && (
                          <div className="w-0.5 h-12 bg-border mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold">{label}</p>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(activity.createdAt), 'dd MMM yyyy à HH:mm', { locale: fr })}
                          </span>
                        </div>
                        {activityData && (
                          <div className="text-sm text-muted-foreground space-y-1">
                            {activityData.page && (
                              <p className="flex items-center gap-2">
                                <ExternalLink className="h-3 w-3" />
                                Page: <code className="bg-secondary px-1 rounded">{activityData.page}</code>
                              </p>
                            )}
                            {activityData.duration && (
                              <p>Durée: {activityData.duration}s</p>
                            )}
                            {activityData.emailSubject && (
                              <p>Sujet: {activityData.emailSubject}</p>
                            )}
                            {activityData.link && (
                              <p className="flex items-center gap-2">
                                <MousePointer className="h-3 w-3" />
                                Lien cliqué: <code className="bg-secondary px-1 rounded text-xs">{activityData.link}</code>
                              </p>
                            )}
                          </div>
                        )}
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            +{activity.score} points
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
