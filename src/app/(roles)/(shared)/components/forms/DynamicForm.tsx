import { FormEvent, useEffect, useState } from "react";
import { DynamicFormProps } from "./types";
import type { Field, Option } from "./types"; // Asegúrate de importar bien tus tipos

export default function DynamicForm<TData>({
  config,
  onSubmit,
  onCancel,
  initConfig = {},
}: DynamicFormProps<TData>) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as TData;
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 rounded-xl shadow-md border max-w-md mx-auto"
    >
      {config.map((field) => {
        const value = initConfig[field.name];

        const [resolvedOptions, setResolvedOptions] = useState<Option[]>([]);

        useEffect(() => {
          if (field.type === "select" && field.options) {
            const result =
              typeof field.options === "function"
                ? field.options(initConfig)
                : field.options;

            if (result instanceof Promise) {
              result.then(setResolvedOptions);
            } else {
              setResolvedOptions(result);
            }
          }
        }, [field.options]);

        return (
          <div key={field.name} className="flex flex-col">
            {field.type !== "checkbox" && (
              <label htmlFor={field.name} className="text-sm font-medium mb-1">
                {field.label}
              </label>
            )}

            {field.type === "select" ? (
  resolvedOptions.length === 0 ? (
    <span className="text-sm italic text-gray-500">Cargando...</span>
  ) : (
    <select
      id={field.name}
      name={field.name}
      defaultValue={
        value !== undefined && value !== null ? value : ""
      }
      className="bg-black border rounded-md px-3 py-2"
    >
      {resolvedOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
) : field.type === "checkbox" ? (
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  name={field.name}
                  defaultChecked={Boolean(value)}
                  className="h-4 w-4"
                />
                {field.label}
              </label>
            ) : (
              <input
                type={field.type}
                name={field.name}
                id={field.name}
                defaultValue={
                  value !== undefined && value !== null ? value : ""
                }
                className="border rounded-md px-3 py-2"
              />
            )}
          </div>
        );
      })}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Enviar
      </button>

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Cancelar
        </button>
      )}
    </form>
  );
}