import type { Toast, ToastContextValue, ToastType } from "@/types/Toast";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast phải được đặt bên trong ToastProvider");
  return ctx;
}

export function ToastProvider({
  children,
  renderContainer,
}: {
  children: ReactNode;
  renderContainer: (toasts: Toast[], remove: (id: string) => void) => ReactNode;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const add = useCallback((type: ToastType, message: string) => {
    setToasts((prev) => [...prev, { id: crypto.randomUUID(), type, message }]);
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value: ToastContextValue = {
    success: (msg) => add("success", msg),
    error: (msg) => add("error", msg),
    info: (msg) => add("info", msg),
    warning: (msg) => add("warning", msg),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {renderContainer(toasts, remove)}
    </ToastContext.Provider>
  );
}