
export default function Skeleton({ variant = 'card', count = 1, className = '' }) {
  const items = Array.from({ length: count });

  if (variant === 'stat') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((_, i) => (
          <div
            key={i}
            className="p-5 bg-white rounded-2xl border border-slate-100 shadow-xs animate-pulse flex flex-col gap-3"
          >
            <div className="flex justify-between items-center">
              <div className="w-24 h-4 bg-slate-200 rounded-md" />
              <div className="w-9 h-9 bg-slate-100 rounded-xl" />
            </div>
            <div className="w-16 h-8 bg-slate-200 rounded-md mt-1" />
            <div className="w-32 h-3 bg-slate-100 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table-row') {
    return (
      <div className="divide-y divide-slate-100 animate-pulse">
        {items.map((_, i) => (
          <div key={i} className="py-4 px-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-1/3">
              <div className="w-4 h-4 bg-slate-200 rounded-sm" />
              <div className="w-48 h-4 bg-slate-200 rounded-md" />
            </div>
            <div className="w-24 h-6 bg-slate-100 rounded-full" />
            <div className="w-20 h-6 bg-slate-100 rounded-full" />
            <div className="w-24 h-4 bg-slate-100 rounded-md" />
            <div className="w-16 h-4 bg-slate-100 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'project-card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((_, i) => (
          <div
            key={i}
            className="p-6 bg-white rounded-2xl border border-slate-100 shadow-xs animate-pulse flex flex-col gap-4"
          >
            <div className="flex justify-between items-start">
              <div className="w-36 h-5 bg-slate-200 rounded-md" />
              <div className="w-16 h-5 bg-slate-100 rounded-full" />
            </div>
            <div className="w-full h-10 bg-slate-100 rounded-md" />
            <div className="w-full h-2 bg-slate-200 rounded-full mt-2" />
            <div className="flex justify-between items-center pt-2 border-t border-slate-50">
              <div className="w-20 h-4 bg-slate-100 rounded-md" />
              <div className="w-24 h-4 bg-slate-100 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`bg-slate-200 rounded-lg animate-pulse ${className}`} />
  );
}
