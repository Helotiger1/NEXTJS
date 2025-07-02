// filters.config.ts
import { FilterConfig,  } from "./types";

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




interface Props {
  filters: FilterConfig[];
  values: FilterState;
  onChange: (key: string, value: FilterState[string]) => void;
}

export function FilterPanel({ filters, values, onChange }: Props) {
  return (
    <form>
      {filters.map((filter) => {
        const value = values[filter.key];

        switch (filter.type) {
          case "select":
            return (
              <label key={filter.key}>
                {filter.label}
                <select
                  value={value as string || ""}
                  onChange={(e) => onChange(filter.key, e.target.value)}
                >
                  <option value="">Todos</option>
                  {filter.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
            );

          case "checkbox":
            return (
              <fieldset key={filter.key}>
                <legend>{filter.label}</legend>
                {filter.options.map((opt) => {
                  const selected = (value as string[]) || [];
                  return (
                    <label key={opt.value}>
                      <input
                        type="checkbox"
                        checked={selected.includes(opt.value)}
                        onChange={(e) => {
                          const newValue = e.target.checked
                            ? [...selected, opt.value]
                            : selected.filter((v) => v !== opt.value);
                          onChange(filter.key, newValue);
                        }}
                      />
                      {opt.label}
                    </label>
                  );
                })}
              </fieldset>
            );

          case "range":
            return (
              <label key={filter.key}>
                {filter.label}
                <input
                  type="range"
                  min={filter.min ?? 0}
                  max={filter.max ?? 100}
                  step={filter.step ?? 1}
                  value={value as number || 0}
                  onChange={(e) =>
                    onChange(filter.key, parseInt(e.target.value, 10))
                  }
                />
              </label>
            );

          default:
            return null;
        }
      })}
    </form>
  );
}