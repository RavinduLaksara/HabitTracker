import type {User} from '../types';
import {AsyncStorageService} from './AsyncStorageService';

interface AuthResult {
  success: boolean;
  user?: User;
  message?: string;
}

class AuthService {
  private static instance: AuthService;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(email: string, password: string): Promise<AuthResult> {
    try {
      // In a real app, this would make an API call
      // For now, we'll simulate with stored users
      const users = await this.getAllUsers();
      const user = users.find(
        u => u.email === email && u.password === password,
      );

      if (user) {
        await AsyncStorageService.saveUser(user);
        return {success: true, user};
      }

      return {success: false, message: 'Invalid credentials'};
    } catch (error) {
      return {success: false, message: 'Login failed'};
    }
  }

  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<AuthResult> {
    try {
      const users = await this.getAllUsers();

      // Check if user already exists
      if (users.find(u => u.email === email)) {
        return {success: false, message: 'User already exists'};
      }

      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        password,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      await this.saveAllUsers(users);
      await AsyncStorageService.saveUser(newUser);

      return {success: true, user: newUser};
    } catch (error) {
      return {success: false, message: 'Registration failed'};
    }
  }

  async logout(): Promise<void> {
    await AsyncStorageService.removeUser();
  }

  async getCurrentUser(): Promise<User | null> {
    return await AsyncStorageService.getUser();
  }

  private async getAllUsers(): Promise<User[]> {
    try {
      const usersString = await AsyncStorageService.getItem('@all_users');
      return usersString ? JSON.parse(usersString) : [];
    } catch {
      return [];
    }
  }

  private async saveAllUsers(users: User[]): Promise<void> {
    await AsyncStorageService.setItem('@all_users', JSON.stringify(users));
  }
}

// Export both named and default
export {AuthService};
export default AuthService;
