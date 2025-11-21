import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Upload, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ImportSubscribers() {
  const [emailsText, setEmailsText] = useState('');
  const [defaultInterest, setDefaultInterest] = useState<'general' | 'diagnostic' | 'formation' | 'transformation'>('general');
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<{ success: number; failed: number; errors: string[] } | null>(null);

  const importMutation = trpc.newsletter.importBulk.useMutation();

  const handleImport = async () => {
    // Parser les emails (un par ligne ou séparés par virgules)
    const emails = emailsText
      .split(/[\n,;]/)
      .map((e) => e.trim())
      .filter((e) => e.length > 0);

    if (emails.length === 0) {
      toast.error('Aucun email valide trouvé');
      return;
    }

    setImporting(true);
    setResults(null);

    try {
      const result = await importMutation.mutateAsync({
        emails,
        defaultInterest,
      });

      setResults(result);
      
      if (result.success > 0) {
        toast.success(`${result.success} abonné(s) importé(s) avec succès !`);
      }
      
      if (result.failed > 0) {
        toast.warning(`${result.failed} email(s) ont échoué`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'importation');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container py-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Import d'Abonnés en Masse</h1>
          <p className="text-slate-600">Importer une liste d'emails pour la newsletter</p>
        </div>
      </div>

      <div className="container py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Importer des Emails</CardTitle>
            <CardDescription>
              Collez une liste d'emails (un par ligne ou séparés par des virgules). Les doublons seront automatiquement ignorés.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Textarea pour les emails */}
            <div className="space-y-2">
              <Label htmlFor="emails">Liste d'Emails</Label>
              <Textarea
                id="emails"
                placeholder="email1@example.com&#10;email2@example.com&#10;email3@example.com"
                value={emailsText}
                onChange={(e) => setEmailsText(e.target.value)}
                rows={12}
                className="font-mono text-sm"
              />
              <p className="text-sm text-slate-500">
                {emailsText.split(/[\n,;]/).filter((e) => e.trim().length > 0).length} email(s) détecté(s)
              </p>
            </div>

            {/* Sélection de l'intérêt par défaut */}
            <div className="space-y-2">
              <Label htmlFor="interest">Intérêt par Défaut</Label>
              <Select value={defaultInterest} onValueChange={(value) => setDefaultInterest(value as 'general' | 'diagnostic' | 'formation' | 'transformation')}>
                <SelectTrigger id="interest">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">Général</SelectItem>
                  <SelectItem value="diagnostic">Diagnostic (Sprint 490 €)</SelectItem>
                  <SelectItem value="formation">Formation (Architecture 10 000 €)</SelectItem>
                  <SelectItem value="transformation">Transformation (Partenariat 50 000 €)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-slate-500">
                Les abonnés recevront des emails personnalisés selon leur intérêt
              </p>
            </div>

            {/* Bouton d'import */}
            <Button
              onClick={handleImport}
              disabled={importing || emailsText.trim().length === 0}
              className="w-full"
              size="lg"
            >
              {importing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Importation en cours...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  Importer les Abonnés
                </>
              )}
            </Button>

            {/* Résultats de l'import */}
            {results && (
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="text-sm text-green-700">Succès</p>
                          <p className="text-2xl font-bold text-green-900">{results.success}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <XCircle className="h-8 w-8 text-red-600" />
                        <div>
                          <p className="text-sm text-red-700">Échecs</p>
                          <p className="text-2xl font-bold text-red-900">{results.failed}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {results.errors.length > 0 && (
                  <Card className="border-amber-200 bg-amber-50">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                        <CardTitle className="text-amber-900">Erreurs Détectées</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-sm text-amber-800">
                        {results.errors.slice(0, 10).map((error, index) => (
                          <li key={index} className="font-mono">
                            • {error}
                          </li>
                        ))}
                        {results.errors.length > 10 && (
                          <li className="text-amber-600 italic">
                            ... et {results.errors.length - 10} autres erreurs
                          </li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <p>
              <strong>1. Format accepté :</strong> Un email par ligne, ou plusieurs emails séparés par des virgules ou points-virgules.
            </p>
            <p>
              <strong>2. Validation :</strong> Tous les emails seront validés. Les emails invalides ou déjà existants seront ignorés.
            </p>
            <p>
              <strong>3. Email de bienvenue :</strong> Chaque nouvel abonné recevra automatiquement l'email de bienvenue (J+0) avec le Manuel PFPMA gratuit.
            </p>
            <p>
              <strong>4. Séquence automatique :</strong> Les abonnés entreront dans la séquence d'onboarding de 7 emails sur 14 jours (J+0, J+1, J+3, J+5, J+7, J+10, J+14).
            </p>
            <p>
              <strong>5. Segmentation :</strong> Choisissez l'intérêt par défaut pour personnaliser les emails selon le profil des abonnés.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
