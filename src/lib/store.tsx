import { createContext, useContext, useEffect, useState } from 'react';

// Simple UUID generator
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
const generateCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

export type User = {
  id: string;
  email: string;
  status_suscripcion: 'inactiva' | 'activa';
  fecha_vencimiento: string | null;
  medio_referente_id: string | null;
  codigo_alfanumerico: string;
}

export type Medio = {
  id: string;
  nombre: string;
  total_suscriptores_aportados: number;
}

type MockDBContextType = {
  currentUser: User | null;
  medios: Medio[];
  login: (email: string, media_id?: string) => void;
  logout: () => void;
  simulatePayment: (plan: 'mensual' | 'anual') => void;
  validateMembership: (code: string) => User | null;
}

const defaultMedios: Medio[] = Array.from({ length: 39 }).map((_, i) => ({
  id: `medio_${i + 1}`,
  nombre: i < 4 ? `Medio Líder ${i + 1}` : `Medio Local ${i + 1}`,
  total_suscriptores_aportados: 0,
}));

const loadDb = () => {
  const data = localStorage.getItem('red_medios_db');
  if (data) return JSON.parse(data);
  return { users: [], medios: defaultMedios };
}

const saveDb = (db: any) => {
  localStorage.setItem('red_medios_db', JSON.stringify(db));
}

const DBContext = createContext<MockDBContextType | null>(null);

export const MockDBProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [db, setDb] = useState(() => loadDb());
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const userId = localStorage.getItem('current_user_id');
    return userId ? loadDb().users.find((u: User) => u.id === userId) || null : null;
  });

  useEffect(() => {
    saveDb(db);
    if (currentUser) {
      localStorage.setItem('current_user_id', currentUser.id);
    } else {
      localStorage.removeItem('current_user_id');
    }
  }, [db, currentUser]);

  const login = (email: string, media_id?: string) => {
    let user = db.users.find((u: User) => u.email === email);
    if (!user) {
      user = {
        id: generateId(),
        email,
        status_suscripcion: 'inactiva',
        fecha_vencimiento: null,
        medio_referente_id: media_id || null,
        codigo_alfanumerico: generateCode(),
      };
      setDb((prev: any) => ({ ...prev, users: [...prev.users, user] }));
    } else if (media_id && !user.medio_referente_id) {
        // Update referral if it was missing 
        user.medio_referente_id = media_id;
        setDb((prev: any) => ({ ...prev, users: prev.users.map((u: User) => u.id === user.id ? user : u) }));
    }
    setCurrentUser(user);
  };

  const logout = () => setCurrentUser(null);

  const simulatePayment = (plan: 'mensual' | 'anual') => {
    if (!currentUser) return;
    
    // Set 1 month or 1 year from now
    const now = new Date();
    if (plan === 'mensual') now.setMonth(now.getMonth() + 1);
    else now.setFullYear(now.getFullYear() + 1);

    const updatedUser = { 
      ...currentUser, 
      status_suscripcion: 'activa', 
      fecha_vencimiento: now.toISOString() 
    };

    setDb((prev: any) => {
      const users = prev.users.map((u: User) => u.id === currentUser.id ? updatedUser : u);
      
      // Update medio contribution if applicable
      let medios = prev.medios;
      if (updatedUser.medio_referente_id && currentUser.status_suscripcion === 'inactiva') {
         medios = medios.map((m: Medio) => 
            m.id === updatedUser.medio_referente_id 
              ? { ...m, total_suscriptores_aportados: m.total_suscriptores_aportados + 1 }
              : m
         );
      }
      return { users, medios };
    });
    
    setCurrentUser(updatedUser as User);
  };

  const validateMembership = (code: string) => {
    return db.users.find((u: User) => u.codigo_alfanumerico.toLowerCase() === code.toLowerCase() || u.id === code) || null;
  };

  return (
    <DBContext.Provider value={{ currentUser, medios: db.medios, login, logout, simulatePayment, validateMembership }}>
      {children}
    </DBContext.Provider>
  )
}

export const useMockDB = () => {
  const ctx = useContext(DBContext);
  if (!ctx) throw new Error("useMockDB must be used within MockDBProvider");
  return ctx;
}
