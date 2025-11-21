import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Sparkles, ArrowLeft, Package, Calendar, User, Mail, Upload, Loader2, CheckCircle, Clock, XCircle, FileText, Users } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

const PRODUCT_NAMES: Record<string, string> = {
  SPRINT_CLARTE: "Sprint de Clarté",
  ARCHITECTURE_INSIGHT: "Architecture de l'Insight",
  PARTENARIAT_STRATEGIQUE: "Partenariat Stratégique",
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

export default function Admin() {
  const { data: user } = trpc.auth.me.useQuery();
  const { data: orders, isLoading, refetch } = trpc.stripe.getAllOrders.useQuery();
  const uploadMutation = trpc.artefacts.uploadArtefact.useMutation();
  
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const [uploadForm, setUploadForm] = useState({
    name: "",
    description: "",
    file: null as File | null,
  });

  // Vérifier si l'utilisateur est admin
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle>Connexion requise</CardTitle>
            <CardDescription>
              Vous devez être connecté pour accéder à l'interface admin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/">
                <a>Retour à l'accueil</a>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle>Accès refusé</CardTitle>
            <CardDescription>
              Vous n'avez pas les permissions nécessaires pour accéder à cette page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/">
                <a>Retour à l'accueil</a>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadForm({ ...uploadForm, file });
    }
  };

  const handleUpload = async (orderId: number) => {
    if (!uploadForm.file || !uploadForm.name) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }

    try {
      toast.info("Upload en cours...");

      // Convertir le fichier en base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        const base64Data = base64.split(',')[1]; // Retirer le préfixe data:...;base64,

        try {
          await uploadMutation.mutateAsync({
            orderId,
            name: uploadForm.name,
            description: uploadForm.description || undefined,
            fileData: base64Data,
            fileName: uploadForm.file!.name,
            fileType: uploadForm.file!.type,
          });

          toast.success("Artefact uploadé avec succès !");
          setUploadForm({ name: "", description: "", file: null });
          setSelectedOrder(null);
          refetch();
        } catch (error: any) {
          toast.error("Erreur lors de l'upload : " + error.message);
        }
      };

      reader.readAsDataURL(uploadForm.file);
    } catch (error: any) {
      toast.error("Erreur lors de la lecture du fichier : " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <a className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-accent" />
              <span className="font-bold text-xl">Sionohmair Admin</span>
            </a>
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/admin/newsletter">
              <a className="text-sm font-medium hover:text-accent transition-colors flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Newsletter
              </a>
            </Link>
            <Link href="/admin/hot-leads">
              <a className="text-sm font-medium hover:text-accent transition-colors flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Leads Chauds
              </a>
            </Link>
            <Link href="/admin/segments">
              <a className="text-sm font-medium hover:text-accent transition-colors flex items-center gap-2">
                <Users className="h-4 w-4" />
                Segments
              </a>
            </Link>
            <Link href="/">
              <a className="text-sm font-medium hover:text-accent transition-colors flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour au site
              </a>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Interface Admin</h1>
            <p className="text-xl text-muted-foreground">
              Gérez les commandes et uploadez les artefacts pour vos clients
            </p>
          </div>
        </div>
      </section>

      {/* Orders List */}
      <section className="pb-20">
        <div className="container">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Toutes les Commandes</h2>
              <Badge variant="outline" className="text-sm">
                {orders?.length || 0} commande{(orders?.length || 0) > 1 ? 's' : ''}
              </Badge>
            </div>

            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
              </div>
            )}

            {!isLoading && (!orders || orders.length === 0) && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucune commande</h3>
                  <p className="text-muted-foreground">
                    Aucune commande n'a encore été passée
                  </p>
                </CardContent>
              </Card>
            )}

            {orders && orders.length > 0 && (
              <div className="space-y-4">
                {orders.map((order: any) => {
                  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                  const StatusIcon = statusConfig.icon;

                  return (
                    <Card key={order.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <CardTitle className="text-xl">
                              {PRODUCT_NAMES[order.productId] || order.productId}
                            </CardTitle>
                            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>
                              {order.user && (
                                <>
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    {order.user.name || 'Utilisateur inconnu'}
                                  </div>
                                  {order.user.email && (
                                    <div className="flex items-center gap-2">
                                      <Mail className="h-4 w-4" />
                                      {order.user.email}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                          <Badge className={statusConfig.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig.label}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {order.notes && (
                          <div className="bg-secondary/20 p-4 rounded-lg text-sm">
                            <p className="font-semibold mb-1">Notes :</p>
                            <p className="text-muted-foreground">{order.notes}</p>
                          </div>
                        )}

                        <div className="pt-4 border-t">
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {selectedOrder === order.id ? 'Annuler l\'upload' : 'Uploader un artefact'}
                          </Button>

                          {selectedOrder === order.id && (
                            <div className="mt-4 p-4 bg-secondary/10 rounded-lg space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor={`name-${order.id}`}>Nom de l'artefact *</Label>
                                <Input
                                  id={`name-${order.id}`}
                                  placeholder="Ex: Rapport de Clarté - Sprint complet"
                                  value={uploadForm.name}
                                  onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`description-${order.id}`}>Description (optionnel)</Label>
                                <Textarea
                                  id={`description-${order.id}`}
                                  placeholder="Description de l'artefact..."
                                  value={uploadForm.description}
                                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                                  rows={3}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`file-${order.id}`}>Fichier *</Label>
                                <Input
                                  id={`file-${order.id}`}
                                  type="file"
                                  onChange={handleFileChange}
                                />
                                {uploadForm.file && (
                                  <p className="text-sm text-muted-foreground">
                                    Fichier sélectionné : {uploadForm.file.name} ({(uploadForm.file.size / 1024 / 1024).toFixed(2)} MB)
                                  </p>
                                )}
                              </div>

                              <Button
                                className="w-full"
                                onClick={() => handleUpload(order.id)}
                                disabled={uploadMutation.isPending || !uploadForm.file || !uploadForm.name}
                              >
                                {uploadMutation.isPending ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Upload en cours...
                                  </>
                                ) : (
                                  <>
                                    <FileText className="h-4 w-4 mr-2" />
                                    Uploader l'artefact
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
