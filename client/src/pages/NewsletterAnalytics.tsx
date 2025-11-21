import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, TrendingUp, Users, Mail, MousePointerClick, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export default function NewsletterAnalytics() {
  const [selectedSegment, setSelectedSegment] = useState<string>('all');

  // Fetch newsletter statistics
  const { data: stats, isLoading: statsLoading } = trpc.newsletter.getStats.useQuery();
  
  // Fetch high-engagement subscribers
  const { data: highEngagement, isLoading: engagementLoading } = trpc.newsletter.getHighEngagementSubscribers.useQuery();

  if (statsLoading || engagementLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const kpis = [
    {
      title: 'Total Abonnés',
      value: stats?.totalSubscribers || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Taux d\'Ouverture',
      value: `${stats?.openRate || 0}%`,
      icon: Mail,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Taux de Clics',
      value: `${stats?.clickRate || 0}%`,
      icon: MousePointerClick,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Taux de Conversion',
      value: `${stats?.conversionRate || 0}%`,
      icon: DollarSign,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
  ];

  const segments = [
    { id: 'all', label: 'Tous', count: stats?.totalSubscribers || 0 },
    { id: 'diagnostic', label: 'Diagnostic', count: stats?.segmentCounts?.diagnostic || 0 },
    { id: 'formation', label: 'Formation', count: stats?.segmentCounts?.formation || 0 },
    { id: 'transformation', label: 'Transformation', count: stats?.segmentCounts?.transformation || 0 },
    { id: 'high', label: 'Engagement Élevé (≥70)', count: stats?.engagementCounts?.high || 0 },
    { id: 'medium', label: 'Engagement Moyen (30-69)', count: stats?.engagementCounts?.medium || 0 },
    { id: 'low', label: 'Engagement Faible (<30)', count: stats?.engagementCounts?.low || 0 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container py-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Analytics Newsletter</h1>
          <p className="text-slate-600">Tableau de bord des performances et engagement</p>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi) => (
            <Card key={kpi.title}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">{kpi.title}</p>
                    <p className="text-3xl font-bold text-slate-900">{kpi.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                    <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Segments */}
        <Card>
          <CardHeader>
            <CardTitle>Segments d'Abonnés</CardTitle>
            <CardDescription>Répartition par intérêt et niveau d'engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {segments.map((segment) => (
                <button
                  key={segment.id}
                  onClick={() => setSelectedSegment(segment.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedSegment === segment.id
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-sm text-slate-600 mb-1">{segment.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{segment.count}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* High Engagement Subscribers */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Abonnés à Fort Engagement (Score ≥ 70)</CardTitle>
                <CardDescription>Leads chauds à contacter en priorité</CardDescription>
              </div>
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            {highEngagement && highEngagement.length > 0 ? (
              <div className="space-y-4">
                {highEngagement.map((subscriber: any) => (
                  <div
                    key={subscriber.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{subscriber.name || 'Anonyme'}</p>
                      <p className="text-sm text-slate-600">{subscriber.email}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Intérêt: {subscriber.interests || 'general'} • Inscrit le{' '}
                        {new Date(subscriber.subscribedAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">{subscriber.engagementScore}</p>
                        <p className="text-xs text-slate-500">Score</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(subscriber.email);
                          toast.success('Email copié dans le presse-papiers');
                        }}
                      >
                        Copier Email
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-500 py-8">
                Aucun abonné avec un engagement élevé pour le moment
              </p>
            )}
          </CardContent>
        </Card>

        {/* Sequence Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Performance de la Séquence d'Onboarding</CardTitle>
            <CardDescription>Taux d'engagement par email (J+0 à J+14)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { day: 0, title: 'Bienvenue + Manuel PFPMA', openRate: 65, clickRate: 25 },
                { day: 1, title: 'Friction d\'Attention', openRate: 55, clickRate: 20 },
                { day: 3, title: 'Théorème Hi', openRate: 48, clickRate: 18 },
                { day: 5, title: 'Les 3 Frictions + Sprint', openRate: 42, clickRate: 22 },
                { day: 7, title: 'Étude de cas LearnFast', openRate: 38, clickRate: 15 },
                { day: 10, title: 'Étude de cas TechFlow', openRate: 35, clickRate: 14 },
                { day: 14, title: 'Guide Pratique 15min', openRate: 32, clickRate: 12 },
              ].map((email) => (
                <div key={email.day} className="flex items-center gap-4">
                  <div className="w-32">
                    <p className="text-sm font-semibold text-slate-900">Jour {email.day}</p>
                    <p className="text-xs text-slate-600">{email.title}</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${email.openRate}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-600 w-12">{email.openRate}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${email.clickRate}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-600 w-12">{email.clickRate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-6 mt-6 pt-6 border-t">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-600" />
                <span className="text-sm text-slate-600">Taux d'ouverture</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-600" />
                <span className="text-sm text-slate-600">Taux de clics</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
