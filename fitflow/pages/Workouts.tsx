import React from 'react';
import { useStore } from '../context/StoreContext';
import { Plus, Trash2, CheckCircle, ChevronRight, Calendar, Dumbbell, Sparkles, LayoutList } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Workouts = () => {
  const { plans, deletePlan, setActivePlan } = useStore();
  const navigate = useNavigate();
  
  // Safe access
  const safePlans = Array.isArray(plans) ? plans : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-white">Meus Planos</h1>
            <p className="text-neutral-400 text-sm">Gerencie suas rotinas de treino</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
            <button 
            onClick={() => navigate('/onboarding')}
            className="flex-1 md:flex-none bg-neutral-800 text-orange-400 border border-orange-500/20 px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-700 transition font-medium text-sm"
            >
            <Sparkles size={16} /> IA Criar
            </button>
            <button 
            onClick={() => navigate('/create-plan')}
            className="flex-1 md:flex-none bg-orange-600 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-700 transition font-medium text-sm shadow-lg shadow-orange-900/20"
            >
            <Plus size={18} /> Manual
            </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {safePlans.map(plan => (
          <div key={plan.id} className={`group relative bg-neutral-900 rounded-3xl p-6 border transition-all duration-300 ${plan.isActive ? 'border-orange-500 shadow-xl shadow-orange-900/10' : 'border-white/5 hover:border-white/10 hover:bg-neutral-800/50'}`}>
            
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                <Dumbbell size={120} className="transform rotate-12" />
            </div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h2 className="text-xl font-bold text-white group-hover:text-orange-400 transition">{plan.name}</h2>
                        {plan.isActive && (
                            <span className="bg-orange-500 text-white text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold shadow-md">
                                Ativo
                            </span>
                        )}
                        </div>
                        <div className="flex items-center gap-2 text-neutral-500 text-xs">
                            <Calendar size={12} />
                            <span>{new Date(plan.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        {!plan.isActive && (
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setActivePlan(plan.id);
                            }}
                            className="p-2 bg-neutral-800 rounded-lg text-neutral-400 hover:text-green-400 hover:bg-neutral-700 transition"
                            title="Definir como ativo"
                        >
                            <CheckCircle size={18} />
                        </button>
                        )}
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                deletePlan(plan.id);
                            }}
                            className="p-2 bg-neutral-800 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-neutral-700 transition"
                            title="Excluir"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-4 my-4 bg-black/20 p-4 rounded-2xl border border-white/5">
                    <div>
                        <span className="text-xs text-neutral-500 uppercase tracking-wide font-bold">Dias</span>
                        <div className="flex items-center gap-2 mt-1">
                            <Calendar className="text-orange-500 w-4 h-4" />
                            <span className="text-lg font-bold text-white">{plan.days?.length || 0}</span>
                        </div>
                    </div>
                    <div>
                        <span className="text-xs text-neutral-500 uppercase tracking-wide font-bold">Exercícios</span>
                        <div className="flex items-center gap-2 mt-1">
                            <LayoutList className="text-blue-500 w-4 h-4" />
                            <span className="text-lg font-bold text-white">
                                {plan.days ? plan.days.reduce((acc, day) => acc + (day.exercises?.length || 0), 0) : 0}
                            </span>
                        </div>
                    </div>
                </div>

                <Link 
                    to={`/plan/${plan.id}`}
                    className="w-full flex items-center justify-center gap-2 bg-white text-neutral-950 px-4 py-3 rounded-xl font-bold text-sm hover:bg-neutral-200 transition shadow-lg mt-auto"
                >
                    Ver Detalhes <ChevronRight size={16} />
                </Link>
            </div>
          </div>
        ))}

        {safePlans.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center text-center py-20 bg-neutral-900/50 rounded-3xl border border-dashed border-white/10">
                <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-6">
                    <Dumbbell className="w-8 h-8 text-neutral-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Sem treinos ainda</h3>
                <p className="text-neutral-400 mb-8 max-w-xs mx-auto">Crie seu primeiro plano de treino manualmente ou deixe nossa IA fazer isso por você.</p>
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md px-4">
                    <button 
                        onClick={() => navigate('/onboarding')}
                        className="flex-1 bg-neutral-800 text-orange-400 border border-neutral-700 px-6 py-3 rounded-xl font-bold hover:bg-neutral-700 transition"
                    >
                        IA Mágica
                    </button>
                    <button 
                        onClick={() => navigate('/create-plan')}
                        className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-900/20 hover:bg-orange-700 transition"
                    >
                        Criar Manual
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Workouts;