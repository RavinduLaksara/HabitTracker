'use client';

import type React from 'react';
import {useState, useCallback} from 'react';
import {View, Text, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {ProgressChart} from '../../components/habits/ProgressChart';
import {HabitService} from '../../services/HabitService';
import type {Habit} from '../../types';
import {colors} from '../../styles/colors';
import {
  getTodayString,
  calculateProgress,
  getWeeklyProgress,
} from '../../utils/dateUtils';

export const ProgressScreen: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadHabits = useCallback(async () => {
    try {
      const loadedHabits = await HabitService.getInstance().getAllHabits();
      setHabits(loadedHabits);
    } catch (error) {
      console.error('Failed to load habits:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHabits();
    }, [loadHabits]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHabits();
    setRefreshing(false);
  };

  const today = getTodayString();
  const todayProgress = calculateProgress(habits, today);
  const weeklyData = getWeeklyProgress(habits);
  const completedToday = habits.filter(habit =>
    habit.completedDates.includes(today),
  ).length;
  const totalHabits = habits.length;

  const getMotivationalMessage = (progress: number): string => {
    if (progress === 100) return "Perfect day! You're on fire! 🔥";
    if (progress >= 80) return 'Amazing progress! Keep it up! 🌟';
    if (progress >= 60) return "Great job! You're doing well! 💪";
    if (progress >= 40) return 'Good start! Keep going! 🚀';
    if (progress > 0) return 'Every step counts! 👍';
    return 'Ready to start your day? 🌅';
  };

  const calculateStreak = (): number => {
    if (habits.length === 0) return 0;

    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateString = checkDate.toISOString().split('T')[0];

      const dayProgress = calculateProgress(habits, dateString);
      if (dayProgress >= 50) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const currentStreak = calculateStreak();
  const averageWeeklyProgress =
    weeklyData.reduce((sum, day) => sum + day, 0) / 7;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Progress Dashboard 📊</Text>
        <Text style={styles.subtitle}>Track your habit journey</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}>
        {/* Today's Progress */}
        <ProgressChart
          title="Today's Progress"
          percentage={todayProgress}
          subtitle={getMotivationalMessage(todayProgress)}
        />

        {/* Weekly Overview */}
        <ProgressChart
          title="Weekly Overview"
          percentage={Math.round(averageWeeklyProgress)}
          subtitle={`Average: ${Math.round(averageWeeklyProgress)}% this week`}
          weeklyData={weeklyData}
        />

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, {color: colors.primary}]}>
              {completedToday}
            </Text>
            <Text style={styles.statLabel}>Completed Today</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={[styles.statNumber, {color: colors.success}]}>
              {totalHabits}
            </Text>
            <Text style={styles.statLabel}>Total Habits</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={[styles.statNumber, {color: colors.warning}]}>
              {currentStreak}
            </Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>

        {/* Insights */}
        <View style={styles.insightsCard}>
          <Text style={styles.insightsTitle}>💡 Insights</Text>
          <Text style={styles.insightsText}>
            It takes an average of 66 days to form a new habit. You're{' '}
            {currentStreak} days into your journey!
          </Text>
          {todayProgress === 100 && (
            <Text
              style={[
                styles.insightsText,
                {color: colors.success, fontWeight: '600'},
              ]}>
              🎉 Perfect day! All habits completed!
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginVertical: 8,
    gap: 12,
  },
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  insightsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    margin: 16,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  insightsText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
});
