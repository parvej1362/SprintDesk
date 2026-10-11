import { Link } from 'react-router-dom';
import { Calendar, CheckCircle2, Edit2, Trash2, ArrowUpRight } from 'lucide-react';
import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';
import { formatShortDate } from '../../utils/formatters';

export default function ProjectCard({
  project,
  tasks = [],
  onEdit,
  onDelete,
}) {
  const projectTasks = tasks.filter((t) => t.projectId === project._id);
  const totalTasks = projectTasks.length;
  const completedTasks = projectTasks.filter((t) => t.status === 'done').length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      {/* Accent Color Stripe */}
      <div
        className="h-1.5 w-full"
        style={{ backgroundColor: project.color || '#6366F1' }}
      />

      <div className="p-5.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header: Title & Badges */}
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <Link
              to={`/projects/${project._id}`}
              className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1"
            >
              {project.name}
            </Link>
            <Badge type="project_status" value={project.status} />
          </div>

          {/* Description */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 min-h-8">
            {project.description || 'No description provided.'}
          </p>

          {/* Progress Bar */}
          <div className="mb-4">
            <ProgressBar progress={progress} color={project.color || '#6366F1'} size="sm" />
          </div>
        </div>

        {/* Footer Meta */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              {completedTasks}/{totalTasks} tasks
            </span>
            {project.dueDate && (
              <span className="flex items-center gap-1 text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                {formatShortDate(project.dueDate)}
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit?.(project)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Edit project"
              aria-label="Edit project"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete?.(project)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Delete project"
              aria-label="Delete project"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <Link
              to={`/projects/${project._id}`}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors ml-1"
              title="View project details"
              aria-label="View project details"
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
