export type CategoryId =
  | "cheesecakes"
  | "gelatinas"
  | "panques"
  | "pasteles"
  | "postres"
  | "sobre-pedido";

export interface Category {
  id: CategoryId;
  label: string;
  leadTimeNote: string | null;
}

export const categories: Category[] = [
  { id: "cheesecakes", label: "Cheesecakes", leadTimeNote: null },
  { id: "gelatinas", label: "Gelatinas", leadTimeNote: null },
  { id: "panques", label: "Panqués", leadTimeNote: null },
  { id: "pasteles", label: "Pasteles", leadTimeNote: null },
  { id: "postres", label: "Postres", leadTimeNote: null },
  {
    id: "sobre-pedido",
    label: "Sobre Pedido",
    leadTimeNote: "Disponible bajo pedido, con 3 días de anticipación",
  },
];
