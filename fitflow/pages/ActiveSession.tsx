import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, Play, Pause, Check, RotateCcw, AlertCircle, Trophy } from 'lucide-react';
import { WorkoutSession } from '../types';

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
        // Create an array of 0s based on total exercises
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
      // Play sound or vibrate here in real app
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
        id: crypto.randomUUID(),
        planId: plan.id,
        dayId: day.id,
        date: new Date().toISOString(),
        durationSeconds: timer,
        completedExercises: setsCompleted.filter((s, i) => s >= day.exercises[i].sets).length,
        totalExercises: day.exercises.length,
        totalVolume: day.exercises.reduce((acc, ex, idx) => {
             // Basic volume calc: sets done * min reps * weight (placeholder 10kg if 0)
             // In real app, user inputs weight used per set.
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
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between border-b border-neutral-800">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-neutral-800 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <div className="text-center">
            <h1 className="font-bold">{day.name}</h1>
            <p className="text-xs text-neutral-400">{formatTime(timer)}</p>
        </div>
        <div className="w-10"></div> {/* Spacer */}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 flex flex-col items-center">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-neutral-800 rounded-full mb-6">
            <div 
                className="h-1 bg-orange-500 rounded-full transition-all"
                style={{ width: `${((currentExerciseIndex) / day.exercises.length) * 100}%` }}
            />
        </div>

        {/* Video Placeholder */}
        <div className="w-full aspect-video bg-neutral-800 rounded-xl mb-6 overflow-hidden relative group">
            <img 
                src={`https://picsum.photos/800/450?random=${currentExerciseIndex}`} 
                alt="Exercise demo" 
                className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center">
                 <Play className="w-12 h-12 text-white opacity-80" fill="white" />
            </div>
            <div className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded text-xs">
                Demo
            </div>
        </div>

        {/* Exercise Info */}
        <div className="w-full max-w-md text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">{currentExercise.exerciseName}</h2>
            <div className="flex justify-center gap-4 text-sm text-neutral-400 mb-4">
                <span className="bg-neutral-800 px-3 py-1 rounded-full">{currentExercise.muscleGroup}</span>
                <span className="bg-neutral-800 px-3 py-1 rounded-full">{currentExercise.sets} Séries</span>
                <span className="bg-neutral-800 px-3 py-1 rounded-full">{currentExercise.details.reps} Reps</span>
            </div>
            
            {/* Instructions Accordion Style (Simple) */}
            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl text-left text-sm text-neutral-300">
                <div className="flex items-start gap-2 mb-2">
                    <AlertCircle size={16} className="mt-0.5 text-orange-400 shrink-0" />
                    <p className="font-medium text-orange-400">Dica: {currentExercise.notes || "Mantenha a postura."}</p>
                </div>
                <ul className="list-disc pl-5 space-y-1">
                    {currentExercise.instructions?.map((inst, i) => (
                        <li key={i}>{inst}</li>
                    ))}
                </ul>
            </div>
        </div>

        {/* Action Area */}
        <div className="w-full max-w-md space-y-4">
            {isResting ? (
                 <div className="bg-orange-900/20 border border-orange-500/30 p-6 rounded-2xl text-center animate-pulse">
                    <h3 className="text-orange-400 font-bold mb-2">Descanso</h3>
                    <p className="text-4xl font-mono font-bold text-white mb-4">{formatTime(restTimer)}</p>
                    <button 
                        onClick={() => setIsResting(false)}
                        className="text-sm text-neutral-300 underline hover:text-white"
                    >
                        Pular Descanso
                    </button>
                 </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-neutral-800 p-4 rounded-xl text-center">
                        <p className="text-neutral-400 text-sm">Séries Feitas</p>
                        <p className="text-2xl font-bold">{setsCompleted[currentExerciseIndex]} / {currentExercise.sets}</p>
                    </div>
                     <div className="bg-neutral-800 p-4 rounded-xl text-center">
                        <p className="text-neutral-400 text-sm">Carga Sugerida</p>
                        <p className="text-2xl font-bold">-</p>
                    </div>
                </div>
            )}
        </div>
      </main>

      {/* Footer Controls */}
      <footer className="p-4 bg-neutral-900 border-t border-neutral-800 pb-8 md:pb-4">
        <div className="max-w-md mx-auto flex gap-4">
             {setsCompleted[currentExerciseIndex] < currentExercise.sets ? (
                <button 
                    onClick={handleSetComplete}
                    disabled={isResting}
                    className="flex-1 bg-orange-600 disabled:bg-orange-800/50 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-500 transition flex items-center justify-center gap-2"
                >
                    {isResting ? 'Descansando...' : 'Marcar Série'} <Check size={20} />
                </button>
             ) : (
                 currentExerciseIndex < day.exercises.length - 1 ? (
                    <button 
                        onClick={() => {
                            setCurrentExerciseIndex(prev => prev + 1);
                            setIsResting(false);
                        }}
                        className="flex-1 bg-white text-neutral-900 py-4 rounded-xl font-bold text-lg hover:bg-neutral-200 transition flex items-center justify-center gap-2"
                    >
                        Próximo Exercício <ArrowLeft size={20} className="rotate-180" />
                    </button>
                 ) : (
                    <button 
                        onClick={handleFinishWorkout}
                        className="flex-1 bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-400 transition flex items-center justify-center gap-2"
                    >
                        Finalizar Treino <Trophy size={20} />
                    </button>
                 )
             )}
        </div>
      </footer>
    </div>
  );
};

export default ActiveSession;