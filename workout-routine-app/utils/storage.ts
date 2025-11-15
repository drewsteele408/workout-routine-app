import { WorkoutRoutine } from '@/types/workout';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@workout_routines';

/**
 * Save all workout routines to device storage
 */
export async function saveRoutines(routines: WorkoutRoutine[]): Promise<void> {
  try {
    // Convert dates to ISO strings for storage
    const serializedRoutines = routines.map((routine) => ({
      ...routine,
      created: routine.created instanceof Date ? routine.created.toISOString() : routine.created,
      lastModified: routine.lastModified instanceof Date ? routine.lastModified.toISOString() : routine.lastModified,
    }));
    
    const jsonString = JSON.stringify(serializedRoutines);
    await AsyncStorage.setItem(STORAGE_KEY, jsonString);
  } catch (error) {
    console.error('Error saving routines:', error);
    throw error;
  }
}

/**
 * Load all workout routines from device storage
 */
export async function loadRoutines(): Promise<WorkoutRoutine[]> {
  try {
    const jsonString = await AsyncStorage.getItem(STORAGE_KEY);
    
    if (!jsonString) {
      return [];
    }
    
    const routines = JSON.parse(jsonString);
    
    // Convert ISO strings back to Date objects
    return routines.map((routine: any) => ({
      ...routine,
      created: new Date(routine.created),
      lastModified: new Date(routine.lastModified),
    }));
  } catch (error) {
    console.error('Error loading routines:', error);
    return [];
  }
}

/**
 * Clear all workout routines from storage
 */
export async function clearRoutines(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing routines:', error);
    throw error;
  }
}
