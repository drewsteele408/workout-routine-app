import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Exercise } from '@/types/workout';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface ExerciseCardProps {
  exercise: Exercise;
  onEdit: () => void;
  onDelete: () => void;
  index: number;
}

export function ExerciseCard({ exercise, onEdit, onDelete, index }: ExerciseCardProps) {
  const colorScheme = useColorScheme();

  return (
    <View
      style={[
        styles.card,
        {
          borderColor: Colors[colorScheme ?? 'light'].tint,
        },
      ]}>
      <View style={styles.exerciseHeader}>
        <View style={styles.exerciseNumber}>
          <ThemedText style={styles.numberText}>{index}</ThemedText>
        </View>
        <View style={styles.exerciseDetails}>
          <ThemedText type="subtitle">{exercise.name}</ThemedText>
          <ThemedText style={styles.stats}>
            {exercise.sets} sets × {exercise.reps} reps
            {exercise.weight ? ` @ ${exercise.weight}` : ''}
          </ThemedText>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: Colors[colorScheme ?? 'light'].tint },
          ]}
          onPress={onEdit}>
          <IconSymbol size={16} name="pencil" color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.deleteBtn]} onPress={onDelete}>
          <IconSymbol size={16} name="trash" color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  numberText: {
    fontWeight: 'bold',
    color: '#333',
  },
  exerciseDetails: {
    flex: 1,
  },
  stats: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {
    backgroundColor: '#ff4444',
  },
});
