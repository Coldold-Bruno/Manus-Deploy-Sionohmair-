import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { TrendingUp } from 'lucide-react';

interface ScoreHistoryPoint {
  date: string;
  leadScore: number;
  activityScore: number;
  engagementScore: number;
  activityType?: string;
}

interface ScoreEvolutionChartProps {
  history: ScoreHistoryPoint[];
}

const ACTIVITY_LABELS: Record<string, string> = {
  page_view: "Page visitée",
  calculator_use: "Calculateur",
  download: "Téléchargement",
  form_submit: "Formulaire",
  email_open: "Email ouvert",
  email_click: "Email cliqué",
  payment_intent: "Intention paiement",
  payment_completed: "Paiement",
};

export function ScoreEvolutionChart({ history }: ScoreEvolutionChartProps) {
  if (!history || history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Évolution du Score
          </CardTitle>
          <CardDescription>
            Graphique de progression dans le temps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>Pas encore d'historique de score</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format data for chart
  const chartData = history.map(point => ({
    ...point,
    dateFormatted: format(new Date(point.date), 'dd MMM', { locale: fr }),
    dateTimestamp: new Date(point.date).getTime(),
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-semibold mb-2">
            {format(new Date(data.date), 'dd MMMM yyyy à HH:mm', { locale: fr })}
          </p>
          {data.activityType && (
            <p className="text-xs text-muted-foreground mb-2">
              {ACTIVITY_LABELS[data.activityType] || data.activityType}
            </p>
          )}
          <div className="space-y-1 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Score total :</span>
              <span className="font-bold text-primary">{data.leadScore}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Activités :</span>
              <span className="font-semibold text-purple-600">{data.activityScore}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Newsletter :</span>
              <span className="font-semibold text-blue-600">{data.engagementScore}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const maxScore = Math.max(...chartData.map(d => d.leadScore));
  const yAxisMax = Math.ceil(maxScore / 50) * 50 + 20; // Round up to nearest 50 + padding

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-accent" />
          Évolution du Score
        </CardTitle>
        <CardDescription>
          Progression du score total et des composantes (newsletter + activités)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="dateFormatted"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              domain={[0, yAxisMax]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            
            {/* Reference lines for temperature thresholds */}
            <ReferenceLine
              y={80}
              stroke="hsl(var(--destructive))"
              strokeDasharray="5 5"
              label={{ value: 'Hot (80+)', position: 'right', fill: 'hsl(var(--destructive))' }}
            />
            <ReferenceLine
              y={41}
              stroke="hsl(var(--warning))"
              strokeDasharray="5 5"
              label={{ value: 'Warm (41+)', position: 'right', fill: 'hsl(var(--warning))' }}
            />

            {/* Lines */}
            <Line
              type="monotone"
              dataKey="leadScore"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              name="Score Total"
              dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="activityScore"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              name="Score Activités"
              dot={{ fill: 'hsl(var(--chart-2))', r: 3 }}
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="engagementScore"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              name="Score Newsletter"
              dot={false}
              strokeDasharray="3 3"
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Legend explanation */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-primary"></div>
            <span className="text-muted-foreground">Score Total (Newsletter + Activités)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-[hsl(var(--chart-2))] border-dashed border-t-2"></div>
            <span className="text-muted-foreground">Score Activités (comportement site)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-[hsl(var(--chart-1))] border-dashed border-t-2"></div>
            <span className="text-muted-foreground">Score Newsletter (engagement emails)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
