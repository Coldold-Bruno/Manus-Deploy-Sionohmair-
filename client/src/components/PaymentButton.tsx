import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PaymentButtonProps {
  productId: "SPRINT_CLARTE" | "ARCHITECTURE_INSIGHT" | "PARTENARIAT_STRATEGIQUE" | "FORMATION_SPRINT_CLARTE";
  label?: string;
  variant?: "default" | "outline";
  size?: "default" | "lg" | "sm";
  className?: string;
}

export function PaymentButton({
  productId,
  label = "Payer maintenant",
  variant = "default",
  size = "default",
  className = "",
}: PaymentButtonProps) {
  const createCheckout = trpc.stripe.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        toast.success("Redirection vers le paiement sécurisé...");
        // Ouvrir Stripe Checkout dans un nouvel onglet
        window.open(data.checkoutUrl, "_blank");
      }
    },
    onError: (error) => {
      toast.error(`Erreur lors de la création du paiement : ${error.message}`);
    },
  });

  const handlePayment = () => {
    createCheckout.mutate({ productId });
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={createCheckout.isPending}
      variant={variant}
      size={size}
      className={className}
    >
      {createCheckout.isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Chargement...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          {label}
        </>
      )}
    </Button>
  );
}
