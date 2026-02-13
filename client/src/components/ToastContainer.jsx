function typeClasses(type) {
  if (type === "error") return "border-red-200 bg-red-50 text-red-800";
  if (type === "info") return "border-slate-200 bg-slate-50 text-slate-800";
  return "border-emerald-200 bg-emerald-50 text-emerald-800";
}

function ToastContainer({ toasts, onClose }) {
  return (
    <div className="fixed bottom-4 left-4 z-50 flex w-[min(92vw,360px)] flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          dir="rtl"
          className={[
            "flex items-start justify-between gap-3 rounded-xl border px-4 py-3 shadow-sm",
            typeClasses(t.type),
          ].join(" ")}
        >
          <div className="text-sm leading-6">{t.message}</div>

          <button
            type="button"
            onClick={() => onClose(t.id)}
            className="rounded-lg px-2 py-1 text-xs opacity-80 hover:opacity-100"
            aria-label="סגור"
            title="סגור"
          >
            סגור
          </button>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
