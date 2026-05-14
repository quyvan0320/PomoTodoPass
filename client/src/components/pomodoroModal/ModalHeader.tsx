import type { ModalHeaderProps } from "@/types/Pomodoro";

const ModalHeader = ({ task, color, mode, focusMins, breakMins, onClose, onToggleSettings, onSwitchMode }: ModalHeaderProps) => (
  <div className="px-5 pt-5 pb-4 border-b border-white/[0.06]">
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${color}22`, color }}>
            {task.difficulty}
          </span>
          <span className="text-[10px] text-white/30 font-mono">+{task.basePoints} pts</span>
        </div>
        <h3 className="text-[15px] font-bold text-white truncate">{task.title}</h3>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button onClick={onToggleSettings} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 border border-white/[0.07] bg-white/[0.04]">⚙</button>
        <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 border border-white/[0.07] bg-white/[0.04]">✕</button>
      </div>
    </div>
    <div className="flex gap-1.5 mt-3">
      {(['focus', 'break'] as const).map(m => (
        <button key={m} onClick={() => onSwitchMode(m)} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
          style={{
            background: mode === m ? `${color}22` : 'rgba(255,255,255,0.04)',
            color: mode === m ? color : 'rgba(255,255,255,0.35)',
            border: `1px solid ${mode === m ? `${color}55` : 'rgba(255,255,255,0.07)'}`,
          }}>
          {m === 'focus' ? `🎯 Tập trung ${focusMins}p` : `☕ Nghỉ ${breakMins}p`}
        </button>
      ))}
    </div>
  </div>
);

export default ModalHeader