import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Difficulty = "EASY" | "MEDIUM" | "HARD";

interface CreatePassModalProps {
  onConfirm: (tasks: TaskInput[]) => void;
  onClose: () => void;
  isLoading?: boolean;
}

const DIFF_CONFIG: Record<
  Difficulty,
  { label: string; color: string; pts: number }
> = {
  EASY: { label: "Dễ", color: "#4ade80", pts: 5 },
  MEDIUM: { label: "Vừa", color: "#facc15", pts: 7 },
  HARD: { label: "Khó", color: "#f87171", pts: 10 },
};

interface TaskInput {
  title: string;
  difficulty: Difficulty;
  estimatedMinutes?: number;
}

const CreatePassModal = ({
  onConfirm,
  onClose,
  isLoading = false,
}: CreatePassModalProps) => {
  const [tasks, setTasks] = useState<TaskInput[]>([
    { title: "", difficulty: "MEDIUM" },
  ]);

  const addTask = () =>
    setTasks((prev) => [...prev, { title: "", difficulty: "MEDIUM" }]);

  const removeTask = (i: number) =>
    setTasks((prev) => prev.filter((_, idx) => idx !== i));

  const updateTask = (
    i: number,
    field: keyof TaskInput,
    value: string | number,
  ) =>
    setTasks((prev) =>
      prev.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)),
    );

  const validTasks = tasks.filter((t) => t.title.trim().length > 0);
  const totalPts = validTasks.reduce(
    (s, t) => s + DIFF_CONFIG[t.difficulty].pts,
    0,
  );
  const canSubmit = validTasks.length > 0 && !isLoading;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onConfirm(validTasks.map((t) => ({ ...t, title: t.title.trim() })));
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
    >
      <motion.div
        className="w-full max-w-md rounded-2xl border border-white/[0.08] overflow-hidden"
        style={{
          background: "linear-gradient(180deg,#0f1117 0%,#141720 100%)",
        }}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📋</span>
              <div>
                <h2 className="text-base font-bold text-white">
                  Lên kế hoạch hôm nay
                </h2>
                <p className="text-[11px] text-white/35 mt-0.5">
                  Thêm task, chọn độ khó — hoàn thành để nhận điểm
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/30 hover:text-white/60 transition-colors text-xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-3">
          {/* Danh sách tasks */}
          <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
            <AnimatePresence>
              {tasks.map((task, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  {/* Title input */}
                  <input
                    type="text"
                    placeholder={`Nhiệm vụ ${i + 1}...`}
                    value={task.title}
                    onChange={(e) => updateTask(i, "title", e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && i === tasks.length - 1 && addTask()
                    }
                    className="flex-1 px-3 py-2.5 rounded-lg text-[13px] text-white placeholder-white/25 outline-none border border-white/[0.08] focus:border-white/20 transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                    autoFocus={i === 0}
                  />

                  {/* Difficulty buttons E / M / H */}
                  <div className="flex gap-1">
                    {(Object.keys(DIFF_CONFIG) as Difficulty[]).map((d) => (
                      <button
                        key={d}
                        onClick={() => updateTask(i, "difficulty", d)}
                        className="w-8 h-9 rounded-lg text-[10px] font-bold border transition-all duration-150"
                        style={{
                          background:
                            task.difficulty === d
                              ? `${DIFF_CONFIG[d].color}22`
                              : "rgba(255,255,255,0.04)",
                          borderColor:
                            task.difficulty === d
                              ? DIFF_CONFIG[d].color
                              : "rgba(255,255,255,0.08)",
                          color:
                            task.difficulty === d
                              ? DIFF_CONFIG[d].color
                              : "rgba(255,255,255,0.3)",
                        }}
                        title={`${DIFF_CONFIG[d].label} — ${DIFF_CONFIG[d].pts} pts`}
                      >
                        {d[0]}
                      </button>
                    ))}
                  </div>

                  {/* Xóa task */}
                  {tasks.length > 1 && (
                    <button
                      onClick={() => removeTask(i)}
                      className="w-8 h-9 rounded-lg flex items-center justify-center text-white/25 hover:text-red-400 hover:bg-red-400/10 border border-white/[0.06] transition-all text-lg"
                    >
                      ×
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Add task + tổng điểm */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={addTask}
              className="text-[12px] text-white/40 hover:text-white/70 transition-colors flex items-center gap-1"
            >
              <span className="text-base leading-none">+</span> Thêm task
            </button>
            {validTasks.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-white/30">Tổng tối đa:</span>
                <span
                  className="text-[13px] font-bold"
                  style={{ color: "#c89b3c" }}
                >
                  {totalPts} pts
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <motion.button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full py-3 rounded-xl text-[13px] font-bold tracking-wide transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg,#c89b3c,#f0d060)",
              color: "#0d0f14",
            }}
            whileHover={{ scale: canSubmit ? 1.02 : 1 }}
            whileTap={{ scale: canSubmit ? 0.97 : 1 }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span
                  className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent inline-block"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 0.7,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                Đang tạo...
              </span>
            ) : (
              "Bắt đầu trận chiến ⚔"
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreatePassModal;
