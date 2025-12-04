import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { UserProfile, Goal, Level } from '../types';
import { generateWorkoutPlan } from '../services/geminiService';
import { Loader2, ChevronRight, ChevronLeft, AlertTriangle } from 'lucide-react';

const STEPS = 5;

const Onboarding = () => {
  const navigate = useNavigate();
  const { updateProfile, addPlan, plans } = useStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Safety check: if user lands here but already has plans, redirect home
  useEffect(() => {
    if (plans.length > 0) {
        navigate('/', { replace: true });
    }
  }, [plans, navigate]);

  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    goal: 'hipertrofia',
    level: 'iniciante',
    daysPerWeek: 3,
    equipment: [],
    limitations: '',
    preferences: ''
  });

  const handleNext = async () => {
    if (step < STEPS) {
      setStep(step + 1);
    } else {
      setLoading(true);
      setError('');
      try {
        updateProfile(formData);
        const plan = await generateWorkoutPlan(formData);
        if (plan) {
            addPlan(plan as any);
            navigate('/');
        } else {
            setError("Falha ao gerar treino: Resposta vazia da IA.");
        }
      } catch (err: any) {
        console.error("Onboarding Error:", err);
        setError(err.message || "Erro ao conectar com a IA.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => setStep(step - 1);

  const toggleEquipment = (item: string) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(item)
        ? prev.equipment.filter(i => i !== item)
        : [...prev.equipment, item]
    }));
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-lg">
        
        {/* Progress Dots */}
        <div className="flex justify-between items-center mb-8 px-2">
           {Array.from({length: STEPS}).map((_, idx) => (
             <div 
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx + 1 === step ? 'w-12 bg-orange-500' : 
                    idx + 1 < step ? 'w-4 bg-orange-900' : 'w-4 bg-neutral-800'
                }`}
             />
           ))}
        </div>

        <div className="bg-neutral-900 border border-white/5 rounded-3xl shadow-2xl p-6 md:p-8 min-h-[400px] flex flex-col justify-between relative overflow-hidden">
          
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900 z-10 p-8 text-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-orange-500 blur-xl opacity-20 animate-pulse"></div>
                    <Loader2 className="w-16 h-16 text-orange-500 animate-spin relative z-10 mb-6" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Construindo seu plano</h2>
                <p className="text-neutral-400">A IA está analisando mais de 1000 combinações para você.</p>
            </div>
          ) : (
            <>
                <div className="animate-in slide-in-from-right-8 duration-300">
                    {step === 1 && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">Seu Objetivo</h2>
                            <p className="text-neutral-400">O que você quer conquistar com o FitFlow?</p>
                        </div>
                        <div className="grid gap-3">
                        {(['emagrecer', 'hipertrofia', 'resistencia', 'forca'] as Goal[]).map(g => (
                            <button
                            key={g}
                            onClick={() => setFormData({ ...formData, goal: g })}
                            className={`p-5 rounded-2xl border-2 text-left transition-all active:scale-95 ${
                                formData.goal === g 
                                ? 'border-orange-500 bg-orange-500/10 text-white shadow-lg shadow-orange-900/20' 
                                : 'border-neutral-800 bg-neutral-800/50 text-neutral-400 hover:bg-neutral-800 hover:border-neutral-600'
                            }`}
                            >
                            <span className="block text-lg font-bold capitalize">{g}</span>
                            </button>
                        ))}
                        </div>
                    </div>
                    )}

                    {step === 2 && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">Sua Experiência</h2>
                            <p className="text-neutral-400">Há quanto tempo você treina?</p>
                        </div>
                        <div className="grid gap-3">
                        {(['iniciante', 'intermediario', 'avancado'] as Level[]).map(l => (
                            <button
                            key={l}
                            onClick={() => setFormData({ ...formData, level: l })}
                            className={`p-5 rounded-2xl border-2 text-left transition-all active:scale-95 ${
                                formData.level === l 
                                ? 'border-orange-500 bg-orange-500/10 text-white shadow-lg shadow-orange-900/20' 
                                : 'border-neutral-800 bg-neutral-800/50 text-neutral-400 hover:bg-neutral-800 hover:border-neutral-600'
                            }`}
                            >
                             <span className="block text-lg font-bold capitalize">{l}</span>
                             <span className="text-sm opacity-60">
                                {l === 'iniciante' ? 'Nunca treinei ou parei há muito tempo' : 
                                 l === 'intermediario' ? 'Treino regularmente há 6 meses+' : 'Treino sério há mais de 2 anos'}
                             </span>
                            </button>
                        ))}
                        </div>
                    </div>
                    )}

                    {step === 3 && (
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">Disponibilidade</h2>
                            <p className="text-neutral-400">Quantos dias na semana você pode treinar?</p>
                        </div>
                        
                        <div className="py-8">
                            <div className="flex justify-center items-center mb-8">
                                <span className="text-6xl font-bold text-orange-500">{formData.daysPerWeek}</span>
                                <span className="text-xl text-neutral-500 ml-2 self-end mb-2">dias</span>
                            </div>
                            <input 
                                type="range" 
                                min="1" 
                                max="7" 
                                value={formData.daysPerWeek} 
                                onChange={(e) => setFormData({...formData, daysPerWeek: parseInt(e.target.value)})}
                                className="w-full h-3 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-orange-600"
                            />
                             <div className="flex justify-between text-xs text-neutral-500 mt-2 px-1">
                                <span>1 dia</span>
                                <span>7 dias</span>
                            </div>
                        </div>
                    </div>
                    )}

                    {step === 4 && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">Equipamentos</h2>
                            <p className="text-neutral-400">O que você tem à disposição?</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                        {['Halteres', 'Barra', 'Máquinas', 'Elásticos', 'Peso do Corpo', 'Kettlebell'].map(eq => (
                            <button
                            key={eq}
                            onClick={() => toggleEquipment(eq)}
                            className={`p-4 rounded-xl border text-sm font-medium transition-all active:scale-95 ${
                                formData.equipment.includes(eq)
                                ? 'bg-orange-600 text-white border-orange-600 shadow-md'
                                : 'bg-neutral-800/50 text-neutral-300 border-neutral-700 hover:bg-neutral-800'
                            }`}
                            >
                            {eq}
                            </button>
                        ))}
                        </div>
                    </div>
                    )}

                    {step === 5 && (
                    <div className="space-y-6">
                         <div>
                            <h2 className="text-3xl font-bold text-white mb-2">Detalhes Finais</h2>
                            <p className="text-neutral-400">Alguma lesão ou preferência especial?</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-neutral-300 mb-2">Lesões ou limitações</label>
                            <textarea 
                                className="w-full p-4 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-white placeholder-neutral-600 transition"
                                rows={4}
                                placeholder="Ex: dor no joelho ao agachar, hérnia de disco..."
                                value={formData.limitations}
                                onChange={e => setFormData({...formData, limitations: e.target.value})}
                            ></textarea>
                        </div>
                    </div>
                    )}
                </div>

                {error && (
                    <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 text-red-200 rounded-xl text-sm flex items-start gap-3">
                        <AlertTriangle className="shrink-0 mt-0.5" size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <div className="mt-8 flex items-center justify-between pt-4 border-t border-white/5">
                    {step > 1 ? (
                        <button onClick={handleBack} className="p-3 text-neutral-400 hover:text-white transition rounded-full hover:bg-white/5">
                            <ChevronLeft size={24} />
                        </button>
                    ) : <div></div>}
                    
                    <button 
                        onClick={handleNext}
                        disabled={loading}
                        className="bg-orange-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-orange-700 transition flex items-center gap-2 shadow-lg shadow-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                    >
                        {step === STEPS ? 'Gerar Treino' : 'Próximo'} {step !== STEPS && <ChevronRight size={20} />}
                    </button>
                </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;