"use client";

import { FormEvent, useEffect, useState } from "react";
import { DynamicFormProps } from "./types";
import type { Field, Option } from "./types";

import { motion } from "framer-motion";
export default function DynamicForm<TData>({
    config,
    onSubmit,
    onCancel,
    initConfig = {},
    name,
}: DynamicFormProps<TData>) {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData) as TData;
        onSubmit(data);
    };

    return (
        <motion.div
            className="p-6 rounded-2xl shadow-xl mt-6 space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}>
            <form
                onSubmit={handleSubmit}
                className="space-y-6 p-6 bg-white rounded-2xl shadow-xl border max-w-md mx-auto mt-6">
                <h1 className="text-2xl font-medium  text-center mb-6 text-gray-900">
                    {name}
                </h1>
                {config.map((field) => {
                    const value = initConfig[field.name];
                    const [resolvedOptions, setResolvedOptions] = useState<
                        Option[]
                    >([]);

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
                                <label
                                    htmlFor={field.name}
                                    className="text-sm font-medium text-gray-700 mb-1">
                                    {field.label}
                                </label>
                            )}

                            {field.type === "select" ? (
                                resolvedOptions.length === 0 ? (
                                    <span className="text-sm italic text-gray-500">
                                        Cargando...
                                    </span>
                                ) : (
                                    <select
                                        id={field.name}
                                        name={field.name}
                                        defaultValue={
                                            value !== undefined &&
                                            value !== null
                                                ? value
                                                : ""
                                        }
                                        className="border border-gray-300 focus:border-purple-600 focus:ring-purple-600 rounded-lg px-4 py-2 shadow-sm transition-all text-gray-700">
                                        {resolvedOptions.map((opt) => (
                                            <option
                                                key={opt.value}
                                                value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                )
                            ) : field.type === "checkbox" ? (
                                <label className="inline-flex items-center gap-2 text-gray-700">
                                    <input
                                        type="checkbox"
                                        name={field.name}
                                        defaultChecked={Boolean(value)}
                                        className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                                    />
                                    {field.label}
                                </label>
                            ) : (
                                <input
                                    type={field.type}
                                    name={field.name}
                                    id={field.name}
                                    defaultValue={
                                        value !== undefined && value !== null
                                            ? value
                                            : ""
                                    }
                                    className="border border-gray-300 focus:border-purple-600 focus:ring-purple-600 rounded-lg px-4 py-2 shadow-sm transition-all text-gray-700"
                                />
                            )}
                        </div>
                    );
                })}

                <div className="flex flex-wrap justify-end gap-4 pt-2">
                    <button
                        type="submit"
                        className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-lg shadow-sm transition-all">
                        Enviar
                    </button>

                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow-sm transition-all">
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </motion.div>
    );
}
