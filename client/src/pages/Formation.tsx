import { useEffect, useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Lock, CheckCircle2, Circle, Clock, Trophy, Zap } from "lucide-react";
import { toast } from "sonner";

/**
 * PAGE FORMATION - Plateforme de formation interactive
 * 
 * Affiche :
 * - Statut de l'accès (jours restants)
 * - Liste des 9 modules avec progression
 * - Badges gagnés
 * - Barre de progression globale
 */

export default function Formation() {
  const [hasAccess, setHasAccess] = useState(false);
  const [accessData, setAccessData] = useState<any>(null);

  // Vérifier l'accès
  const { data: accessCheck, isLoading: loadingAccess } = trpc.formation.checkAccess.useQuery();

  // Récupérer les modules
  const { data: modules, isLoading: loadingModules, refetch: refetchModules } = trpc.formation.getModules.useQuery(
    undefined,
    { enabled: hasAccess }
  );

  // Récupérer les badges
  const { data: badges, isLoading: loadingBadges } = trpc.formation.getBadges.useQuery(
    undefined,
    { enabled: hasAccess }
  );

  useEffect(() => {
    if (accessCheck) {
      setHasAccess(accessCheck.hasAccess);
      setAccessData(accessCheck);
    }
  }, [accessCheck]);

  if (loadingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Vérification de l'accès...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Accès refusé</CardTitle>
            <CardDescription>{accessData?.message || "Vous n'avez pas accès à la formation."}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Pour accéder à la Formation Sprint de Clarté, vous devez d'abord l'acheter.
            </p>
            <div className="flex gap-4">
              <Button asChild>
                <Link href="/services">Voir les offres</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Retour à l'accueil</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progressPercentage = accessData ? (accessData.completedModules / 9) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="border-b bg-background/95 bg-background/98">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Formation Sprint de Clarté</h1>
              <p className="text-muted-foreground mt-1">
                Maîtrise le Code PFPMA en 9 modules interactifs
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/">← Retour</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sur mobile, afficher d'abord la progression, puis les modules, puis la sidebar */}
          {/* Colonne principale : Modules */}
          <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
            {/* Progression globale */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Ta progression
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Modules complétés</span>
                    <span className="font-medium">{accessData?.completedModules || 0} / 9</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{accessData?.totalExercisesCompleted || 0}</div>
                    <div className="text-xs text-muted-foreground">Exercices réussis</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{accessData?.overallScore || 0}</div>
                    <div className="text-xs text-muted-foreground">Score global /100</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{accessData?.daysRemaining || 0}</div>
                    <div className="text-xs text-muted-foreground">Jours restants</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Liste des modules */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Les 9 Modules</h2>
              
              {loadingModules ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {modules?.map((module) => (
                    <Card
                      key={module.id}
                      className={`transition-all ${
                        module.isUnlocked
                          ? "hover:shadow-md cursor-pointer"
                          : "opacity-60"
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Icône de statut */}
                          <div className="flex-shrink-0">
                            {module.isCompleted ? (
                              <CheckCircle2 className="h-8 w-8 text-green-500" />
                            ) : module.isUnlocked ? (
                              <Circle className="h-8 w-8 text-primary" />
                            ) : (
                              <Lock className="h-8 w-8 text-muted-foreground" />
                            )}
                          </div>

                          {/* Contenu */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">
                                Module {module.moduleNumber} : {module.moduleName}
                              </h3>
                              {module.isCompleted && (
                                <Badge variant="default" className="bg-green-500">
                                  Terminé
                                </Badge>
                              )}
                              {module.isStarted && !module.isCompleted && (
                                <Badge variant="secondary">En cours</Badge>
                              )}
                              {!module.isUnlocked && (
                                <Badge variant="outline">Verrouillé</Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{module.completedExercises} / 3 exercices</span>
                              {module.moduleScore > 0 && (
                                <span>Score : {module.moduleScore}/100</span>
                              )}
                            </div>

                            {/* Barre de progression du module */}
                            {module.isUnlocked && (
                              <Progress
                                value={(module.completedExercises / 3) * 100}
                                className="h-1.5 mt-3"
                              />
                            )}
                          </div>

                          {/* Bouton d'action */}
                          <div className="flex-shrink-0">
                            {module.isUnlocked && !module.isCompleted && (
                              <Button asChild>
                                <Link href={`/formation/module/${module.moduleNumber}`}>
                                  {module.isStarted ? "Continuer" : "Commencer"}
                                </Link>
                              </Button>
                            )}
                            {module.isCompleted && (
                              <Button variant="outline" asChild>
                                <Link href={`/formation/module/${module.moduleNumber}`}>
                                  Revoir
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Colonne latérale : Badges et infos */}
          <div className="space-y-6 order-3 lg:order-2">
            {/* Temps restant */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5" />
                  Temps restant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {accessData?.daysRemaining || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    jours pour terminer la formation
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Expire le {new Date(accessData?.accessEndDate).toLocaleDateString("fr-FR")}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Trophy className="h-5 w-5" />
                  Tes badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingBadges ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : badges && badges.length > 0 ? (
                  <div className="space-y-3">
                    {badges.map((badge) => (
                      <div
                        key={badge.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        <div className="text-2xl">{badge.badgeIcon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{badge.badgeName}</div>
                          <div className="text-xs text-muted-foreground">
                            {badge.badgeDescription}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(badge.earnedAt).toLocaleDateString("fr-FR")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    <Trophy className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>Aucun badge gagné pour le moment.</p>
                    <p className="text-xs mt-1">Complète des modules pour débloquer des badges !</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ressources */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ressources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/ressources">
                    📚 Manuel PFPMA (PDF)
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/cgv-formation">
                    📜 Lire les CGV
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Aide */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Besoin d'aide ?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  Tu as une question sur la formation ?
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/contact">Contacter le support</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
