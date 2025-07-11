import { useEffect, useState } from "react";
import type { CrudService } from "@/app/services/createCrudService";

export function useCRUDForm<TData, TResult>(service: CrudService<TData, TResult>) {
    const [data, setData] = useState<TResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    const [trigger, setTrigger] = useState(0);
    const updater = () => setTrigger((t) => t + 1);

    useEffect(() => {
        setLoading(true);
        service
            .obtenerTodos()
            .then(setData)
            .catch(setError)
            .finally(() => setLoading(false));
    }, [trigger, service]);

    return { data, loading, error, updater };
}
