import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Toast, ToastType } from "@/types/Toast";
import { ToastProvider as BaseToastProvider } from "@/contexts/ToastContext";

export { useToast } from "@/contexts/ToastContext";

const TOAST_CONFIG: Record<
  ToastType,
  { icon: string; color: string; bg: string; border: string }
> = {
  success: {
    icon: "✓",
    color: "#4ade80",
    bg: "rgba(74,222,128,0.1)",
    border: "rgba(74,222,128,0.25)",
  },
  error: {
    icon: "✕",
    color: "#f87171",
    bg: "rgba(248,113,113,0.1)",
    border: "rgba(248,113,113,0.25)",
  },
  info: {
    icon: "ℹ",
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.1)",
    border: "rgba(96,165,250,0.25)",
  },
  warning: {
    icon: "⚠",
    color: "#facc15",
    bg: "rgba(250,204,21,0.1)",
    border: "rgba(250,204,21,0.25)",
  },
};

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const cfg = TOAST_CONFIG[toast.type];

  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border min-w-[220px] max-w-[320px]"
      style={{
        background: cfg.bg,
        borderColor: cfg.border,
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <span
        className="w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
        style={{ background: `${cfg.color}22`, color: cfg.color }}
      >
        {cfg.icon}
      </span>
      <span className="text-[13px] text-white/90 flex-1">{toast.message}</span>
      <button
        onClick={onClose}
        className="text-white/30 hover:text-white/60 text-base leading-none flex-shrink-0"
      >
        ×
      </button>
    </motion.div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <BaseToastProvider
      children={children}
      renderContainer={(toasts, remove) => (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
          <AnimatePresence>
            {toasts.map((t) => (
              <ToastItem key={t.id} toast={t} onClose={() => remove(t.id)} />
            ))}
          </AnimatePresence>
        </div>
      )}
    />
  );
}
