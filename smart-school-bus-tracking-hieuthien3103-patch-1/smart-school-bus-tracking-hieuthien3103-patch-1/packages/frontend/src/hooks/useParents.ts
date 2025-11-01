import { useState, useEffect, useCallback } from 'react';
import type { Parent } from '../contexts/ParentsContext';
import axios from 'axios';

export const useParents = (): {
  parents: Parent[];
  loading: boolean;
  error: string | null;
  fetchParents: () => Promise<void>;
} => {
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchParents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Lấy dữ liệu từ backend
      const res = await axios.get('/api/parents');
      setParents(res.data); 
    } catch (err: any) {
      setError(err.message || 'Failed to fetch parents');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchParents();
  }, [fetchParents]);

  return { parents, loading, error, fetchParents };
};
