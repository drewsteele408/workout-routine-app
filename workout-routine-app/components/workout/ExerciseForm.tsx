import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Exercise } from '@/types/workout';
import React, { useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import uuid from 'react-native-uuid';

interface ExerciseFormProps {
  onSave: (exercise: Exercise) => void;
  onCancel: () => void;
  initialExercise?: Exercise;
}

export function ExerciseForm({ onSave, onCancel, initialExercise }: ExerciseFormProps) {
  const colorScheme = useColorScheme();
  const [name, setName] = useState(initialExercise?.name || '');
  const [sets, setSets] = useState(initialExercise?.sets.toString() || '3');
  const [reps, setReps] = useState(initialExercise?.reps.toString() || '10');
  const [weight, setWeight] = useState(initialExercise?.weight || '');
  const [rest, setRest] = useState(initialExercise?.rest?.toString() || '60');
  const [notes, setNotes] = useState(initialExercise?.notes || '');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Exercise name is required');
      return;
    }

    if (!sets.trim() || isNaN(Number(sets))) {
      Alert.alert('Error', 'Sets must be a valid number');
      return;
    }

    if (!reps.trim() || isNaN(Number(reps))) {
      Alert.alert('Error', 'Reps must be a valid number');
      return;
    }

    const exercise: Exercise = {
      id: initialExercise?.id || (uuid.v4() as string),
      name,
      sets: Number(sets),
      reps: Number(reps),
      weight: weight || undefined,
      rest: rest ? Number(rest) : undefined,
      notes: notes || undefined,
    };

    onSave(exercise);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        {initialExercise ? 'Edit Exercise' : 'Add Exercise'}
      </ThemedText>

      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Exercise Name *</ThemedText>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: Colors[colorScheme ?? 'light'].tint,
              color: Colors[colorScheme ?? 'light'].text,
            },
          ]}
          placeholder="e.g., Bench Press"
          placeholderTextColor={Colors[colorScheme ?? 'light'].text}
          value={name}
          onChangeText={setName}
          editable
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.formGroup, styles.half]}>
          <ThemedText style={styles.label}>Sets *</ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: Colors[colorScheme ?? 'light'].tint,
                color: Colors[colorScheme ?? 'light'].text,
              },
            ]}
            placeholder="3"
            placeholderTextColor={Colors[colorScheme ?? 'light'].text}
            value={sets}
            onChangeText={setSets}
            keyboardType="number-pad"
          />
        </View>

        <View style={[styles.formGroup, styles.half]}>
          <ThemedText style={styles.label}>Reps *</ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: Colors[colorScheme ?? 'light'].tint,
                color: Colors[colorScheme ?? 'light'].text,
              },
            ]}
            placeholder="10"
            placeholderTextColor={Colors[colorScheme ?? 'light'].text}
            value={reps}
            onChangeText={setReps}
            keyboardType="number-pad"
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.formGroup, styles.half]}>
          <ThemedText style={styles.label}>Weight (optional)</ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: Colors[colorScheme ?? 'light'].tint,
                color: Colors[colorScheme ?? 'light'].text,
              },
            ]}
            placeholder="e.g., 225 lbs"
            placeholderTextColor={Colors[colorScheme ?? 'light'].text}
            value={weight}
            onChangeText={setWeight}
          />
        </View>

        <View style={[styles.formGroup, styles.half]}>
          <ThemedText style={styles.label}>Rest (seconds)</ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: Colors[colorScheme ?? 'light'].tint,
                color: Colors[colorScheme ?? 'light'].text,
              },
            ]}
            placeholder="60"
            placeholderTextColor={Colors[colorScheme ?? 'light'].text}
            value={rest}
            onChangeText={setRest}
            keyboardType="number-pad"
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Notes (optional)</ThemedText>
        <TextInput
          style={[
            styles.input,
            styles.textarea,
            {
              borderColor: Colors[colorScheme ?? 'light'].tint,
              color: Colors[colorScheme ?? 'light'].text,
            },
          ]}
          placeholder="Add any notes..."
          placeholderTextColor={Colors[colorScheme ?? 'light'].text}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}>
          <ThemedText style={styles.buttonText}>Cancel</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: Colors[colorScheme ?? 'light'].tint },
          ]}
          onPress={handleSave}>
          <ThemedText style={[styles.buttonText, { color: '#fff' }]}>
            {initialExercise ? 'Update' : 'Add Exercise'}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  title: {
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  textarea: {
    textAlignVertical: 'top',
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cancelButton: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 14,
  },
});
