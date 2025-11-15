import { WorkoutRoutine } from '@/types/workout';
import { loadRoutines, saveRoutines } from '@/utils/storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface WorkoutContextType {
  routines: WorkoutRoutine[];
  addRoutine: (routine: WorkoutRoutine) => void;
  updateRoutine: (id: string, routine: WorkoutRoutine) => void;
  deleteRoutine: (id: string) => void;
  getRoutineById: (id: string) => WorkoutRoutine | undefined;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [routines, setRoutines] = useState<WorkoutRoutine[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load routines from storage when app starts
  useEffect(() => {
    const initializeRoutines = async () => {
      try {
        const savedRoutines = await loadRoutines();
        setRoutines(savedRoutines);
      } catch (error) {
        console.error('Failed to load routines:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    initializeRoutines();
  }, []);

  // Save routines to storage whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveRoutines(routines);
    }
  }, [routines, isLoaded]);

  const addRoutine = (routine: WorkoutRoutine) => {
    setRoutines((prev) => [...prev, routine]);
  };

  const updateRoutine = (id: string, updatedRoutine: WorkoutRoutine) => {
    setRoutines((prev) =>
      prev.map((routine) => (routine.id === id ? updatedRoutine : routine))
    );
  };

  const deleteRoutine = (id: string) => {
    setRoutines((prev) => prev.filter((routine) => routine.id !== id));
  };

  const getRoutineById = (id: string): WorkoutRoutine | undefined => {
    return routines.find((routine) => routine.id === id);
  };

  const value: WorkoutContextType = {
    routines,
    addRoutine,
    updateRoutine,
    deleteRoutine,
    getRoutineById,
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
}
