import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Sparkles, ArrowLeft, Package, Loader2 } from "lucide-react";
import { OrderCard } from "@/components/OrderCard";
import { Link } from "wouter";
import { APP_LOGO } from "@/const";



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
            <a className="flex items-center space-x-3">
              <img src={APP_LOGO} alt="Sionohmair Insight Academy" className="h-12 w-auto" />
              <span className="font-bold text-xl hidden md:inline">Sionohmair Insight Academy</span>
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
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
