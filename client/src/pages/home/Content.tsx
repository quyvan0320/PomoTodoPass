import ArenaPass from "@/components/arena";
import { useMe } from "@/hooks/useAuth";
import { useCreatePass, useTodayPass } from "@/hooks/usePass";
import { useCompleteTask, useStartTask } from "@/hooks/useTask";
import { useBalance } from "@/hooks/useTimepoint";
import type { ArenaTask } from "@/types/Arena";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PomodoroModal from "@/components/pomodoroModal";
import CommitmentPopup from "@/components/commitmentPopup";
import CreatePassModal from "@/components/createPassModal";
import { useGoogleLogin } from "@/hooks/useGoogleLogin";
import { useToast } from "@/contexts/ToastContext";
const Content = () => {
  const { logout } = useGoogleLogin();
  const { data: me } = useMe();
  const { data: balance } = useBalance();
  const toast = useToast();
  const { data: pass, isLoading, isError, refetch } = useTodayPass();

  const createPass = useCreatePass();
  const startTask = useStartTask();
  const completeTask = useCompleteTask();

  // Điều khiển flow các modal
  const [showCreatePass, setShowCreatePass] = useState(false);
  const [pomodoroState, setPomodoroState] = useState<{
    task: ArenaTask;
    sessionId: string;
  } | null>(null);

  // Tạo pass → gọi API → cache tự update → ArenaPass hiện ra
  const handleCreatePass = async (
    tasks: {
      title: string;
      difficulty: "EASY" | "MEDIUM" | "HARD";
      estimatedMinutes?: number;
    }[],
  ) => {
    try {
      await createPass.mutateAsync({ tasks });
      setShowCreatePass(false);
      toast.success("Trận chiến hôm nay bắt đầu! ⚔");
    } catch (err: any) {
      if (err?.response?.status === 409) {
        refetch();
        setShowCreatePass(false);
      } else toast.error(err?.response?.data?.message ?? "Tạo pass thất bại");
    }
  };

  // Click task trên Arena → gọi /start → mở Pomodoro
  const handleTaskClick = async (task: ArenaTask) => {
    try {
      const { session } = await startTask.mutateAsync({
        taskId: task.id,
        durationMinutes: 50,
      });
      setPomodoroState({ task, sessionId: session.id });
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Không thể bắt đầu task");
    }
  };

  // Pomodoro xong → gọi /complete → cache tự update điểm
  const handlePomodoroComplete = async (actualMinutes: number) => {
    if (!pomodoroState) return;
    try {
      const result = await completeTask.mutateAsync({
        taskId: pomodoroState.task.id,
        sessionId: pomodoroState.sessionId,
        actualMinutes,
      });
      setPomodoroState(null);
      toast.success(`+${result.pointsEarned} pts! Tổng: ${result.newTotal} ⬡`);
      if (result.bonusPoints > 0) {
        setTimeout(
          () =>
            toast.info(`🎉 Bonus +${result.bonusPoints} pts hoàn thành 100%!`),
          500,
        );
      }
    } catch (err: any) {
            toast.error(err?.response?.data?.message ?? 'Lỗi hoàn thành task')

    }
  };

    if (isError) return (
    <div className="min-h-screen bg-[#080a0f] flex flex-col items-center justify-center gap-3">
      <p className="text-white/40 text-sm">Không tải được dữ liệu</p>
      <button onClick={() => refetch()} className="text-[#c89b3c] text-sm underline">Thử lại</button>
    </div>
  )
  return (
    <div className="min-h-screen bg-[#080a0f] text-white">
      {/* ── Top navbar ── */}
      <nav className="border-b border-white/[0.06] px-6 py-3 flex items-center justify-between">
        <span className="text-sm font-bold tracking-[0.15em] text-[#c89b3c] uppercase">
          PomoTodoPass
        </span>
        <div className="flex items-center gap-4">
          {/* show balance */}
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

          <button
            onClick={logout}
            className="text-[11px] text-white/30 hover:text-white/60 border border-white/[0.07] hover:border-white/20 rounded-lg px-3 py-1.5 transition-all"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            Đăng xuất
          </button>
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

      {pass === null && !showCreatePass && (
        <CommitmentPopup onConfirm={() => setShowCreatePass(true)} />
      )}

      {pass === null && showCreatePass && (
        <CreatePassModal
          onConfirm={handleCreatePass}
          onClose={() => setShowCreatePass(false)}
          isLoading={createPass.isPending}
        />
      )}

      <AnimatePresence>
        {pomodoroState && (
          <PomodoroModal
            task={pomodoroState.task}
            onComplete={handlePomodoroComplete}
            onClose={() => setPomodoroState(null)}
            isCompleting={completeTask.isPending}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Content;
