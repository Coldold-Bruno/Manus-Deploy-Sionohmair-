import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { Loader2, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function NewsletterForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const subscribe = trpc.newsletter.subscribe.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        setEmail('');
        setName('');
      } else {
        toast.error(data.message);
      }
    },
    onError: (error) => {
      toast.error(error.message || t('newsletter.errorSubscription'));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error(t('newsletter.errorEmail'));
      return;
    }

    subscribe.mutate({ email, name, source: 'website' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          type="text"
          placeholder={t('newsletter.namePlaceholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={subscribe.isPending}
          className="flex-1"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          type="email"
          placeholder={t('newsletter.emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={subscribe.isPending}
          required
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={subscribe.isPending}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {subscribe.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t('newsletter.subscribing')}
            </>
          ) : (
            <>
              <Mail className="h-4 w-4 mr-2" />
              {t('newsletter.subscribe')}
            </>
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        {t('newsletter.gift').split('<br/>').map((line, i, arr) => (
          <span key={i}>
            {line}
            {i < arr.length - 1 && <br />}
          </span>
        ))}
      </p>
    </form>
  );
}
