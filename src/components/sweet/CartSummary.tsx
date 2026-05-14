import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { calculatePrice, formatMoney } from "@/lib/pricing";

interface Props {
  units: number;
  onReserve: () => void;
}

export const CartSummary = ({ units, onReserve }: Props) => {
  if (units === 0) return null;
  const { total, savings } = calculatePrice(units);

  const next = units < 7 ? 7 - units : units < 14 ? 14 - units : 0;
  const nextLabel =
    units < 7
      ? `¡${next} más para promo 7x$4.75!`
      : units < 14
      ? `¡${next} más para promo 14x$9.50!`
      : "¡Promo aplicada!";

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:px-6 sm:pb-6 animate-fade-up">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 rounded-2xl bg-gradient-cocoa p-3 pl-5 text-primary-foreground shadow-glow sm:p-4 sm:pl-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative">
            <ShoppingBag className="h-6 w-6" />
            <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold">
              {units}
            </span>
          </div>
          <div className="leading-tight">
            <div className="font-display text-xl font-semibold sm:text-2xl">
              {formatMoney(total)}
            </div>
            <div className="text-[11px] opacity-80 sm:text-xs">
              {savings > 0 ? `Ahorras ${formatMoney(savings)} · ` : ""}
              {nextLabel}
            </div>
          </div>
        </div>
        <Button
          onClick={onReserve}
          size="lg"
          className="rounded-full bg-accent px-5 font-semibold text-accent-foreground hover:bg-accent/90 sm:px-7"
        >
          Reservar pedido
        </Button>
      </div>
    </div>
  );
};