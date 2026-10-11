import { FolderPlus } from 'lucide-react';

export default function EmptyState({
  icon: Icon = FolderPlus,
  title = 'No records found',
  description = 'Get started by creating a new record.',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-slate-200 text-center ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100/50 flex items-center justify-center text-indigo-600 mb-4 shadow-xs">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs hover:shadow transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
