import { toast as sonnerToast } from "sonner";
import { useTranslation } from "react-i18next";

/**
 * Hook personnalisé pour les notifications toast multilingues
 * Utilise Sonner pour l'affichage et i18next pour les traductions
 */
export function useToast() {
  const { t } = useTranslation();

  return {
    success: (message: string, options?: { description?: string; duration?: number }) => {
      sonnerToast.success(message, {
        description: options?.description,
        duration: options?.duration || 4000,
      });
    },
    
    error: (message: string, options?: { description?: string; duration?: number }) => {
      sonnerToast.error(message, {
        description: options?.description,
        duration: options?.duration || 5000,
      });
    },
    
    info: (message: string, options?: { description?: string; duration?: number }) => {
      sonnerToast.info(message, {
        description: options?.description,
        duration: options?.duration || 4000,
      });
    },
    
    warning: (message: string, options?: { description?: string; duration?: number }) => {
      sonnerToast.warning(message, {
        description: options?.description,
        duration: options?.duration || 4000,
      });
    },
    
    promise: <T,>(
      promise: Promise<T>,
      messages: {
        loading: string;
        success: string;
        error: string;
      }
    ) => {
      return sonnerToast.promise(promise, messages);
    },

    // Messages prédéfinis multilingues
    successSaved: () => {
      sonnerToast.success(t("toast.saved"));
    },
    
    successDeleted: () => {
      sonnerToast.success(t("toast.deleted"));
    },
    
    successCopied: () => {
      sonnerToast.success(t("toast.copied"));
    },
    
    errorGeneric: () => {
      sonnerToast.error(t("toast.error"));
    },
    
    errorNetwork: () => {
      sonnerToast.error(t("toast.networkError"));
    },
    
    comingSoon: () => {
      sonnerToast.info(t("toast.comingSoon"));
    },
    
    languageChanged: (language: string) => {
      const languageNames: Record<string, string> = {
        fr: "Français",
        en: "English",
        de: "Deutsch",
      };
      sonnerToast.success(t("toast.languageChanged"), {
        description: languageNames[language] || language,
      });
    },
  };
}
