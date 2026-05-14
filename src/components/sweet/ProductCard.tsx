import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMoney, UNIT_PRICE } from "@/lib/pricing";
import type { Product } from "./products";

interface Props {
  product: Product;
  qty: number;
  onChange: (qty: number) => void;
}
const MAX_PER_PRODUCT = 30;

export const ProductCard = ({ product, qty, onChange }: Props) => {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-card shadow-card transition-smooth hover:shadow-glow [@media(hover:hover)]:hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden bg-gradient-warm">
        <img
          src={product.image}
          alt={`Bolo gourmet sabor ${product.name}`}
          loading="lazy"
          width={768}
          height={768}
          className="h-full w-full object-cover transition-smooth group-hover:scale-105"
        />
        <span className={`absolute right-3 top-3 h-3 w-3 rounded-full`} />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
        <div>
          <h3 className="font-display text-base font-semibold text-foreground sm:text-xl line-clamp-1">{product.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 sm:text-sm">{product.description}</p>
        </div>
        <div className="mt-auto flex flex-col items-center justify-between gap-3 pt-1 sm:flex-row">
          <span className="font-display text-base font-semibold text-primary sm:text-lg">
            {formatMoney(UNIT_PRICE)}
          </span>
          <div className="flex items-center gap-1 rounded-full border border-border bg-secondary/60 p-1 sm:gap-2">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-7 w-7 rounded-full hover:bg-background sm:h-8 sm:w-8"
              onClick={() => onChange(Math.max(0, qty - 1))}
              aria-label={`Quitar ${product.name}`}
              disabled={qty === 0}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-6 text-center font-semibold tabular-nums">{qty}</span>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-7 w-7 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 sm:h-8 sm:w-8"
              onClick={() => onChange(Math.min(MAX_PER_PRODUCT, qty + 1))}
              aria-label={`Añadir ${product.name}`}
              disabled={qty >= MAX_PER_PRODUCT}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};