import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ExerciseCard } from '@/components/workout/ExerciseCard';
import { ExerciseForm } from '@/components/workout/ExerciseForm';
import { Colors } from '@/constants/theme';
import { useWorkout } from '@/context/WorkoutContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Exercise, WorkoutRoutine } from '@/types/workout';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function WorkoutDetailScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { id } = useLocalSearchParams();
  const { getRoutineById, updateRoutine } = useWorkout();

  const [routine, setRoutine] = useState<WorkoutRoutine | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    if (id && typeof id === 'string') {
      const foundRoutine = getRoutineById(id);
      if (foundRoutine) {
        setRoutine(foundRoutine);
      }
    }
  }, [id, getRoutineById]);

  const handleAddExercise = (exercise: Exercise) => {
    if (!routine) return;

    const updatedExercises = [...routine.exercises];
    const existingIndex = updatedExercises.findIndex((e) => e.id === exercise.id);

    if (existingIndex >= 0) {
      updatedExercises[existingIndex] = exercise;
    } else {
      updatedExercises.push(exercise);
    }

    const updatedRoutine: WorkoutRoutine = {
      ...routine,
      exercises: updatedExercises,
      lastModified: new Date(),
    };

    setRoutine(updatedRoutine);
    updateRoutine(routine.id, updatedRoutine);
    setShowForm(false);
    setEditingExercise(null);

    Alert.alert('Success', 'Exercise added to routine!');
  };

  const handleDeleteExercise = (exerciseId: string) => {
    if (!routine) return;

    Alert.alert('Delete Exercise', 'Remove this exercise?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Delete',
        onPress: () => {
          const updatedExercises = routine.exercises.filter((e) => e.id !== exerciseId);
          const updatedRoutine: WorkoutRoutine = {
            ...routine,
            exercises: updatedExercises,
            lastModified: new Date(),
          };

          setRoutine(updatedRoutine);
          updateRoutine(routine.id, updatedRoutine);
        },
        style: 'destructive',
      },
    ]);
  };

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setShowForm(true);
  };

  if (!routine) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ThemedText style={styles.backButton}>← Back</ThemedText>
          </TouchableOpacity>
          <ThemedText type="title">{routine.name}</ThemedText>
        </View>

        {routine.description && (
          <ThemedText style={styles.description}>{routine.description}</ThemedText>
        )}

        <View style={styles.stats}>
          <ThemedText style={styles.statText}>
            {routine.exercises.length} exercises
          </ThemedText>
        </View>

        {showForm && (
          <ExerciseForm
            onSave={handleAddExercise}
            onCancel={() => {
              setShowForm(false);
              setEditingExercise(null);
            }}
            initialExercise={editingExercise || undefined}
          />
        )}

        {!showForm && (
          <TouchableOpacity
            style={[
              styles.addButton,
              { backgroundColor: Colors[colorScheme ?? 'light'].tint },
            ]}
            onPress={() => {
              setEditingExercise(null);
              setShowForm(true);
            }}>
            <ThemedText style={styles.addButtonText}>+ Add Exercise</ThemedText>
          </TouchableOpacity>
        )}

        <View style={styles.exercisesList}>
          {routine.exercises.length === 0 ? (
            <ThemedText style={styles.emptyText}>No exercises yet. Add one to get started!</ThemedText>
          ) : (
            routine.exercises.map((exercise, index) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                index={index + 1}
                onEdit={() => handleEditExercise(exercise)}
                onDelete={() => handleDeleteExercise(exercise.id)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    marginTop: 50
  },
  header: {
    marginBottom: 12,
  },
  backButton: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  description: {
    opacity: 0.7,
    marginBottom: 12,
  },
  stats: {
    marginBottom: 16,
  },
  statText: {
    fontSize: 14,
    opacity: 0.6,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  exercisesList: {
    gap: 8,
    paddingBottom: 24,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.6,
    marginVertical: 40,
  },
});
