import { useCallback, useMemo, useRef, useState } from "react";
import { ToastContext } from "./toastContext";
import ToastContainer from "../components/ToastContainer";

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const t = timersRef.current.get(id);
    if (t) {
      clearTimeout(t);
      timersRef.current.delete(id);
    }
  }, []);

  const showToast = useCallback(
    (message, type = "success", durationMs = 3000) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      setToasts((prev) => [{ id, message, type }, ...prev].slice(0, 3));

      const timer = setTimeout(() => removeToast(id), durationMs);
      timersRef.current.set(id, timer);

      return id;
    },
    [removeToast],
  );

  const value = useMemo(
    () => ({ showToast, removeToast }),
    [showToast, removeToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}
