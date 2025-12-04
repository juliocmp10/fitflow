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

// Chaves do LocalStorage
const STORAGE_KEYS = {
  USERS: 'fitflow_users_v1', // Lista de credenciais
  SESSION: 'fitflow_current_session_v1', // Email do usuário logado
  DATA_PREFIX: 'fitflow_data_v1_' // Prefixo para dados do usuário (fitflow_data_v1_email@Example.com)
};

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
  // Estado principal
  const [state, setState] = useState<UserState>(INITIAL_STATE);
  const [isInitialized, setIsInitialized] = useState(false);

  // 1. Carregar lista de usuários e sessão ativa ao iniciar
  useEffect(() => {
    const loadInitialState = () => {
      try {
        // Carrega usuários registrados
        const usersJson = localStorage.getItem(STORAGE_KEYS.USERS);
        const registeredUsers: UserAccount[] = usersJson ? JSON.parse(usersJson) : [];

        // Verifica se há sessão ativa
        const currentEmail = localStorage.getItem(STORAGE_KEYS.SESSION);
        
        let userState = { ...INITIAL_STATE, registeredUsers };

        if (currentEmail) {
          const userExists = registeredUsers.find(u => u.email === currentEmail);
          
          if (userExists) {
            // Carrega dados específicos do usuário
            const userDataJson = localStorage.getItem(`${STORAGE_KEYS.DATA_PREFIX}${currentEmail}`);
            if (userDataJson) {
              const userData = JSON.parse(userDataJson);
              userState = {
                ...userState,
                isAuthenticated: true,
                currentUserEmail: currentEmail,
                profile: userData.profile || null,
                plans: Array.isArray(userData.plans) ? userData.plans : [],
                sessions: Array.isArray(userData.sessions) ? userData.sessions : [],
              };
            } else {
                // Sessão existe mas sem dados (edge case), restaura básico
                userState = {
                    ...userState,
                    isAuthenticated: true,
                    currentUserEmail: currentEmail
                }
            }
          } else {
            // Sessão inválida (usuário deletado?)
            localStorage.removeItem(STORAGE_KEYS.SESSION);
          }
        }

        setState(userState);
      } catch (error) {
        console.error("Erro ao inicializar Store:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadInitialState();
  }, []);

  // 2. Persistir dados do usuário atual sempre que mudarem
  useEffect(() => {
    if (!isInitialized || !state.currentUserEmail) return;

    const userData = {
      profile: state.profile,
      plans: state.plans,
      sessions: state.sessions
    };

    try {
      localStorage.setItem(`${STORAGE_KEYS.DATA_PREFIX}${state.currentUserEmail}`, JSON.stringify(userData));
    } catch (error) {
      console.error("Erro ao salvar dados do usuário:", error);
    }
  }, [state.profile, state.plans, state.sessions, state.currentUserEmail, isInitialized]);

  // Ações de Autenticação

  const register = async (name: string, email: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            if (state.registeredUsers.some(u => u.email === email)) {
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

            const newUsersList = [...state.registeredUsers, newUser];

            // Atualiza LocalStorage de Usuários
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(newUsersList));
            
            // Define Sessão
            localStorage.setItem(STORAGE_KEYS.SESSION, email);

            // Inicializa dados do usuário
            const initialUserData = { profile: initialProfile, plans: [], sessions: [] };
            localStorage.setItem(`${STORAGE_KEYS.DATA_PREFIX}${email}`, JSON.stringify(initialUserData));

            // Atualiza Estado
            setState(prev => ({
                ...prev,
                registeredUsers: newUsersList,
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
                // Carrega dados do usuário
                const userDataJson = localStorage.getItem(`${STORAGE_KEYS.DATA_PREFIX}${email}`);
                const userData = userDataJson ? JSON.parse(userDataJson) : { profile: null, plans: [], sessions: [] };

                // Atualiza Sessão LS
                localStorage.setItem(STORAGE_KEYS.SESSION, email);

                setState(prev => ({ 
                    ...prev, 
                    isAuthenticated: true, 
                    currentUserEmail: email,
                    profile: userData.profile || {
                        name: user.name,
                        goal: 'hipertrofia',
                        level: 'iniciante',
                        daysPerWeek: 3,
                        equipment: [],
                        limitations: '',
                        preferences: ''
                    },
                    plans: Array.isArray(userData.plans) ? userData.plans : [],
                    sessions: Array.isArray(userData.sessions) ? userData.sessions : []
                }));
                resolve();
            } else {
                reject(new Error("Email ou senha inválidos."));
            }
        }, 800);
    });
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    setState(prev => ({ 
        ...prev, 
        isAuthenticated: false, 
        currentUserEmail: null,
        profile: null,
        plans: [],
        sessions: []
    }));
  };

  // Ações de Dados (CRUD)

  const updateProfile = (profile: UserProfile) => {
    setState(prev => ({ ...prev, profile }));
  };

  const addPlan = (plan: WorkoutPlan) => {
    setState(prev => {
        // Desativa outros planos se o novo for ativo
        const currentPlans = Array.isArray(prev.plans) ? prev.plans : [];
        const updatedPlans = plan.isActive 
            ? currentPlans.map(p => ({ ...p, isActive: false }))
            : currentPlans;
            
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
  };

  const saveSession = (session: WorkoutSession) => {
    setState(prev => ({
      ...prev,
      sessions: [session, ...prev.sessions]
    }));
  };

  if (!isInitialized) {
      return null; // Ou um loading spinner global se preferir
  }

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