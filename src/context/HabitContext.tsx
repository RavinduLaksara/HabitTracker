'use client';

import type React from 'react';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import HabitService from '../services/HabitService';
import type {Habit, HabitCompletion, HabitContextType} from '../types';
import {useAuth} from './AuthContext';

const HabitContext = createContext<HabitContextType | undefined>(undefined);

interface HabitProviderProps {
  children: ReactNode;
}

export const HabitProvider: React.FC<HabitProviderProps> = ({children}) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const {user} = useAuth();
  const habitService = HabitService.getInstance();

  const refreshData = useCallback(async () => {
    if (!user) return;

    try {
      const userHabits = await habitService.getUserHabits(user.id);
      const allCompletions = await habitService.getAllCompletions();
      setHabits(userHabits);
      setCompletions(allCompletions);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  }, [user, habitService]);

  useEffect(() => {
    if (user) {
      refreshData();
    } else {
      setHabits([]);
      setCompletions([]);
    }
  }, [user, refreshData]);

  const addHabit = async (
    name: string,
    frequency: 'daily' | 'weekly',
  ): Promise<void> => {
    if (!user) return;

    try {
      const newHabit = await habitService.createHabit(name, frequency, user.id);
      setHabits(prev => [...prev, newHabit]);
    } catch (error) {
      console.error('Error adding habit:', error);
      throw error;
    }
  };

  const markHabitComplete = async (habitId: string): Promise<void> => {
    try {
      await habitService.markHabitComplete(habitId);
      await refreshData();
    } catch (error) {
      console.error('Error marking habit complete:', error);
      throw error;
    }
  };

  const unmarkHabitComplete = async (habitId: string): Promise<void> => {
    try {
      await habitService.unmarkHabitComplete(habitId);
      await refreshData();
    } catch (error) {
      console.error('Error unmarking habit complete:', error);
      throw error;
    }
  };

  const getHabitCompletions = (habitId: string): HabitCompletion[] => {
    return completions.filter(completion => completion.habitId === habitId);
  };

  const getTodayProgress = (): number => {
    if (!user) return 0;

    const dailyHabits = habits.filter(habit => habit.frequency === 'daily');
    if (dailyHabits.length === 0) return 0;

    const today = new Date().toISOString().split('T')[0];
    const completedToday = dailyHabits.filter(habit =>
      completions.some(
        completion =>
          completion.habitId === habit.id && completion.date === today,
      ),
    );

    return Math.round((completedToday.length / dailyHabits.length) * 100);
  };

  const getWeeklyProgress = (): number => {
    if (!user || habits.length === 0) return 0;

    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));

    const thisWeekCompletions = completions.filter(completion => {
      const completionDate = new Date(completion.date);
      return completionDate >= startOfWeek && completionDate <= endOfWeek;
    });

    const totalPossibleCompletions = habits.length * 7;
    return Math.round(
      (thisWeekCompletions.length / totalPossibleCompletions) * 100,
    );
  };

  const getHabitStreak = (habitId: string): number => {
    const habitCompletions = getHabitCompletions(habitId);
    if (habitCompletions.length === 0) return 0;

    const sortedDates = habitCompletions
      .map(completion => completion.date)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const dateString of sortedDates) {
      const completionDate = new Date(dateString);
      completionDate.setHours(0, 0, 0, 0);

      const diffTime = currentDate.getTime() - completionDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) {
        streak++;
        currentDate = new Date(completionDate);
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const value: HabitContextType = {
    habits,
    completions,
    addHabit,
    markHabitComplete,
    unmarkHabitComplete,
    getHabitCompletions,
    getTodayProgress,
    getWeeklyProgress,
    getHabitStreak,
    refreshData,
  };

  return (
    <HabitContext.Provider value={value}>{children}</HabitContext.Provider>
  );
};

export const useHabits = (): HabitContextType => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};
