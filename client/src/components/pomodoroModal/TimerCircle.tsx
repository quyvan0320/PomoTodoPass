import { formatTime } from "@/lib/helpers";
import type { TimerCircleProps } from "@/types/Pomodoro";
import { motion } from "framer-motion";
const TimerCircle = ({ secondsLeft, progress, color, state, mode }: TimerCircleProps) => {
  const R = 88;
  const C = 2 * Math.PI * R;
  const dash = C * (1 - progress);
  return (
    <div className="flex flex-col items-center px-5 py-8">
      <div className="relative w-52 h-52 flex items-center justify-center">
        <svg
          className="absolute inset-0 -rotate-90"
          width="208"
          height="208"
          viewBox="0 0 208 208"
        >
          <circle
            cx="104"
            cy="104"
            r={R}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="6"
          />
          <motion.circle
            cx="104"
            cy="104"
            r={R}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={dash}
            style={{ filter: `drop-shadow(0 0 8px ${color}88)` }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div className="relative z-10 text-center">
          <motion.div
            className="text-5xl font-black tracking-tight text-white font-mono"
            key={Math.floor(secondsLeft / 60)}
            animate={{ scale: [1.05, 1] }}
            transition={{ duration: 0.15 }}
          >
            {formatTime(secondsLeft)}
          </motion.div>
          <p className="text-[11px] mt-1.5 text-white/30 uppercase">
            {state === "idle"
              ? "Sẵn sàng"
              : state === "running"
                ? mode === "focus"
                  ? "Tập trung"
                  : "Nghỉ"
                : state}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimerCircle;
