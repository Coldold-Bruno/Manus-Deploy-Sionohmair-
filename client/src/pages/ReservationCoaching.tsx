import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Calendar, Clock, ArrowLeft, CheckCircle2 } from "lucide-react";
import { format, addDays, startOfDay, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";

export default function ReservationCoaching() {
  const [, navigate] = useLocation();
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [step, setStep] = useState<"calendar" | "form" | "success">("calendar");
  
  // Formulaire pré-session
  const [formData, setFormData] = useState({
    clientPhone: "",
    clientTimezone: "Europe/Paris",
    preferredContactMethod: "email" as "email" | "phone" | "whatsapp",
    objectives: [""],
    questions: [""],
    documentsToReview: [""],
    specificTopics: [""],
  });

  // Récupérer les créneaux disponibles (7 prochains jours)
  const startDate = startOfDay(new Date());
  const endDate = addDays(startDate, 7);
  
  const { data: slots, isLoading } = trpc.coaching.getAvailableSlots.useQuery({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });

  const bookSessionMutation = trpc.coaching.bookSession.useMutation({
    onSuccess: () => {
      setStep("success");
      toast.success("Session réservée avec succès !");
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la réservation");
    },
  });

  const handleSlotSelect = (slot: any) => {
    setSelectedSlot(slot);
    setStep("form");
  };

  const handleAddField = (field: keyof typeof formData) => {
    setFormData({
      ...formData,
      [field]: [...(formData[field] as string[]), ""],
    });
  };

  const handleUpdateField = (field: keyof typeof formData, index: number, value: string) => {
    const newArray = [...(formData[field] as string[])];
    newArray[index] = value;
    setFormData({
      ...formData,
      [field]: newArray,
    });
  };

  const handleSubmit = () => {
    if (!selectedSlot) return;

    bookSessionMutation.mutate({
      availabilityId: selectedSlot.id,
      clientPhone: formData.clientPhone,
      clientTimezone: formData.clientTimezone,
      preferredContactMethod: formData.preferredContactMethod,
      preSessionQuestionnaire: {
        objectives: formData.objectives.filter(Boolean),
        questions: formData.questions.filter(Boolean),
        documentsToReview: formData.documentsToReview.filter(Boolean),
        specificTopics: formData.specificTopics.filter(Boolean),
      },
    });
  };

  // Grouper les créneaux par jour
  const slotsByDay = slots?.reduce((acc: any, slot: any) => {
    const day = format(new Date(slot.startTime), "yyyy-MM-dd");
    if (!acc[day]) acc[day] = [];
    acc[day].push(slot);
    return acc;
  }, {}) || {};

  if (step === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Session Réservée !</CardTitle>
            <CardDescription>
              Votre session de coaching a été réservée avec succès.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">
                  {selectedSlot && format(new Date(selectedSlot.startTime), "EEEE d MMMM yyyy", { locale: fr })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">
                  {selectedSlot && format(new Date(selectedSlot.startTime), "HH:mm")} - {selectedSlot && format(new Date(selectedSlot.endTime), "HH:mm")}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Vous recevrez un email de confirmation avec le lien Zoom dans quelques instants.
            </p>
            <Button onClick={() => navigate("/dashboard/coaching")} className="w-full">
              Voir mes sessions
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "form") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4 py-8">
        <div className="container max-w-3xl">
          <Button
            variant="ghost"
            onClick={() => setStep("calendar")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au calendrier
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Questionnaire Pré-Session</CardTitle>
              <CardDescription>
                Aidez-nous à préparer votre session de coaching en répondant à quelques questions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Créneau sélectionné */}
              <div className="bg-primary/10 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Créneau sélectionné</h3>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(selectedSlot.startTime), "EEEE d MMMM yyyy", { locale: fr })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{format(new Date(selectedSlot.startTime), "HH:mm")} - {format(new Date(selectedSlot.endTime), "HH:mm")}</span>
                  </div>
                </div>
              </div>

              {/* Informations de contact */}
              <div className="space-y-4">
                <h3 className="font-semibold">Informations de Contact</h3>
                
                <div>
                  <Label htmlFor="phone">Téléphone (optionnel)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+33 6 12 34 56 78"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="contactMethod">Méthode de contact préférée</Label>
                  <Select
                    value={formData.preferredContactMethod}
                    onValueChange={(value: any) => setFormData({ ...formData, preferredContactMethod: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Téléphone</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Objectifs */}
              <div className="space-y-3">
                <Label>Quels sont vos objectifs pour cette session ?</Label>
                {formData.objectives.map((obj, index) => (
                  <Input
                    key={index}
                    placeholder={`Objectif ${index + 1}`}
                    value={obj}
                    onChange={(e) => handleUpdateField("objectives", index, e.target.value)}
                  />
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddField("objectives")}
                >
                  + Ajouter un objectif
                </Button>
              </div>

              {/* Questions */}
              <div className="space-y-3">
                <Label>Quelles questions souhaitez-vous aborder ?</Label>
                {formData.questions.map((q, index) => (
                  <Textarea
                    key={index}
                    placeholder={`Question ${index + 1}`}
                    value={q}
                    onChange={(e) => handleUpdateField("questions", index, e.target.value)}
                    rows={2}
                  />
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddField("questions")}
                >
                  + Ajouter une question
                </Button>
              </div>

              {/* Sujets spécifiques */}
              <div className="space-y-3">
                <Label>Sujets spécifiques à traiter (optionnel)</Label>
                {formData.specificTopics.map((topic, index) => (
                  <Input
                    key={index}
                    placeholder={`Sujet ${index + 1}`}
                    value={topic}
                    onChange={(e) => handleUpdateField("specificTopics", index, e.target.value)}
                  />
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddField("specificTopics")}
                >
                  + Ajouter un sujet
                </Button>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={bookSessionMutation.isPending}
                className="w-full"
              >
                {bookSessionMutation.isPending ? "Réservation en cours..." : "Confirmer la réservation"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4 py-8">
      <div className="container max-w-5xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Réserver une Session de Coaching</h1>
          <p className="text-lg text-muted-foreground">
            Choisissez un créneau disponible pour votre session de coaching (1h)
          </p>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Chargement des créneaux disponibles...</p>
            </CardContent>
          </Card>
        ) : Object.keys(slotsByDay).length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Aucun créneau disponible</h3>
              <p className="text-muted-foreground">
                Aucun créneau n'est disponible pour les 7 prochains jours.
                <br />
                Contactez-nous pour planifier une session.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(slotsByDay).map(([day, daySlots]: [string, any]) => (
              <Card key={day}>
                <CardHeader>
                  <CardTitle>
                    {format(new Date(day), "EEEE d MMMM yyyy", { locale: fr })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {daySlots.map((slot: any) => (
                      <Button
                        key={slot.id}
                        variant="outline"
                        className="h-auto py-4 flex flex-col items-center gap-2"
                        onClick={() => handleSlotSelect(slot)}
                      >
                        <Clock className="w-5 h-5" />
                        <span className="font-semibold">
                          {format(new Date(slot.startTime), "HH:mm")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(slot.endTime), "HH:mm")}
                        </span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
