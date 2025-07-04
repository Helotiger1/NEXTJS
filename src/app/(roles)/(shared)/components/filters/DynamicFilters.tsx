
import {Props} from "./types";

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