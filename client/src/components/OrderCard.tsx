import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Calendar, CreditCard, CheckCircle, Clock, XCircle, Download, FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const PRODUCT_NAMES: Record<string, string> = {
  SPRINT_CLARTE: "Sprint de Clarté",
  ARCHITECTURE_INSIGHT: "Architecture de l'Insight",
  PARTENARIAT_STRATEGIQUE: "Partenariat Stratégique",
};

const PRODUCT_PRICES: Record<string, string> = {
  SPRINT_CLARTE: "490 €",
  ARCHITECTURE_INSIGHT: "10 000 €",
  PARTENARIAT_STRATEGIQUE: "50 000 €",
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  completed: {
    label: "Payé",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    icon: CheckCircle,
  },
  pending: {
    label: "En attente",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    icon: Clock,
  },
  cancelled: {
    label: "Annulé",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    icon: XCircle,
  },
};

interface OrderCardProps {
  order: {
    id: number;
    productId: string;
    status: string;
    createdAt: Date;
    notes: string | null;
  };
}

export function OrderCard({ order }: OrderCardProps) {
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  
  const { data: artefacts, isLoading: isLoadingArtefacts } = trpc.artefacts.getOrderArtefacts.useQuery(
    { orderId: order.id },
    { enabled: expandedOrder === order.id && order.status === 'completed' }
  );

  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;

  const downloadMutation = trpc.artefacts.getArtefactDownloadUrl.useQuery(
    { artefactId: 0 },
    { enabled: false }
  );

  const handleDownload = (artefact: any) => {
    // Utiliser directement l'URL S3 stockée dans la base de données
    window.open(artefact.s3Url, '_blank');
    toast.success(`Téléchargement de ${artefact.name} démarré`);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">
              {PRODUCT_NAMES[order.productId] || order.productId}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </CardDescription>
          </div>
          <Badge className={statusConfig.color}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CreditCard className="h-4 w-4" />
            <span>Montant payé</span>
          </div>
          <span className="text-lg font-bold text-accent">
            {PRODUCT_PRICES[order.productId] || 'N/A'}
          </span>
        </div>

        {order.notes && (
          <div className="bg-secondary/20 p-4 rounded-lg text-sm">
            <p className="font-semibold mb-1">Notes :</p>
            <p className="text-muted-foreground">{order.notes}</p>
          </div>
        )}

        {order.status === 'completed' && (
          <div className="pt-4 border-t space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
            >
              <FileText className="h-4 w-4 mr-2" />
              {expandedOrder === order.id ? 'Masquer les artefacts' : 'Voir les artefacts disponibles'}
            </Button>

            {expandedOrder === order.id && (
              <div className="space-y-2">
                {isLoadingArtefacts && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-accent" />
                  </div>
                )}

                {!isLoadingArtefacts && (!artefacts || artefacts.length === 0) && (
                  <div className="text-center py-4 text-sm text-muted-foreground">
                    Aucun artefact disponible pour le moment.<br />
                    Vos livrables seront ajoutés ici dès qu'ils seront prêts.
                  </div>
                )}

                {artefacts && artefacts.length > 0 && (
                  <div className="space-y-2">
                    {artefacts.map((artefact) => (
                      <div
                        key={artefact.id}
                        className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg hover:bg-secondary/20 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{artefact.name}</p>
                          {artefact.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {artefact.description}
                            </p>
                          )}
                          {artefact.fileSize && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {(artefact.fileSize / 1024 / 1024).toFixed(2)} MB
                            </p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDownload(artefact)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
