import ArenaPass from "@/components/arena";
import { useMe } from "@/hooks/useAuth";
import { useCreatePass, useTodayPass } from "@/hooks/usePass";
import { useCompleteTask, useStartTask } from "@/hooks/useTask";
import { useBalance } from "@/hooks/useTimepoint";
import type { ArenaTask } from "@/types/Arena";
import { useState } from "react";
import { motion } from "framer-motion";
const Content = () => {
  const { data: me } = useMe();
  const { data: balance } = useBalance();
  const {
    data: pass,
    isLoading: passLoading,
    isError: passError,
  } = useTodayPass();

  const createPass = useCreatePass();
  const startTask = useStartTask();
  const completeTask = useCompleteTask();
  const [pomodoroState, setPomodoroState] = useState<{
    task: ArenaTask;
    sessionId: string;
  } | null>(null);

  const handleTaskClick = async (task: ArenaTask) => {
    try {
      const { session } = await startTask.mutateAsync({
        taskId: task.id,
        durationMinutes: 50,
      });
      setPomodoroState({ task, sessionId: session.id });
    } catch (err) {
      console.error("Start task failed:", err);
    }
  };

  const handlePomodoroComplete = async (actualMinutes: number) => {
    if (!pomodoroState) return;
    try {
      const result = await completeTask.mutateAsync({
        taskId: pomodoroState.task.id,
        sessionId: pomodoroState.sessionId,
        actualMinutes,
      });
      setPomodoroState(null);
      console.log(`+${result.pointsEarned} điểm! Tổng: ${result.newTotal}`);
    } catch (err) {
      console.error("Complete task failed:", err);
    }
  };
  console.log(pass);
  if (passError)
    return (
      <div className="flex items-center justify-center h-48 text-white/40 text-sm">
        Không tải được dữ liệu.{" "}
        <button
          className="ml-2 underline"
          onClick={() => window.location.reload()}
        >
          Thử lại
        </button>
      </div>
    );
  return (
    <div className="min-h-screen bg-[#080a0f] text-white">
      {/* ── Top navbar ── */}
      <nav className="border-b border-white/[0.06] px-6 py-3 flex items-center justify-between">
        <span className="text-sm font-bold tracking-[0.15em] text-[#c89b3c] uppercase">
          PomoTodoPass
        </span>
        <div className="flex items-center gap-4">
          {/* Điểm hiển thị realtime từ useBalance */}
          <div className="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5">
            <span className="text-[#c89b3c] text-sm">⬡</span>
            <span className="text-sm font-bold text-white">
              {balance?.totalTimepoints ?? 0}
            </span>
            <span className="text-[10px] text-white/40">pts</span>
          </div>

          {/* Streak */}
          {(balance?.streakCount ?? 0) > 0 && (
            <div className="flex items-center gap-1 text-orange-400 text-sm font-bold">
              🔥 {balance?.streakCount}
            </div>
          )}

          {/* Avatar */}
          {me?.avatarUrl && (
            <img
              src={me.avatarUrl}
              alt={me.displayName ?? "avatar"}
              className="w-8 h-8 rounded-full border border-white/10"
            />
          )}
        </div>
      </nav>

      {/* ── Main content ── */}
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {pass && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ArenaPass pass={pass} onTaskClick={handleTaskClick} />
          </motion.div>
        )}
      </main>

      {/* ── Pomodoro modal (overlay) ── */}
      {/* <AnimatePresence>
        {pomodoroState && (
          <PomodoroModal
            task={pomodoroState.task}
            onComplete={handlePomodoroComplete}
            onClose={() => setPomodoroState(null)}
            isCompleting={completeTask.isPending}
          />
        )}
      </AnimatePresence> */}
    </div>
  );
};

export default Content;
