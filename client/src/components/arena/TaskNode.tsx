import { DIFF, type ArenaTask } from "@/types/Arena";
import { motion, AnimatePresence } from "framer-motion";

const TaskNode = ({ task, index, isActive, onClick }: {
  task: ArenaTask; index: number; isActive: boolean; onClick: () => void
}) => {
    const cfg      = DIFF[task.difficulty]
  const isDone   = task.status === 'DONE'
  const isSkip   = task.status === 'SKIPPED'
  const canClick = !isDone && !isSkip
  return (
    <motion.div
      className="relative flex flex-col items-center gap-1.5 group"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: 'easeOut' }}
    >
      {/* Tooltip*/}
      <div
        className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2
          px-3 py-2 rounded-lg border border-white/10 whitespace-nowrap z-20
          opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none"
        style={{ background: '#1a1d26', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
      >
        {/* Arrow */}
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
          style={{ borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid #1a1d26' }}
        />
        <p className="text-[13px] font-semibold text-white/90">{task.title}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-[10px] font-mono" style={{ color: cfg.color }}>{task.difficulty}</span>
          <span className="text-[10px] text-white/30">·</span>
          <span className="text-[10px] text-white/40 font-mono">{task.basePoints} pts</span>
          {task.estimatedMinutes && (
            <>
              <span className="text-[10px] text-white/30">·</span>
              <span className="text-[10px] text-white/40 font-mono">{task.estimatedMinutes}p</span>
            </>
          )}
        </div>
      </div>
 
      {/* Node button */}
      <motion.button
        onClick={canClick ? onClick : undefined}
        className={`relative w-14 h-14 rounded-xl border-2 flex items-center justify-center outline-none
          ${isDone  ? 'cursor-default' : ''}
          ${isSkip  ? 'opacity-30 cursor-default' : ''}
          ${canClick ? 'cursor-pointer' : ''}
        `}
        style={{
          background:  isDone ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.04)',
          borderColor: isDone ? 'rgba(74,222,128,0.5)' : isActive ? cfg.color : `${cfg.color}33`,
          boxShadow:   isActive && !isDone ? `0 0 0 1px ${cfg.color}, 0 0 18px ${cfg.glow}` : undefined,
        }}
        whileHover={canClick ? { scale: 1.1, y: -3 } : {}}
        whileTap={canClick ? { scale: 0.94 } : {}}
      >
        {isActive && !isDone && (
          <motion.span
            className="absolute inset-[-4px] rounded-[15px] border-2 pointer-events-none"
            style={{ borderColor: cfg.color }}
            animate={{ scale: [1, 1.55], opacity: [0.65, 0] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
 
        {/* Icon */}
        {isDone ? (
          <motion.svg width="22" height="22" viewBox="0 0 22 22" className="text-green-400">
            <motion.path
              d="M4.5 11l4.5 4.5L17.5 7"
              stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round" fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.35 }}
            />
          </motion.svg>
        ) : (
          <span className="text-xl leading-none" style={{ color: cfg.color }}>{cfg.icon}</span>
        )}
 
        {/* Difficulty label */}
        <span
          className="absolute -bottom-1.5 -right-1.5 w-4 h-4 rounded text-[8px] font-bold flex items-center justify-center"
          style={{ background: cfg.color, color: '#0d0f14' }}
        >
          {cfg.label}
        </span>
 
        <AnimatePresence>
          {isDone && (
            <motion.span
              className="absolute -top-2.5 -right-2 text-[9px] font-bold rounded-full px-1.5 py-0.5"
              style={{ color: '#4ade80', background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)' }}
              initial={{ opacity: 0, y: 4, scale: 0.7 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.25 }}
            >
              +{task.basePoints}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
 
      <span className="text-[9px] text-white/20">{index + 1}</span>
    </motion.div>
  )
}

export default TaskNode