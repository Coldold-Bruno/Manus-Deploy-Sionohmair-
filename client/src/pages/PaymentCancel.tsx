import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, ArrowLeft, HelpCircle } from "lucide-react";
import { Link } from "wouter";

export default function PaymentCancel() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto h-20 w-20 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mb-6">
            <XCircle className="h-12 w-12 text-orange-600 dark:text-orange-400" />
          </div>
          <CardTitle className="text-4xl mb-4">Paiement annulé</CardTitle>
          <CardDescription className="text-lg">
            Vous avez annulé le processus de paiement. Aucun montant n'a été débité.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-secondary/20 p-6 rounded-lg space-y-4">
            <h3 className="font-semibold text-lg">Que s'est-il passé ?</h3>
            <p className="text-muted-foreground">
              Le paiement n'a pas été finalisé. Cela peut arriver si vous avez fermé la fenêtre de paiement 
              ou cliqué sur le bouton "Retour" pendant la transaction.
            </p>
            <p className="text-muted-foreground">
              <strong>Aucun montant n'a été débité</strong> de votre compte. Vous pouvez réessayer à tout moment.
            </p>
          </div>

          <div className="bg-accent/10 p-6 rounded-lg space-y-3">
            <div className="flex items-start gap-3">
              <HelpCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-2">Besoin d'aide ?</h4>
                <p className="text-sm text-muted-foreground">
                  Si vous rencontrez des difficultés avec le paiement, n'hésitez pas à nous contacter. 
                  Nous pouvons vous proposer d'autres options de paiement (virement, paiement en plusieurs fois).
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/services">
                <a className="flex items-center justify-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Retour aux Services
                </a>
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/contact">
                <a className="flex items-center justify-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Nous contacter
                </a>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
