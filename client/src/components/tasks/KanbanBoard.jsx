import {
  Calendar,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Edit2,
  Trash2,
} from 'lucide-react';
import Badge from '../common/Badge';
import { TASK_STATUS, TASK_STATUS_LABELS } from '../../utils/constants';
import { formatShortDate, isOverdue } from '../../utils/formatters';

const COLUMNS = [
  { key: TASK_STATUS.TODO, label: 'To Do', color: 'border-slate-300' },
  { key: TASK_STATUS.IN_PROGRESS, label: 'In Progress', color: 'border-blue-400' },
  { key: TASK_STATUS.IN_REVIEW, label: 'In Review', color: 'border-amber-400' },
  { key: TASK_STATUS.DONE, label: 'Done', color: 'border-emerald-400' },
];

const STATUS_ORDER = [
  TASK_STATUS.TODO,
  TASK_STATUS.IN_PROGRESS,
  TASK_STATUS.IN_REVIEW,
  TASK_STATUS.DONE,
];

export default function KanbanBoard({
  tasks = [],
  projects = [],
  onStatusChange,
  onEdit,
  onDelete,
}) {
  const projectMap = new Map(projects.map((p) => [p._id, p]));

  const getNextStatus = (current) => {
    const idx = STATUS_ORDER.indexOf(current);
    return idx < STATUS_ORDER.length - 1 ? STATUS_ORDER[idx + 1] : null;
  };

  const getPrevStatus = (current) => {
    const idx = STATUS_ORDER.indexOf(current);
    return idx > 0 ? STATUS_ORDER[idx - 1] : null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
      {COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.key);

        return (
          <div
            key={col.key}
            className="bg-slate-100/70 rounded-2xl border border-slate-200/80 p-4 flex flex-col min-h-[500px]"
          >
            {/* Column Header */}
            <div className={`flex items-center justify-between pb-3 mb-3 border-b-2 ${col.color}`}>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-800">{col.label}</h3>
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                  {columnTasks.length}
                </span>
              </div>
            </div>

            {/* Column Task Cards */}
            <div className="space-y-3 flex-1 overflow-y-auto">
              {columnTasks.map((task) => {
                const project = projectMap.get(task.projectId);
                const overdue = isOverdue(task.dueDate, task.status);
                const prevStatus = getPrevStatus(task.status);
                const nextStatus = getNextStatus(task.status);

                return (
                  <div
                    key={task._id}
                    className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between gap-3 group"
                  >
                    <div>
                      {/* Project Tag & Priority */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        {project ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 truncate max-w-[120px]">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: project.color || '#6366F1' }}
                            />
                            <span className="truncate">{project.name}</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">Unassigned</span>
                        )}
                        <Badge type="priority" value={task.priority} />
                      </div>

                      {/* Title */}
                      <h4 className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors leading-snug">
                        {task.title}
                      </h4>

                      {/* Description preview */}
                      {task.description && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      )}
                    </div>

                    {/* Metadata: Assignee & Due Date */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        {task.assignee ? (
                          <div
                            className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center text-[10px] font-bold"
                            title={`Assigned to ${task.assignee}`}
                          >
                            {task.assignee.slice(0, 1).toUpperCase()}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}

                        {task.dueDate && (
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                              overdue
                                ? 'text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded'
                                : 'text-slate-500'
                            }`}
                          >
                            {overdue ? (
                              <AlertTriangle className="w-3 h-3 text-red-500" />
                            ) : (
                              <Calendar className="w-3 h-3 text-slate-400" />
                            )}
                            {formatShortDate(task.dueDate)}
                          </span>
                        )}
                      </div>

                      {/* Quick Edit/Delete */}
                      <div className="flex items-center gap-0.5 opacity-90 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => onEdit?.(task)}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                          title="Edit"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete?.(task)}
                          className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Quick Column Progression Arrows */}
                    <div className="flex items-center justify-between pt-1">
                      {prevStatus ? (
                        <button
                          type="button"
                          onClick={() => onStatusChange?.(task._id, prevStatus)}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 px-2 py-0.5 rounded-md transition-colors"
                          title={`Move back to ${TASK_STATUS_LABELS[prevStatus]}`}
                        >
                          <ChevronLeft className="w-3 h-3" />
                          Back
                        </button>
                      ) : <div />}

                      {nextStatus && (
                        <button
                          type="button"
                          onClick={() => onStatusChange?.(task._id, nextStatus)}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2 py-0.5 rounded-md transition-colors ml-auto"
                          title={`Advance to ${TASK_STATUS_LABELS[nextStatus]}`}
                        >
                          Advance
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {columnTasks.length === 0 && (
                <div className="h-28 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400">
                  Empty column
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
