import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserState, UserProfile, WorkoutPlan, WorkoutSession, UserAccount } from '../types';
import { generateId } from '../utils';

interface StoreContextType extends UserState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: UserProfile) => void;
  addPlan: (plan: WorkoutPlan) => void;
  deletePlan: (id: string) => void;
  saveSession: (session: WorkoutSession) => void;
  setActivePlan: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const INITIAL_STATE: UserState = {
  registeredUsers: [],
  currentUserEmail: null,
  profile: null,
  isAuthenticated: false,
  plans: [],
  sessions: [],
  exerciseLibrary: []
};

// Função auxiliar para garantir que a estrutura dos dados esteja correta (Sanitização)
const sanitizeState = (data: any): UserState => {
  const base = { ...INITIAL_STATE, ...data };
  
  // Garante que listas sejam arrays
  base.registeredUsers = Array.isArray(base.registeredUsers) ? base.registeredUsers : [];
  base.sessions = Array.isArray(base.sessions) ? base.sessions : [];
  base.exerciseLibrary = Array.isArray(base.exerciseLibrary) ? base.exerciseLibrary : [];
  
  // Sanitização profunda dos planos para evitar crash no map()
  base.plans = Array.isArray(base.plans) ? base.plans.map((p: any) => ({
    ...p,
    days: Array.isArray(p.days) ? p.days.map((d: any) => ({
      ...d,
      exercises: Array.isArray(d.exercises) ? d.exercises : []
    })) : []
  })) : [];

  return base;
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize from local storage safely
  const [state, setState] = useState<UserState>(() => {
    try {
      const saved = localStorage.getItem('fitflow_state_v2');
      if (!saved) return INITIAL_STATE;
      
      const parsed = JSON.parse(saved);
      if (typeof parsed !== 'object' || parsed === null) return INITIAL_STATE;

      return sanitizeState(parsed);
    } catch (e) {
      console.error("Erro ao carregar estado:", e);
      try { localStorage.removeItem('fitflow_state_v2'); } catch {}
      return INITIAL_STATE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('fitflow_state_v2', JSON.stringify(state));
    } catch (e) {
      console.error("Erro ao salvar estado:", e);
    }
  }, [state]);

  const register = async (name: string, email: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            const userExists = state.registeredUsers.find(u => u.email === email);
            if (userExists) {
                reject(new Error("Este email já está cadastrado."));
                return;
            }

            const newUser: UserAccount = {
                id: generateId(),
                name,
                email,
                password
            };

            const initialProfile: UserProfile = {
                name: name,
                goal: 'hipertrofia',
                level: 'iniciante',
                daysPerWeek: 3,
                equipment: [],
                limitations: '',
                preferences: ''
            };

            setState(prev => ({
                ...prev,
                registeredUsers: [...prev.registeredUsers, newUser],
                currentUserEmail: email,
                isAuthenticated: true,
                profile: initialProfile,
                plans: [],
                sessions: []
            }));
            resolve();
        }, 800);
    });
  };

  const login = async (email: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            const user = state.registeredUsers.find(u => u.email === email && u.password === password);
            
            if (user) {
                setState(prev => ({ 
                    ...prev, 
                    isAuthenticated: true, 
                    currentUserEmail: user.email,
                    profile: { ...(prev.profile || {
                        name: user.name,
                        goal: 'hipertrofia',
                        level: 'iniciante',
                        daysPerWeek: 3,
                        equipment: [],
                        limitations: '',
                        preferences: ''
                    }), name: user.name } 
                }));
                resolve();
            } else {
                reject(new Error("Email ou senha inválidos."));
            }
        }, 800);
    });
  };

  const logout = () => {
    setState(prev => ({ 
        ...prev, 
        isAuthenticated: false, 
        currentUserEmail: null 
    }));
  };

  const updateProfile = (profile: UserProfile) => {
    setState(prev => ({ ...prev, profile }));
  };

  const addPlan = (plan: WorkoutPlan) => {
    setState(prev => {
        const currentPlans = Array.isArray(prev.plans) ? prev.plans : [];
        const updatedPlans = currentPlans.map(p => ({ ...p, isActive: false }));
        return {
            ...prev,
            plans: [plan, ...updatedPlans]
        };
    });
  };

  const deletePlan = (id: string) => {
    setState(prev => ({
      ...prev,
      plans: prev.plans.filter(p => p.id !== id)
    }));
  };

  const setActivePlan = (id: string) => {
     setState(prev => ({
      ...prev,
      plans: prev.plans.map(p => ({ ...p, isActive: p.id === id }))
    }));
  }

  const saveSession = (session: WorkoutSession) => {
    setState(prev => ({
      ...prev,
      sessions: [session, ...prev.sessions]
    }));
  };

  return (
    <StoreContext.Provider value={{
      ...state,
      login,
      register,
      logout,
      updateProfile,
      addPlan,
      deletePlan,
      saveSession,
      setActivePlan
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};