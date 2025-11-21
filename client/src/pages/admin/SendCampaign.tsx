import { useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { ArrowLeft, Send, Eye, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

export default function SendCampaign() {
  const [, setLocation] = useLocation();
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [segment, setSegment] = useState<'all' | 'sprint' | 'n3' | 'ia'>('all');
  const [selectedTestId, setSelectedTestId] = useState<number | undefined>();
  const [showPreview, setShowPreview] = useState(false);
  const [sendResult, setSendResult] = useState<{
    sent: number;
    failed: number;
    errors: string[];
    abTestActive: boolean;
  } | null>(null);

  // Récupérer les tests A/B actifs
  const { data: abTests } = trpc.abTesting.getTests.useQuery();
  const runningTests = abTests?.filter(test => test.status === 'running') || [];

  // Mutation pour envoyer la campagne
  const sendCampaignMutation = trpc.newsletter.sendCampaign.useMutation({
    onSuccess: (data) => {
      setSendResult(data);
      toast.success(`Campagne envoyée à ${data.sent} abonnés !`);
    },
    onError: (error) => {
      toast.error(`Erreur : ${error.message}`);
    },
  });

  const handleSend = () => {
    if (!subject.trim()) {
      toast.error('Le sujet est requis');
      return;
    }
    if (!content.trim()) {
      toast.error('Le contenu est requis');
      return;
    }

    // Confirmation
    const confirmMessage = selectedTestId
      ? `Envoyer la campagne avec le test A/B au segment "${segment}" ?`
      : `Envoyer la campagne au segment "${segment}" ?`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    sendCampaignMutation.mutate({
      subject,
      content,
      segmentFilter: segment,
      testId: selectedTestId,
    });
  };

  const segmentLabels = {
    all: 'Tous les abonnés',
    sprint: 'Intéressés Sprint de Clarté',
    n3: 'Intéressés Niveau 3',
    ia: 'Intéressés Automatisation IA',
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation('/admin')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Envoyer une Campagne</h1>
            <p className="text-muted-foreground">
              Composez et envoyez une campagne newsletter à vos abonnés
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Formulaire */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations de base */}
            <Card>
              <CardHeader>
                <CardTitle>Informations de la Campagne</CardTitle>
                <CardDescription>
                  Composez votre email et sélectionnez les destinataires
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Sujet */}
                <div className="space-y-2">
                  <Label htmlFor="subject">Sujet de l'email</Label>
                  <Input
                    id="subject"
                    placeholder="Ex: Nouvelle ressource gratuite : Le Guide PFPMA"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    {selectedTestId
                      ? "⚠️ Ce sujet sera ignoré si un test A/B est sélectionné"
                      : "Le sujet apparaîtra dans la boîte de réception"}
                  </p>
                </div>

                {/* Contenu */}
                <div className="space-y-2">
                  <Label htmlFor="content">Contenu HTML</Label>
                  <Textarea
                    id="content"
                    placeholder="<html>...</html>"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={12}
                    className="font-mono text-sm"
                  />
                  <p className="text-sm text-muted-foreground">
                    Utilisez du HTML pour formater votre email
                  </p>
                </div>

                {/* Bouton prévisualisation */}
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(!showPreview)}
                  className="w-full"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {showPreview ? 'Masquer' : 'Afficher'} la Prévisualisation
                </Button>

                {/* Prévisualisation */}
                {showPreview && (
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <h4 className="font-semibold mb-2">Prévisualisation</h4>
                    <div className="bg-white p-4 rounded border">
                      <div className="mb-4 pb-4 border-b">
                        <p className="text-sm text-muted-foreground">Sujet :</p>
                        <p className="font-semibold">{subject || '(Aucun sujet)'}</p>
                      </div>
                      <div
                        dangerouslySetInnerHTML={{ __html: content || '<p class="text-muted-foreground">Aucun contenu</p>' }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Résultats d'envoi */}
            {sendResult && (
              <Card>
                <CardHeader>
                  <CardTitle>Résultats de l'Envoi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold">{sendResult.sent}</p>
                        <p className="text-sm text-muted-foreground">Envoyés</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="text-2xl font-bold">{sendResult.failed}</p>
                        <p className="text-sm text-muted-foreground">Échoués</p>
                      </div>
                    </div>
                  </div>

                  {sendResult.abTestActive && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Test A/B actif : Les abonnés ont été répartis 50/50 entre les variantes
                      </AlertDescription>
                    </Alert>
                  )}

                  {sendResult.errors.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-red-600">Erreurs :</h4>
                      <div className="max-h-40 overflow-y-auto space-y-1">
                        {sendResult.errors.map((error, i) => (
                          <p key={i} className="text-sm text-red-600">• {error}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Paramètres */}
          <div className="space-y-6">
            {/* Segment */}
            <Card>
              <CardHeader>
                <CardTitle>Destinataires</CardTitle>
                <CardDescription>
                  Sélectionnez le segment à cibler
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Segment</Label>
                  <Select value={segment} onValueChange={(value: any) => setSegment(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{segmentLabels.all}</SelectItem>
                      <SelectItem value="sprint">{segmentLabels.sprint}</SelectItem>
                      <SelectItem value="n3">{segmentLabels.n3}</SelectItem>
                      <SelectItem value="ia">{segmentLabels.ia}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Test A/B */}
            <Card>
              <CardHeader>
                <CardTitle>Test A/B (Optionnel)</CardTitle>
                <CardDescription>
                  Sélectionnez un test A/B actif pour tester 2 subject lines
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {runningTests.length === 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Aucun test A/B actif. Créez-en un dans la section A/B Testing.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-2">
                    <Label>Test A/B</Label>
                    <Select
                      value={selectedTestId?.toString() || 'none'}
                      onValueChange={(value) =>
                        setSelectedTestId(value === 'none' ? undefined : parseInt(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Aucun test</SelectItem>
                        {runningTests.map((test) => (
                          <SelectItem key={test.id} value={test.id.toString()}>
                            {test.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedTestId && (
                      <div className="mt-4 p-3 bg-muted rounded-lg text-sm space-y-2">
                        {runningTests.find(t => t.id === selectedTestId) && (
                          <>
                            <div>
                              <p className="font-semibold">Variante A :</p>
                              <p className="text-muted-foreground">
                                {runningTests.find(t => t.id === selectedTestId)?.variantA}
                              </p>
                            </div>
                            <div>
                              <p className="font-semibold">Variante B :</p>
                              <p className="text-muted-foreground">
                                {runningTests.find(t => t.id === selectedTestId)?.variantB}
                              </p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              Les abonnés seront répartis 50/50 entre ces 2 variantes
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bouton d'envoi */}
            <Button
              onClick={handleSend}
              disabled={sendCampaignMutation.isPending || !subject.trim() || !content.trim()}
              className="w-full"
              size="lg"
            >
              <Send className="h-4 w-4 mr-2" />
              {sendCampaignMutation.isPending ? 'Envoi en cours...' : 'Envoyer la Campagne'}
            </Button>

            {/* Avertissement */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                L'envoi est irréversible. Vérifiez bien le contenu et le segment avant d'envoyer.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
}
