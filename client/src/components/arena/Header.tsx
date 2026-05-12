import { motion, AnimatePresence } from "framer-motion";
interface ArenaHeaderProps {
  completionRate: number;
  multiplier: number;
  debuffActive: boolean;
  totalTasks: number;
  doneTasks: number;
}
const Header = ({
  completionRate,
  multiplier,
  debuffActive,
  totalTasks,
  doneTasks,
}: ArenaHeaderProps) => {
  return (
    <div className="flex items-center gap-4 mb-6 flex-wrap ">
      <div className="flex-shrink-0">
        <p
          className="text-[0.8rem] font-bold tracking-[0.2rem] uppercase"
          style={{ color: "#c89b3c" }}
        >
          Arena
        </p>
        <p className="text-[0.7rem] text-white/30 mt-0.5">
          {new Date().toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
      </div>

      {/* progress bar */}
      <div className="flex-1 min-w-[10rem] space-y-1.5">
        <div
          className="h-[0.2rem] w-full rounded-full overflow-hidden "
          style={{ background: "rgba(255,255,255,0.07)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg,#c89b3c,#f0d060)" }}
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <p className="text-[0.6rem] text-white/35">
          {doneTasks}/{totalTasks} nhiệm vụ · {Math.round(completionRate)}%
        </p>
      </div>

      {/* badge  */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {multiplier > 1 && (
          <motion.span
            className="text-[0.5rem] font-bold tracking-widest px-2 py-1 rounded border uppercase text-green-400 border-green-500/30"
            style={{ background: "rgba(74,222,128,0.1)" }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {" "}
            ×{multiplier.toFixed(1)} Streak
          </motion.span>
        )}
        {debuffActive && (
          <motion.span
            className="text-[0.5rem] font-bold tracking-widest px-2 py-1 rounded border uppercase text-red-400 border-red-500/30"
            style={{ background: "rgba(248,113,113,0.1)" }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            ⚠ Debuff −20%
          </motion.span>
        )}
      </div>
    </div>
  );
};

export default Header;
