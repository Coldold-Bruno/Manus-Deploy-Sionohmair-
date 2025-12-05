import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, AlertCircle, ExternalLink, Copy } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

/**
 * Dashboard de configuration du système d'abonnement
 * Affiche l'état de toutes les configurations nécessaires
 */
export default function ConfigDashboard() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`${label} copié dans le presse-papiers`);
    setTimeout(() => setCopied(null), 2000);
  };

  const configs = [
    {
      id: 'smtp',
      title: 'Configuration SMTP',
      description: 'Envoi d\'emails automatiques (J-7, J-3, J-1, J-0)',
      status: 'configured', // 'configured', 'pending', 'error'
      variables: [
        { key: 'SMTP_HOST', value: 'smtp.gmail.com' },
        { key: 'SMTP_PORT', value: '587' },
        { key: 'SMTP_USER', value: 'coldoldbruno@gmail.com' },
        { key: 'SMTP_PASS', value: 'uiqq kpth pjdb oknb' },
        { key: 'SMTP_FROM', value: 'coldoldbruno@gmail.com' },
      ],
      instructions: [
        'Allez dans Manus → Settings → Secrets',
        'Cliquez sur "Add Secret" pour chaque variable',
        'Copiez-collez les valeurs ci-dessous',
        'Redémarrez le serveur',
      ],
    },
    {
      id: 'cron',
      title: 'CRON_SECRET',
      description: 'Sécurisation du cron job quotidien',
      status: 'configured',
      variables: [
        { key: 'CRON_SECRET', value: '7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=' },
      ],
      instructions: [
        'Ajoutez dans GitHub → Settings → Secrets → Actions',
        'Ajoutez aussi dans Manus → Settings → Secrets',
        'Le secret doit être identique dans les 2 endroits',
      ],
    },
    {
      id: 'github',
      title: 'GitHub Secrets',
      description: 'Configuration du cron job automatique',
      status: 'pending',
      variables: [
        { key: 'CRON_SECRET', value: '7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=' },
        { key: 'APP_URL', value: 'https://sionohmair-insight-academy.manus.space' },
      ],
      instructions: [
        'Allez sur GitHub → Votre repository → Settings',
        'Cliquez sur Secrets and variables → Actions',
        'Ajoutez les 2 secrets ci-dessous',
      ],
      link: 'https://github.com/settings/secrets',
    },
    {
      id: 'stripe',
      title: 'Configuration Stripe',
      description: 'Paiements et abonnements (29€/mois)',
      status: 'pending',
      variables: [
        { key: 'STRIPE_SECRET_KEY', value: 'sk_test_...' },
        { key: 'VITE_STRIPE_PUBLISHABLE_KEY', value: 'pk_test_...' },
        { key: 'STRIPE_WEBHOOK_SECRET', value: 'whsec_...' },
      ],
      instructions: [
        'Activez votre compte Stripe (lien ci-dessous)',
        'Créez le produit "Abonnement Sionohmair" (29€/mois)',
        'Récupérez les clés API dans Developers → API keys',
        'Configurez le webhook dans Developers → Webhooks',
        'Ajoutez les 3 variables dans Manus → Settings → Secrets',
      ],
      link: 'https://dashboard.stripe.com/claim_sandbox/YWNjdF8xU1ZFSGJENDV1UzY5TlRlLDE3NjQyODg3Njcv100fQEDeaWE',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'configured':
        return <Badge className="bg-green-500"><Check className="w-3 h-3 mr-1" /> Configuré</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700"><AlertCircle className="w-3 h-3 mr-1" /> En attente</Badge>;
      case 'error':
        return <Badge variant="destructive"><X className="w-3 h-3 mr-1" /> Erreur</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background py-16">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Dashboard de Configuration</h1>
          <p className="text-xl text-muted-foreground">
            Vérifiez l'état de toutes les configurations nécessaires pour le système d'abonnement
          </p>
        </div>

        {/* Progress */}
        <Card className="mb-8 border-2 border-accent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-accent">2/4</span>
              </div>
              <div>
                <div>Progression de la configuration</div>
                <div className="text-sm font-normal text-muted-foreground mt-1">
                  2 configurations terminées sur 4
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-secondary rounded-full h-4">
              <div className="bg-accent h-4 rounded-full" style={{ width: '50%' }}></div>
            </div>
          </CardContent>
        </Card>

        {/* Configurations */}
        <div className="space-y-6">
          {configs.map((config) => (
            <Card key={config.id} className="border-2">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {config.title}
                      {getStatusBadge(config.status)}
                    </CardTitle>
                    <CardDescription className="mt-2">{config.description}</CardDescription>
                  </div>
                  {config.link && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={config.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ouvrir
                      </a>
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Variables */}
                <div>
                  <h4 className="font-semibold mb-3">Variables à configurer :</h4>
                  <div className="space-y-2">
                    {config.variables.map((variable) => (
                      <div key={variable.key} className="flex items-center gap-2 bg-secondary/50 p-3 rounded-lg">
                        <code className="flex-1 text-sm">
                          <span className="font-semibold">{variable.key}</span>=
                          <span className="text-muted-foreground">{variable.value}</span>
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(`${variable.key}=${variable.value}`, variable.key)}
                        >
                          {copied === variable.key ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <h4 className="font-semibold mb-3">Instructions :</h4>
                  <ol className="space-y-2">
                    {config.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </span>
                        <span className="text-sm">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <Card className="mt-8 border-2 border-accent">
          <CardHeader>
            <CardTitle>Scripts d'automatisation</CardTitle>
            <CardDescription>
              Utilisez ces scripts pour tester et configurer le système
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <div>
                <code className="font-semibold">./scripts/install.sh</code>
                <p className="text-sm text-muted-foreground mt-1">
                  Script d'installation automatique (one-click)
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <div>
                <code className="font-semibold">./scripts/test-email.mjs</code>
                <p className="text-sm text-muted-foreground mt-1">
                  Tester l'envoi d'emails SMTP
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <div>
                <code className="font-semibold">./scripts/test-system.sh</code>
                <p className="text-sm text-muted-foreground mt-1">
                  Tester tout le système (cron, SMTP, Stripe, DB)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documentation */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">CONFIGURATION_FINALE.md</h4>
                <p className="text-sm text-muted-foreground">
                  Guide complet de configuration (3 étapes)
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">CRON_AUTOMATION.md</h4>
                <p className="text-sm text-muted-foreground">
                  Documentation du cron job automatique
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">GUIDE_UTILISATEUR.md</h4>
                <p className="text-sm text-muted-foreground">
                  Guide utilisateur pour les abonnés
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">scripts/README.md</h4>
                <p className="text-sm text-muted-foreground">
                  Documentation des scripts d'automatisation
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
