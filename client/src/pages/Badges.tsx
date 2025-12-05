import { useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Award, Users, Calendar, Lock } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Page des badges de fidélité
 * Affiche tous les badges disponibles et ceux obtenus par l'utilisateur
 */
export default function Badges() {
  const [activeTab, setActiveTab] = useState('my-badges');

  // Récupérer les badges de l'utilisateur
  const { data: myBadgesData, isLoading: isLoadingMyBadges } = trpc.loyaltyBadges.getMyBadges.useQuery();

  // Récupérer tous les badges disponibles
  const { data: allBadges, isLoading: isLoadingAllBadges } = trpc.loyaltyBadges.getAllBadges.useQuery();

  // Vérifier et attribuer les badges automatiquement
  const checkBadgesMutation = trpc.loyaltyBadges.checkAndAwardBadges.useMutation({
    onSuccess: (data) => {
      if (data.newBadges.length > 0) {
        toast.success(`🎉 Vous avez gagné ${data.newBadges.length} nouveau(x) badge(s) !`);
        window.location.reload();
      }
    },
  });

  useEffect(() => {
    // Vérifier automatiquement les badges au chargement de la page
    checkBadgesMutation.mutate();
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'referral':
        return <Users className="h-5 w-5" />;
      case 'loyalty':
        return <Calendar className="h-5 w-5" />;
      case 'engagement':
        return <Award className="h-5 w-5" />;
      default:
        return <Trophy className="h-5 w-5" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'referral':
        return 'Parrainage';
      case 'loyalty':
        return 'Ancienneté';
      case 'engagement':
        return 'Engagement';
      default:
        return 'Autre';
    }
  };

  const myBadgeCodes = new Set(myBadgesData?.badges.map((b: any) => b.badgeCode) || []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1929] via-[#1e3a5f] to-[#0A1929]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0A1929] to-[#1e3a5f] border-b border-[#F59E0B]/20">
        <div className="container py-12">
          <div className="flex items-center gap-4 mb-4">
            <Trophy className="h-12 w-12 text-[#F59E0B]" />
            <div>
              <h1 className="text-4xl font-bold text-white">Badges de Fidélité</h1>
              <p className="text-gray-300 mt-2">
                Gagnez des badges en fonction de votre engagement et de votre ancienneté
              </p>
            </div>
          </div>

          {/* Statistiques */}
          {myBadgesData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <Card className="bg-white/10 border-[#F59E0B]/30">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-8 w-8 text-[#F59E0B]" />
                    <div>
                      <p className="text-2xl font-bold text-white">{myBadgesData.totalBadges}</p>
                      <p className="text-sm text-gray-300">Badges obtenus</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-[#F59E0B]/30">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Award className="h-8 w-8 text-[#F59E0B]" />
                    <div>
                      <p className="text-2xl font-bold text-white">{myBadgesData.totalPrestige}</p>
                      <p className="text-sm text-gray-300">Points de prestige</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-[#F59E0B]/30">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-[#F59E0B]" />
                    <div>
                      <p className="text-2xl font-bold text-white">
                        {allBadges ? allBadges.length - myBadgesData.totalBadges : 0}
                      </p>
                      <p className="text-sm text-gray-300">Badges à débloquer</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="my-badges">Mes Badges</TabsTrigger>
            <TabsTrigger value="all-badges">Tous les Badges</TabsTrigger>
          </TabsList>

          {/* Mes badges */}
          <TabsContent value="my-badges">
            {isLoadingMyBadges ? (
              <div className="text-center py-12">
                <p className="text-gray-300">Chargement...</p>
              </div>
            ) : myBadgesData && myBadgesData.badges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myBadgesData.badges.map((badge: any) => (
                  <Card
                    key={badge.id}
                    className="bg-white/10 border-[#F59E0B]/30 hover:border-[#F59E0B] transition-all"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="text-5xl mb-3">{badge.icon}</div>
                        <Badge variant="secondary" className="bg-[#F59E0B]/20 text-[#F59E0B]">
                          {getCategoryLabel(badge.category)}
                        </Badge>
                      </div>
                      <CardTitle className="text-white">{badge.name}</CardTitle>
                      <CardDescription className="text-gray-300">
                        {badge.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[#F59E0B]">
                          <Trophy className="h-4 w-4" />
                          <span className="text-sm font-semibold">{badge.prestigePoints} pts</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          Obtenu le {new Date(badge.earnedAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white/10 border-[#F59E0B]/30">
                <CardContent className="py-12 text-center">
                  <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300 text-lg">Vous n'avez pas encore de badges</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Continuez à utiliser l'Academy pour débloquer vos premiers badges !
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tous les badges */}
          <TabsContent value="all-badges">
            {isLoadingAllBadges ? (
              <div className="text-center py-12">
                <p className="text-gray-300">Chargement...</p>
              </div>
            ) : allBadges && allBadges.length > 0 ? (
              <div className="space-y-8">
                {/* Grouper par catégorie */}
                {['engagement', 'referral', 'loyalty'].map((category) => {
                  const categoryBadges = allBadges.filter((b: any) => b.category === category);
                  if (categoryBadges.length === 0) return null;

                  return (
                    <div key={category}>
                      <div className="flex items-center gap-3 mb-4">
                        {getCategoryIcon(category)}
                        <h2 className="text-2xl font-bold text-white">
                          {getCategoryLabel(category)}
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categoryBadges.map((badge: any) => {
                          const isEarned = myBadgeCodes.has(badge.badgeCode);

                          return (
                            <Card
                              key={badge.id}
                              className={`${
                                isEarned
                                  ? 'bg-white/10 border-[#F59E0B]/30'
                                  : 'bg-white/5 border-gray-700/30 opacity-60'
                              } transition-all`}
                            >
                              <CardHeader>
                                <div className="flex items-start justify-between">
                                  <div className="text-5xl mb-3 relative">
                                    {badge.icon}
                                    {!isEarned && (
                                      <Lock className="absolute -top-1 -right-1 h-5 w-5 text-gray-400" />
                                    )}
                                  </div>
                                  <Badge
                                    variant="secondary"
                                    className={
                                      isEarned
                                        ? 'bg-[#F59E0B]/20 text-[#F59E0B]'
                                        : 'bg-gray-700/20 text-gray-400'
                                    }
                                  >
                                    {getCategoryLabel(badge.category)}
                                  </Badge>
                                </div>
                                <CardTitle className="text-white">{badge.name}</CardTitle>
                                <CardDescription className="text-gray-300">
                                  {badge.description}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-3">
                                  <div className="flex items-center gap-2 text-[#F59E0B]">
                                    <Trophy className="h-4 w-4" />
                                    <span className="text-sm font-semibold">
                                      {badge.prestigePoints} pts
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-400 bg-white/5 rounded p-2">
                                    <strong>Critère :</strong> {badge.criteria}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <Card className="bg-white/10 border-[#F59E0B]/30">
                <CardContent className="py-12 text-center">
                  <p className="text-gray-300">Aucun badge disponible</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
