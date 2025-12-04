import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserState, UserProfile, WorkoutPlan, WorkoutSession, UserAccount } from '../types';

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

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize from local storage if available
  const [state, setState] = useState<UserState>(() => {
    const saved = localStorage.getItem('fitflow_state_v2'); // Changed key to reset for new auth structure
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem('fitflow_state_v2', JSON.stringify(state));
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
                id: crypto.randomUUID(),
                name,
                email,
                password
            };

            // Also create a default empty profile for the user
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
                plans: [], // New user starts with no plans
                sessions: []
            }));
            resolve();
        }, 800); // Fake network delay
    });
  };

  const login = async (email: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            const user = state.registeredUsers.find(u => u.email === email && u.password === password);
            
            if (user) {
                // In a real app, we would fetch the user's specific data here. 
                // For this LocalStorage demo, since we store everything in one big object,
                // we are keeping it simple. Ideally, plans/sessions should be keyed by userId.
                // For now, we assume the single state object belongs to the active user (limitation of this simple demo architecture).
                // To fix this properly, we'd need to restructure state to be { users: map, data: { userId: { plans: [] } } }.
                // For this specific request, checking credentials is sufficient.
                
                setState(prev => ({ 
                    ...prev, 
                    isAuthenticated: true, 
                    currentUserEmail: user.email,
                    // If we had multi-user data isolation in this demo structure, we would load it here.
                    profile: { ...prev.profile!, name: user.name } 
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
    const updatedPlans = state.plans.map(p => ({ ...p, isActive: false }));
    setState(prev => ({
      ...prev,
      plans: [plan, ...updatedPlans]
    }));
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