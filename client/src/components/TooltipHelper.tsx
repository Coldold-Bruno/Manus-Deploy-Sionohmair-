import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface TooltipHelperProps {
  content: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

/**
 * Composant helper pour afficher des tooltips d'aide
 * Utilisation : <TooltipHelper content="Texte d'aide" />
 */
export default function TooltipHelper({ content, side = 'top' }: TooltipHelperProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center justify-center h-4 w-4 rounded-full text-muted-foreground hover:text-accent transition-colors"
        >
          <HelpCircle className="h-4 w-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent side={side} className="max-w-xs">
        <p className="text-sm">{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}
