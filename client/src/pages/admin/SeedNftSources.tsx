import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, CheckCircle, AlertCircle, Sparkles } from "lucide-react";

/**
 * Page Admin pour Initialiser les NFT Sources
 * 
 * Cette page permet d'exécuter le seed data pour créer les 3 NFT Sources :
 * 1. Correcteur Universel de Contenu (5%)
 * 2. Formation Sprint de Clarté (7%)
 * 3. Coaching Zoom Personnalisé (10%)
 */

export default function SeedNftSources() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [result, setResult] = useState<any>(null);

  const seedMutation = trpc.nftGratitude.seedNftSources.useMutation({
    onSuccess: (data) => {
      setResult(data);
      if (data.sources.length > 0) {
        toast.success(data.message);
      }
      setIsSeeding(false);
    },
    onError: (error) => {
      toast.error(`Erreur : ${error.message}`);
      setIsSeeding(false);
    },
  });

  const handleSeed = () => {
    setIsSeeding(true);
    setResult(null);
    seedMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            🌱 Initialisation des NFT Sources
          </h1>
          <p className="text-slate-600">
            Créez les 3 NFT Sources principaux pour activer le système de Gratitude Économique
          </p>
        </div>

        {/* Informations */}
        <Card className="p-6 mb-6 bg-white border-2 border-purple-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            NFT Sources à Créer
          </h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-1">
                1. Correcteur Universel de Contenu
              </h3>
              <p className="text-sm text-purple-700 mb-2">
                Service de correction automatique (texte, bilan, site web)
              </p>
              <div className="flex items-center gap-4 text-xs text-purple-600">
                <span>Catégorie : <strong>service</strong></span>
                <span>Redevabilité : <strong>5%</strong></span>
                <span>Facteur α : <strong>×22.67</strong></span>
              </div>
            </div>

            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <h3 className="font-semibold text-indigo-900 mb-1">
                2. Formation Sprint de Clarté
              </h3>
              <p className="text-sm text-indigo-700 mb-2">
                Formation interactive en 3 étapes (310 pages de méthodologie)
              </p>
              <div className="flex items-center gap-4 text-xs text-indigo-600">
                <span>Catégorie : <strong>formation</strong></span>
                <span>Redevabilité : <strong>7%</strong></span>
                <span>Facteur α : <strong>×22.67</strong></span>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-1">
                3. Coaching Zoom Personnalisé
              </h3>
              <p className="text-sm text-blue-700 mb-2">
                Séances individuelles via Zoom (diagnostic + plan d'action)
              </p>
              <div className="flex items-center gap-4 text-xs text-blue-600">
                <span>Catégorie : <strong>coaching</strong></span>
                <span>Redevabilité : <strong>10%</strong></span>
                <span>Facteur α : <strong>×22.67</strong></span>
              </div>
            </div>
          </div>
        </Card>

        {/* Bouton d'action */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">
                Prêt à initialiser ?
              </h3>
              <p className="text-sm text-slate-600">
                Cette opération créera les 3 NFT Sources dans la base de données
              </p>
            </div>
            <Button
              onClick={handleSeed}
              disabled={isSeeding}
              size="lg"
              className="gap-2"
            >
              {isSeeding ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Initialisation...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Initialiser les NFT Sources
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Résultat */}
        {result && (
          <Card className={`p-6 ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-start gap-3">
              {result.success ? (
                <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600 mt-1" />
              )}
              <div className="flex-1">
                <h3 className={`font-semibold mb-2 ${result.success ? 'text-green-900' : 'text-red-900'}`}>
                  {result.message}
                </h3>
                
                {result.sources && result.sources.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <p className="text-sm font-medium text-slate-700">
                      NFT Sources créés :
                    </p>
                    {result.sources.map((source: any, index: number) => (
                      <div key={index} className="p-3 bg-white rounded border border-slate-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-900">
                              {source.sourceName || source.name}
                            </p>
                            <p className="text-xs text-slate-600 mt-1">
                              ID: {source.id} • Catégorie: {source.sourceCategory || source.category}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-purple-600">
                              {source.baseRoyaltyPercentage}%
                            </p>
                            <p className="text-xs text-slate-500">
                              α = {source.enrichmentFactor}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {result.success && (
                  <div className="mt-4 p-3 bg-green-100 rounded border border-green-300">
                    <p className="text-sm text-green-800">
                      ✅ <strong>Prochaines étapes :</strong>
                    </p>
                    <ul className="text-sm text-green-700 mt-2 space-y-1 ml-4">
                      <li>• Les utilisateurs peuvent maintenant utiliser <code className="bg-green-200 px-1 rounded">/correcteur</code></li>
                      <li>• Chaque correction sera automatiquement liée au NFT Source</li>
                      <li>• Les redevances seront calculées selon les bénéfices générés</li>
                      <li>• Le NFT s'enrichira avec chaque contribution (×22.67)</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Avertissement */}
        <Card className="p-4 bg-yellow-50 border-yellow-200 mt-6">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-900 mb-1">
                ⚠️ Important
              </p>
              <p className="text-xs text-yellow-700">
                Cette opération est idempotente : si les NFT Sources existent déjà, 
                ils ne seront pas recréés. Vous pouvez cliquer plusieurs fois sans risque.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
