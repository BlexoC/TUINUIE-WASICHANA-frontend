import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
const ToastContext = createContext(void 0);
const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const showToast = useCallback((message, type = "success") => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4e3);
  }, []);
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };
  return <ToastContext.Provider value={{ showToast }}>
      {children}
      {
    /* Floating Toast Notification Stack */
  }
      <div
    className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4"
    aria-live="polite"
  >
        <AnimatePresence>
          {toasts.map((toast) => <motion.div
    key={toast.id}
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -10, scale: 0.95 }}
    transition={{ duration: 0.2 }}
    className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-lg border text-sm font-medium ${toast.type === "success" ? "bg-white border-emerald-200 text-slate-800 shadow-emerald-900/10" : toast.type === "error" ? "bg-white border-rose-200 text-slate-800 shadow-rose-900/10" : "bg-white border-purple-200 text-slate-800 shadow-purple-900/10"}`}
  >
              <div className="flex items-center gap-3">
                {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                {toast.type === "error" && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                {toast.type === "info" && <Info className="w-5 h-5 text-purple-600 shrink-0" />}
                <p className="text-slate-800 leading-snug">{toast.message}</p>
              </div>

              <button
    onClick={() => removeToast(toast.id)}
    className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors ml-2"
    aria-label="Dismiss toast"
  >
                <X className="w-4 h-4" />
              </button>
            </motion.div>)}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>;
};
const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
export {
  ToastProvider,
  useToast
};
