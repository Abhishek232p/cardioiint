
import { CardioHealthData, User } from "../types";

const STORAGE_KEYS = {
  USERS: 'cardio_users',
  RECORDS: 'cardio_records',
  AUTH: 'cardio_current_user'
};

export class DataService {
  private getUsers(): any[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  }

  register(username: string, password: string, age: number, gender: 'male' | 'female' | 'other'): User | null {
    const users = this.getUsers();
    if (users.find(u => u.username === username)) return null;

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      password: this.mockHash(password), // Simulation of secure hashing
      age,
      gender
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return this.login(username, password);
  }

  login(username: string, password: string): User | null {
    const users = this.getUsers();
    const user = users.find(u => u.username === username && u.password === this.mockHash(password));
    if (user) {
      const { password, ...safeUser } = user;
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(safeUser));
      return safeUser as User;
    }
    return null;
  }

  logout() {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem(STORAGE_KEYS.AUTH);
    return user ? JSON.parse(user) : null;
  }

  getRecords(userId: string): CardioHealthData[] {
    const allRecords = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECORDS) || '[]');
    return allRecords.filter((r: CardioHealthData) => r.userId === userId)
                     .sort((a: any, b: any) => b.timestamp - a.timestamp);
  }

  addRecord(record: Omit<CardioHealthData, 'id'>): CardioHealthData {
    const allRecords = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECORDS) || '[]');
    const newRecord = { ...record, id: Math.random().toString(36).substr(2, 9) };
    allRecords.push(newRecord);
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(allRecords));
    return newRecord;
  }

  private mockHash(str: string): string {
    // Simple mock hash for browser demonstration
    return btoa(str).split('').reverse().join('');
  }
}

export const dataService = new DataService();
