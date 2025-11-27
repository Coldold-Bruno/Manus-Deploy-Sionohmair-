import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Bot, X, Send, Minimize2, Maximize2, Sparkles } from 'lucide-react';
import { CHATBOT_KNOWLEDGE, searchKnowledge } from '@/lib/chatbotKnowledge';
import { trpc } from '@/lib/trpc';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: `Bonjour ! Je suis l'assistant Sionohmair. Je connais tous les outils, frameworks (PFPMA, APTEA, AIDA, PAS, etc.), et la méthodologie de la plateforme. Comment puis-je vous aider ?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggestions rapides
  const quickSuggestions = [
    "C'est quoi PFPMA ?",
    "Comment utiliser l'Analyseur ?",
    "Différence PFPMA vs APTEA ?",
    "Qu'est-ce que le Facteur Alpha ?"
  ];

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    // Ajouter le message utilisateur
    const userMessage: Message = {
      id: messages.length + 1,
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simuler un délai de réponse
    setTimeout(() => {
      // Rechercher dans la base de connaissances
      const response = searchKnowledge(messageText);
      
      const assistantMessage: Message = {
        id: messages.length + 2,
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 800);
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

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-accent text-accent-foreground shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
        aria-label="Ouvrir le chatbot"
      >
        <Bot className="h-7 w-7" />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all ${
        isMinimized ? 'w-80' : 'w-96'
      }`}
    >
      <Card className="border-accent/20 shadow-2xl">
        <CardHeader className="pb-3 bg-accent/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Bot className="h-6 w-6 text-accent" />
              </div>
              <div>
                <CardTitle className="text-lg">Assistant Sionohmair</CardTitle>
                <p className="text-xs text-muted-foreground">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                  En ligne
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8"
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0">
            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-secondary/5">
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
                    className={`max-w-[75%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-background border'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-60 mt-1">
                      {message.timestamp.toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-accent" />
                  </div>
                  <div className="bg-background border rounded-lg p-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-accent animate-bounce"></span>
                      <span className="h-2 w-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="h-2 w-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions rapides */}
            {messages.length === 1 && (
              <div className="p-4 border-t bg-secondary/5">
                <p className="text-xs text-muted-foreground mb-2">Suggestions :</p>
                <div className="flex flex-wrap gap-2">
                  {quickSuggestions.map((suggestion, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="cursor-pointer hover:bg-accent/10"
                      onClick={() => handleSend(suggestion)}
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Posez votre question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  rows={2}
                  disabled={isTyping}
                  className="resize-none"
                />
                <Button
                  onClick={() => handleSend()}
                  disabled={isTyping || !input.trim()}
                  className="bg-accent text-accent-foreground hover:bg-accent/90 self-end"
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                🔒 Vos conversations sont privées et sécurisées
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
