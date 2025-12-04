import React from 'react';
import { useStore } from '../context/StoreContext';
import { Plus, Trash2, CheckCircle, ChevronRight, Calendar, Dumbbell, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Workouts = () => {
  const { plans, deletePlan, setActivePlan } = useStore();
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-white">Meus Planos</h1>
        <div className="flex gap-3">
            <button 
            onClick={() => navigate('/onboarding')}
            className="bg-neutral-800 text-orange-400 border border-orange-900/50 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-neutral-700 transition font-medium text-sm"
            >
            <Sparkles size={16} /> Gerar com IA
            </button>
            <button 
            onClick={() => navigate('/create-plan')}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-700 transition font-medium text-sm"
            >
            <Plus size={18} /> Criar Manualmente
            </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {plans.map(plan => (
          <div key={plan.id} className={`group bg-neutral-900 rounded-2xl p-6 shadow-sm border-2 transition relative overflow-hidden ${plan.isActive ? 'border-orange-500 shadow-orange-900/20' : 'border-neutral-800 hover:border-neutral-700'}`}>
            
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <Dumbbell size={100} className="text-white transform rotate-12" />
            </div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-bold text-white group-hover:text-orange-500 transition">{plan.name}</h2>
                    {plan.isActive && <span className="bg-orange-900/50 text-orange-400 border border-orange-500/30 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold">Ativo</span>}
                    </div>
                    <div className="flex items-center gap-2 text-neutral-500 text-sm">
                        <Calendar size={14} />
                        <span>Criado em {new Date(plan.createdAt).toLocaleDateString()}</span>
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
                        className="p-2 bg-neutral-800 rounded-lg text-neutral-400 hover:text-orange-500 hover:bg-neutral-700 transition"
                        title="Definir como ativo"
                    >
                        <CheckCircle size={20} />
                    </button>
                    )}
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            deletePlan(plan.id);
                        }}
                        className="p-2 bg-neutral-800 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-neutral-700 transition"
                        title="Excluir"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
                </div>

                <div className="flex items-center justify-between mt-6">
                    <div className="flex gap-4">
                        <div className="text-center">
                            <span className="block text-2xl font-bold text-white">{plan.days.length}</span>
                            <span className="text-xs text-neutral-500 uppercase tracking-wide">Dias/Semana</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-2xl font-bold text-white">
                                {plan.days.reduce((acc, day) => acc + day.exercises.length, 0)}
                            </span>
                            <span className="text-xs text-neutral-500 uppercase tracking-wide">Exercícios</span>
                        </div>
                    </div>

                    <Link 
                        to={`/plan/${plan.id}`}
                        className="flex items-center gap-2 bg-white text-neutral-950 px-4 py-2 rounded-lg font-bold text-sm hover:bg-neutral-200 transition"
                    >
                        Abrir Plano <ChevronRight size={16} />
                    </Link>
                </div>
            </div>
          </div>
        ))}

        {plans.length === 0 && (
            <div className="col-span-full text-center py-16 bg-neutral-900 rounded-2xl border border-dashed border-neutral-800">
                <Dumbbell className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
                <p className="text-neutral-400 mb-6 text-lg">Você ainda não tem treinos criados.</p>
                <div className="flex justify-center gap-4">
                    <button 
                        onClick={() => navigate('/onboarding')}
                        className="bg-neutral-800 text-orange-400 border border-neutral-700 px-6 py-3 rounded-xl font-bold hover:bg-neutral-700 transition"
                    >
                        Gerar com IA
                    </button>
                    <button 
                        onClick={() => navigate('/create-plan')}
                        className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-900/20 hover:bg-orange-700 transition"
                    >
                        Criar Manualmente
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Workouts;