import type { ArenaTask, DailyPass } from "@/types/Arena";
import Header from "./Header";
import Connector from "./Connector";
import FinishNode from "./FinishNode";
import { motion, AnimatePresence } from "framer-motion";
import TaskNode from "./TaskNode";

interface ArenaPassProps {
  pass: DailyPass;
  onTaskClick: (task: ArenaTask) => void;
  className?: string;
}
const ArenaPass = ({ pass, onTaskClick, className = "" }: ArenaPassProps) => {
  const { tasks, completionRate, multiplier, debuffActive, bonusGranted } =
    pass;
  const doneTasks = tasks.filter((t) => t.status === "DONE").length;
  const activeIdx = (() => {
    const ip = tasks.findIndex((t) => t.status === "IN_PROGRESS");
    return ip !== -1 ? ip : tasks.findIndex((t) => t.status === "PENDING");
  })();
  return (
    <div
      className={`relative w-full rounded-2xl border border-white/[0.07] overflow-hidden p-5 ${className}`}
      style={{ background: "linear-gradient(180deg,#0d0f14 0%,#131720 100%)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),
                            linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      >
        <div className="relative z-10">
          {/* header */}
          <Header
            completionRate={completionRate}
            multiplier={multiplier}
            debuffActive={debuffActive}
            totalTasks={tasks.length}
            doneTasks={doneTasks}
          />
        </div>
      </div>

      {/* TRACK  */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center px-2 py-8 min-w-max">
          {tasks.map((task, i) => (
            <div key={task.id} className="flex items-center">
              {i > 0 && <Connector filled={tasks[i - 1].status === "DONE"} />}
              <TaskNode
                task={task}
                index={i}
                isActive={i === activeIdx}
                onClick={() => {
                  if (task.status !== "DONE" && task.status !== "SKIPPED")
                    onTaskClick(task);
                }}
              />
            </div>
          ))}
          <Connector filled={completionRate === 100} />
          <FinishNode
            done={completionRate === 100}
            bonusGranted={bonusGranted}
          />
        </div>
      </div>

      {/* COMPLETION BANNER */}
      <AnimatePresence>
        {completionRate === 100 && (
          <motion.div
            className="flex items-center gap-2.5 px-4 py-2.5 mt-2 rounded-lg border text-[13px] font-semibold"
            style={{
              background: "rgba(200,155,60,0.08)",
              borderColor: "rgba(200,155,60,0.22)",
              color: "#c89b3c",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <span className="text-lg">⚔</span>
            <span>Trận chiến hôm nay đã thắng! +20 điểm thưởng</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArenaPass;
