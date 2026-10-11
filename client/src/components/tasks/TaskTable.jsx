import { Calendar, AlertTriangle, Edit2, Trash2 } from 'lucide-react';
import Badge from '../common/Badge';
import { TASK_STATUS } from '../../utils/constants';
import { formatShortDate, isOverdue } from '../../utils/formatters';

export default function TaskTable({
  tasks = [],
  projects = [],
  onStatusChange,
  onEdit,
  onDelete,
}) {
  const projectMap = new Map(projects.map((p) => [p._id, p]));

  if (tasks.length === 0) {
    return (
      <div className="py-12 text-center text-slate-500 text-sm">
        No tasks found matching your criteria.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200/80 bg-slate-50/60 text-slate-600 text-xs font-semibold uppercase tracking-wider">
            <th className="py-3 px-4">Task</th>
            <th className="py-3 px-4">Project</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Priority</th>
            <th className="py-3 px-4">Assignee</th>
            <th className="py-3 px-4">Due Date</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {tasks.map((task) => {
            const project = projectMap.get(task.projectId);
            const overdue = isOverdue(task.dueDate, task.status);

            return (
              <tr
                key={task._id}
                className="hover:bg-slate-50/80 transition-colors group"
              >
                {/* Title */}
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-800 line-clamp-1">
                    {task.title}
                  </div>
                  {task.description && (
                    <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {task.description}
                    </div>
                  )}
                </td>

                {/* Parent Project */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {project ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-100/80 px-2.5 py-1 rounded-lg">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: project.color || '#6366F1' }}
                      />
                      <span className="truncate max-w-[130px]">{project.name}</span>
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Unassigned</span>
                  )}
                </td>

                {/* Status with quick inline switch */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <select
                    value={task.status}
                    onChange={(e) => onStatusChange?.(task._id, e.target.value)}
                    className="text-xs font-semibold rounded-lg px-2.5 py-1 bg-white border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 cursor-pointer shadow-2xs"
                  >
                    <option value={TASK_STATUS.TODO}>To Do</option>
                    <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
                    <option value={TASK_STATUS.IN_REVIEW}>In Review</option>
                    <option value={TASK_STATUS.DONE}>Done</option>
                  </select>
                </td>

                {/* Priority */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <Badge type="priority" value={task.priority} />
                </td>

                {/* Assignee */}
                <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-600">
                  {task.assignee ? (
                    <span className="flex items-center gap-1.5 font-medium">
                      <span className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
                        {task.assignee.slice(0, 1).toUpperCase()}
                      </span>
                      {task.assignee}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic">Unassigned</span>
                  )}
                </td>

                {/* Due Date & Overdue Indicator */}
                <td className="py-3.5 px-4 whitespace-nowrap text-xs">
                  {task.dueDate ? (
                    <span
                      className={`inline-flex items-center gap-1 font-medium ${
                        overdue
                          ? 'text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md'
                          : 'text-slate-600'
                      }`}
                    >
                      {overdue ? (
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      )}
                      {formatShortDate(task.dueDate)}
                    </span>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit?.(task)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      title="Edit task"
                      aria-label="Edit task"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete?.(task)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete task"
                      aria-label="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
