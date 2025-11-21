import { Button } from '@/components/ui/button';
import { Share2, Linkedin, Twitter, Facebook, Link2 } from 'lucide-react';
import { toast } from 'sonner';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
}

export function SocialShare({ url, title, description }: SocialShareProps) {
  const fullUrl = url.startsWith('http') ? url : `https://sionohmair-insight-academy.manus.space${url}`;
  
  const shareLinks = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast.success('Lien copié dans le presse-papiers !');
    } catch (error) {
      toast.error('Erreur lors de la copie du lien');
    }
  };

  const openShareWindow = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground flex items-center gap-2">
        <Share2 className="h-4 w-4" />
        Partager :
      </span>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => openShareWindow(shareLinks.linkedin)}
        className="hover:bg-[#0077B5] hover:text-white hover:border-[#0077B5] transition-colors"
      >
        <Linkedin className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => openShareWindow(shareLinks.twitter)}
        className="hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-colors"
      >
        <Twitter className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => openShareWindow(shareLinks.facebook)}
        className="hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-colors"
      >
        <Facebook className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={copyToClipboard}
        className="hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        <Link2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
