import type { ModalFooterProps } from "@/types/Pomodoro";
import { motion } from "framer-motion";

const ModalFooter = ({
  isIdle,
  isCompleting,
  basePoints,
  onComplete,
  onClose,
}: ModalFooterProps) => (
  <div className="px-5 pb-5 space-y-2">
    <motion.button
      onClick={onComplete}
      disabled={isIdle || isCompleting}
      className="w-full py-3 rounded-xl text-[13px] font-bold tracking-wide disabled:opacity-30"
      style={{
        background: "linear-gradient(135deg,#c89b3c,#f0d060)",
        color: "#0d0f14",
      }}
      whileHover={{ scale: !isIdle && !isCompleting ? 1.02 : 1 }}
      whileTap={{ scale: 0.98 }}
    >
      {isCompleting
        ? "Đang lưu..."
        : `✓ Hoàn thành nhiệm vụ (+${basePoints} pts)`}
    </motion.button>
    <button
      onClick={onClose}
      className="w-full py-2 text-[12px] text-white/25 hover:text-white/45"
    >
      {" "}
      Làm sau{" "}
    </button>
  </div>
);

export default ModalFooter;
