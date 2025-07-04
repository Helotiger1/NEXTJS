import { FilterConfig } from "./types";
export const filters: FilterConfig[] = [
  {
    key: "status",
    label: "Estado",
    type: "select",
    options: [
      { value: "active", label: "Activo" },
      { value: "inactive", label: "Inactivo" },
    ],
  },
  {
    key: "categories",
    label: "Categorías",
    type: "checkbox",
    options: [
      { value: "books", label: "Libros" },
      { value: "movies", label: "Películas" },
    ],
  },
  {
    key: "price",
    label: "Precio",
    type: "range",
    min: 0,
    max: 100,
    step: 1,
  },
];

