import React, { useState } from 'react';
import { Search } from 'lucide-react';

// Using the same extended list logic as CreatePlan for consistency
const EXERCISES_MOCK = [
  // PEITO
  { id: 'p1', name: 'Supino Reto (Barra)', group: 'Peito', diff: 'Intermediário' },
  { id: 'p2', name: 'Supino Reto (Halteres)', group: 'Peito', diff: 'Intermediário' },
  { id: 'p3', name: 'Supino Inclinado (Barra)', group: 'Peito', diff: 'Intermediário' },
  { id: 'p4', name: 'Supino Inclinado (Halteres)', group: 'Peito', diff: 'Intermediário' },
  { id: 'p5', name: 'Supino Declinado', group: 'Peito', diff: 'Intermediário' },
  { id: 'p6', name: 'Crucifixo Reto', group: 'Peito', diff: 'Iniciante' },
  { id: 'p8', name: 'Crossover Polia Alta', group: 'Peito', diff: 'Avancado' },
  { id: 'p10', name: 'Peck Deck / Voador', group: 'Peito', diff: 'Iniciante' },
  { id: 'p11', name: 'Flexão de Braço', group: 'Peito', diff: 'Iniciante' },

  // COSTAS
  { id: 'c1', name: 'Puxada Frontal Aberta', group: 'Costas', diff: 'Iniciante' },
  { id: 'c2', name: 'Puxada Triângulo', group: 'Costas', diff: 'Iniciante' },
  { id: 'c4', name: 'Remada Curvada (Barra)', group: 'Costas', diff: 'Avançado' },
  { id: 'c6', name: 'Remada Serrote (Unilateral)', group: 'Costas', diff: 'Intermediário' },
  { id: 'c7', name: 'Remada Baixa (Triângulo)', group: 'Costas', diff: 'Iniciante' },
  { id: 'c9', name: 'Barra Fixa', group: 'Costas', diff: 'Avançado' },
  { id: 'c10', name: 'Levantamento Terra', group: 'Costas', diff: 'Avançado' },

  // PERNAS
  { id: 'l1', name: 'Agachamento Livre', group: 'Pernas', diff: 'Avançado' },
  { id: 'l3', name: 'Leg Press 45º', group: 'Pernas', diff: 'Intermediário' },
  { id: 'l5', name: 'Cadeira Extensora', group: 'Pernas', diff: 'Iniciante' },
  { id: 'l6', name: 'Afundo / Passada', group: 'Pernas', diff: 'Intermediário' },
  { id: 'l7', name: 'Agachamento Búlgaro', group: 'Pernas', diff: 'Avançado' },
  { id: 'l9', name: 'Stiff', group: 'Posterior', diff: 'Intermediário' },
  { id: 'l10', name: 'Mesa Flexora', group: 'Posterior', diff: 'Iniciante' },
  { id: 'l13', name: 'Elevação Pélvica', group: 'Glúteo', diff: 'Intermediário' },
  { id: 'l16', name: 'Panturrilha em Pé', group: 'Panturrilha', diff: 'Iniciante' },

  // OMBROS
  { id: 's1', name: 'Desenvolvimento Militar', group: 'Ombros', diff: 'Intermediário' },
  { id: 's2', name: 'Desenvolvimento Halteres', group: 'Ombros', diff: 'Iniciante' },
  { id: 's4', name: 'Elevação Lateral', group: 'Ombros', diff: 'Iniciante' },
  { id: 's6', name: 'Elevação Frontal', group: 'Ombros', diff: 'Iniciante' },

  // BÍCEPS & TRÍCEPS
  { id: 'b1', name: 'Rosca Direta (Barra)', group: 'Bíceps', diff: 'Iniciante' },
  { id: 'b4', name: 'Rosca Martelo', group: 'Bíceps', diff: 'Iniciante' },
  { id: 't1', name: 'Tríceps Polia', group: 'Tríceps', diff: 'Iniciante' },
  { id: 't2', name: 'Tríceps Corda', group: 'Tríceps', diff: 'Iniciante' },
  { id: 't3', name: 'Tríceps Testa', group: 'Tríceps', diff: 'Intermediário' },
  { id: 't7', name: 'Paralelas', group: 'Tríceps', diff: 'Avançado' },

  // ABD
  { id: 'a1', name: 'Abdominal Supra', group: 'Abdômen', diff: 'Iniciante' },
  { id: 'a4', name: 'Prancha', group: 'Abdômen', diff: 'Intermediário' },
  { id: 'car1', name: 'Esteira', group: 'Cardio', diff: 'Iniciante' },
];

const ExerciseLibrary = () => {
  const [term, setTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('Todos');

  const groups = ['Todos', ...Array.from(new Set(EXERCISES_MOCK.map(e => e.group)))];

  const filtered = EXERCISES_MOCK.filter(ex => {
    const matchesTerm = ex.name.toLowerCase().includes(term.toLowerCase()) || 
                        ex.group.toLowerCase().includes(term.toLowerCase());
    const matchesGroup = selectedGroup === 'Todos' || ex.group === selectedGroup;
    return matchesTerm && matchesGroup;
  });

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Biblioteca de Exercícios</h1>
      
      <div className="mb-6 space-y-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Buscar exercício..."
            className="w-full pl-10 pr-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-white placeholder-neutral-500"
            value={term}
            onChange={e => setTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-3.5 text-neutral-500 w-5 h-5" />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {groups.map(group => (
                <button
                    key={group}
                    onClick={() => setSelectedGroup(group)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition border ${
                        selectedGroup === group 
                        ? 'bg-orange-600 text-white border-orange-600' 
                        : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                    }`}
                >
                    {group}
                </button>
            ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(ex => (
          <div key={ex.id} className="bg-neutral-900 p-4 rounded-xl shadow-sm border border-neutral-800 flex gap-4 hover:border-orange-900 transition cursor-pointer group">
            <div className="w-20 h-20 bg-neutral-800 rounded-lg shrink-0 overflow-hidden">
               <img src={`https://picsum.photos/200?random=${ex.id}`} alt={ex.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-200 group-hover:text-orange-500 transition">{ex.name}</h3>
              <p className="text-sm text-neutral-500">{ex.group}</p>
              <span className={`inline-block mt-2 text-xs px-2 py-1 rounded border ${
                  ex.diff === 'Iniciante' ? 'bg-green-900/30 text-green-400 border-green-900' :
                  ex.diff === 'Intermediário' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-900' :
                  'bg-red-900/30 text-red-400 border-red-900'
              }`}>
                {ex.diff}
              </span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
            <div className="col-span-full text-center py-8 text-neutral-500">
                Nenhum exercício encontrado.
            </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseLibrary;