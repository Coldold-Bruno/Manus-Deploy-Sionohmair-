/**
 * Page de gestion des alertes intelligentes (Slack/Discord)
 */

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Bell, CheckCircle2, XCircle, Send, TestTube, Activity } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

export default function Alerts() {
  const [alertType, setAlertType] = useState<string>('hot_lead');
  const [priority, setPriority] = useState<string>('medium');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  // Récupérer la configuration des webhooks
  const { data: webhookConfig, isLoading: loadingConfig } = trpc.alerts.getWebhookConfig.useQuery();

  // Récupérer les statistiques
  const { data: stats, isLoading: loadingStats } = trpc.alerts.getAlertStats.useQuery();

  // Mutation pour envoyer une alerte manuelle
  const sendAlertMutation = trpc.alerts.sendManualAlert.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Alerte envoyée avec succès !', {
          description: `Slack: ${data.slack ? '✓' : '✗'} | Discord: ${data.discord ? '✓' : '✗'}`
        });
        setTitle('');
        setMessage('');
      } else {
        toast.error('Échec de l\'envoi de l\'alerte', {
          description: 'Vérifiez la configuration des webhooks'
        });
      }
    },
    onError: (error) => {
      toast.error('Erreur lors de l\'envoi', {
        description: error.message
      });
    }
  });

  // Mutation pour tester les webhooks
  const testWebhooksMutation = trpc.alerts.testWebhooks.useMutation({
    onSuccess: (data) => {
      const slackStatus = data.slack.configured ? (data.slack.sent ? '✓ Envoyé' : '✗ Échec') : '⚠️ Non configuré';
      const discordStatus = data.discord.configured ? (data.discord.sent ? '✓ Envoyé' : '✗ Échec') : '⚠️ Non configuré';
      
      toast.info('Test des webhooks terminé', {
        description: `Slack: ${slackStatus} | Discord: ${discordStatus}`
      });
    },
    onError: (error) => {
      toast.error('Erreur lors du test', {
        description: error.message
      });
    }
  });

  const handleSendAlert = () => {
    if (!title || !message) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    sendAlertMutation.mutate({
      type: alertType as any,
      priority: priority as any,
      title,
      message
    });
  };

  const handleTestWebhooks = () => {
    testWebhooksMutation.mutate();
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 space-y-8">
        {/* En-tête */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="h-8 w-8" />
            Alertes Intelligentes
          </h1>
          <p className="text-muted-foreground mt-2">
            Configurez et testez les notifications Slack et Discord pour les événements critiques
          </p>
        </div>

        {/* Configuration des webhooks */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration des Webhooks</CardTitle>
            <CardDescription>
              Statut actuel de vos intégrations Slack et Discord
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingConfig ? (
              <div className="text-center py-4">Chargement...</div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${webhookConfig?.slack.configured ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div>
                      <p className="font-medium">Slack</p>
                      <p className="text-sm text-muted-foreground">
                        {webhookConfig?.slack.configured ? `URL: ${webhookConfig.slack.url}` : 'Non configuré'}
                      </p>
                    </div>
                  </div>
                  {webhookConfig?.slack.configured ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-300" />
                  )}
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${webhookConfig?.discord.configured ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div>
                      <p className="font-medium">Discord</p>
                      <p className="text-sm text-muted-foreground">
                        {webhookConfig?.discord.configured ? `URL: ${webhookConfig.discord.url}` : 'Non configuré'}
                      </p>
                    </div>
                  </div>
                  {webhookConfig?.discord.configured ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-300" />
                  )}
                </div>

                <Button 
                  onClick={handleTestWebhooks} 
                  disabled={testWebhooksMutation.isPending}
                  className="w-full"
                  variant="outline"
                >
                  <TestTube className="mr-2 h-4 w-4" />
                  {testWebhooksMutation.isPending ? 'Test en cours...' : 'Tester les Webhooks'}
                </Button>

                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    <strong>Configuration :</strong> Ajoutez les variables d'environnement <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">SLACK_WEBHOOK_URL</code> et <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">DISCORD_WEBHOOK_URL</code> dans Settings → Secrets
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistiques */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Statistiques des Alertes
            </CardTitle>
            <CardDescription>
              Événements qui déclenchent automatiquement des alertes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <div className="text-center py-4">Chargement...</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Leads</p>
                  <p className="text-2xl font-bold">{stats?.totalLeads || 0}</p>
                </div>
                <div className="p-4 border rounded-lg bg-orange-50 dark:bg-orange-950">
                  <p className="text-sm text-muted-foreground">Leads Chauds</p>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats?.hotLeads || 0}</p>
                </div>
                <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                  <p className="text-sm text-muted-foreground">Conversions (30j)</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats?.conversions || 0}</p>
                </div>
                <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-950">
                  <p className="text-sm text-muted-foreground">Risques Churn</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats?.churnRisks || 0}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Envoyer une alerte manuelle */}
        <Card>
          <CardHeader>
            <CardTitle>Envoyer une Alerte Manuelle</CardTitle>
            <CardDescription>
              Testez l'envoi d'alertes personnalisées vers Slack et Discord
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="alertType">Type d'événement</Label>
                <Select value={alertType} onValueChange={setAlertType}>
                  <SelectTrigger id="alertType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hot_lead">🔥 Lead Chaud</SelectItem>
                    <SelectItem value="payment_failed">💳 Paiement Échoué</SelectItem>
                    <SelectItem value="churn_risk">⚠️ Risque de Churn</SelectItem>
                    <SelectItem value="new_conversion">🎉 Nouvelle Conversion</SelectItem>
                    <SelectItem value="goal_reached">🎯 Objectif Atteint</SelectItem>
                    <SelectItem value="trial_expiring">⏰ Essai Expire</SelectItem>
                    <SelectItem value="high_value_action">⭐ Action Importante</SelectItem>
                    <SelectItem value="system_error">🚨 Erreur Système</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priorité</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Basse (Vert)</SelectItem>
                    <SelectItem value="medium">Moyenne (Orange)</SelectItem>
                    <SelectItem value="high">Haute (Rouge)</SelectItem>
                    <SelectItem value="critical">Critique (Violet)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Titre de l'alerte</Label>
              <Input
                id="title"
                placeholder="Ex: Nouveau Lead Chaud Détecté"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Ex: Un lead vient d'atteindre un score de 85 points avec 5 actions récentes..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>

            <Button 
              onClick={handleSendAlert} 
              disabled={sendAlertMutation.isPending || !title || !message}
              className="w-full"
            >
              <Send className="mr-2 h-4 w-4" />
              {sendAlertMutation.isPending ? 'Envoi en cours...' : 'Envoyer l\'Alerte'}
            </Button>
          </CardContent>
        </Card>

        {/* Guide de configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Guide de Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Configuration Slack</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Allez sur <a href="https://api.slack.com/messaging/webhooks" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">api.slack.com/messaging/webhooks</a></li>
                <li>Créez une nouvelle Incoming Webhook</li>
                <li>Sélectionnez le canal où recevoir les notifications</li>
                <li>Copiez l'URL du webhook (commence par https://hooks.slack.com/...)</li>
                <li>Ajoutez-la dans Settings → Secrets avec la clé <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">SLACK_WEBHOOK_URL</code></li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. Configuration Discord</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Ouvrez les paramètres de votre serveur Discord</li>
                <li>Allez dans Intégrations → Webhooks</li>
                <li>Créez un nouveau webhook</li>
                <li>Sélectionnez le canal où recevoir les notifications</li>
                <li>Copiez l'URL du webhook</li>
                <li>Ajoutez-la dans Settings → Secrets avec la clé <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">DISCORD_WEBHOOK_URL</code></li>
              </ol>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-sm text-yellow-900 dark:text-yellow-100">
                <strong>Note :</strong> Les alertes sont envoyées automatiquement pour les événements critiques (leads chauds, paiements échoués, etc.). Utilisez cette page pour tester la configuration et envoyer des alertes manuelles si nécessaire.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
