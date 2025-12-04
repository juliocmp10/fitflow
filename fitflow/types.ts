export type Goal = 'emagrecer' | 'hipertrofia' | 'resistencia' | 'forca';
export type Level = 'iniciante' | 'intermediario' | 'avancado';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password: string; // Stored in local storage for demo purposes
}

export interface UserProfile {
  name: string;
  goal: Goal;
  level: Level;
  daysPerWeek: number;
  equipment: string[];
  limitations: string;
  preferences: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
  videoUrl?: string; // Placeholder for video
  instructions: string[];
  commonMistakes: string[];
  difficulty: Level;
}

export interface SetDetails {
  reps: string; // Range e.g. "8-12"
  weight: number; // Suggested weight
  restSeconds: number;
}

export interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  muscleGroup?: string;
  sets: number;
  details: SetDetails;
  notes?: string;
  instructions?: string[];
  isCompleted?: boolean;
}

export interface WorkoutDay {
  id: string;
  name: string; // e.g., "Treino A - Peito e Tríceps"
  exercises: WorkoutExercise[];
}

export interface WorkoutPlan {
  id: string;
  name: string;
  createdAt: string;
  days: WorkoutDay[];
  isActive: boolean;
}

export interface WorkoutSession {
  id: string;
  planId: string;
  dayId: string;
  date: string;
  durationSeconds: number;
  totalVolume: number; // weight * reps * sets
  completedExercises: number;
  totalExercises: number;
  feedback?: string;
}

export interface UserState {
  registeredUsers: UserAccount[]; // List of all registered users
  currentUserEmail: string | null; // Track who is logged in
  profile: UserProfile | null;
  isAuthenticated: boolean;
  plans: WorkoutPlan[];
  sessions: WorkoutSession[];
  exerciseLibrary: Exercise[];
}