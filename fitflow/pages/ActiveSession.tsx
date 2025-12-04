import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, Play, Pause, Check, RotateCcw, AlertCircle, Trophy, SkipForward } from 'lucide-react';
import { WorkoutSession } from '../types';
import { generateId } from '../utils';

const ActiveSession = () => {
  const { planId, dayId } = useParams();
  const navigate = useNavigate();
  const { plans, saveSession } = useStore();

  const plan = plans.find(p => p.id === planId);
  const day = plan?.days.find(d => d.id === dayId);

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [setsCompleted, setSetsCompleted] = useState<number[]>([]);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);

  // Initialize completed sets array
  useEffect(() => {
    if (day) {
       if (setsCompleted.length === 0) {
           setSetsCompleted(new Array(day.exercises.length).fill(0));
       }
    }
  }, [day]);

  // Global Session Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Rest Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isResting && restTimer > 0) {
      interval = setInterval(() => setRestTimer(t => t - 1), 1000);
    } else if (restTimer === 0 && isResting) {
      setIsResting(false);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  useEffect(() => {
      setIsTimerRunning(true);
  }, []);

  if (!plan || !day) return <div className="p-8 text-white">Treino não encontrado</div>;

  const currentExercise = day.exercises[currentExerciseIndex];

  const handleSetComplete = () => {
    const newSetsCompleted = [...setsCompleted];
    newSetsCompleted[currentExerciseIndex] += 1;
    setSetsCompleted(newSetsCompleted);

    // Start rest if not last set
    if (newSetsCompleted[currentExerciseIndex] < currentExercise.sets) {
      setRestTimer(currentExercise.details.restSeconds);
      setIsResting(true);
    }
  };

  const handleFinishWorkout = () => {
    const session: WorkoutSession = {
        id: generateId(),
        planId: plan.id,
        dayId: day.id,
        date: new Date().toISOString(),
        durationSeconds: timer,
        completedExercises: setsCompleted.filter((s, i) => s >= day.exercises[i].sets).length,
        totalExercises: day.exercises.length,
        totalVolume: day.exercises.reduce((acc, ex, idx) => {
             const weight = ex.details.weight || 10;
             const reps = parseInt(ex.details.reps.split('-')[0]) || 8;
             return acc + (setsCompleted[idx] * reps * weight);
        }, 0)
    };
    saveSession(session);
    navigate('/');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-neutral-950 text-white flex flex-col z-[60]">
      {/* Immersive Header */}
      <div className="pt-safe px-4 py-4 flex items-center justify-between bg-neutral-900 border-b border-white/5">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-neutral-800 rounded-full text-neutral-400 hover:text-white transition">
          <ArrowLeft size={24} />
        </button>
        <div className="text-center">
            <h1 className="font-bold text-sm text-neutral-300 uppercase tracking-widest">{day.name}</h1>
            <div className="font-mono text-xl font-bold text-white">{formatTime(timer)}</div>
        </div>
        <div className="w-10"></div> 
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col items-center pb-32">
        {/* Progress Dots */}
        <div className="flex gap-1 mb-8 w-full justify-center">
            {day.exercises.map((_, idx) => (
                <div 
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentExerciseIndex 
                        ? 'w-8 bg-orange-500' 
                        : idx < currentExerciseIndex 
                        ? 'w-2 bg-orange-900' 
                        : 'w-2 bg-neutral-800'
                    }`}
                />
            ))}
        </div>

        {/* Current Exercise Card */}
        <div className="w-full max-w-lg">
            {/* Visual/Video */}
            <div className="relative w-full aspect-video bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl mb-6 border border-white/5 group">
                <img 
                    src={`https://picsum.photos/800/450?random=${currentExerciseIndex}`} 
                    alt="Exercise demo" 
                    className="w-full h-full object-cover opacity-50 group-hover:opacity-60 transition"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                        <Play className="w-8 h-8 text-white fill-white" />
                     </div>
                </div>
                <div className="absolute top-4 left-4">
                     <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-xs font-bold text-orange-400 border border-orange-500/20">
                        {currentExercise.muscleGroup}
                     </span>
                </div>
            </div>

            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2 leading-tight">{currentExercise.exerciseName}</h2>
                <div className="flex justify-center gap-3 mt-4">
                    <div className="bg-neutral-900 border border-white/10 px-4 py-2 rounded-xl">
                        <span className="block text-xs text-neutral-500 uppercase font-bold">Séries</span>
                        <span className="text-xl font-bold text-white">{currentExercise.sets}</span>
                    </div>
                    <div className="bg-neutral-900 border border-white/10 px-4 py-2 rounded-xl">
                        <span className="block text-xs text-neutral-500 uppercase font-bold">Reps</span>
                        <span className="text-xl font-bold text-white">{currentExercise.details.reps}</span>
                    </div>
                    <div className="bg-neutral-900 border border-white/10 px-4 py-2 rounded-xl">
                        <span className="block text-xs text-neutral-500 uppercase font-bold">Carga</span>
                        <span className="text-xl font-bold text-white">--</span>
                    </div>
                </div>
            </div>

            {/* Rest Overlay or Info */}
            {isResting ? (
                 <div className="bg-orange-600 rounded-3xl p-8 text-center shadow-2xl shadow-orange-900/40 animate-pulse relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 opacity-90"></div>
                    <div className="relative z-10">
                        <h3 className="text-orange-100 font-bold uppercase tracking-widest text-sm mb-2">Descanso</h3>
                        <p className="text-6xl font-mono font-bold text-white mb-6">{formatTime(restTimer)}</p>
                        <button 
                            onClick={() => setIsResting(false)}
                            className="bg-white text-orange-600 px-6 py-2 rounded-full font-bold text-sm shadow-lg hover:scale-105 transition"
                        >
                            Pular Descanso
                        </button>
                    </div>
                 </div>
            ) : (
                <div className="bg-neutral-900/50 border border-white/5 p-5 rounded-2xl">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="text-orange-500 shrink-0 mt-0.5" size={20} />
                        <div>
                            <p className="font-medium text-orange-100 mb-1">Dica de Execução</p>
                            <p className="text-sm text-neutral-400 leading-relaxed">
                                {currentExercise.notes || "Mantenha o core contraído e controle a fase excêntrica do movimento."}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* Fixed Footer Controls - HUGE buttons for easy mobile tapping */}
      <div className="fixed bottom-0 left-0 right-0 bg-neutral-950 border-t border-white/10 p-4 pb-safe z-50">
        <div className="max-w-lg mx-auto flex gap-3 h-20">
             {setsCompleted[currentExerciseIndex] < currentExercise.sets ? (
                <button 
                    onClick={handleSetComplete}
                    disabled={isResting}
                    className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 disabled:from-neutral-800 disabled:to-neutral-800 disabled:text-neutral-500 text-white rounded-2xl font-bold text-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg shadow-orange-900/20"
                >
                    {isResting ? (
                        'Descansando...'
                    ) : (
                        <>
                            <Check className="w-8 h-8" strokeWidth={3} />
                            <span>Marcar Série {setsCompleted[currentExerciseIndex] + 1}/{currentExercise.sets}</span>
                        </>
                    )}
                </button>
             ) : (
                 currentExerciseIndex < day.exercises.length - 1 ? (
                    <button 
                        onClick={() => {
                            setCurrentExerciseIndex(prev => prev + 1);
                            setIsResting(false);
                        }}
                        className="flex-1 bg-white text-neutral-950 rounded-2xl font-bold text-xl hover:bg-neutral-200 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg"
                    >
                        <span>Próximo</span>
                        <SkipForward className="w-8 h-8" strokeWidth={3} />
                    </button>
                 ) : (
                    <button 
                        onClick={handleFinishWorkout}
                        className="flex-1 bg-green-600 text-white rounded-2xl font-bold text-xl hover:bg-green-500 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-900/20"
                    >
                        <span>Finalizar</span>
                        <Trophy className="w-8 h-8" fill="currentColor" />
                    </button>
                 )
             )}
        </div>
      </div>
    </div>
  );
};

export default ActiveSession;