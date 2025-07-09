import { useEffect, useState } from 'react';
import { almacenService } from '@/app/services/almacenService';

export function useAlmacenes() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    almacenService.obtenerTodos()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
