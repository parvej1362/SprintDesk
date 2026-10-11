import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  CheckCircle2,
  Plus,
  Edit2,
  Trash2,
  ArrowLeft,
  List,
  Kanban,
  AlertTriangle,
} from 'lucide-react';
import Badge from '../components/common/Badge';
import ProgressBar from '../components/common/ProgressBar';
import TaskTable from '../components/tasks/TaskTable';
import KanbanBoard from '../components/tasks/KanbanBoard';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useWorkspace } from '../context/WorkspaceContext';
import { formatDate } from '../utils/formatters';

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    getProjectById,
    tasks,
    projects,
    openEditProjectModal,
    openNewTaskModal,
    openEditTaskModal,
    handleUpdateTaskStatus,
    handleDeleteProject,
    handleDeleteTask,
  } = useWorkspace();

  const [activeTab, setActiveTab] = useState('table'); // 'table' | 'kanban'
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    type: null, // 'project' | 'task'
    target: null,
  });

  const project = getProjectById(id);

  // Tasks belonging to this project
  const projectTasks = useMemo(() => {
    return tasks.filter((t) => t.projectId === id);
  }, [tasks, id]);

  const totalTasks = projectTasks.length;
  const completedTasks = projectTasks.filter((t) => t.status === 'done').length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (!project) {
    return (
      <div className="py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 mx-auto mb-4">
          <AlertTriangle className="w-7 h-7 text-amber-500" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Project Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">
          The requested project ID does not exist or was deleted.
        </p>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
      </div>
    );
  }

  const confirmDelete = async () => {
    if (!deleteDialog.target) return;
    if (deleteDialog.type === 'project') {
      await handleDeleteProject(project._id);
      navigate('/projects');
    } else if (deleteDialog.type === 'task') {
      await handleDeleteTask(deleteDialog.target._id);
    }
    setDeleteDialog({ isOpen: false, type: null, target: null });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Back button link */}
      <div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
      </div>

      {/* Project Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Color stripe */}
        <div className="h-2 w-full" style={{ backgroundColor: project.color || '#6366F1' }} />

        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {project.name}
                </h1>
                <Badge type="project_status" value={project.status} />
              </div>
              <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                {project.description || 'No description provided.'}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 self-start">
              <button
                type="button"
                onClick={() => openEditProjectModal(project)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                type="button"
                onClick={() =>
                  setDeleteDialog({
                    isOpen: true,
                    type: 'project',
                    target: project,
                  })
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>

          {/* Progress & Milestone Meta */}
          <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-5 items-center">
            <div className="sm:col-span-2">
              <ProgressBar progress={progress} color={project.color || '#6366F1'} size="md" />
            </div>

            <div className="flex items-center justify-start sm:justify-end gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                {completedTasks}/{totalTasks} Completed
              </span>
              {project.dueDate && (
                <span className="flex items-center gap-1 text-slate-600 font-medium">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Due: {formatDate(project.dueDate)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Task Section Header & Tab Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-slate-900">Project Tasks</h2>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {totalTasks}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Tab Switcher */}
          <div className="flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('table')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'table'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Table View
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('kanban')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'kanban'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              Kanban Board
            </button>
          </div>

          {/* Add Task Button scoped to this project */}
          <button
            type="button"
            onClick={() => openNewTaskModal(project._id)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs hover:shadow transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Task
          </button>
        </div>
      </div>

      {/* Tasks Content (Table or Board) */}
      {projectTasks.length > 0 ? (
        activeTab === 'table' ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <TaskTable
              tasks={projectTasks}
              projects={projects}
              onStatusChange={handleUpdateTaskStatus}
              onEdit={openEditTaskModal}
              onDelete={(t) =>
                setDeleteDialog({
                  isOpen: true,
                  type: 'task',
                  target: t,
                })
              }
            />
          </div>
        ) : (
          <KanbanBoard
            tasks={projectTasks}
            projects={projects}
            onStatusChange={handleUpdateTaskStatus}
            onEdit={openEditTaskModal}
            onDelete={(t) =>
              setDeleteDialog({
                isOpen: true,
                type: 'task',
                target: t,
              })
            }
          />
        )
      ) : (
        <EmptyState
          title="No tasks in this project yet"
          description="Create the first sprint task to start tracking execution milestones."
          actionLabel="Create Task"
          onAction={() => openNewTaskModal(project._id)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onCancel={() => setDeleteDialog({ isOpen: false, type: null, target: null })}
        onConfirm={confirmDelete}
        title={deleteDialog.type === 'project' ? 'Delete Project' : 'Delete Task'}
        message={
          deleteDialog.type === 'project'
            ? `Are you sure you want to delete "${project.name}"? All associated tasks will be removed.`
            : `Are you sure you want to delete task "${deleteDialog.target?.title}"?`
        }
      />
    </div>
  );
}
