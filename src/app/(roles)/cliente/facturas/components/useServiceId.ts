import { useState, useEffect } from "react";
import { flattenDeepWithPrefix } from "@/app/lib/axios";
export function useServiceId( url:string, initialId?: string) {
  const [id, setId] = useState<string | null>(initialId || null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [trigger, setTrigger] = useState(0);

  const updater = () => setTrigger((t) => t + 1);

  useEffect(() => {
    if (!initialId && typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user?.id) setId(user.id);
    }
  }, [initialId]);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`/api/${url}${id}`)
    .then((res) => {
      if (!res.ok) throw new Error("Error en la petición");
      return res.json();
    })
    .then((resData) => {
      const flattened = Array.isArray(resData)
        ? resData.map((item) => flattenDeepWithPrefix(item))

        : flattenDeepWithPrefix(resData);
      setData(flattened);
    })
    .catch(setError)
    .finally(() => setLoading(false));
}, [id, trigger]);

  return { data, loading, error, updater };
}
