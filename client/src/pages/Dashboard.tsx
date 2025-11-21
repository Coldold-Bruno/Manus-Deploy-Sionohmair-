import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Sparkles, ArrowLeft, Package, Calendar, CreditCard, CheckCircle, Clock, XCircle, Loader2 } from "lucide-react";
import { Link } from "wouter";

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

export default function Dashboard() {
  const { data: user } = trpc.auth.me.useQuery();
  const { data: orders, isLoading } = trpc.stripe.getMyOrders.useQuery();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle>Connexion requise</CardTitle>
            <CardDescription>
              Vous devez être connecté pour accéder à votre dashboard
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <a className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-accent" />
              <span className="font-bold text-xl">Sionohmair Insight Academy</span>
            </a>
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/">
              <a className="text-sm font-medium hover:text-accent transition-colors flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour
              </a>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Mon Dashboard</h1>
            <p className="text-xl text-muted-foreground">
              Bienvenue {user.name || user.email} ! Consultez l'historique de vos commandes et téléchargez vos artefacts.
            </p>
          </div>
        </div>
      </section>

      {/* Orders List */}
      <section className="pb-20">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Mes Commandes</h2>
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
                  <p className="text-muted-foreground mb-6">
                    Vous n'avez pas encore passé de commande
                  </p>
                  <Button asChild>
                    <Link href="/services">
                      <a>Découvrir nos services</a>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {orders && orders.length > 0 && (
              <div className="space-y-4">
                {orders.map((order) => {
                  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                  const StatusIcon = statusConfig.icon;

                  return (
                    <Card key={order.id} className="hover:shadow-lg transition-shadow">
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
                          <div className="pt-4 border-t">
                            <Button variant="outline" className="w-full">
                              Télécharger les artefacts
                            </Button>
                          </div>
                        )}
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
