export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border p-4 space-y-3">
      <div className="h-5 w-2/3 bg-slate-200 rounded"></div>
      <div className="h-4 w-full bg-slate-200 rounded"></div>
      <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
      <div className="h-3 w-1/4 bg-slate-200 rounded"></div>
    </div>
  );
}
