import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

export interface Parent {
  id: number;
  name: string;
  phone?: string;
  email?: string;
}

interface ParentsContextType {
  parents: Parent[];
  setParents: React.Dispatch<React.SetStateAction<Parent[]>>;
  fetchParents: () => Promise<void>;
}

const ParentsContext = createContext<ParentsContextType | undefined>(undefined);

interface ParentsProviderProps {
  children: React.ReactNode;
}

export const ParentsProvider: React.FC<ParentsProviderProps> = ({ children }) => {
  const [parents, setParents] = useState<Parent[]>([]);

  const fetchParents = useCallback(async () => {
    try {
      const res = await axios.get('/api/parents');
      setParents(res.data);
    } catch (err) {
      // Xử lý lỗi nếu cần
      setParents([]);
      console.error('Lỗi lấy danh sách phụ huynh:', err);
    }
  }, []);

  return (
    <ParentsContext.Provider value={{ parents, setParents, fetchParents }}>
      {children}
    </ParentsContext.Provider>
  );
};

export const useParentsContext = () => {
  const context = useContext(ParentsContext);
  if (!context) throw new Error('useParentsContext must be used within a ParentsProvider');
  return context;
};
