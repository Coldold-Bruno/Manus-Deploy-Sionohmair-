import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Clock, CheckCircle2, AlertCircle, Calendar, Phone, Mail, Users as UsersIcon, Circle, ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const TASK_TYPE_ICONS: Record<string, any> = {
  call: Phone,
  email: Mail,
  meeting: UsersIcon,
  follow_up: Clock,
  other: Circle,
};

const TASK_TYPE_LABELS: Record<string, string> = {
  call: "Appel",
  email: "Email",
  meeting: "Rendez-vous",
  follow_up: "Relance",
  other: "Autre",
};

const TASK_TYPE_COLORS: Record<string, string> = {
  call: "bg-blue-100 text-blue-800",
  email: "bg-purple-100 text-purple-800",
  meeting: "bg-green-100 text-green-800",
  follow_up: "bg-orange-100 text-orange-800",
  other: "bg-gray-100 text-gray-800",
};

export default function Tasks() {
  const { user, loading: authLoading } = useAuth();
  const [filter, setFilter] = useState<"all" | "today" | "this_week" | "overdue" | "pending" | "completed">("pending");
  const [taskTypeFilter, setTaskTypeFilter] = useState<"all" | "call" | "email" | "meeting" | "follow_up" | "other">("all");

  const { data: stats, isLoading: statsLoading } = trpc.leadTasks.getTaskStats.useQuery();
  const { data: tasks, isLoading: tasksLoading, refetch } = trpc.leadTasks.getAllTasks.useQuery({
    filter,
    taskType: taskTypeFilter,
  });

  const completeTaskMutation = trpc.leadTasks.completeTask.useMutation();
  const deleteTaskMutation = trpc.leadTasks.deleteTask.useMutation();

  const handleCompleteTask = async (taskId: number) => {
    try {
      await completeTaskMutation.mutateAsync({ taskId });
      toast.success("Tâche marquée comme complétée");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la complétion de la tâche");
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette tâche ?")) return;

    try {
      await deleteTaskMutation.mutateAsync({ taskId });
      toast.success("Tâche supprimée avec succès");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression de la tâche");
    }
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
              <Link href="/">Retour à l'accueil</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Clock className="h-10 w-10 text-accent" />
                Toutes les Tâches
              </h1>
              <p className="text-muted-foreground text-lg">
                Vue d'ensemble de toutes les tâches de suivi commercial
              </p>
            </div>
            <Button asChild variant="default">
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour Admin
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.total || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-orange-800 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                En Retard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats?.overdue || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-800 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Aujourd'hui
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats?.dueToday || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-yellow-800">En Attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats?.pending || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-800 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Complétées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats?.completed || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filtres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Échéance</label>
                <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="overdue">En retard</SelectItem>
                    <SelectItem value="today">Aujourd'hui</SelectItem>
                    <SelectItem value="this_week">Cette semaine</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="completed">Complétées</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Type de tâche</label>
                <Select value={taskTypeFilter} onValueChange={(value: any) => setTaskTypeFilter(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="call">Appels</SelectItem>
                    <SelectItem value="email">Emails</SelectItem>
                    <SelectItem value="meeting">Rendez-vous</SelectItem>
                    <SelectItem value="follow_up">Relances</SelectItem>
                    <SelectItem value="other">Autres</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks List */}
        <Card>
          <CardHeader>
            <CardTitle>Tâches ({tasks?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {tasksLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                <p className="text-muted-foreground">Chargement des tâches...</p>
              </div>
            ) : !tasks || tasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>Aucune tâche trouvée avec ces filtres</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task: any) => {
                  const TaskIcon = TASK_TYPE_ICONS[task.taskType] || Circle;
                  const isOverdue = new Date(task.dueDate) < new Date() && task.status === "pending";
                  const isPending = task.status === "pending";

                  return (
                    <div
                      key={task.id}
                      className={`p-4 border rounded-lg ${
                        task.status === "completed"
                          ? "bg-green-50 border-green-200 opacity-60"
                          : isOverdue
                          ? "bg-red-50 border-red-200"
                          : "bg-background"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <TaskIcon className="h-4 w-4" />
                            <Badge className={TASK_TYPE_COLORS[task.taskType]}>
                              {TASK_TYPE_LABELS[task.taskType]}
                            </Badge>
                            {task.status === "completed" && (
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
                            task.status === "completed" ? "line-through text-muted-foreground" : ""
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
                              <Mail className="h-3 w-3" />
                              <Link href={`/admin/lead-profile?email=${task.leadEmail}`}>
                                <a className="hover:text-accent hover:underline">{task.leadEmail}</a>
                              </Link>
                            </span>
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
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCompleteTask(task.id)}
                              disabled={completeTaskMutation.isPending}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
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
      </div>
    </div>
  );
}
