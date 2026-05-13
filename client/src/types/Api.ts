export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// auth
export interface User {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  totalTimepoints: number;
  streakCount: number;
  lastActiveDate: string | null;
  createdAt: string;
}

// task
export interface Task {
  id: string;
  passId: string;
  title: string;
  difficulty: Difficulty;
  basePoints: number;
  status: TaskStatus;
  order: number;
  estimatedMinutes: number | null;
  actualMinutes: number | null;
  completedAt: string | null;
  createdAt: string;
}

// pass
export interface DailyPass {
  id: string;
  userId: string;
  date: string;
  status: PassStatus;
  completionRate: number;
  multiplier: number;
  debuffActive: boolean;
  bonusGranted: boolean;
  commitmentChecked: boolean;
  createdAt: string;
  tasks: Task[];
}

// create pass input usepass
export interface CreatePassInput {
  tasks: {
    title: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    estimatedMinutes?: number;
  }[];
}

// useTask
export interface StartTaskResponse {
  task: Task;
  session: PomodoroSession;
}
export interface CompleteTaskResponse {
  pointsEarned: number;
  bonusPoints: number;
  completionRate: number;
  newTotal: number;
}

export interface PomodoroSession {
  id: string;
  taskId: string;
  userId: string;
  durationMinutes: number;
  completed: boolean;
  pointsEarned: number;
  startedAt: string;
  endedAt: string | null;
}

export interface Balance {
  totalTimepoints: number;
  streakCount: number;
}

export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type TaskStatus = "PENDING" | "IN_PROGRESS" | "DONE" | "SKIPPED";
export type PassStatus = "ACTIVE" | "COMPLETED" | "FAILED";
export type LogType =
  | "TASK_COMPLETE"
  | "COMPLETION_BONUS"
  | "STREAK_BONUS"
  | "PENALTY"
  | "ENTERTAINMENT";
export type EntStatus = "ACTIVE" | "EXPIRED" | "COMPLETED";
