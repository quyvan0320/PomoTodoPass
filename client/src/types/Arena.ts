 
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD'
export type TaskStatus  = 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'SKIPPED'
 
export interface ArenaTask {
  id: string
  title: string
  difficulty: Difficulty
  basePoints: number
  status: TaskStatus
  order: number
  estimatedMinutes?: number | null
}
 
export interface DailyPass {
  id: string
  date: string
  status: 'ACTIVE' | 'COMPLETED' | 'FAILED'
  completionRate: number
  multiplier: number
  debuffActive: boolean
  bonusGranted: boolean
  tasks: ArenaTask[]
}
 
export const DIFF: Record<Difficulty, { color: string; glow: string; label: string; icon: string }> = {
  EASY:   { color: '#4ade80', glow: 'rgba(74,222,128,0.4)',  label: 'E', icon: '◈' },
  MEDIUM: { color: '#facc15', glow: 'rgba(250,204,21,0.4)',  label: 'M', icon: '◆' },
  HARD:   { color: '#f87171', glow: 'rgba(248,113,113,0.4)', label: 'H', icon: '★' },
}