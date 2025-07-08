import { FormEvent } from "react";
import {DynamicFormProps} from "./types"

export default function DynamicForm({ config, onSubmit, onCancel }: DynamicFormProps) {
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    console.log(data);
    onSubmit(data);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-xl shadow-md border max-w-md mx-auto">
      {config.map((field) => (
        <div key={field.name} className="flex flex-col">
          {field.type !== "checkbox" && (
            <label htmlFor={field.name} className="text-sm font-medium mb-1">
              {field.label}
            </label>
          )}

          {field.type === "select" ? (
            <select
              id={field.name}
              name={field.name}
              className="bg-black border rounded-md px-3 py-2"
            >
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : field.type === "checkbox" ? (
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" name={field.name} className="h-4 w-4" />
              {field.label}
            </label>
          ) : (
            <input
              type={field.type}
              name={field.name}
              id={field.name}
              className="border rounded-md px-3 py-2"
            />
          )}
        </div>
      ))}

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
        Enviar
      </button>

      {onCancel && (<button type="button" onClick={onCancel} className="bg-blue-600 text-white px-4 py-2 rounded-md">
        Cancelar
      </button>)}
      
    </form>
  );
}