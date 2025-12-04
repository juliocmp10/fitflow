import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, Play, Clock, Dumbbell, MoreVertical } from 'lucide-react';

const PlanDetails = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { plans } = useStore();

  const plan = plans.find(p => p.id === planId);

  if (!plan) return <div className="p-8 text-white">Plano não encontrado.</div>;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button 
            onClick={() => navigate('/workouts')} 
            className="flex items-center gap-2 text-neutral-400 hover:text-white mb-4 transition"
        >
            <ArrowLeft size={20} /> Voltar para Planos
        </button>
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">{plan.name}</h1>
                <div className="flex items-center gap-3">
                    {plan.isActive && (
                        <span className="bg-orange-900/30 text-orange-400 border border-orange-500/20 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                            Plano Ativo
                        </span>
                    )}
                    <span className="text-neutral-500 text-sm">
                        {plan.days.length} dias por semana
                    </span>
                </div>
            </div>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-orange-500 rounded-full block"></span>
            Cronograma Semanal
        </h2>

        <div className="grid gap-6">
            {plan.days.map((day, index) => (
                <div key={day.id} className="bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800">
                    {/* Day Header */}
                    <div className="p-4 bg-neutral-800/50 border-b border-neutral-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-white border border-neutral-700">
                                {index + 1}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">{day.name}</h3>
                                <p className="text-sm text-neutral-500">{day.exercises.length} Exercícios</p>
                            </div>
                        </div>
                        <Link 
                            to={`/session/${plan.id}/${day.id}`}
                            className="w-full sm:w-auto px-6 py-2 bg-orange-600 text-white rounded-lg font-bold text-sm hover:bg-orange-700 transition flex items-center justify-center gap-2 shadow-lg shadow-orange-900/20"
                        >
                            <Play size={16} fill="currentColor" /> Iniciar Treino
                        </Link>
                    </div>

                    {/* Exercises List */}
                    <div className="divide-y divide-neutral-800">
                        {day.exercises.map((ex, i) => (
                            <div key={i} className="p-4 flex items-center justify-between hover:bg-neutral-800/30 transition">
                                <div className="flex items-center gap-4">
                                    <div className="hidden sm:flex w-12 h-12 rounded-lg bg-neutral-800 items-center justify-center shrink-0">
                                        <Dumbbell size={20} className="text-neutral-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-neutral-200">{ex.exerciseName}</h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded border border-neutral-700">
                                                {ex.muscleGroup || 'Geral'}
                                            </span>
                                            {ex.notes && (
                                                <span className="text-xs text-orange-500 truncate max-w-[150px] sm:max-w-xs">
                                                    Dica: {ex.notes}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="text-right shrink-0">
                                    <div className="font-bold text-white text-lg">{ex.sets} x {ex.details.reps}</div>
                                    <div className="text-xs text-neutral-500 flex items-center justify-end gap-1">
                                        <Clock size={10} /> {ex.details.restSeconds}s
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PlanDetails;