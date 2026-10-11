
export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  colorVariant = 'indigo',
  onClick,
}) {
  const colorStyles = {
    indigo: {
      bg: 'bg-indigo-50/70',
      text: 'text-indigo-600',
      border: 'border-indigo-100/50',
    },
    emerald: {
      bg: 'bg-emerald-50/70',
      text: 'text-emerald-600',
      border: 'border-emerald-100/50',
    },
    sky: {
      bg: 'bg-sky-50/70',
      text: 'text-sky-600',
      border: 'border-sky-100/50',
    },
    amber: {
      bg: 'bg-amber-50/70',
      text: 'text-amber-600',
      border: 'border-amber-100/50',
    },
    red: {
      bg: 'bg-red-50/70',
      text: 'text-red-600',
      border: 'border-red-100/50',
    },
  }[colorVariant] || {
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-100',
  };

  return (
    <div
      onClick={onClick}
      className={`p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:border-indigo-300' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center border ${colorStyles.bg} ${colorStyles.text} ${colorStyles.border} shadow-2xs`}
          >
            <Icon className="w-4.5 h-4.5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-2xl font-bold text-slate-900 tracking-tight">
          {value}
        </span>
        {trend && (
          <span className="text-xs font-semibold text-emerald-600 flex items-center">
            {trend}
          </span>
        )}
      </div>

      {description && (
        <p className="text-xs text-slate-400 mt-2 truncate">
          {description}
        </p>
      )}
    </div>
  );
}
