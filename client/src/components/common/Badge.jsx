import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS, PROJECT_STATUS_LABELS } from '../../utils/constants';

export default function Badge({
  type = 'status', // 'status' | 'priority' | 'project_status' | 'overdue' | 'custom'
  value,
  label,
  className = '',
}) {
  let displayLabel = label || value;
  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  if (type === 'status') {
    displayLabel = label || TASK_STATUS_LABELS[value] || value;
    switch (value) {
      case 'todo':
        colorClasses = 'bg-slate-100 text-slate-700 border-slate-300';
        break;
      case 'in_progress':
        colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
        break;
      case 'in_review':
        colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
        break;
      case 'done':
        colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        break;
      default:
        colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
    }
  } else if (type === 'priority') {
    displayLabel = label || TASK_PRIORITY_LABELS[value] || value;
    switch (value) {
      case 'low':
        colorClasses = 'bg-slate-50 text-slate-600 border-slate-200';
        break;
      case 'medium':
        colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
        break;
      case 'high':
        colorClasses = 'bg-red-50 text-red-700 border-red-200 font-semibold';
        break;
      default:
        colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
    }
  } else if (type === 'project_status') {
    displayLabel = label || PROJECT_STATUS_LABELS[value] || value;
    switch (value) {
      case 'planned':
        colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
        break;
      case 'active':
        colorClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200';
        break;
      case 'completed':
        colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        break;
      case 'on_hold':
        colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
        break;
      default:
        colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
    }
  } else if (type === 'overdue') {
    displayLabel = label || 'Overdue';
    colorClasses = 'bg-red-50 text-red-700 border-red-200 font-medium';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border ${colorClasses} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 mr-1.5" />
      {displayLabel}
    </span>
  );
}
