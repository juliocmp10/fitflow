import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { UserProfile, Goal, Level } from '../types';
import { generateWorkoutPlan } from '../services/geminiService';
import { Loader2, CheckCircle, ChevronRight, ChevronLeft, AlertTriangle } from 'lucide-react';

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
      // Finish and Generate
      setLoading(true);
      setError('');
      try {
        updateProfile(formData);
        const plan = await generateWorkoutPlan(formData);
        if (plan) {
            // Force type assertion since we know the partial has critical fields from AI
            addPlan(plan as any);
            navigate('/');
        } else {
            setError("Falha ao gerar treino: Resposta vazia da IA.");
        }
      } catch (err: any) {
        console.error("Onboarding Error:", err);
        setError(err.message || "Erro ao conectar com a IA. Verifique sua conexão.");
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
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl p-8">
        
        {/* Progress Bar */}
        <div className="w-full bg-neutral-800 h-2 rounded-full mb-8">
          <div 
            className="bg-orange-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / STEPS) * 100}%` }}
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Loader2 className="w-16 h-16 text-orange-500 animate-spin mb-4" />
            <h2 className="text-xl font-bold text-white">Criando seu treino perfeito...</h2>
            <p className="text-neutral-400 mt-2">A IA está analisando seu perfil e periodizando sua rotina.</p>
          </div>
        ) : (
          <>
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Qual é o seu objetivo principal?</h2>
                <div className="grid gap-3">
                  {(['emagrecer', 'hipertrofia', 'resistencia', 'forca'] as Goal[]).map(g => (
                    <button
                      key={g}
                      onClick={() => setFormData({ ...formData, goal: g })}
                      className={`p-4 rounded-xl border-2 text-left transition ${
                        formData.goal === g 
                        ? 'border-orange-500 bg-orange-900/20 text-orange-400 font-semibold' 
                        : 'border-neutral-700 text-neutral-300 hover:border-orange-500/50'
                      }`}
                    >
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Qual seu nível de experiência?</h2>
                <div className="grid gap-3">
                  {(['iniciante', 'intermediario', 'avancado'] as Level[]).map(l => (
                    <button
                      key={l}
                      onClick={() => setFormData({ ...formData, level: l })}
                      className={`p-4 rounded-xl border-2 text-left transition ${
                        formData.level === l 
                        ? 'border-orange-500 bg-orange-900/20 text-orange-400 font-semibold' 
                        : 'border-neutral-700 text-neutral-300 hover:border-orange-500/50'
                      }`}
                    >
                      {l.charAt(0).toUpperCase() + l.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Quantos dias para treinar?</h2>
                <div className="flex justify-between items-center bg-neutral-800 p-4 rounded-xl border border-neutral-700">
                  <span className="text-3xl font-bold text-orange-500">{formData.daysPerWeek}</span>
                  <input 
                    type="range" 
                    min="1" 
                    max="7" 
                    value={formData.daysPerWeek} 
                    onChange={(e) => setFormData({...formData, daysPerWeek: parseInt(e.target.value)})}
                    className="w-full ml-4 accent-orange-600 bg-neutral-700 rounded-lg h-2 appearance-none cursor-pointer"
                  />
                </div>
                <p className="text-sm text-neutral-400">Dias por semana</p>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Equipamentos disponíveis</h2>
                <div className="grid grid-cols-2 gap-3">
                  {['Halteres', 'Barra', 'Máquinas', 'Elásticos', 'Peso do Corpo', 'Kettlebell'].map(eq => (
                    <button
                      key={eq}
                      onClick={() => toggleEquipment(eq)}
                      className={`p-3 rounded-lg border text-sm transition ${
                        formData.equipment.includes(eq)
                        ? 'bg-orange-600 text-white border-orange-600'
                        : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:border-orange-500/50'
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
                <h2 className="text-2xl font-bold text-white">Alguma restrição?</h2>
                <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">Lesões ou limitações</label>
                    <textarea 
                        className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-white placeholder-neutral-500"
                        rows={3}
                        placeholder="Ex: dor no joelho, hérnia de disco..."
                        value={formData.limitations}
                        onChange={e => setFormData({...formData, limitations: e.target.value})}
                    ></textarea>
                </div>
              </div>
            )}

            {error && (
                <div className="mt-4 p-4 bg-red-900/20 border border-red-900/50 text-red-400 rounded-lg text-sm flex items-start gap-3">
                    <AlertTriangle className="shrink-0 mt-0.5" size={18} />
                    <span>{error}</span>
                </div>
            )}

            <div className="mt-8 flex justify-between">
              {step > 1 ? (
                <button onClick={handleBack} className="flex items-center text-neutral-400 hover:text-white px-4 py-2">
                  <ChevronLeft size={20} /> Voltar
                </button>
              ) : <div></div>}
              
              <button 
                onClick={handleNext}
                disabled={loading}
                className="bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 transition flex items-center gap-2 shadow-lg shadow-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {step === STEPS ? 'Gerar Treino' : 'Próximo'} {step !== STEPS && <ChevronRight size={20} />}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Onboarding;