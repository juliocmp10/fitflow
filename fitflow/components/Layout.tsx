import React from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, BookOpen, User, LogOut, ArrowLeft, Menu } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Layout = () => {
  const { logout, profile } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we are on the dashboard (home)
  const isHome = location.pathname === '/';

  // Configuração dos itens de navegação
  const navItems = [
    { to: "/", icon: LayoutDashboard, label: "Início" },
    { to: "/workouts", icon: Dumbbell, label: "Treinos" },
    { to: "/exercises", icon: BookOpen, label: "Exercícios" },
    { to: "/profile", icon: User, label: "Perfil" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-neutral-100">
      {/* Mobile Top Header (Só aparece em mobile) */}
      <header className="md:hidden bg-neutral-950/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-30 pt-safe px-4 py-3 flex justify-between items-center transition-all duration-200">
        <div className="flex items-center gap-3">
            {!isHome ? (
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-2 -ml-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-full transition"
                    aria-label="Voltar"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
            ) : (
                <div className="p-2 -ml-2 bg-orange-500/10 rounded-lg">
                    <Dumbbell className="w-5 h-5 text-orange-500" />
                </div>
            )}
            <h1 className="text-lg font-bold tracking-tight text-white">FitFlow</h1>
        </div>
        <button onClick={logout} className="p-2 text-neutral-400 hover:text-red-400 hover:bg-white/5 rounded-full transition" title="Sair">
            <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-72 flex-col bg-neutral-900 border-r border-white/5 z-40">
        <div className="p-8 pb-4">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-800 rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/20">
                    <Dumbbell className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">FitFlow</h1>
            </div>
            
            {/* User Mini Profile in Sidebar */}
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl mb-6 border border-white/5">
                <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-orange-500 border border-orange-500/20">
                    {profile?.name?.charAt(0) || 'U'}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-semibold truncate text-white">{profile?.name || 'Atleta'}</p>
                    <p className="text-xs text-neutral-400 truncate capitalize">{profile?.level || 'Iniciante'}</p>
                </div>
            </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
            {navItems.map((item) => (
                <NavLink 
                    key={item.to}
                    to={item.to} 
                    className={({ isActive }) => `flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 group ${
                        isActive 
                        ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20 font-medium' 
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                    {({ isActive }) => (
                        <>
                            <item.icon size={20} className={isActive ? 'text-white' : 'text-neutral-400 group-hover:text-white transition-colors'} />
                            <span>{item.label}</span>
                        </>
                    )}
                </NavLink>
            ))}
        </nav>

        <div className="p-4 border-t border-white/5">
            <button 
                onClick={logout} 
                className="flex items-center gap-3 p-3.5 rounded-xl w-full text-left text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
                <LogOut size={20} />
                <span>Sair</span>
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:pl-72 flex flex-col min-h-screen">
        <div className="flex-1 overflow-y-auto w-full pb-24 md:pb-8 pt-4 md:pt-8 px-4 md:px-8 max-w-7xl mx-auto">
            <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-neutral-900/90 backdrop-blur-xl border-t border-white/5 pb-safe z-50">
        <div className="flex justify-around items-center h-16 px-2">
            {navItems.map((item) => (
                <NavLink 
                    key={item.to}
                    to={item.to} 
                    className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-200 ${
                        isActive 
                        ? 'text-orange-500' 
                        : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                >
                    {({ isActive }) => (
                        <>
                            <div className={`relative p-1.5 rounded-xl transition-all ${isActive ? 'bg-orange-500/10' : ''}`}>
                                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                {/* Active Dot indicator */}
                                <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-500 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`}></span>
                            </div>
                            <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
                        </>
                    )}
                </NavLink>
            ))}
        </div>
      </nav>
    </div>
  );
};