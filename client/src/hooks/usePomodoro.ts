
import { useState, useEffect } from "react";
import type { TimerMode, TimerState } from "@/types/Pomodoro";

export const usePomodoro = (initialFocus: number, initialBreak: number) => {
  const [focusMins, setFocusMins] = useState(initialFocus);
  const [breakMins, setBreakMins] = useState(initialBreak);
  const [mode, setMode] = useState<TimerMode>("focus");
  const [state, setState] = useState<TimerState>("idle");
  const [secondsLeft, setSecondsLeft] = useState(initialFocus * 60);
  const [startedAt, setStartedAt] = useState<Date | null>(null);

  const playDone = () => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.8);
    } catch (_) {}
  };

  useEffect(() => {
    if (state !== "running") return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          setState("done");
          playDone();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [state]);

  const start = () => {
    if (state === "idle") setStartedAt(new Date());
    setState("running");
  };

  const pause = () => setState("paused");

  const reset = () => {
    setState("idle");
    setSecondsLeft((mode === "focus" ? focusMins : breakMins) * 60);
    setStartedAt(null);
  };

  const switchMode = (m: TimerMode) => {
    setMode(m);
    setState("idle");
    setSecondsLeft((m === "focus" ? focusMins : breakMins) * 60);
    setStartedAt(null);
  };

  return {
    focusMins, breakMins, mode, state, secondsLeft, startedAt,
    setFocusMins, setBreakMins, setState, setSecondsLeft,
    start, pause, reset, switchMode, playDone
  };
};