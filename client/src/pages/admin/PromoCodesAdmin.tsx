import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Eye, TrendingUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function PromoCodesAdmin() {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedPromoCode, setSelectedPromoCode] = useState<number | null>(null);

  // Récupérer tous les codes promo
  const { data: promoCodes, isLoading, refetch } = trpc.promoCodes.list.useQuery();

  // Mutation pour créer un code promo
  const createMutation = trpc.promoCodes.create.useMutation({
    onSuccess: () => {
      toast.success("Code promo créé avec succès");
      setIsCreating(false);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Mutation pour désactiver un code promo
  const deactivateMutation = trpc.promoCodes.deactivate.useMutation({
    onSuccess: () => {
      toast.success("Code promo désactivé");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // État du formulaire
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage" as "percentage" | "amount",
    discountValue: 0,
    description: "",
    validFrom: new Date().toISOString().split("T")[0],
    validUntil: "",
    maxUses: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createMutation.mutate({
      code: formData.code.toUpperCase(),
      discountType: formData.discountType,
      discountValue: formData.discountValue,
      description: formData.description || undefined,
      validFrom: new Date(formData.validFrom),
      validUntil: formData.validUntil ? new Date(formData.validUntil) : undefined,
      maxUses: formData.maxUses ? parseInt(formData.maxUses) : undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Codes Promo</h1>
          <p className="text-muted-foreground mt-2">
            Créez et gérez les codes de réduction Stripe
          </p>
        </div>

        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Code Promo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer un Code Promo</DialogTitle>
              <DialogDescription>
                Le code sera automatiquement créé dans Stripe et enregistré en base de données
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="code">Code Promo *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="LAUNCH2024"
                  required
                  maxLength={50}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  3 à 50 caractères, lettres et chiffres uniquement
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discountType">Type de Réduction *</Label>
                  <Select
                    value={formData.discountType}
                    onValueChange={(value: "percentage" | "amount") =>
                      setFormData({ ...formData, discountType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Pourcentage (%)</SelectItem>
                      <SelectItem value="amount">Montant Fixe (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="discountValue">
                    Valeur * {formData.discountType === "percentage" ? "(%)" : "(€)"}
                  </Label>
                  <Input
                    id="discountValue"
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) =>
                      setFormData({ ...formData, discountValue: parseFloat(e.target.value) })
                    }
                    min="0"
                    max={formData.discountType === "percentage" ? "100" : undefined}
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Promotion de lancement - 20% de réduction"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="validFrom">Date de Début *</Label>
                  <Input
                    id="validFrom"
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="validUntil">Date de Fin (optionnel)</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="maxUses">Nombre Max d'Utilisations (optionnel)</Label>
                <Input
                  id="maxUses"
                  type="number"
                  value={formData.maxUses}
                  onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                  placeholder="Illimité si vide"
                  min="1"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Créer le Code Promo
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Liste des codes promo */}
      <div className="grid gap-4">
        {promoCodes?.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Aucun code promo créé pour le moment</p>
          </Card>
        ) : (
          promoCodes?.map((code: any) => (
            <Card key={code.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold font-mono">{code.code}</h3>
                    {code.isActive ? (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                        Actif
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                        Inactif
                      </span>
                    )}
                  </div>

                  {code.description && (
                    <p className="text-muted-foreground mb-3">{code.description}</p>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Réduction</p>
                      <p className="font-semibold">
                        {code.discountType === "percentage"
                          ? `${code.discountValue}%`
                          : `${code.discountValue}€`}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Utilisations</p>
                      <p className="font-semibold">
                        {code.currentUses}
                        {code.maxUses ? ` / ${code.maxUses}` : " / ∞"}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Valide du</p>
                      <p className="font-semibold">
                        {new Date(code.validFrom).toLocaleDateString("fr-FR")}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Valide jusqu'au</p>
                      <p className="font-semibold">
                        {code.validUntil
                          ? new Date(code.validUntil).toLocaleDateString("fr-FR")
                          : "Illimité"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPromoCode(code.id)}
                      >
                        <TrendingUp className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Statistiques - {code.code}</DialogTitle>
                      </DialogHeader>
                      <PromoCodeStats promoCodeId={code.id} />
                    </DialogContent>
                  </Dialog>

                  {code.isActive && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Désactiver le code ${code.code} ?`)) {
                          deactivateMutation.mutate({ id: code.id });
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// Composant pour afficher les statistiques d'un code promo
function PromoCodeStats({ promoCodeId }: { promoCodeId: number }) {
  const { data: stats, isLoading } = trpc.promoCodes.getStats.useQuery({ id: promoCodeId });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Utilisations</p>
          <p className="text-2xl font-bold">{stats.stats.totalUses}</p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Réductions</p>
          <p className="text-2xl font-bold">{stats.stats.totalDiscountGiven.toFixed(2)}€</p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Moy. par Utilisation</p>
          <p className="text-2xl font-bold">{stats.stats.averageDiscountPerUse.toFixed(2)}€</p>
        </Card>
      </div>

      {stats.usages.length > 0 && (
        <div>
          <h4 className="font-semibold mb-3">Historique des Utilisations</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {stats.usages.map((usage: any) => (
              <div
                key={usage.id}
                className="flex justify-between items-center p-3 bg-muted rounded-lg text-sm"
              >
                <div>
                  <p className="font-medium">Utilisateur #{usage.userId}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(usage.usedAt).toLocaleString("fr-FR")}
                  </p>
                </div>
                <p className="font-semibold text-green-600">
                  -{(usage.discountAmount / 100).toFixed(2)}€
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
