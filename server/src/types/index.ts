import { Request } from "express";

// auth
export interface AuthUser {
  id: string;
  firebaseUid: string;
  email: string;
  displayName: string | null;
  totalTimepoints: number;
  streakCount: number;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

// body

export interface CreateTaskItem {
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  estimatedMinutes?: number;
}

export interface CreatePassBody {
  tasks: CreateTaskItem[];
}

// pts with lv
export const POINTS_MAP: Record<'EASY' | 'MEDIUM' | 'HARD', number> = {
  EASY: 5,
  MEDIUM: 7,
  HARD: 10,
}

export const COMPLETION_BONUS = 20; // bonus pts when finish 100%
export const STREAK_MULTIPLIER = 1.2; // X1.2 when streak >= 3
export const DEBUFF_RATE = 0.8; // -20% if yesterday  < 70%
export const STREAK_THRESHOLD = 3; // days active buff
