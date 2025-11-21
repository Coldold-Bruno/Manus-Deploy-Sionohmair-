import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { FlaskConical, ArrowLeft, Plus, TrendingUp, Mail, MousePointerClick, Trophy, PlayCircle } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function ABTesting() {
  const { user, loading: authLoading } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  const [newTest, setNewTest] = useState({
    name: "",
    variantA: "",
    variantB: "",
    emailContent: "",
  });

  const { data: tests, isLoading: testsLoading, refetch } = trpc.abTesting.getTests.useQuery();
  const { data: testResults, isLoading: resultsLoading } = trpc.abTesting.getTestResults.useQuery(
    { testId: selectedTestId! },
    { enabled: selectedTestId !== null }
  );

  const createTestMutation = trpc.abTesting.createTest.useMutation();
  const startTestMutation = trpc.abTesting.startTest.useMutation();
  const declareWinnerMutation = trpc.abTesting.declareWinner.useMutation();

  const handleCreateTest = async () => {
    if (!newTest.name || !newTest.variantA || !newTest.variantB || !newTest.emailContent) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    try {
      await createTestMutation.mutateAsync(newTest);
      toast.success("Test A/B créé avec succès");
      setIsCreateDialogOpen(false);
      setNewTest({ name: "", variantA: "", variantB: "", emailContent: "" });
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la création du test");
    }
  };

  const handleStartTest = async (testId: number) => {
    try {
      await startTestMutation.mutateAsync({ testId });
      toast.success("Test A/B démarré");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors du démarrage du test");
    }
  };

  const handleDeclareWinner = async (testId: number, winner: "A" | "B") => {
    if (!confirm(`Voulez-vous déclarer la variante ${winner} comme gagnante ?`)) return;

    try {
      await declareWinnerMutation.mutateAsync({ testId, winner });
      toast.success(`Variante ${winner} déclarée gagnante !`);
      refetch();
      if (selectedTestId === testId) {
        setSelectedTestId(null);
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la déclaration du gagnant");
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
                <FlaskConical className="h-10 w-10 text-accent" />
                A/B Testing Newsletter
              </h1>
              <p className="text-muted-foreground text-lg">
                Testez différentes variantes de subject lines pour optimiser vos taux d'ouverture
              </p>
            </div>
            <div className="flex gap-3">
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="default">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau Test
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Créer un Test A/B</DialogTitle>
                    <DialogDescription>
                      Testez 2 variantes de subject line pour voir laquelle performe le mieux
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nom du test</Label>
                      <Input
                        id="name"
                        value={newTest.name}
                        onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
                        placeholder="Ex: Test Sprint de Clarté - Janvier 2025"
                      />
                    </div>
                    <div>
                      <Label htmlFor="variantA">Subject Line - Variante A</Label>
                      <Input
                        id="variantA"
                        value={newTest.variantA}
                        onChange={(e) => setNewTest({ ...newTest, variantA: e.target.value })}
                        placeholder="Ex: 🔥 Transformez votre message en 7 jours"
                      />
                    </div>
                    <div>
                      <Label htmlFor="variantB">Subject Line - Variante B</Label>
                      <Input
                        id="variantB"
                        value={newTest.variantB}
                        onChange={(e) => setNewTest({ ...newTest, variantB: e.target.value })}
                        placeholder="Ex: Votre idée est brillante. Pourquoi personne ne la comprend ?"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emailContent">Contenu de l'email (identique pour les 2 variantes)</Label>
                      <Textarea
                        id="emailContent"
                        value={newTest.emailContent}
                        onChange={(e) => setNewTest({ ...newTest, emailContent: e.target.value })}
                        placeholder="Bonjour {name},&#10;&#10;Votre contenu ici..."
                        rows={8}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button onClick={handleCreateTest} disabled={createTestMutation.isPending}>
                        {createTestMutation.isPending ? "Création..." : "Créer le test"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button asChild variant="outline">
                <Link href="/admin">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour Admin
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Tests List */}
        <div className="grid grid-cols-1 gap-6">
          {testsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement des tests...</p>
            </div>
          ) : !tests || tests.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FlaskConical className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground mb-4">Aucun test A/B créé pour le moment</p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer votre premier test
                </Button>
              </CardContent>
            </Card>
          ) : (
            tests.map((test: any) => (
              <Card key={test.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 mb-2">
                        <FlaskConical className="h-5 w-5" />
                        {test.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge
                          className={
                            test.status === "draft"
                              ? "bg-gray-100 text-gray-800"
                              : test.status === "running"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }
                        >
                          {test.status === "draft" ? "Brouillon" : test.status === "running" ? "En cours" : "Terminé"}
                        </Badge>
                        {test.winnerVariant && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Trophy className="h-3 w-3 mr-1" />
                            Gagnant: Variante {test.winnerVariant}
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Variante A:</span> {test.variantA}
                        </div>
                        <div>
                          <span className="font-medium">Variante B:</span> {test.variantB}
                        </div>
                        {test.startDate && (
                          <div className="text-muted-foreground">
                            Démarré le {format(new Date(test.startDate), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {test.status === "draft" && (
                        <Button
                          size="sm"
                          onClick={() => handleStartTest(test.id)}
                          disabled={startTestMutation.isPending}
                        >
                          <PlayCircle className="h-4 w-4 mr-1" />
                          Démarrer
                        </Button>
                      )}
                      {test.status === "running" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedTestId(selectedTestId === test.id ? null : test.id)}
                        >
                          <TrendingUp className="h-4 w-4 mr-1" />
                          {selectedTestId === test.id ? "Masquer" : "Voir résultats"}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>

                {/* Results Section */}
                {selectedTestId === test.id && testResults && (
                  <CardContent className="border-t pt-6">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Résultats du Test
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Variante A */}
                      <div className="border rounded-lg p-4 bg-blue-50">
                        <h5 className="font-medium mb-3 flex items-center gap-2">
                          Variante A
                          {testResults.test.winnerVariant === "A" && (
                            <Trophy className="h-4 w-4 text-yellow-600" />
                          )}
                        </h5>
                        <p className="text-sm mb-3 text-muted-foreground">{test.variantA}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Envoyés:</span>
                            <span className="font-medium">{testResults.stats.variantA.sent}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              Taux d'ouverture:
                            </span>
                            <span className="font-medium text-green-600">{testResults.stats.variantA.openRate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm flex items-center gap-1">
                              <MousePointerClick className="h-3 w-3" />
                              Taux de clics:
                            </span>
                            <span className="font-medium text-purple-600">{testResults.stats.variantA.clickRate}%</span>
                          </div>
                        </div>
                        {test.status === "running" && !test.winnerVariant && (
                          <Button
                            size="sm"
                            className="w-full mt-4"
                            onClick={() => handleDeclareWinner(test.id, "A")}
                          >
                            <Trophy className="h-3 w-3 mr-1" />
                            Déclarer gagnante
                          </Button>
                        )}
                      </div>

                      {/* Variante B */}
                      <div className="border rounded-lg p-4 bg-purple-50">
                        <h5 className="font-medium mb-3 flex items-center gap-2">
                          Variante B
                          {testResults.test.winnerVariant === "B" && (
                            <Trophy className="h-4 w-4 text-yellow-600" />
                          )}
                        </h5>
                        <p className="text-sm mb-3 text-muted-foreground">{test.variantB}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Envoyés:</span>
                            <span className="font-medium">{testResults.stats.variantB.sent}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              Taux d'ouverture:
                            </span>
                            <span className="font-medium text-green-600">{testResults.stats.variantB.openRate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm flex items-center gap-1">
                              <MousePointerClick className="h-3 w-3" />
                              Taux de clics:
                            </span>
                            <span className="font-medium text-purple-600">{testResults.stats.variantB.clickRate}%</span>
                          </div>
                        </div>
                        {test.status === "running" && !test.winnerVariant && (
                          <Button
                            size="sm"
                            className="w-full mt-4"
                            onClick={() => handleDeclareWinner(test.id, "B")}
                          >
                            <Trophy className="h-3 w-3 mr-1" />
                            Déclarer gagnante
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
