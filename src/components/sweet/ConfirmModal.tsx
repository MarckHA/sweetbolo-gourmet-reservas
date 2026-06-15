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
import { CheckCircle2, Clock } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  cart: CartMap;
  products: Product[];
  onConfirm: () => void;
}

export const ConfirmModal = ({ open, onOpenChange, cart, products, onConfirm }: Props) => {
  // NUEVO:
  // 1. Estado para controlar el flujo de las pantallas
  const [isSuccess, setIsSuccess] = useState(false);
  const [showNotice, setShowNotice] = useState(true); // Nuevo estado: Empieza en true

  // 2. Efecto para resetear AMBOS estados cuando el modal se cierra
  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
        setShowNotice(true); // Volvemos a activar el aviso para el próximo pedido
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);
  
  const items = products.filter((p) => (cart[p.id] ?? 0) > 0);
  const units = items.reduce((s, p) => s + cart[p.id], 0);
  const { total, packs14, packs7, singles, savings } = calculatePrice(units);

  // 3. Envolvemos el onConfirm original para también cambiar la UI
  const handleConfirmAction = () => {

    // SI ES VÁLIDO||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||:
    onConfirm(); // Ejecuta WhatsApp y limpia carrito en Index.tsx
    setIsSuccess(true); // Muestra la pantalla de éxito solo ahora
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        
        {/* --- MÁQUINA DE ESTADOS VISUAL --- */}
        {isSuccess ? (
          // ------------------------------------------------
          // PANTALLA 3: ÉXITO
          // ------------------------------------------------
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
        ) : showNotice ? (
          // ------------------------------------------------
          // PANTALLA 1: AVISO DE ENTREGA
          // ------------------------------------------------
          <div className="flex flex-col items-center p-2 animate-in fade-in duration-300">
            <DialogHeader className="flex flex-col items-center text-center space-y-3">
              <div className="rounded-full bg-accent/10 p-3 mb-2">
                <Clock className="h-10 w-10 text-accent" />
              </div>
              <DialogTitle className="font-display text-2xl">
                Aviso de Entrega
              </DialogTitle>
              <DialogDescription className="text-base">
                Para garantizar la calidad y textura perfecta de tus bolos, todos los pedidos se preparan y congelan adecuadamente.
                <br /><br />
                <strong className="text-foreground">Tu pedido será entregado el día 16/06/2026 a partir de las 09:00 en la ubicación que nos indiques.</strong>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="w-full gap-2 mt-6 sm:gap-2">
              <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90" 
                onClick={() => setShowNotice(false)} // Pasa a la pantalla 2
              >
                ¡Entendido!
              </Button>
            </DialogFooter>
          </div>
        ) : (
          // ------------------------------------------------
          // PANTALLA 2: RESUMEN ORIGINAL
          // ------------------------------------------------
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">
                ¡Tu pedido está casi listo!
              </DialogTitle>
              <DialogDescription>
                Revisa el desglose antes de enviar a WhatsApp.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 rounded-xl bg-secondary/60 p-4 animate-in slide-in-from-right-4 duration-300">
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
              {/* Opción de volver atrás para no perder al cliente */}
              <Button variant="outline" onClick={() => setShowNotice(true)}
                className="border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors">
                Volver
              </Button>
              <Button
                onClick={handleConfirmAction}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90" 
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
