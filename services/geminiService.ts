import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserProfile, WorkoutPlan, WorkoutDay, WorkoutSession } from "../types";

// Initialize Gemini Client
// In a real production app, ensure API_KEY is handled securely via backend proxy.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const MODEL_NAME = 'gemini-2.5-flash';

// Schema for structured output
const workoutPlanSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    planName: { type: Type.STRING, description: "Nome criativo para o plano de treino" },
    days: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Nome DESCRITIVO do dia incluindo os músculos (ex: Treino A - Peito e Tríceps)" },
          exercises: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                exerciseName: { type: Type.STRING, description: "Nome padrão do exercício" },
                muscleGroup: { type: Type.STRING, description: "Grupo muscular principal" },
                sets: { type: Type.INTEGER },
                reps: { type: Type.STRING, description: "Faixa de repetições (ex: 8-12)" },
                restSeconds: { type: Type.INTEGER, description: "Tempo de descanso em segundos" },
                notes: { type: Type.STRING, description: "Dica curta de execução" },
                instructions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 passos simples de execução" }
              },
              required: ["exerciseName", "muscleGroup", "sets", "reps", "restSeconds", "instructions"]
            }
          }
        },
        required: ["name", "exercises"]
      }
    }
  },
  required: ["planName", "days"]
};

export const generateWorkoutPlan = async (profile: UserProfile): Promise<Partial<WorkoutPlan> | null> => {
  if (!process.env.API_KEY) {
    console.error("API Key missing");
    throw new Error("API Key is missing. Please configure it.");
  }

  const prompt = `
    Atue como um treinador físico de elite e fisiologista.
    Crie um plano de treino completo para o seguinte perfil de aluno:
    - Objetivo: ${profile.goal}
    - Nível: ${profile.level}
    - Disponibilidade: ${profile.daysPerWeek} dias por semana
    - Equipamentos: ${profile.equipment.join(", ")}
    - Limitações/Lesões: ${profile.limitations || "Nenhuma"}
    - Preferências: ${profile.preferences || "Nenhuma"}

    REGRAS DE OURO:
    1. O nome de cada dia de treino (propriedade 'name') DEVE descrever explicitamente o foco muscular.
       Exemplo CORRETO: "Treino A - Peito e Ombros", "Treino B - Pernas Completo", "Treino C - Costas e Bíceps".
       Exemplo INCORRETO: "Treino A", "Dia 1".
    2. O treino deve ser periodizado corretamente, com volume adequado ao nível.
    
    Responda EXCLUSIVAMENTE com o JSON estruturado conforme o schema solicitado.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: workoutPlanSchema,
        temperature: 0.4, // Lower temperature for more consistent structured data
      }
    });

    const text = response.text;
    if (!text) return null;

    const data = JSON.parse(text);

    // Transform API response to our internal WorkoutPlan type
    const newPlan: Partial<WorkoutPlan> = {
      id: crypto.randomUUID(),
      name: data.planName,
      createdAt: new Date().toISOString(),
      isActive: true,
      days: data.days.map((day: any, index: number) => ({
        id: `day-${index}-${crypto.randomUUID()}`,
        name: day.name,
        exercises: day.exercises.map((ex: any, i: number) => ({
          exerciseId: `ex-${i}-${crypto.randomUUID()}`, // In a real app, map to DB ID
          exerciseName: ex.exerciseName,
          muscleGroup: ex.muscleGroup,
          sets: ex.sets,
          details: {
            reps: ex.reps,
            weight: 0, // User sets weight later
            restSeconds: ex.restSeconds
          },
          notes: ex.notes,
          instructions: ex.instructions // Storing instructions here for simplicity
        }))
      }))
    };

    return newPlan;

  } catch (error) {
    console.error("Erro ao gerar treino:", error);
    throw error;
  }
};

export const adjustWorkoutSuggestion = async (
  currentPlan: WorkoutPlan,
  history: WorkoutSession[]
): Promise<string> => {
   // Function to generate a text suggestion for progression
   if (!process.env.API_KEY) return "Configure a API Key para receber sugestões.";

   const prompt = `
    Analise o progresso recente do aluno.
    Plano atual: ${currentPlan.name}.
    Últimas sessões: ${history.length} treinos realizados.
    Sugira uma progressão de carga ou mudança de volume breve (máx 2 frases).
   `;

   try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text || "Continue o bom trabalho!";
   } catch (e) {
     return "Mantenha a constância!";
   }
};