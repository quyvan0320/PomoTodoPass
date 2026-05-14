export const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0  ");
  return `${m}:${s}`;
};

export const DIFF_COLOR: Record<string, string> = {
  EASY:   '#4ade80',
  MEDIUM: '#facc15',
  HARD:   '#f87171',
}