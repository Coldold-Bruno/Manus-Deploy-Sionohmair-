import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, Home } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect } from "react";

export default function PaymentSuccess() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split('?')[1]);
  const sessionId = params.get('session_id');

  useEffect(() => {
    // Optionnel : Envoyer un événement analytics
    console.log('[Payment Success] Session ID:', sessionId);
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto h-20 w-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-6">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-4xl mb-4">Paiement réussi !</CardTitle>
          <CardDescription className="text-lg">
            Votre commande a été confirmée. Vous allez recevoir un email de confirmation dans quelques instants.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-secondary/20 p-6 rounded-lg space-y-4">
            <h3 className="font-semibold text-lg">Prochaines étapes :</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span>
                  <strong>Confirmation par email</strong> : Vous recevrez un récapitulatif de votre commande avec la facture
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span>
                  <strong>Prise de contact</strong> : Bruno Coldold vous contactera sous 24-48h pour planifier le démarrage
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span>
                  <strong>Accès au Dashboard</strong> : Consultez votre historique de commandes et téléchargez vos artefacts
                </span>
              </li>
            </ul>
          </div>

          {sessionId && (
            <div className="text-sm text-muted-foreground text-center">
              Numéro de transaction : <code className="bg-secondary px-2 py-1 rounded">{sessionId}</code>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/dashboard">
                <a className="flex items-center justify-center gap-2">
                  <Download className="h-4 w-4" />
                  Accéder au Dashboard
                </a>
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/">
                <a className="flex items-center justify-center gap-2">
                  <Home className="h-4 w-4" />
                  Retour à l'accueil
                </a>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
