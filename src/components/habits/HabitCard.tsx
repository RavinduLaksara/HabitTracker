'use client';

import type React from 'react';
import {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Animated} from 'react-native';
import type {Habit} from '../../types';
import {colors} from '../../styles/colors';
import {getTodayString, getStreakCount} from '../../utils/dateUtils';

interface HabitCardProps {
  habit: Habit;
  onToggleComplete: (habitId: string) => void;
  onDelete?: (habitId: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onToggleComplete,
  onDelete,
}) => {
  const today = getTodayString();
  const isCompleted = habit.completedDates.includes(today);
  const [scaleValue] = useState(new Animated.Value(1));

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 3,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onToggleComplete(habit.id);
  };

  const streak = getStreakCount(habit);

  const getFrequencyIcon = () => {
    return habit.frequency === 'daily' ? '🌅' : '📅';
  };

  const getStreakIcon = () => {
    if (streak >= 30) return '🏆';
    if (streak >= 14) return '🔥';
    if (streak >= 7) return '⚡';
    if (streak >= 3) return '✨';
    return '💫';
  };

  return (
    <Animated.View
      style={[styles.container, {transform: [{scale: scaleValue}]}]}>
      <View
        style={[
          styles.card,
          {borderLeftColor: isCompleted ? colors.success : colors.primary},
        ]}>
        <View style={styles.content}>
          <View style={styles.habitInfo}>
            <View style={styles.habitHeader}>
              <Text style={styles.habitName}>{habit.name}</Text>
              {isCompleted && (
                <View
                  style={[
                    styles.completedBadge,
                    {backgroundColor: colors.success},
                  ]}>
                  <Text style={styles.completedText}>✓</Text>
                </View>
              )}
            </View>

            <View style={styles.habitDetails}>
              <Text style={styles.frequency}>
                {getFrequencyIcon()}{' '}
                {habit.frequency.charAt(0).toUpperCase() +
                  habit.frequency.slice(1)}
              </Text>
              {streak > 0 && (
                <Text style={styles.streak}>
                  {getStreakIcon()} {streak} day streak
                </Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.checkButton,
              {
                backgroundColor: isCompleted
                  ? colors.success
                  : colors.background,
                borderColor: isCompleted ? colors.success : colors.primary,
              },
            ]}
            onPress={handlePress}
            activeOpacity={0.8}>
            <Text
              style={[
                styles.checkIcon,
                {color: isCompleted ? colors.surface : colors.primary},
              ]}>
              {isCompleted ? '✓' : '○'}
            </Text>
          </TouchableOpacity>
        </View>

        {onDelete && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(habit.id)}>
            <Text style={styles.deleteIcon}>🗑️</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    marginHorizontal: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderLeftWidth: 4,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  habitInfo: {
    flex: 1,
  },
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  habitName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  completedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  completedText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: 'bold',
  },
  habitDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  frequency: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  streak: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  checkButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginLeft: 12,
  },
  checkIcon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
  deleteIcon: {
    fontSize: 16,
  },
});
