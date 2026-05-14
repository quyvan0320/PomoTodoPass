import type { ArenaTask } from "./Arena";

export interface PomodoroModalProps {
  task: ArenaTask;
  onComplete: (actualMinutes: number) => void;
  onClose: () => void;
  isCompleting?: boolean;
}

export interface ModalHeaderProps {
  task: ArenaTask;
  color: string;
  mode: TimerMode;
  focusMins: number;
  breakMins: number;
  onClose: () => void;
  onToggleSettings: () => void;
  onSwitchMode: (m: TimerMode) => void;
}

export interface TimerCircleProps {
  secondsLeft: number;
  progress: number;
  color: string;
  state: TimerState;
  mode: TimerMode;
}

export interface TimerControlsProps {
  state: TimerState;
  color: string;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export interface ModalFooterProps {
  isIdle: boolean;
  isCompleting: boolean;
  basePoints: number;
  onComplete: () => void;
  onClose: () => void;
}

export type TimerMode = "focus" | "break";
export type TimerState = "idle" | "running" | "paused" | "done";
