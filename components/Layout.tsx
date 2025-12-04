import React from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, BookOpen, User, LogOut, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Layout = () => {
  const { logout } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we are on the dashboard (home)
  const isHome = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950">
      {/* Top Bar - Mobile First */}
      <header className="bg-orange-600 text-white p-4 shadow-md sticky top-0 z-10 flex justify-between items-center border-b border-orange-700">
        <div className="flex items-center gap-2">
            {!isHome ? (
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-1 hover:bg-orange-700 rounded-full transition"
                    aria-label="Voltar"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
            ) : (
                <Dumbbell className="w-6 h-6" />
            )}
            <h1 className="text-xl font-bold tracking-tight">FitFlow</h1>
        </div>
        <button onClick={logout} className="text-orange-100 hover:text-white" title="Sair">
            <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-4 md:pl-64">
        <Outlet />
      </main>

      {/* Navigation (Bottom for Mobile, Side for Desktop) */}
      <nav className="fixed bottom-0 w-full bg-neutral-900 border-t border-neutral-800 flex justify-around py-3 z-20 md:fixed md:left-0 md:top-16 md:h-[calc(100vh-4rem)] md:w-64 md:flex-col md:justify-start md:border-t-0 md:border-r md:p-4">
        <NavLink 
          to="/" 
          className={({ isActive }) => `flex flex-col items-center gap-1 text-xs md:text-sm md:flex-row md:gap-3 md:p-3 md:rounded-lg transition ${isActive ? 'text-orange-500 font-medium bg-neutral-800' : 'text-neutral-400 hover:text-neutral-200'}`}
        >
          <LayoutDashboard size={20} />
          <span>Inicio</span>
        </NavLink>
        <NavLink 
          to="/workouts" 
          className={({ isActive }) => `flex flex-col items-center gap-1 text-xs md:text-sm md:flex-row md:gap-3 md:p-3 md:rounded-lg transition ${isActive ? 'text-orange-500 font-medium bg-neutral-800' : 'text-neutral-400 hover:text-neutral-200'}`}
        >
          <Dumbbell size={20} />
          <span>Treinos</span>
        </NavLink>
        <NavLink 
          to="/exercises" 
          className={({ isActive }) => `flex flex-col items-center gap-1 text-xs md:text-sm md:flex-row md:gap-3 md:p-3 md:rounded-lg transition ${isActive ? 'text-orange-500 font-medium bg-neutral-800' : 'text-neutral-400 hover:text-neutral-200'}`}
        >
          <BookOpen size={20} />
          <span>Exercícios</span>
        </NavLink>
        <NavLink 
          to="/profile" 
          className={({ isActive }) => `flex flex-col items-center gap-1 text-xs md:text-sm md:flex-row md:gap-3 md:p-3 md:rounded-lg transition ${isActive ? 'text-orange-500 font-medium bg-neutral-800' : 'text-neutral-400 hover:text-neutral-200'}`}
        >
          <User size={20} />
          <span>Perfil</span>
        </NavLink>
      </nav>
    </div>
  );
};