import { usePomodoro } from "@/hooks/usePomodoro";
import { DIFF_COLOR } from "@/lib/helpers";
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from "react";
import SettingsPanel from "./SettingsPanel";
import type { PomodoroModalProps } from "@/types/Pomodoro";
import TimerCircle from "./TimerCircle";
import ModalHeader from "./ModalHeader";
import TimerControls from "./TimerControls";
import ModalFooter from "./ModalFooter";


const PomodoroModal = ({ task, onComplete, onClose, isCompleting = false }: PomodoroModalProps) => {
  const color = DIFF_COLOR[task.difficulty] ?? "#facc15";
  const [showSettings, setShowSettings] = useState(false);
  
  const {
    focusMins, breakMins, mode, state, secondsLeft, startedAt,
    setFocusMins, setBreakMins, setState, setSecondsLeft,
    start, pause, reset, switchMode, playDone
  } = usePomodoro(50, 10);

  
  const totalSeconds = (mode === "focus" ? focusMins : breakMins) * 60;
  const progress = 1 - secondsLeft / totalSeconds;
  const actualMinutes = startedAt 
    ? Math.round((Date.now() - startedAt.getTime()) / 60000) 
    : focusMins;

  const applySettings = (fm: number, bm: number) => {
    setFocusMins(fm);
    setBreakMins(bm);
    setState("idle");
    setSecondsLeft(fm * 60);
    setShowSettings(false);
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      
      <motion.div className="w-full max-w-sm rounded-2xl border border-white/[0.08] overflow-hidden"
        style={{ background: 'linear-gradient(180deg,#0f1117 0%,#141720 100%)' }}
        initial={{ scale: 0.92, opacity: 0, y: 24 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0, y: 24 }}>
        
        {/* Headers */}
       <ModalHeader 
          task={task} color={color} mode={mode} 
          focusMins={focusMins} breakMins={breakMins}
          onClose={onClose} onToggleSettings={() => setShowSettings(!showSettings)}
          onSwitchMode={switchMode}
        />

        {/*Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div className="px-5 py-4 border-b border-white/[0.06]" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
              <SettingsPanel focusMins={focusMins} breakMins={breakMins} onApply={applySettings} />
            </motion.div>
          )}
        </AnimatePresence>

        {/*  Timer Circle Display */}
        <TimerCircle secondsLeft={secondsLeft} progress={progress} color={color} state={state} mode={mode} />

        {/*  Controls */}
      <TimerControls 
          state={state} color={color}
          onStart={start} onPause={pause} onReset={reset}
          onSkip={() => { setState('done'); playDone(); }}
        />

        {/*  Footer Actions */}
        <ModalFooter 
          isIdle={state === 'idle'} isCompleting={isCompleting}
          basePoints={task.basePoints}
          onComplete={() => onComplete(actualMinutes)}
          onClose={onClose}
        />

      </motion.div>
    </motion.div>
  );
};

export default PomodoroModal;