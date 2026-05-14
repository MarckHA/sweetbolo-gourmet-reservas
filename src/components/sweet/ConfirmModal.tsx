import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { calculatePrice, formatMoney, type CartMap } from "@/lib/pricing";
import type { Product } from "./products";
import { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  cart: CartMap;
  products: Product[];
  onConfirm: () => void;
}

export const ConfirmModal = ({ open, onOpenChange, cart, products, onConfirm }: Props) => {
  // 1. Estado para controlar si mostramos la pantalla de éxito
  const [isSuccess, setIsSuccess] = useState(false);

  // 2. Efecto para resetear el estado de éxito cuando el modal se cierra
  useEffect(() => {
    if (!open) {
      // Un pequeño retraso para que el texto no cambie mientras ocurre la animación de cierre
      const timer = setTimeout(() => setIsSuccess(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);
  
  const items = products.filter((p) => (cart[p.id] ?? 0) > 0);
  const units = items.reduce((s, p) => s + cart[p.id], 0);
  const { total, packs14, packs7, singles, savings } = calculatePrice(units);

  // 3. Envolvemos tu onConfirm original para también cambiar la UI
  const handleConfirmAction = () => {
    const LAST_SEND_KEY = 'sweetbolo_last_order';
    const COOLDOWN_MS = 60000; 
    const now = Date.now();
    const lastSend = localStorage.getItem(LAST_SEND_KEY);

    // VALIDACIÓN: Si intenta enviar antes del minuto
    if (lastSend && now - parseInt(lastSend) < COOLDOWN_MS) {
      alert("Por favor, espera un minuto antes de enviar otro pedido.");
      // No activamos setIsSuccess(true), así que no verá la pantalla de éxito
      return; 
    }

    // SI ES VÁLIDO:
    onConfirm(); // Ejecuta WhatsApp y limpia carrito en Index.tsx
    localStorage.setItem(LAST_SEND_KEY, now.toString()); // Guarda el tiempo actual
    setIsSuccess(true); // Muestra la pantalla de éxito solo ahora
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {/* RENDERIZADO CONDICIONAL */}
        {isSuccess ? (
          // --- PANTALLA DE ÉXITO ---
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <DialogTitle className="font-display text-2xl font-bold text-foreground">
              ¡Pedido enviado!
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              Revisa tu WhatsApp. Te confirmaremos en breve para coordinar el lugar de entrega de tus bolos con Sweet Bolo Gourmet.
            </DialogDescription>
            <Button
              className="mt-4 w-full rounded-full"
              onClick={() => onOpenChange(false)}
            >
              Cerrar
            </Button>
          </div>
        ) : (
          // --- PANTALLA DE RESUMEN ORIGINAL ---
        <>
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              ¡Tu pedido está listo para ser enviado a WhatsApp!
            </DialogTitle>
            <DialogDescription>
              Revisa el desglose.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 rounded-xl bg-secondary/60 p-4">
            {items.map((p) => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{p.name}</span>
                <span className="font-semibold tabular-nums">× {cart[p.id]}</span>
              </div>
            ))}
            <div className="my-2 border-t border-border" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total unidades</span>
              <span className="font-semibold">{units}</span>
            </div>
            {(packs14 > 0 || packs7 > 0) && (
              <div className="rounded-lg bg-accent/10 p-2 text-xs text-foreground/80">
                Promos: {packs14 > 0 && <span>{packs14}× pack 14 · </span>}
                {packs7 > 0 && <span>{packs7}× pack 7 · </span>}
                {singles > 0 && <span>{singles}× unidad</span>}
              </div>
            )}
            {savings > 0 && (
              <div className="flex justify-between text-sm text-accent">
                <span>Ahorro</span>
                <span className="font-semibold">−{formatMoney(savings)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 font-display text-xl">
              <span>Total</span>
              <span className="font-bold text-primary">{formatMoney(total)}</span>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmAction}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Aceptar y enviar a WhatsApp
            </Button>
          </DialogFooter>
        </>
        )}
      </DialogContent>
    </Dialog>
  );
};