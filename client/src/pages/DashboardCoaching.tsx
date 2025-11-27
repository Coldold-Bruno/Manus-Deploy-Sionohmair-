import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Video, FileText, Download, Star } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useLocation } from "wouter";

export default function DashboardCoaching() {
  const [, navigate] = useLocation();
  
  const { data: sessions, isLoading } = trpc.coaching.getMySessions.useQuery();
  const { data: deliverables } = trpc.coaching.getMyDeliverables.useQuery();

  const upcomingSessions = sessions?.filter(s => s.status === "scheduled" && new Date(s.scheduledAt) > new Date()) || [];
  const pastSessions = sessions?.filter(s => s.status === "completed" || (s.status === "scheduled" && new Date(s.scheduledAt) <= new Date())) || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-500">Planifiée</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Terminée</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Annulée</Badge>;
      case "no_show":
        return <Badge variant="secondary">Absent</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getDeliverableStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">En attente</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-500">En cours</Badge>;
      case "review":
        return <Badge className="bg-yellow-500">En révision</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Terminé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4 py-8">
      <div className="container max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Mes Sessions de Coaching</h1>
            <p className="text-muted-foreground">
              Gérez vos sessions et accédez à vos livrables
            </p>
          </div>
          <Button onClick={() => navigate("/reservation-coaching")}>
            <Calendar className="w-4 h-4 mr-2" />
            Réserver une session
          </Button>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">
              À venir ({upcomingSessions.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Passées ({pastSessions.length})
            </TabsTrigger>
            <TabsTrigger value="deliverables">
              Livrables ({deliverables?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingSessions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Aucune session à venir</h3>
                  <p className="text-muted-foreground mb-4">
                    Réservez votre première session de coaching
                  </p>
                  <Button onClick={() => navigate("/reservation-coaching")}>
                    Réserver maintenant
                  </Button>
                </CardContent>
              </Card>
            ) : (
              upcomingSessions.map((session) => (
                <Card key={session.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          Session de Coaching
                          {getStatusBadge(session.status)}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(session.scheduledAt), "EEEE d MMMM yyyy", { locale: fr })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {format(new Date(session.scheduledAt), "HH:mm")}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Lien Zoom */}
                    {session.zoomJoinUrl && (
                      <div className="bg-primary/10 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Video className="w-5 h-5" />
                            <span className="font-medium">Rejoindre la réunion Zoom</span>
                          </div>
                          <Button asChild>
                            <a href={session.zoomJoinUrl} target="_blank" rel="noopener noreferrer">
                              Rejoindre
                            </a>
                          </Button>
                        </div>
                        {session.zoomPassword && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Mot de passe : {session.zoomPassword}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Questionnaire pré-session */}
                    {session.preSessionQuestionnaire && (
                      <div className="space-y-2">
                        <h4 className="font-semibold">Vos objectifs :</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {session.preSessionQuestionnaire.objectives?.map((obj, i) => (
                            <li key={i}>{obj}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Modifier le questionnaire
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive">
                        Annuler la session
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastSessions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Aucune session passée</h3>
                  <p className="text-muted-foreground">
                    Vos sessions terminées apparaîtront ici
                  </p>
                </CardContent>
              </Card>
            ) : (
              pastSessions.map((session) => (
                <Card key={session.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          Session de Coaching
                          {getStatusBadge(session.status)}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(session.scheduledAt), "EEEE d MMMM yyyy", { locale: fr })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {format(new Date(session.scheduledAt), "HH:mm")}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Compte-rendu post-session */}
                    {session.postSessionSummary && (
                      <div className="space-y-4">
                        {session.postSessionSummary.keyPoints && session.postSessionSummary.keyPoints.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">Points clés :</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                              {session.postSessionSummary.keyPoints.map((point, i) => (
                                <li key={i}>{point}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {session.postSessionSummary.actionItems && session.postSessionSummary.actionItems.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">Actions à faire :</h4>
                            <div className="space-y-2">
                              {session.postSessionSummary.actionItems.map((action, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm">
                                  <Badge variant={action.priority === "high" ? "destructive" : "secondary"}>
                                    {action.priority}
                                  </Badge>
                                  <span>{action.task}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Note du client */}
                    {!session.clientRating && (
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm mb-2">Comment s'est passée cette session ?</p>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <Button key={rating} variant="outline" size="sm">
                              <Star className="w-4 h-4" />
                              {rating}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="deliverables" className="space-y-4">
            {!deliverables || deliverables.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Aucun livrable</h3>
                  <p className="text-muted-foreground">
                    Vos livrables du Sprint de Clarté apparaîtront ici
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {deliverables.map((deliverable) => (
                  <Card key={deliverable.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{deliverable.title}</CardTitle>
                        {getDeliverableStatusBadge(deliverable.status)}
                      </div>
                      {deliverable.description && (
                        <CardDescription>{deliverable.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      {deliverable.fileUrl && (
                        <Button asChild variant="outline" className="w-full">
                          <a href={deliverable.fileUrl} download>
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger (v{deliverable.version})
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
