import type {Habit, HabitCompletion} from '../types';
import {AsyncStorageService} from './AsyncStorageService';
import {formatDate} from '../utils/dateUtils';

class HabitService {
  private static instance: HabitService;

  static getInstance(): HabitService {
    if (!HabitService.instance) {
      HabitService.instance = new HabitService();
    }
    return HabitService.instance;
  }

  async createHabit(
    name: string,
    frequency: 'daily' | 'weekly',
    userId: string,
  ): Promise<Habit> {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      frequency,
      userId,
      createdAt: new Date().toISOString(),
      completedDates: [],
    };

    const habits = await this.getAllHabits();
    habits.push(newHabit);
    await AsyncStorageService.setItem('@all_habits', JSON.stringify(habits));

    return newHabit;
  }

  async getAllHabits(): Promise<Habit[]> {
    try {
      const habitsString = await AsyncStorageService.getItem('@all_habits');
      return habitsString ? JSON.parse(habitsString) : [];
    } catch {
      return [];
    }
  }

  async getUserHabits(userId: string): Promise<Habit[]> {
    const allHabits = await this.getAllHabits();
    return allHabits.filter(habit => habit.userId === userId);
  }

  async toggleHabitCompletion(habitId: string, date: string): Promise<void> {
    const habits = await this.getAllHabits();
    const habitIndex = habits.findIndex(h => h.id === habitId);

    if (habitIndex !== -1) {
      const habit = habits[habitIndex];
      const dateIndex = habit.completedDates.indexOf(date);

      if (dateIndex > -1) {
        // Remove the date (unmark as completed)
        habit.completedDates.splice(dateIndex, 1);
      } else {
        // Add the date (mark as completed)
        habit.completedDates.push(date);
      }

      habits[habitIndex] = habit;
      await AsyncStorageService.setItem('@all_habits', JSON.stringify(habits));
    }
  }

  async deleteHabit(habitId: string): Promise<void> {
    const habits = await this.getAllHabits();
    const filteredHabits = habits.filter(h => h.id !== habitId);
    await AsyncStorageService.setItem(
      '@all_habits',
      JSON.stringify(filteredHabits),
    );
  }

  async markHabitComplete(habitId: string): Promise<void> {
    const today = formatDate(new Date());
    await this.toggleHabitCompletion(habitId, today);
  }

  async unmarkHabitComplete(habitId: string): Promise<void> {
    const today = formatDate(new Date());
    await this.toggleHabitCompletion(habitId, today);
  }

  async getAllCompletions(): Promise<HabitCompletion[]> {
    try {
      const completionsString = await AsyncStorageService.getItem(
        '@habit_completions',
      );
      return completionsString ? JSON.parse(completionsString) : [];
    } catch {
      return [];
    }
  }
}

// Export both the class and a default instance
export {HabitService};
export default HabitService;
