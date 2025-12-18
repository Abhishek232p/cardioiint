
export enum RiskLevel {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 2
}

export interface CardioHealthData {
  id: string;
  userId: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  heartRate: number;
  systolicBp: number;
  diastolicBp: number;
  timestamp: number;
}

export interface AnalysisResult {
  riskLevel: RiskLevel;
  summary: string;
  recommendations: string[];
  anomalies: string[];
}

export interface User {
  id: string;
  username: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
