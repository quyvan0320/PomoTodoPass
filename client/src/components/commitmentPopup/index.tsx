import { motion, AnimatePresence } from "framer-motion";
import { useCommitment } from "@/hooks/useCommitment";
import HeaderInfo from "./HeaderInfo";
import CommitmentItem from "./CommitmentItem";

const CommitmentPopup = ({ onConfirm }: { onConfirm: () => void }) => {
  const {
    commitments,
    inputText,
    setInputText,
    inputRef,
    addCommitment,
    removeCommitment,
    toggleCommitment,
    allChecked,
    checkedCount,
  } = useCommitment();
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
       <HeaderInfo />

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Input Area */}
          <div className="flex gap-2">
            <input
              ref={inputRef} value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCommitment()}
              placeholder="Ví dụ: Không lướt TikTok quá 15 phút..."
              className="flex-1 px-3 py-2.5 rounded-lg text-[13px] text-white bg-white/[0.04] border border-white/[0.08] outline-none focus:border-white/20 transition-all"
              autoFocus
            />
            <button 
              onClick={addCommitment} 
              disabled={!inputText.trim()}
              className="px-4 py-2.5 rounded-lg text-[13px] font-bold bg-white/[0.04] text-white/50 border border-white/[0.08] hover:text-white transition-all disabled:opacity-30"
            >
              + Thêm
            </button>
          </div>

          {/* List Area */}
          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
            <AnimatePresence initial={false}>
              {commitments.length === 0 ? (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-[12px] text-white/25 py-6">
                  Nhập cam kết vào ô trên ↑
                </motion.p>
              ) : (
                commitments.map((c) => (
                  <CommitmentItem key={c.id} c={c} onToggle={toggleCommitment} onRemove={removeCommitment} />
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Status Label */}
          {commitments.length > 0 && (
            <p className="text-[11px] text-white/25 text-center">
              {checkedCount}/{commitments.length} đã cam kết
              {allChecked && <span className="text-[#c89b3c] ml-1">✓ Sẵn sàng!</span>}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <motion.button
            onClick={onConfirm}
            disabled={!allChecked}
            className="w-full py-3 rounded-xl text-[13px] font-bold text-[#0d0f14] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg,#c89b3c,#f0d060)" }}
            whileHover={{ scale: allChecked ? 1.02 : 1 }}
            whileTap={{ scale: allChecked ? 0.97 : 1 }}
          >
            Tiếp theo — Lên kế hoạch →
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default CommitmentPopup;
