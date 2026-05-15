import { useEffect, useMemo, useState } from "react";
import { Instagram, Facebook, MessageCircle, Sparkles, AlertCircle } from "lucide-react";
import { ProductCard } from "@/components/sweet/ProductCard";
import { CartSummary } from "@/components/sweet/CartSummary";
import { ConfirmModal } from "@/components/sweet/ConfirmModal";
import { PRODUCTS } from "@/components/sweet/products";
import { calculatePrice, formatMoney, totalUnits, type CartMap } from "@/lib/pricing";
import logo from "@/assets/logo.png";
import logoP from "@/assets/logoPestania.png";
import hero1 from "@/assets/bolos1.png"; // La primera que me pasaste
import hero2 from"@/assets/bolos2.png";

// Número de WhatsApp configurado vía variable de entorno (ver .env.example)
const WHATSAPP_NUMBER =  import.meta.env.VITE_WHATSAPP_NUMBER; // Valor por defecto para desarrollo

if (!WHATSAPP_NUMBER) {
  throw new Error("Falta VITE_WHATSAPP_NUMBER en el archivo .env");
}

// Coloca esto fuera del componente Index, cerca de tus otras constantes
const OFF_HOURS_DATE = new Date("2026-05-15T00:00:00"); // Ajusta a la medianoche de hoy

const Index = () => {
  const [cart, setCart] = useState<CartMap>({});
  const [open, setOpen] = useState(false);
  const units = useMemo(() => totalUnits(cart), [cart]);
  const setQty = (id: string, qty: number) =>

    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });

  const handleConfirm = () => {

    const items = PRODUCTS.filter((p) => (cart[p.id] ?? 0) > 0);
    const { total, savings } = calculatePrice(units);
    const lines = items.map((p) => `• ${p.name} × ${cart[p.id]}`).join("%0A");
    const msg =`Hola *Sweet Bolo Gourmet* deseo el siguiente pedido:%0A` +
      `${lines}%0A%0A` +
      `Unidades: *${units}*%0A` +
      (savings > 0 ? `Ahorro: ${formatMoney(savings)}%0A` : "") +
      `Total: *${formatMoney(total)}*%0A%0A` +
      `¡Muchas gracias!`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;

    // 1. Abrimos WhatsApp
    window.open(url, "_blank", "noopener,noreferrer");
    // 2. ¡IMPORTANTE! Vaciamos el carrito aquí
    setCart({});    
    };

    const images = [hero1, hero2];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isReservationsOpen, setIsReservationsOpen] = useState(true);

    useEffect(() => {
          const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
          }, 5000);
      return () => clearInterval(timer); // Limpieza para evitar fugas de memoria
    }, [images.length]);

    // Efecto para el control de horario de reservas
    useEffect(() => {
      const checkAvailability = () => {
        const now = new Date();
        // Configura aquí la fecha de cierre (Año, Mes [0-11], Día, Hora, Min, Seg)
        // Ejemplo: 16 de Mayo de 2024 a las 00:00:00 (Medianoche de hoy)
        const offHoursDate = new Date(2026, 4, 14, 23, 59, 0); 
        if (now >= offHoursDate) {
          setIsReservationsOpen(false);
        }
      };
      checkAvailability();
      // Revisamos cada minuto por si el usuario deja la página abierta
      const timer = setInterval(checkAvailability, 60000);
      return () => clearInterval(timer);
    }, []);

    const socialLinks = {
      instagram: "https://www.instagram.com/sweet_bolo_gourmet.ec/",
      facebook: "https://www.facebook.com/people/Sweet-Bolo-Gourmet/61582958589595/",
      tiktok: "https://www.tiktok.com/@sweet_bolo_gourme"
    }

    const TikTokIcon = ({ className }) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    );

    // --- FUNCIÓN DE SCROLL SUAVE ---
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
        const offset = 80; // Margen para que el header no tape el título
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
        }
    };
  
  if (!isReservationsOpen) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-6 animate-fade-up">
          <img src={logo} alt="Logo" className="h-24 w-24 mx-auto object-contain mb-4" />
          <h1 className="font-display text-4xl font-bold text-primary">
            ¡Gracias por tu interés!
          </h1>
          <p className="text-muted-foreground text-lg">
            Las reservas para la fecha actual han finalizado. 
            Próximamente se avisará la fecha de nuevos pedidos a través de nuestras redes sociales.
          </p>
          <div className="flex items-center gap-4 justify-center">
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="rounded-full bg-card p-2.5 text-foreground shadow-soft transition-smooth hover:bg-primary hover:text-primary-foreground"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="rounded-full bg-card p-2.5 text-foreground shadow-soft transition-smooth hover:bg-primary hover:text-primary-foreground"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href={socialLinks.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="rounded-full bg-card p-2.5 text-foreground shadow-soft transition-smooth hover:bg-primary hover:text-primary-foreground"
            >
              <TikTokIcon className="h-5 w-5" />
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="rounded-full bg-card p-2.5 text-foreground shadow-soft transition-smooth hover:bg-primary hover:text-primary-foreground"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
          <p className="text-xs text-muted-foreground pt-8 italic">
            Atentamente, el equipo de Sweet Bolo Gourmet.
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Contenedor Sticky: Agrupa el Header y el Banner informativo */}
    <div className="sticky top-0 z-30 w-full shadow-sm">
    {/* Header Principal */}
    <header className="border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="container flex items-center justify-between py-3">
        <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
            <img src={logo} alt="Sweet Bolo Gourmet" className="h-12 w-12 object-contain" width={48} height={48} />
            <span className="font-display text-lg font-semibold text-primary sm:text-xl">
            Sweet Bolo <span className="italic text-accent">Gourmet</span>
            </span>
        </div>
        <nav className="hidden gap-6 text-sm font-medium text-muted-foreground sm:flex">
            <button onClick={() => scrollToSection('promos')} className="transition-smooth hover:text-primary">Promos</button>
            <button onClick={() => scrollToSection('sabores')} className="transition-smooth hover:text-primary">Sabores</button>
            <button onClick={() => scrollToSection('contacto')} className="transition-smooth hover:text-primary">Contacto</button>
        </nav>
        </div>
    </header>

    {/* Banner Informativo (Justo debajo del header y también fijo) */}
    <div className="bg-accent/15 border-b border-accent/20 py-2 px-4 backdrop-blur-md bg-white/90">
        <p className="text-center text-[10px] sm:text-xs font-medium text-primary leading-tight">
        <AlertCircle className="inline-block h-3.5 w-3.5 mr-1" />
        <span className="font-bold text-accent">Importante:</span> Pedidos abiertos hasta hoy 14/05/26 a las 23:59. 
        Entregas mañana 15/05/26 a partir de las 10:00 AM.
        </p>
    </div>
    </div>

      {/* Hero Modificado - Debugged */}
      <section className="relative overflow-hidden min-h-[600px] flex items-center">
        {/* CAPA 1: IMÁGENES (Ahora en z-0 para que no queden bajo el fondo) */}
        <div className="absolute inset-0 z-0">
          {images.map((img, index) => (
            <img
              key={index}
              src={img} // CAMBIO: Usamos la variable 'img' del map
              alt="Bolos artesanales de varios sabores"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          {/* CAPA 2: OVERLAY (Oscurece y difumina para legibilidad) */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10" />
        </div>
        {/* CAPA 3: CONTENIDO (z-20 para estar sobre todo) */}
        <div className="container relative z-20 flex flex-col items-center gap-10 py-16 md:flex-row md:justify-between md:py-24">
          <div className="animate-fade-up space-y-6 md:w-1/2 lg:w-[45%]">
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Bolos artesanales
            </span>

            {/* Texto en blanco o contraste alto para el fondo oscuro */}
            <h1 className="font-display text-5xl font-bold leading-[1.05] text-white sm:text-6xl md:text-7xl drop-shadow-md">
              Pequeños bocados,{" "}
              <span className="italic text-accent">grandes momentos</span>.
            </h1>
        
            <p className="max-w-md text-lg text-gray-100 drop-shadow-sm">
              8 sabores únicos hechos con amor. A solo {formatMoney(0.75)} cada uno.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button 
                onClick={() => scrollToSection("sabores")}
                className="rounded-full bg-primary px-7 py-3 font-semibold text-primary-foreground shadow-lg transition-smooth hover:scale-105"
              >
                Ver sabores
              </button>
              <button
                onClick={() => scrollToSection("promos")}
                className="rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-7 py-3 font-semibold text-white transition-smooth hover:bg-white/20"
              >
                Promociones
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Promos */}
      <section id="promos" className="container py-12 md:py-16">
        <div className="grid gap-5 md:grid-cols-2">
          {[
            { units: 7, price: 4.75, label: "Pack Antojo" },
            { units: 14, price: 9.5, label: "Pack Familiar" },
          ].map((p) => (
            <div
              key={p.units}
              className="group relative overflow-hidden rounded-2xl bg-gradient-cocoa p-8 text-primary-foreground shadow-card transition-smooth hover:shadow-glow"
            >
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/30 blur-2xl transition-smooth group-hover:bg-accent/50" />
              <div className="relative">
                <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                  {p.label}
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-6xl font-bold">{p.units}</span>
                  <span className="font-display text-2xl opacity-80">bolos</span>
                </div>
                <div className="mt-1 font-display text-4xl">
                  por <span className="text-accent">{formatMoney(p.price)}</span>
                </div>
                <p className="mt-3 text-sm opacity-80">
                  Se aplica automáticamente al llegar a {p.units} unidades en tu pedido.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sabores */}
      <section id="sabores" className="container py-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
              Nuestros sabores
            </h2>
            <p className="mt-2 text-muted-foreground">Elige tus favoritos y arma tu pack.</p>
          </div>
          <span className="hidden rounded-full bg-secondary px-4 py-2 text-sm font-medium text-primary sm:inline">
            {formatMoney(0.75)} c/u
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {PRODUCTS.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              qty={cart[p.id] ?? 0}
              onChange={(q) => setQty(p.id, q)}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="contacto" className="mt-20 border-t border-border bg-secondary/40">
        <div className="container flex flex-col items-center justify-between gap-6 py-10 sm:flex-row">
          <div className="flex items-center gap-3">
            <img src={logoP} alt="" className="h-10 w-10 object-contain" width={40} height={40} />
            <div>
              <div className="font-display text-lg font-semibold text-primary">
                Sweet Bolo Gourmet
              </div>
              <div className="text-xs text-muted-foreground">
                Bolos artesanales hechos con amor.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="rounded-full bg-card p-2.5 text-foreground shadow-soft transition-smooth hover:bg-primary hover:text-primary-foreground"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="rounded-full bg-card p-2.5 text-foreground shadow-soft transition-smooth hover:bg-primary hover:text-primary-foreground"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href={socialLinks.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="rounded-full bg-card p-2.5 text-foreground shadow-soft transition-smooth hover:bg-primary hover:text-primary-foreground"
            >
              <TikTokIcon className="h-5 w-5" />
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="rounded-full bg-card p-2.5 text-foreground shadow-soft transition-smooth hover:bg-primary hover:text-primary-foreground"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Sweet Bolo Gourmet
          </p>
        </div>
      </footer>

      <CartSummary units={units} onReserve={() => setOpen(true)} />
      <ConfirmModal
        open={open}
        onOpenChange={setOpen}
        cart={cart}
        products={PRODUCTS}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default Index; 