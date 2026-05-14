import type { TimerControlsProps } from "@/types/Pomodoro";
import { motion } from "framer-motion";

const TimerControls = ({ state, color, onStart, onPause, onReset, onSkip }: TimerControlsProps) => (
  <div className="flex items-center justify-center gap-3 mb-8">
    <button onClick={onReset} className="w-10 h-10 rounded-full flex items-center justify-center text-white/30 border border-white/[0.08] bg-white/[0.04]">↺</button>
    <motion.button 
      onClick={state === 'running' ? onPause : onStart} 
      disabled={state === 'done'}
      className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-[#0d0f14] text-xl"
      style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }} 
      whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}>
      {state === 'running' ? '⏸' : '▶'}
    </motion.button>
    <button onClick={onSkip} className="w-10 h-10 rounded-full flex items-center justify-center text-white/30 border border-white/[0.08] bg-white/[0.04]">⏭</button>
  </div>
);

export default TimerControls