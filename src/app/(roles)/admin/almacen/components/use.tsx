import { useEffect, useState } from 'react';
import { Almacen, almacenService } from '@/app/services/almacenService';

export function useAlmacenes() {
  const [data, setData] = useState<Almacen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [trigger, setTrigger] = useState<number>(0);
  const updater = () => { setTrigger(trigger + 1);}
  useEffect(() => {
    almacenService.obtenerTodos()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [trigger]);

  
  return { data, loading, error, updater };
}
