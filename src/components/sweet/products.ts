import mora from "@/assets/bolo-mora.png";
import galak from "@/assets/bolo-galak.png";
import nutella from "@/assets/bolo-nutella.png";
import capuccino from "@/assets/bolo-capuccino.png";
import oreo from "@/assets/bolo-oreo.png";
import chocomenta from "@/assets/bolo-chocomenta.png";
import manicho from "@/assets/bolo-manicho.png";
import cheesecake from "@/assets/bolo-cheesecake.png";

export type Product = {
  id: string;
  name: string;
  description: string;
  image: string; // tailwind text color class for accent dot
};

export const PRODUCTS: Product[] = [
  { id: "mora", name: "Mora", description: "Glaseado de mora silvestre", image: mora},
  { id: "galak", name: "Galak", description: "Chocolate blanco cremoso", image: galak},
  { id: "nutella", name: "Nutella", description: "Avellana y cacao", image: nutella},
  { id: "capuccino", name: "Capuccino", description: "Café espumoso con cacao", image: capuccino },
  { id: "oreo", name: "Oreo", description: "Galleta crocante en crema", image: oreo},
  { id: "chocomenta", name: "Chocomenta", description: "Chocolate con menta fresca", image: chocomenta},
  { id: "manicho", name: "Manicho", description: "Chocolate con maní crocante", image: manicho},
  { id: "cheesecake", name: "Cheesecake Maracuyá", description: "Cheesecake con maracuyá", image: cheesecake},
];