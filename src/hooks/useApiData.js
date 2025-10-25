import { useEffect, useState } from 'react';

const useApiData = (endpoint, initialValue = []) => {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(endpoint, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }
        const payload = await response.json();
        setData(payload);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();

    return () => {
      controller.abort();
    };
  }, [endpoint]);

  return { data, loading, error };
};

export default useApiData;
