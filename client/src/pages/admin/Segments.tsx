import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Users, Send, Eye, ArrowLeft, Flame, TrendingUp, Target, Clock, UserX, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SEGMENT_INFO: Record<string, { title: string; description: string; icon: any; color: string }> = {
  hot_leads: {
    title: "Leads Chauds 🔥",
    description: "Score ≥ 80 - Prêts à convertir",
    icon: Flame,
    color: "text-red-600",
  },
  warm_leads: {
    title: "Leads Tièdes",
    description: "Score 41-79 - Engagement modéré",
    icon: TrendingUp,
    color: "text-orange-600",
  },
  sprint_interested: {
    title: "Intéressés Sprint de Clarté",
    description: "Ont montré de l'intérêt pour le Sprint",
    icon: Sparkles,
    color: "text-purple-600",
  },
  high_value: {
    title: "Haute Valeur",
    description: "Score ≥ 60 + intérêt Niveau 3 ou Sprint",
    icon: Target,
    color: "text-blue-600",
  },
  recent_subscribers: {
    title: "Nouveaux Inscrits",
    description: "Inscrits dans les 30 derniers jours",
    icon: Clock,
    color: "text-green-600",
  },
  inactive: {
    title: "Inactifs",
    description: "Score 0-40 - Peu d'engagement",
    icon: UserX,
    color: "text-gray-600",
  },
};

export default function Segments() {
  const { user, loading: authLoading } = useAuth();
  const { data: stats, isLoading: statsLoading } = trpc.leadSegments.getSegmentStats.useQuery();
  
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [campaignSubject, setCampaignSubject] = useState("");
  const [campaignContent, setCampaignContent] = useState("");
  const [previewMode, setPreviewMode] = useState(true);

  const sendCampaignMutation = trpc.leadSegments.sendCampaign.useMutation();

  const handleSendCampaign = async () => {
    if (!selectedSegment || !campaignSubject.trim() || !campaignContent.trim()) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    try {
      const result = await sendCampaignMutation.mutateAsync({
        segment: selectedSegment as any,
        subject: campaignSubject,
        content: campaignContent,
        previewMode,
      });

      if (result.previewMode) {
        toast.success(`Prévisualisation envoyée à votre adresse email`);
      } else {
        toast.success(`Campagne envoyée : ${result.sent}/${result.total} emails envoyés avec succès`);
        if (result.failed > 0) {
          toast.warning(`${result.failed} emails n'ont pas pu être envoyés`);
        }
      }

      // Reset form
      setCampaignSubject("");
      setCampaignContent("");
      setSelectedSegment(null);
      setPreviewMode(true);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'envoi de la campagne");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Accès Refusé</CardTitle>
            <CardDescription>Vous devez être administrateur pour accéder à cette page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="default">
              <Link href="/">Retour à l'accueil</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Users className="h-10 w-10 text-accent" />
                Segments & Campagnes
              </h1>
              <p className="text-muted-foreground text-lg">
                Ciblez vos prospects avec des campagnes email personnalisées
              </p>
            </div>
            <Button asChild variant="default">
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour Admin
              </Link>
            </Button>
          </div>
        </div>

        {/* Segments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Object.entries(SEGMENT_INFO).map(([key, info]) => {
            const Icon = info.icon;
            const count = stats?.[key] || 0;

            return (
              <Card 
                key={key}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedSegment === key ? 'ring-2 ring-accent' : ''
                }`}
                onClick={() => setSelectedSegment(key)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-6 w-6 ${info.color}`} />
                      <CardTitle className="text-lg">{info.title}</CardTitle>
                    </div>
                    <Badge variant="secondary" className="text-lg font-bold">
                      {count}
                    </Badge>
                  </div>
                  <CardDescription>{info.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Campaign Form */}
        {selectedSegment && (
          <Card className="border-accent/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-accent" />
                Créer une Campagne Email
              </CardTitle>
              <CardDescription>
                Segment sélectionné : <strong>{SEGMENT_INFO[selectedSegment].title}</strong> ({stats?.[selectedSegment] || 0} leads)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="subject">Objet de l'email *</Label>
                  <Input
                    id="subject"
                    value={campaignSubject}
                    onChange={(e) => setCampaignSubject(e.target.value)}
                    placeholder="Ex: Découvrez comment transformer votre communication"
                  />
                </div>

                <div>
                  <Label htmlFor="content">Contenu de l'email (HTML supporté) *</Label>
                  <Textarea
                    id="content"
                    value={campaignContent}
                    onChange={(e) => setCampaignContent(e.target.value)}
                    placeholder="Bonjour,&#10;&#10;Nous avons remarqué votre intérêt pour...&#10;&#10;Cordialement,&#10;L'équipe Sionohmair"
                    rows={12}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Vous pouvez utiliser du HTML pour la mise en forme (balises &lt;p&gt;, &lt;strong&gt;, &lt;a&gt;, etc.)
                  </p>
                </div>

                <div className="flex items-center gap-4 p-4 bg-secondary/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="preview"
                      checked={previewMode}
                      onChange={(e) => setPreviewMode(e.target.checked)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="preview" className="cursor-pointer">
                      Mode prévisualisation (envoyer seulement à moi)
                    </Label>
                  </div>
                  {previewMode && (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">
                      <Eye className="h-3 w-3 mr-1" />
                      Prévisualisation
                    </Badge>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleSendCampaign}
                    disabled={sendCampaignMutation.isPending}
                    size="lg"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {previewMode ? "Envoyer la prévisualisation" : `Envoyer à ${stats?.[selectedSegment] || 0} leads`}
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedSegment(null);
                      setCampaignSubject("");
                      setCampaignContent("");
                      setPreviewMode(true);
                    }}
                    variant="outline"
                  >
                    Annuler
                  </Button>
                </div>

                {!previewMode && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">
                      <strong>⚠️ Attention :</strong> Vous êtes sur le point d'envoyer un email à {stats?.[selectedSegment] || 0} leads. 
                      Assurez-vous que le contenu est correct avant d'envoyer !
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Card */}
        {!selectedSegment && (
          <Card className="bg-accent/5 border-accent/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-accent" />
                Comment utiliser les segments ?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Sélectionnez un segment en cliquant sur une carte ci-dessus</li>
                <li>Rédigez votre email avec un objet accrocheur et un contenu personnalisé</li>
                <li>Testez d'abord en mode prévisualisation (envoi à vous-même)</li>
                <li>Une fois satisfait, décochez la prévisualisation et envoyez à tout le segment</li>
              </ol>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>💡 Astuce :</strong> Les leads chauds (score ≥ 80) sont les plus susceptibles de convertir. 
                  Priorisez-les avec des offres personnalisées !
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
