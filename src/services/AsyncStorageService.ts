import AsyncStorage from '@react-native-async-storage/async-storage';
import type {User} from '../types';

const KEYS = {
  USER: '@habit_tracker_user',
  HABITS: '@habit_tracker_habits',
};

export class AsyncStorageService {
  // User methods
  static async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  static async getUser(): Promise<User | null> {
    try {
      const userString = await AsyncStorage.getItem(KEYS.USER);
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  static async removeUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.USER);
    } catch (error) {
      console.error('Error removing user:', error);
      throw error;
    }
  }

  // Generic methods for any key-value storage
  static async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
      throw error;
    }
  }

  static async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
      throw error;
    }
  }

  // Habits methods
  static async saveHabits(habits: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.HABITS, JSON.stringify(habits));
    } catch (error) {
      console.error('Error saving habits:', error);
      throw error;
    }
  }

  static async getHabits(): Promise<any[]> {
    try {
      const habitsString = await AsyncStorage.getItem(KEYS.HABITS);
      return habitsString ? JSON.parse(habitsString) : [];
    } catch (error) {
      console.error('Error getting habits:', error);
      return [];
    }
  }

  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([KEYS.USER, KEYS.HABITS]);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }
}

// Default export for backward compatibility
export default AsyncStorageService;
