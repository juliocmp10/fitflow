import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { WorkoutPlan, WorkoutDay, WorkoutExercise } from '../types';
import { generateId } from '../utils';
import { Plus, Trash2, Save, X, Search, Dumbbell, ChevronDown, ChevronUp } from 'lucide-react';

// Comprehensive Database of Exercises
const AVAILABLE_EXERCISES = [
  // PEITO
  { id: 'p1', name: 'Supino Reto (Barra)', muscle: 'Peito' },
  { id: 'p2', name: 'Supino Reto (Halteres)', muscle: 'Peito' },
  { id: 'p3', name: 'Supino Inclinado (Barra)', muscle: 'Peito' },
  { id: 'p4', name: 'Supino Inclinado (Halteres)', muscle: 'Peito' },
  { id: 'p5', name: 'Supino Declinado', muscle: 'Peito' },
  { id: 'p6', name: 'Crucifixo Reto', muscle: 'Peito' },
  { id: 'p7', name: 'Crucifixo Inclinado', muscle: 'Peito' },
  { id: 'p8', name: 'Crossover Polia Alta', muscle: 'Peito' },
  { id: 'p9', name: 'Crossover Polia Baixa', muscle: 'Peito' },
  { id: 'p10', name: 'Peck Deck / Voador', muscle: 'Peito' },
  { id: 'p11', name: 'Flexão de Braço', muscle: 'Peito' },
  { id: 'p12', name: 'Paralelas (Foco Peito)', muscle: 'Peito' },

  // COSTAS
  { id: 'c1', name: 'Puxada Frontal Aberta', muscle: 'Costas' },
  { id: 'c2', name: 'Puxada Triângulo', muscle: 'Costas' },
  { id: 'c3', name: 'Puxada Supinada', muscle: 'Costas' },
  { id: 'c4', name: 'Remada Curvada (Barra)', muscle: 'Costas' },
  { id: 'c5', name: 'Remada Curvada (Supinada)', muscle: 'Costas' },
  { id: 'c6', name: 'Remada Serrote (Unilateral)', muscle: 'Costas' },
  { id: 'c7', name: 'Remada Baixa (Triângulo)', muscle: 'Costas' },
  { id: 'c8', name: 'Remada Máquina', muscle: 'Costas' },
  { id: 'c9', name: 'Barra Fixa', muscle: 'Costas' },
  { id: 'c10', name: 'Levantamento Terra', muscle: 'Costas' },
  { id: 'c11', name: 'Pulldown (Polia)', muscle: 'Costas' },
  { id: 'c12', name: 'Crucifixo Inverso', muscle: 'Costas' },

  // PERNAS (Quadríceps, Posterior, Glúteo)
  { id: 'l1', name: 'Agachamento Livre', muscle: 'Pernas' },
  { id: 'l2', name: 'Agachamento Smith', muscle: 'Pernas' },
  { id: 'l3', name: 'Leg Press 45º', muscle: 'Pernas' },
  { id: 'l4', name: 'Leg Press Horizontal', muscle: 'Pernas' },
  { id: 'l5', name: 'Cadeira Extensora', muscle: 'Pernas' },
  { id: 'l6', name: 'Afundo / Passada', muscle: 'Pernas' },
  { id: 'l7', name: 'Agachamento Búlgaro', muscle: 'Pernas' },
  { id: 'l8', name: 'Agachamento Sumô', muscle: 'Pernas' },
  { id: 'l9', name: 'Stiff', muscle: 'Posterior' },
  { id: 'l10', name: 'Mesa Flexora', muscle: 'Posterior' },
  { id: 'l11', name: 'Cadeira Flexora', muscle: 'Posterior' },
  { id: 'l12', name: 'Flexora em Pé', muscle: 'Posterior' },
  { id: 'l13', name: 'Elevação Pélvica', muscle: 'Glúteo' },
  { id: 'l14', name: 'Cadeira Abdutora', muscle: 'Glúteo' },
  { id: 'l15', name: 'Cadeira Adutora', muscle: 'Pernas' },
  { id: 'l16', name: 'Panturrilha em Pé', muscle: 'Panturrilha' },
  { id: 'l17', name: 'Panturrilha Sentado', muscle: 'Panturrilha' },

  // OMBROS
  { id: 's1', name: 'Desenvolvimento Militar (Barra)', muscle: 'Ombros' },
  { id: 's2', name: 'Desenvolvimento Halteres', muscle: 'Ombros' },
  { id: 's3', name: 'Desenvolvimento Arnold', muscle: 'Ombros' },
  { id: 's4', name: 'Elevação Lateral', muscle: 'Ombros' },
  { id: 's5', name: 'Elevação Lateral Polia', muscle: 'Ombros' },
  { id: 's6', name: 'Elevação Frontal', muscle: 'Ombros' },
  { id: 's7', name: 'Remada Alta', muscle: 'Ombros' },
  { id: 's8', name: 'Face Pull', muscle: 'Ombros' },

  // BÍCEPS
  { id: 'b1', name: 'Rosca Direta (Barra)', muscle: 'Bíceps' },
  { id: 'b2', name: 'Rosca Direta (Halteres)', muscle: 'Bíceps' },
  { id: 'b3', name: 'Rosca Alternada', muscle: 'Bíceps' },
  { id: 'b4', name: 'Rosca Martelo', muscle: 'Bíceps' },
  { id: 'b5', name: 'Rosca Scott', muscle: 'Bíceps' },
  { id: 'b6', name: 'Rosca Concentrada', muscle: 'Bíceps' },
  { id: 'b7', name: 'Rosca Inclinada', muscle: 'Bíceps' },
  { id: 'b8', name: 'Rosca Polia Baixa', muscle: 'Bíceps' },

  // TRÍCEPS
  { id: 't1', name: 'Tríceps Polia (Barra)', muscle: 'Tríceps' },
  { id: 't2', name: 'Tríceps Corda', muscle: 'Tríceps' },
  { id: 't3', name: 'Tríceps Testa', muscle: 'Tríceps' },
  { id: 't4', name: 'Tríceps Francês', muscle: 'Tríceps' },
  { id: 't5', name: 'Tríceps Banco', muscle: 'Tríceps' },
  { id: 't6', name: 'Tríceps Coice', muscle: 'Tríceps' },
  { id: 't7', name: 'Paralelas (Foco Tríceps)', muscle: 'Tríceps' },

  // ABDÔMEN E CORE
  { id: 'a1', name: 'Abdominal Supra', muscle: 'Abdômen' },
  { id: 'a2', name: 'Abdominal Infra', muscle: 'Abdômen' },
  { id: 'a3', name: 'Abdominal Remador', muscle: 'Abdômen' },
  { id: 'a4', name: 'Prancha Isométrica', muscle: 'Abdômen' },
  { id: 'a5', name: 'Prancha Lateral', muscle: 'Abdômen' },
  { id: 'a6', name: 'Russian Twist', muscle: 'Abdômen' },
  { id: 'a7', name: 'Abdominal na Polia', muscle: 'Abdômen' },

  // CARDIO
  { id: 'car1', name: 'Esteira (Corrida)', muscle: 'Cardio' },
  { id: 'car2', name: 'Esteira (Caminhada Inclinada)', muscle: 'Cardio' },
  { id: 'car3', name: 'Bicicleta Ergométrica', muscle: 'Cardio' },
  { id: 'car4', name: 'Elíptico', muscle: 'Cardio' },
  { id: 'car5', name: 'Pular Corda', muscle: 'Cardio' },
];

const CreatePlan = () => {
  const navigate = useNavigate();
  const { addPlan } = useStore();
  
  const [planName, setPlanName] = useState('Meu Novo Treino');
  const [days, setDays] = useState<WorkoutDay[]>([
    { id: generateId(), name: 'Treino A', exercises: [] }
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDayId, setActiveDayId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = ['Todos', ...Array.from(new Set(AVAILABLE_EXERCISES.map(e => e.muscle)))];

  const handleAddDay = () => {
    setDays([...days, { id: generateId(), name: `Treino ${String.fromCharCode(65 + days.length)}`, exercises: [] }]);
  };

  const handleRemoveDay = (id: string) => {
    if (days.length === 1) return;
    setDays(days.filter(d => d.id !== id));
  };

  const handleDayNameChange = (id: string, newName: string) => {
    setDays(days.map(d => d.id === id ? { ...d, name: newName } : d));
  };

  // Logic to auto-suggest name based on muscles
  const updateDayNameAutomatically = (dayId: string, currentExercises: WorkoutExercise[]) => {
    const targetDay = days.find(d => d.id === dayId);
    if (!targetDay) return;

    // Only update if the name is still generic (starts with "Treino X") or empty
    const isGenericName = /^Treino\s[A-Z]$/.test(targetDay.name) || targetDay.name === '' || targetDay.name.startsWith("Treino");
    
    // We will update if it matches the pattern "Treino A" exactly OR if it was already an auto-generated name (contains " - ")
    const shouldUpdate = isGenericName || targetDay.name.includes(" - ");

    if (shouldUpdate && currentExercises.length > 0) {
        // Get unique muscles
        const muscles = Array.from(new Set(currentExercises.map(e => e.muscleGroup).filter(m => m !== undefined))) as string[];
        
        // Prioritize major groups or limit to top 2
        const displayMuscles = muscles.slice(0, 3).join(" e ");
        
        // Get the base letter (e.g. "Treino A")
        const baseName = targetDay.name.split(" - ")[0]; // Keep "Treino A" part
        
        if (displayMuscles) {
             const newName = `${baseName} - ${displayMuscles}`;
             setDays(prevDays => prevDays.map(d => d.id === dayId ? { ...d, name: newName } : d));
        }
    }
  };

  const openExerciseModal = (dayId: string) => {
    setActiveDayId(dayId);
    setIsModalOpen(true);
    setSearchTerm('');
    setSelectedCategory('Todos');
  };

  const addExerciseToDay = (exercise: typeof AVAILABLE_EXERCISES[0]) => {
    if (!activeDayId) return;

    const newExercise: WorkoutExercise = {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      muscleGroup: exercise.muscle,
      sets: 3,
      details: {
        reps: '10-12',
        weight: 0,
        restSeconds: 60
      },
      instructions: ['Execute com controle', 'Mantenha a postura'],
      notes: ''
    };

    setDays(prevDays => {
        const updatedDays = prevDays.map(d => {
            if (d.id === activeDayId) {
                return { ...d, exercises: [...d.exercises, newExercise] };
            }
            return d;
        });
        return updatedDays;
    });

    // Trigger auto-name update after state update logic (needs a timeout or separate effect, but here we construct the logic directly)
    const currentDay = days.find(d => d.id === activeDayId);
    if (currentDay) {
        const updatedExercises = [...currentDay.exercises, newExercise];
        updateDayNameAutomatically(activeDayId, updatedExercises);
    }

    setIsModalOpen(false);
  };

  const removeExercise = (dayId: string, exIndex: number) => {
    let updatedExercises: WorkoutExercise[] = [];
    setDays(prevDays => prevDays.map(d => {
      if (d.id === dayId) {
        updatedExercises = [...d.exercises];
        updatedExercises.splice(exIndex, 1);
        return { ...d, exercises: updatedExercises };
      }
      return d;
    }));

    // Update name on remove too
    if(updatedExercises.length >= 0) {
        updateDayNameAutomatically(dayId, updatedExercises);
    }
  };

  const updateExerciseDetails = (dayId: string, exIndex: number, field: string, value: any) => {
    setDays(days.map(d => {
      if (d.id === dayId) {
        const newExs = [...d.exercises];
        if (field === 'sets') {
            newExs[exIndex] = { ...newExs[exIndex], sets: parseInt(value) || 0 };
        } else if (field === 'reps') {
            newExs[exIndex] = { ...newExs[exIndex], details: { ...newExs[exIndex].details, reps: value } };
        } else if (field === 'rest') {
            newExs[exIndex] = { ...newExs[exIndex], details: { ...newExs[exIndex].details, restSeconds: parseInt(value) || 0 } };
        }
        return { ...d, exercises: newExs };
      }
      return d;
    }));
  };

  const handleSavePlan = () => {
    const newPlan: WorkoutPlan = {
      id: generateId(),
      name: planName,
      createdAt: new Date().toISOString(),
      isActive: true,
      days: days
    };
    addPlan(newPlan);
    navigate('/workouts');
  };

  const filteredExercises = AVAILABLE_EXERCISES.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ex.muscle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || ex.muscle === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-24">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <label className="text-sm text-neutral-400 block mb-1">Nome do Plano</label>
          <input 
            type="text" 
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            className="text-2xl md:text-3xl font-bold bg-transparent border-b border-neutral-700 focus:border-orange-500 outline-none text-white w-full md:w-96"
          />
        </div>
        <button 
          onClick={handleSavePlan}
          className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-900/20 hover:bg-orange-700 transition flex items-center gap-2"
        >
          <Save size={20} /> Salvar Plano
        </button>
      </header>

      <div className="space-y-6">
        {days.map((day, dayIndex) => (
          <div key={day.id} className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
            <div className="p-4 bg-neutral-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1 w-full">
                  <label className="text-xs text-neutral-500 uppercase font-bold tracking-wider mb-1 block">Nome do Dia (ex: Peito e Tríceps)</label>
                  <input 
                    type="text" 
                    value={day.name}
                    onChange={(e) => handleDayNameChange(day.id, e.target.value)}
                    className="w-full bg-transparent text-white font-bold text-lg outline-none border-b border-neutral-700 focus:border-orange-500 placeholder-neutral-600 transition"
                    placeholder="Nome do Treino"
                  />
              </div>
              <button onClick={() => handleRemoveDay(day.id)} className="text-neutral-500 hover:text-red-500 self-end md:self-center">
                <Trash2 size={18} />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {day.exercises.length === 0 ? (
                <div className="text-center py-6 text-neutral-500 text-sm border border-dashed border-neutral-800 rounded-lg">
                  Nenhum exercício adicionado.
                </div>
              ) : (
                day.exercises.map((ex, exIndex) => (
                  <div key={exIndex} className="bg-neutral-950 p-3 rounded-lg border border-neutral-800 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                         <span className="text-orange-500 font-bold text-sm">{exIndex + 1}.</span>
                         <h4 className="text-white font-medium">{ex.exerciseName}</h4>
                      </div>
                      <span className="text-xs text-neutral-500 ml-5">{ex.muscleGroup}</span>
                    </div>

                    <div className="flex items-center gap-3 ml-5 md:ml-0">
                      <div className="flex flex-col">
                        <label className="text-[10px] text-neutral-500">Séries</label>
                        <input 
                          type="number" 
                          value={ex.sets}
                          onChange={(e) => updateExerciseDetails(day.id, exIndex, 'sets', e.target.value)}
                          className="w-16 bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white text-sm text-center"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[10px] text-neutral-500">Reps</label>
                        <input 
                          type="text" 
                          value={ex.details.reps}
                          onChange={(e) => updateExerciseDetails(day.id, exIndex, 'reps', e.target.value)}
                          className="w-20 bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white text-sm text-center"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[10px] text-neutral-500">Descanso(s)</label>
                        <input 
                          type="number" 
                          value={ex.details.restSeconds}
                          onChange={(e) => updateExerciseDetails(day.id, exIndex, 'rest', e.target.value)}
                          className="w-16 bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white text-sm text-center"
                        />
                      </div>
                      <button 
                        onClick={() => removeExercise(day.id, exIndex)}
                        className="p-2 text-neutral-600 hover:text-red-500 mt-3"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}

              <button 
                onClick={() => openExerciseModal(day.id)}
                className="w-full py-3 border border-dashed border-neutral-700 rounded-lg text-neutral-400 hover:text-orange-500 hover:border-orange-500/50 transition flex items-center justify-center gap-2 text-sm"
              >
                <Plus size={16} /> Adicionar Exercício
              </button>
            </div>
          </div>
        ))}

        <button 
          onClick={handleAddDay}
          className="w-full py-4 bg-neutral-900 rounded-2xl border border-neutral-800 text-white font-medium hover:bg-neutral-800 transition flex items-center justify-center gap-2"
        >
          <Plus size={20} /> Adicionar Dia de Treino
        </button>
      </div>

      {/* Exercise Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 w-full max-w-md rounded-2xl border border-neutral-800 flex flex-col max-h-[85vh] shadow-2xl">
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Selecionar Exercício</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-neutral-500 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Buscar exercício..."
                  autoFocus
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-4 py-2 text-white outline-none focus:border-orange-500"
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap border transition ${
                            selectedCategory === cat 
                            ? 'bg-orange-600 text-white border-orange-600' 
                            : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:border-neutral-500'
                        }`}
                      >
                          {cat}
                      </button>
                  ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {filteredExercises.map(ex => (
                <button
                  key={ex.id}
                  onClick={() => addExerciseToDay(ex)}
                  className="w-full text-left p-3 hover:bg-neutral-800 rounded-lg flex items-center justify-between group transition border border-transparent hover:border-neutral-700"
                >
                  <span className="text-neutral-200 group-hover:text-white font-medium">{ex.name}</span>
                  <span className="text-xs text-neutral-500 bg-neutral-950 px-2 py-1 rounded border border-neutral-800">{ex.muscle}</span>
                </button>
              ))}
              {filteredExercises.length === 0 && (
                <div className="text-center text-neutral-500 py-8">
                    <Dumbbell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    Nenhum exercício encontrado.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePlan;