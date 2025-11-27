import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, Bot, User, Sparkles } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatIA() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: 'Bonjour ! Je suis l\'assistant IA Sionohmair. Je peux vous aider à optimiser votre copywriting, analyser vos scripts, ou répondre à vos questions sur les frameworks PFPMA et APTEA. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [selectedAvatarId, setSelectedAvatarId] = useState<number | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Récupérer les avatars clients
  const { data: avatars = [] } = trpc.contentMarketing.getMyAvatars.useQuery();

  // Mutation pour envoyer un message (on utilise generateCopy comme backend temporaire)
  const sendMessageMutation = trpc.contentMarketing.generateCopy.useMutation({
    onSuccess: (data) => {
      const assistantMessage: Message = {
        id: messages.length + 1,
        role: 'assistant',
        content: data.generatedContent,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    },
    onError: (error) => {
      toast.error(`Erreur : ${error.message}`);
    }
  });

  const handleSend = () => {
    if (!input.trim()) {
      toast.error('Veuillez entrer un message');
      return;
    }

    // Ajouter le message utilisateur
    const userMessage: Message = {
      id: messages.length + 1,
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Envoyer à l'IA
    sendMessageMutation.mutate({
      contentType: 'landing_page',
      brief: input,
      avatarId: selectedAvatarId,
      tone: 'professionnel',
      length: 'medium'
    });

    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12">
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
            Chat IA Sionohmair
          </div>
          <h1 className="text-5xl font-bold mb-4">
            Discutez avec l'<span className="text-accent">IA Copywriting</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Posez vos questions, optimisez vos scripts, ou générez du contenu personnalisé selon votre avatar client.
          </p>
        </div>

        {/* Sélection d'avatar */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Personnalisation</CardTitle>
            <CardDescription>
              Sélectionnez un avatar client pour des réponses adaptées à votre audience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar Client (optionnel)</Label>
              <Select value={selectedAvatarId?.toString()} onValueChange={(value) => setSelectedAvatarId(value === 'none' ? undefined : parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un avatar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun avatar (réponses génériques)</SelectItem>
                  {avatars.map((avatar: any) => (
                    <SelectItem key={avatar.id} value={avatar.id.toString()}>
                      {avatar.name} ({avatar.age} ans - {avatar.occupation})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedAvatarId && (
                <p className="text-xs text-accent">
                  ✓ Les réponses seront personnalisées pour cet avatar
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Zone de chat */}
        <Card className="border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-accent" />
              Conversation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Messages */}
            <div className="h-[500px] overflow-y-auto space-y-4 p-4 bg-secondary/5 rounded-lg border">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-accent" />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-background border'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-60 mt-2">
                      {message.timestamp.toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                  )}
                </div>
              ))}
              {sendMessageMutation.isPending && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-accent" />
                  </div>
                  <div className="bg-background border rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-accent" />
                      <p className="text-sm text-muted-foreground">L'IA réfléchit...</p>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="space-y-2">
              <Textarea
                placeholder="Posez votre question ou décrivez votre besoin... (Shift+Enter pour nouvelle ligne, Enter pour envoyer)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={3}
                disabled={sendMessageMutation.isPending}
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  {input.length} caractères
                </p>
                <Button
                  onClick={handleSend}
                  disabled={sendMessageMutation.isPending || !input.trim()}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {sendMessageMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Envoyer
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suggestions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:border-accent/50 transition-colors" onClick={() => setInput('Comment optimiser ma landing page avec PFPMA ?')}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                Optimiser avec PFPMA
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="cursor-pointer hover:border-accent/50 transition-colors" onClick={() => setInput('Analyse ce script et identifie les frameworks utilisés : [collez votre script]')}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                Analyser un script
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="cursor-pointer hover:border-accent/50 transition-colors" onClick={() => setInput('Génère un email de vente avec le framework PAS pour [votre produit]')}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                Générer un email
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            🔒 Vos conversations sont privées et sécurisées. L'IA utilise la méthodologie Sionohmair (PFPMA, APTEA) pour des réponses optimisées.
          </p>
        </div>
      </div>
    </div>
  );
}
