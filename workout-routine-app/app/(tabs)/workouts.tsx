import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useWorkout } from '@/context/WorkoutContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { WorkoutRoutine } from '@/types/workout';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import uuid from 'react-native-uuid';

export default function WorkoutsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { routines, addRoutine, deleteRoutine } = useWorkout();
  const [showForm, setShowForm] = useState(false);
  const [workoutName, setWorkoutName] = useState('');

  const handleCreateRoutine = () => {
    if (!workoutName.trim()) {
      Alert.alert('Error', 'Please enter a workout routine name');
      return;
    }

    const newRoutine: WorkoutRoutine = {
      id: uuid.v4() as string,
      name: workoutName,
      description: '',
      exercises: [],
      created: new Date(),
      lastModified: new Date(),
    };

    addRoutine(newRoutine);
    setWorkoutName('');
    setShowForm(false);
    Alert.alert('Success', `"${workoutName}" created! Add exercises to it.`);
  };

  const handleDeleteRoutine = (id: string, name: string) => {
    Alert.alert(
      'Delete Routine',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            deleteRoutine(id);
            Alert.alert('Deleted', 'Routine removed');
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText type="title">My Workouts</ThemedText>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: Colors[colorScheme ?? 'light'].tint },
            ]}
            onPress={() => setShowForm(!showForm)}>
            <ThemedText style={styles.buttonText}>
              {showForm ? 'Cancel' : '+ New Routine'}
            </ThemedText>
          </TouchableOpacity>
        </View>

        {showForm && (
          <View style={styles.formContainer}>
            <ThemedText style={styles.label}>Routine Name</ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: Colors[colorScheme ?? 'light'].tint,
                  color: Colors[colorScheme ?? 'light'].text,
                },
              ]}
              placeholder="Enter routine name..."
              placeholderTextColor={Colors[colorScheme ?? 'light'].text}
              value={workoutName}
              onChangeText={setWorkoutName}
            />

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: Colors[colorScheme ?? 'light'].tint },
              ]}
              onPress={handleCreateRoutine}>
              <ThemedText style={styles.buttonText}>Create Routine</ThemedText>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.routinesList}>
          {routines.length === 0 ? (
            <ThemedText style={styles.emptyText}>
              No workouts yet. Create your first routine!
            </ThemedText>
          ) : (
            routines.map((routine) => (
              <View
                key={routine.id}
                style={[
                  styles.routineCard,
                  {
                    borderColor: Colors[colorScheme ?? 'light'].tint,
                  },
                ]}>
                <View style={styles.routineInfo}>
                  <ThemedText type="subtitle">{routine.name}</ThemedText>
                  <ThemedText style={styles.exerciseCount}>
                    {routine.exercises.length} exercises
                  </ThemedText>
                </View>

                <View style={styles.routineActions}>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      { backgroundColor: Colors[colorScheme ?? 'light'].tint },
                    ]}
                    onPress={() => router.push({ pathname: './workout-detail', params: { id: routine.id } })}>
                    <ThemedText style={styles.actionButtonText}>Edit</ThemedText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteRoutine(routine.id, routine.name)}>
                    <ThemedText style={styles.deleteButtonText}>Delete</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
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
    marginTop: 50,
  },
  header: {
    marginBottom: 24,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  formContainer: {
    marginBottom: 24,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    justifyContent: 'center',
  },
  routinesList: {
    gap: 12,
    marginBottom: 24,
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 40,
    opacity: 0.6,
  },
  routineCard: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routineInfo: {
    flex: 1,
  },
  exerciseCount: {
    marginTop: 4,
    opacity: 0.7,
    fontSize: 12,
  },
  routineActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
