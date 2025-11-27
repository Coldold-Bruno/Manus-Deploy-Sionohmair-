import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, Save, Download } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function AvatarBuilder() {
  const [avatarName, setAvatarName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');
  const [occupation, setOccupation] = useState('');
  const [income, setIncome] = useState('');
  const [education, setEducation] = useState('');

  // Psychographiques
  const [goals, setGoals] = useState('');
  const [challenges, setChallenges] = useState('');
  const [painPoints, setPainPoints] = useState('');
  const [desires, setDesires] = useState('');
  const [fears, setFears] = useState('');
  const [values, setValues] = useState('');

  // Comportement
  const [buyingBehavior, setBuyingBehavior] = useState('');
  const [mediaConsumption, setMediaConsumption] = useState('');
  const [preferredTone, setPreferredTone] = useState('');
  const [keyMessages, setKeyMessages] = useState('');

  const createAvatarMutation = trpc.contentMarketing.createAvatar.useMutation({
    onSuccess: () => {
      toast.success('Avatar client créé avec succès !');
      // Reset form
      setAvatarName('');
      setAge('');
      setGender('');
      setLocation('');
      setOccupation('');
      setIncome('');
      setEducation('');
      setGoals('');
      setChallenges('');
      setPainPoints('');
      setDesires('');
      setFears('');
      setValues('');
      setBuyingBehavior('');
      setMediaConsumption('');
      setPreferredTone('');
      setKeyMessages('');
    },
    onError: (error) => {
      toast.error(`Erreur : ${error.message}`);
    }
  });

  const handleSave = () => {
    if (!avatarName.trim()) {
      toast.error('Veuillez entrer un nom pour l\'avatar');
      return;
    }

    createAvatarMutation.mutate({
      name: avatarName,
      age: age ? parseInt(age) : undefined,
      gender: gender || undefined,
      location: location || undefined,
      occupation: occupation || undefined,
      income: income || undefined,
      education: education || undefined,
      goals: goals.split('\n').filter(Boolean),
      challenges: challenges.split('\n').filter(Boolean),
      painPoints: painPoints.split('\n').filter(Boolean),
      desires: desires.split('\n').filter(Boolean),
      fears: fears.split('\n').filter(Boolean),
      values: values.split('\n').filter(Boolean),
      buyingBehavior: buyingBehavior ? {
        decisionMakers: [],
        buyingCycle: buyingBehavior,
        budget: income || '',
        objections: []
      } : undefined,
      mediaConsumption: mediaConsumption ? {
        platforms: [],
        contentTypes: [],
        influencers: []
      } : undefined,
      preferredTone: preferredTone || undefined,
      keyMessages: keyMessages.split('\n').filter(Boolean)
    });
  };

  const handleExport = () => {
    const avatarData = {
      name: avatarName,
      demographics: { age, gender, location, occupation, income, education },
      psychographics: {
        goals: goals.split('\n').filter(Boolean),
        challenges: challenges.split('\n').filter(Boolean),
        painPoints: painPoints.split('\n').filter(Boolean),
        desires: desires.split('\n').filter(Boolean),
        fears: fears.split('\n').filter(Boolean),
        values: values.split('\n').filter(Boolean)
      },
      behavior: {
        buyingBehavior,
        mediaConsumption,
        preferredTone,
        keyMessages: keyMessages.split('\n').filter(Boolean)
      }
    };

    const blob = new Blob([JSON.stringify(avatarData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `avatar-${avatarName.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Avatar exporté en JSON !');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12">
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
            Persona Builder
          </div>
          <h1 className="text-5xl font-bold mb-4">
            Créez Votre <span className="text-accent">Avatar Client Idéal</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Définissez en détail votre client cible pour créer des messages ultra-personnalisés et maximiser vos conversions.
          </p>
        </div>

        <div className="space-y-6">
          {/* Informations démographiques */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-accent" />
                Informations Démographiques
              </CardTitle>
              <CardDescription>
                Qui est votre client idéal ? (âge, genre, localisation, profession...)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="avatarName">Nom de l'avatar *</Label>
                  <Input
                    id="avatarName"
                    placeholder="Ex: Marie, Entrepreneur Tech"
                    value={avatarName}
                    onChange={(e) => setAvatarName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Âge</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Ex: 35"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Genre</Label>
                  <Input
                    id="gender"
                    placeholder="Ex: Femme, Homme, Non-binaire"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Localisation</Label>
                  <Input
                    id="location"
                    placeholder="Ex: Paris, France"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupation">Profession</Label>
                  <Input
                    id="occupation"
                    placeholder="Ex: CEO de startup SaaS"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="income">Revenu annuel</Label>
                  <Input
                    id="income"
                    placeholder="Ex: 80 000 - 120 000 €"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="education">Niveau d'éducation</Label>
                  <Input
                    id="education"
                    placeholder="Ex: Master en Marketing Digital"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations psychographiques */}
          <Card>
            <CardHeader>
              <CardTitle>Profil Psychographique</CardTitle>
              <CardDescription>
                Objectifs, défis, douleurs, désirs, peurs et valeurs de votre client
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goals">Objectifs (un par ligne)</Label>
                <Textarea
                  id="goals"
                  placeholder="Ex:&#10;Augmenter le chiffre d'affaires de 50%&#10;Automatiser les tâches répétitives&#10;Gagner 10h par semaine"
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="challenges">Défis (un par ligne)</Label>
                <Textarea
                  id="challenges"
                  placeholder="Ex:&#10;Manque de temps pour la stratégie&#10;Équipe trop petite&#10;Budget marketing limité"
                  value={challenges}
                  onChange={(e) => setChallenges(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="painPoints">Points de douleur (un par ligne)</Label>
                <Textarea
                  id="painPoints"
                  placeholder="Ex:&#10;Perd 15h/semaine dans des tâches manuelles&#10;Taux de conversion trop faible (1%)&#10;Difficulté à recruter des talents"
                  value={painPoints}
                  onChange={(e) => setPainPoints(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="desires">Désirs (un par ligne)</Label>
                  <Textarea
                    id="desires"
                    placeholder="Ex:&#10;Liberté financière&#10;Reconnaissance&#10;Impact positif"
                    value={desires}
                    onChange={(e) => setDesires(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fears">Peurs (un par ligne)</Label>
                  <Textarea
                    id="fears"
                    placeholder="Ex:&#10;Échouer publiquement&#10;Perdre de l'argent&#10;Rester bloqué"
                    value={fears}
                    onChange={(e) => setFears(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="values">Valeurs (un par ligne)</Label>
                <Textarea
                  id="values"
                  placeholder="Ex:&#10;Innovation&#10;Authenticité&#10;Excellence&#10;Impact social"
                  value={values}
                  onChange={(e) => setValues(e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Comportement */}
          <Card>
            <CardHeader>
              <CardTitle>Comportement d'Achat & Consommation Média</CardTitle>
              <CardDescription>
                Comment votre client achète-t-il ? Où consomme-t-il du contenu ?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="buyingBehavior">Comportement d'achat</Label>
                <Textarea
                  id="buyingBehavior"
                  placeholder="Ex: Décision rapide (< 7 jours), compare 3-5 solutions, consulte les avis clients, budget 500-2000€, objections principales : prix et ROI"
                  value={buyingBehavior}
                  onChange={(e) => setBuyingBehavior(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mediaConsumption">Consommation média</Label>
                <Textarea
                  id="mediaConsumption"
                  placeholder="Ex: LinkedIn (quotidien), podcasts business (3x/semaine), newsletters (10+), YouTube (tutoriels), livres business (2/mois)"
                  value={mediaConsumption}
                  onChange={(e) => setMediaConsumption(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredTone">Ton de communication préféré</Label>
                <Input
                  id="preferredTone"
                  placeholder="Ex: Professionnel mais accessible, data-driven, inspirant"
                  value={preferredTone}
                  onChange={(e) => setPreferredTone(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keyMessages">Messages clés à communiquer (un par ligne)</Label>
                <Textarea
                  id="keyMessages"
                  placeholder="Ex:&#10;Gagnez du temps sans sacrifier la qualité&#10;ROI mesurable dès le premier mois&#10;Support expert inclus&#10;Garantie satisfait ou remboursé"
                  value={keyMessages}
                  onChange={(e) => setKeyMessages(e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              onClick={handleSave}
              disabled={createAvatarMutation.isPending}
              size="lg"
              className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {createAvatarMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Enregistrer l'avatar
                </>
              )}
            </Button>

            <Button
              onClick={handleExport}
              variant="outline"
              size="lg"
              disabled={!avatarName}
            >
              <Download className="mr-2 h-5 w-5" />
              Exporter en JSON
            </Button>
          </div>

          {/* Guide */}
          <Card className="bg-accent/5 border-accent/20">
            <CardHeader>
              <CardTitle className="text-accent">💡 Pourquoi créer un avatar client ?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">
                Un avatar client (ou persona) est une représentation semi-fictionnelle de votre client idéal basée sur des données réelles et des insights.
              </p>
              <div className="space-y-2">
                <p className="text-sm font-medium">Bénéfices :</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Créer des messages ultra-personnalisés qui résonnent profondément</li>
                  <li>Identifier les bons canaux de communication (LinkedIn, podcasts, newsletters...)</li>
                  <li>Anticiper les objections et y répondre proactivement</li>
                  <li>Aligner toute l'équipe sur la même vision du client</li>
                  <li>Maximiser le ROI marketing en ciblant précisément</li>
                </ul>
              </div>
              <div className="bg-background/50 p-4 rounded-lg border border-accent/20">
                <p className="text-sm font-medium text-accent mb-2">
                  ⚡ Méthodologie Sionohmair
                </p>
                <p className="text-sm text-muted-foreground">
                  Un avatar bien défini élimine la <strong>Friction Cognitive</strong> : votre message devient immédiatement clair car il parle directement aux douleurs, désirs et valeurs de votre audience. Résultat : +340% de conversion grâce au Facteur Alpha (α = 22.67).
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
