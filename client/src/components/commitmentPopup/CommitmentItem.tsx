import type { Commitment } from "@/hooks/useCommitment";
import { motion } from "framer-motion";


const CommitmentItem = ({ c, onToggle, onRemove }: { c: Commitment, onToggle: any, onRemove: any }) => {

    return (

  <motion.div
    layout
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
    className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-150"
    style={{
      background: c.checked ? "rgba(200,155,60,0.08)" : "rgba(255,255,255,0.03)",
      borderColor: c.checked ? "rgba(200,155,60,0.35)" : "rgba(255,255,255,0.07)",
    }}
  >
    <button
      onClick={() => onToggle(c.id)}
      className="w-5 h-5 rounded flex items-center justify-center border transition-all"
      style={{ background: c.checked ? "#c89b3c" : "transparent", borderColor: c.checked ? "#c89b3c" : "rgba(255,255,255,0.2)" }}
    >
      {c.checked && (
        <motion.svg width="11" height="11" viewBox="0 0 11 11" initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <path d="M1.5 5.5l3 3L9.5 2" stroke="#0d0f14" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      )}
    </button>
    <span className={`flex-1 text-[13px] ${c.checked ? "text-white/85" : "text-white/50"}`}>{c.text}</span>
    <button onClick={() => onRemove(c.id)} className="text-white/20 hover:text-red-400 text-xl leading-none">×</button>
  </motion.div>
    )
}


export default CommitmentItem;
