import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle, ArrowLeft, ArrowRight, Lightbulb, Trophy } from "lucide-react";
import { toast } from "sonner";
import { getModuleExercises } from "@shared/exercisesContent";
import confetti from "canvas-confetti";

/**
 * PAGE MODULE - Affichage d'un module avec ses 3 exercices
 */

export default function FormationModule() {
  const { moduleNumber } = useParams<{ moduleNumber: string }>();
  const [, navigate] = useLocation();
  const moduleNum = parseInt(moduleNumber || "1");

  const [currentExercise, setCurrentExercise] = useState(1);
  const [userAnswer, setUserAnswer] = useState("");
  const [showHints, setShowHints] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  // Récupérer les modules
  const { data: modules, refetch: refetchModules } = trpc.formation.getModules.useQuery();

  // Récupérer le module actuel
  const currentModule = modules?.find((m) => m.moduleNumber === moduleNum);

  // Démarrer le module si pas encore démarré
  const startModuleMutation = trpc.formation.startModule.useMutation({
    onSuccess: () => {
      refetchModules();
      toast.success("Module démarré !");
    },
  });

  // Soumettre un exercice
  const submitExerciseMutation = trpc.formation.submitExercise.useMutation({
    onSuccess: (data) => {
      setLastResult(data);
      refetchModules();
      
      if (data.isCorrect) {
        toast.success(`✅ Exercice ${currentExercise} réussi !`, {
          description: `Score : ${data.score}/100`,
        });

        // Si module complété, afficher un message spécial + confettis
        if (data.moduleCompleted) {
          toast.success("🎉 Module complété !", {
            description: "Le module suivant est maintenant débloqué.",
          });
          
          // Lancer les confettis
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#F59E0B', '#0A1929', '#3B82F6'],
          });
        }

        // Passer à l'exercice suivant après 2 secondes
        setTimeout(() => {
          if (currentExercise < 3) {
            setCurrentExercise(currentExercise + 1);
            setUserAnswer("");
            setLastResult(null);
            setShowHints(false);
          } else {
            // Module terminé, retour à la liste
            navigate("/formation");
          }
        }, 2000);
      } else {
        toast.error(`❌ Exercice ${currentExercise} échoué`, {
          description: `Score : ${data.score}/100. Réessaie !`,
        });
      }
    },
    onError: (error) => {
      toast.error("Erreur lors de la soumission", {
        description: error.message,
      });
    },
  });

  // Récupérer les tentatives précédentes
  const { data: attempts } = trpc.formation.getExerciseAttempts.useQuery({
    moduleNumber: moduleNum,
    exerciseNumber: currentExercise,
  });

  // Démarrer le module automatiquement
  useEffect(() => {
    if (currentModule && !currentModule.isStarted && !startModuleMutation.isPending) {
      startModuleMutation.mutate({ moduleNumber: moduleNum });
    }
  }, [currentModule]);

  // Récupérer le contenu des exercices
  const exercises = getModuleExercises(moduleNum);
  const currentExerciseContent = exercises.find((ex) => ex.exerciseNumber === currentExercise);

  if (!currentModule) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Module introuvable</CardTitle>
            <CardDescription>Ce module n'existe pas ou n'est pas encore débloqué.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/formation">← Retour à la formation</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentModule.isUnlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Module verrouillé</CardTitle>
            <CardDescription>
              Tu dois d'abord terminer le module précédent pour débloquer celui-ci.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/formation">← Retour à la formation</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = () => {
    if (!userAnswer.trim()) {
      toast.error("Réponds à l'exercice avant de soumettre !");
      return;
    }

    submitExerciseMutation.mutate({
      moduleNumber: moduleNum,
      exerciseNumber: currentExercise,
      userAnswer: userAnswer.trim(),
    });
  };

  const progressPercentage = (currentModule.completedExercises / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/formation">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-bold">
                  Module {moduleNum} : {currentModule.moduleName}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Exercice {currentExercise} / 3
                </p>
              </div>
            </div>
            <Badge variant={currentModule.isCompleted ? "default" : "secondary"}>
              {currentModule.completedExercises} / 3 exercices
            </Badge>
          </div>

          {/* Barre de progression */}
          <Progress value={progressPercentage} className="h-2 mt-4" />
        </div>
      </div>

      <div className="container py-4 md:py-8 max-w-4xl px-4">
        <div className="space-y-6">
          {/* Exercice actuel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {currentExerciseContent?.title || `Exercice ${currentExercise}`}
              </CardTitle>
              {attempts && attempts.length > 0 && (
                <CardDescription>
                  Tentative n°{attempts.length + 1}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Instructions */}
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {currentExerciseContent?.instructions}
                </div>
              </div>

              {/* Zone de réponse */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Ta réponse :</label>
                <Textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Rédige ta réponse ici..."
                  rows={8}
                  className="resize-none"
                  disabled={submitExerciseMutation.isPending}
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {userAnswer.length} caractères
                    {currentExerciseContent && (
                      <> (min: {currentExerciseContent.minLength}, max: {currentExerciseContent.maxLength})</>
                    )}
                  </span>
                  {currentExerciseContent?.hints && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowHints(!showHints)}
                      className="h-auto py-1"
                    >
                      <Lightbulb className="h-4 w-4 mr-1" />
                      {showHints ? "Masquer" : "Voir"} les indices
                    </Button>
                  )}
                </div>
              </div>

              {/* Indices */}
              {showHints && currentExerciseContent?.hints && (
                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">Indices :</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {currentExerciseContent.hints.map((hint, idx) => (
                          <li key={idx}>{hint}</li>
                        ))}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Résultat de la dernière tentative */}
              {lastResult && (
                <Alert variant={lastResult.isCorrect ? "default" : "destructive"}>
                  {lastResult.isCorrect ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">
                        {lastResult.isCorrect ? "✅ Exercice réussi !" : "❌ Exercice échoué"}
                      </p>
                      <p className="text-sm">Score : {lastResult.score}/100</p>
                      <p className="text-sm">{lastResult.feedback}</p>
                      {lastResult.moduleCompleted && (
                        <p className="text-sm font-medium mt-2">
                          🎉 Module complété ! Le module suivant est débloqué.
                        </p>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Tentatives précédentes */}
              {attempts && attempts.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Tentatives précédentes :</p>
                  <div className="space-y-2">
                    {attempts.slice(0, 3).map((attempt) => (
                      <div
                        key={attempt.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 text-sm"
                      >
                        {attempt.isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">
                            Tentative #{attempt.attemptNumber} - Score : {attempt.score}/100
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {attempt.feedback}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Boutons d'action */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (currentExercise > 1) {
                      setCurrentExercise(currentExercise - 1);
                      setUserAnswer("");
                      setLastResult(null);
                      setShowHints(false);
                    }
                  }}
                  disabled={currentExercise === 1}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Exercice précédent
                </Button>

                <Button
                  onClick={handleSubmit}
                  disabled={submitExerciseMutation.isPending || !userAnswer.trim()}
                >
                  {submitExerciseMutation.isPending ? "Validation..." : "Soumettre"}
                </Button>

                {currentModule.completedExercises >= currentExercise && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (currentExercise < 3) {
                        setCurrentExercise(currentExercise + 1);
                        setUserAnswer("");
                        setLastResult(null);
                        setShowHints(false);
                      } else {
                        navigate("/formation");
                      }
                    }}
                  >
                    {currentExercise < 3 ? (
                      <>
                        Exercice suivant
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    ) : (
                      <>
                        Terminer
                        <Trophy className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
