import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2, Eye, EyeOff, RefreshCw } from "lucide-react";

/**
 * Page de Gestion des API Keys pour l'Honofication
 * 
 * Permet de configurer les intégrations API :
 * - Stripe
 * - PayPal
 * - Google Analytics
 * - Google Search (OSINT)
 * - SendGrid/Mailgun (Emails)
 */

export default function ApiKeysManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<number, boolean>>({});
  
  // Form state
  const [platform, setPlatform] = useState<string>("");
  const [integrationName, setIntegrationName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [skipValidation, setSkipValidation] = useState(false);
  
  // Récupérer les intégrations existantes
  const { data: integrations, refetch } = trpc.honofication.getApiIntegrations.useQuery();
  
  // Mutations
  const createIntegration = trpc.honofication.createApiIntegration.useMutation({
    onSuccess: () => {
      toast.success("Intégration créée avec succès !");
      setIsDialogOpen(false);
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error(`Erreur : ${error.message}`);
    },
  });
  
  const deleteIntegration = trpc.honofication.deleteApiIntegration.useMutation({
    onSuccess: () => {
      toast.success("Intégration supprimée");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erreur : ${error.message}`);
    },
  });
  
  const toggleIntegration = trpc.honofication.toggleApiIntegration.useMutation({
    onSuccess: () => {
      toast.success("Statut mis à jour");
      refetch();
    },
  });
  
  const resetForm = () => {
    setPlatform("");
    setIntegrationName("");
    setApiKey("");
    setApiSecret("");
  };
  
  const handleCreate = () => {
    if (!platform || !integrationName || !apiKey) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    createIntegration.mutate({
      platform,
      integrationName,
      apiKey,
      apiSecret: apiSecret || null,
      skipValidation,
    });
  };
  
  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette intégration ?")) {
      deleteIntegration.mutate({ integrationId: id });
    }
  };
  
  const toggleSecret = (id: number) => {
    setShowSecrets(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "stripe": return "💳";
      case "paypal": return "💰";
      case "google_analytics": return "📊";
      case "google_search": return "🔍";
      case "sendgrid": return "📧";
      case "mailgun": return "✉️";
      default: return "🔌";
    }
  };
  
  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "stripe": return "bg-purple-100 text-purple-700";
      case "paypal": return "bg-blue-100 text-blue-700";
      case "google_analytics": return "bg-orange-100 text-orange-700";
      case "google_search": return "bg-green-100 text-green-700";
      case "sendgrid": return "bg-indigo-100 text-indigo-700";
      case "mailgun": return "bg-pink-100 text-pink-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Gestion des API Keys</h1>
            <p className="text-slate-600 mt-2">
              Configurez les intégrations API pour la détection automatique des bénéfices
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Nouvelle Intégration
          </Button>
        </div>

        {/* Liste des intégrations */}
        <div className="grid gap-4">
          {integrations && integrations.length > 0 ? (
            integrations.map((integration) => (
              <Card key={integration.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-lg ${getPlatformColor(integration.platform)} flex items-center justify-center text-2xl`}>
                      {getPlatformIcon(integration.platform)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {integration.integrationName}
                        </h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          integration.status === "active" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {integration.status === "active" ? "Actif" : "Inactif"}
                        </span>
                      </div>
                      
                      <p className="text-sm text-slate-600 mb-3">
                        Plateforme : <span className="font-medium">{integration.platform}</span>
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label className="text-xs text-slate-500 w-24">API Key :</Label>
                          <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono">
                            {showSecrets[integration.id] 
                              ? integration.apiKey 
                              : "••••••••••••••••"}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSecret(integration.id)}
                            className="h-6 w-6 p-0"
                          >
                            {showSecrets[integration.id] ? (
                              <EyeOff className="w-3 h-3" />
                            ) : (
                              <Eye className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                        
                        {integration.lastSyncAt && (
                          <div className="flex items-center gap-2">
                            <Label className="text-xs text-slate-500 w-24">Dernière sync :</Label>
                            <span className="text-xs text-slate-600">
                              {new Date(integration.lastSyncAt).toLocaleString("fr-FR")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleIntegration.mutate({ 
                        integrationId: integration.id,
                        status: integration.status === "active" ? "paused" : "active"
                      })}
                      className="gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      {integration.status === "active" ? "Désactiver" : "Activer"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(integration.id)}
                      className="gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center">
              <div className="text-6xl mb-4">🔌</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Aucune intégration configurée
              </h3>
              <p className="text-slate-600 mb-6">
                Ajoutez votre première intégration API pour activer la détection automatique
              </p>
              <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Ajouter une intégration
              </Button>
            </Card>
          )}
        </div>

        {/* Dialog d'ajout */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Nouvelle Intégration API</DialogTitle>
              <DialogDescription>
                Configurez une nouvelle intégration pour la détection automatique des bénéfices
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="platform">Plateforme *</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une plateforme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stripe">💳 Stripe</SelectItem>
                    <SelectItem value="paypal">💰 PayPal</SelectItem>
                    <SelectItem value="google_analytics">📊 Google Analytics</SelectItem>
                    <SelectItem value="google_search">🔍 Google Search (OSINT)</SelectItem>
                    <SelectItem value="sendgrid">📧 SendGrid</SelectItem>
                    <SelectItem value="mailgun">✉️ Mailgun</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="name">Nom de l'intégration *</Label>
                <Input
                  id="name"
                  placeholder="Ex: Stripe Production"
                  value={integrationName}
                  onChange={(e) => setIntegrationName(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="apiKey">API Key *</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="sk_live_..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="apiSecret">API Secret (optionnel)</Label>
                <Input
                  id="apiSecret"
                  type="password"
                  placeholder="Laissez vide si non nécessaire"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreate} disabled={createIntegration.isPending}>
                {createIntegration.isPending ? "Création..." : "Créer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
