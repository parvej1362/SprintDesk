import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  CheckSquare,
  Clock,
  AlertTriangle,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import TaskStatusChart from '../components/dashboard/TaskStatusChart';
import ProjectCard from '../components/projects/ProjectCard';
import TaskTable from '../components/tasks/TaskTable';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useWorkspace } from '../context/WorkspaceContext';
import { isOverdue } from '../utils/formatters';

export default function DashboardPage() {
  const navigate = useNavigate();
  const {
    projects,
    tasks,
    openNewProjectModal,
    openNewTaskModal,
    openEditProjectModal,
    openEditTaskModal,
    handleUpdateTaskStatus,
    handleDeleteProject,
    handleDeleteTask,
  } = useWorkspace();

  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    type: null, // 'project' | 'task'
    target: null,
  });

  // Calculate Metrics
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === 'active').length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const overdueTasksList = tasks.filter((t) => isOverdue(t.dueDate, t.status));
  const overdueTasksCount = overdueTasksList.length;

  // Active Projects Preview (Top 3)
  const previewProjects = projects.slice(0, 3);

  // Recent Tasks (Top 6 latest)
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  const confirmDelete = async () => {
    if (!deleteDialog.target) return;
    if (deleteDialog.type === 'project') {
      await handleDeleteProject(deleteDialog.target._id);
    } else if (deleteDialog.type === 'task') {
      await handleDeleteTask(deleteDialog.target._id);
    }
    setDeleteDialog({ isOpen: false, type: null, target: null });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Sprint Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor sprint velocity, active deliverables, and project health metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={openNewProjectModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/80 shadow-2xs transition-all"
          >
            <Plus className="w-4 h-4 text-slate-500" />
            New Project
          </button>
          <button
            type="button"
            onClick={() => openNewTaskModal()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs hover:shadow transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Projects"
          value={totalProjects}
          icon={FolderKanban}
          colorVariant="indigo"
          description={`${activeProjects} active initiatives`}
          onClick={() => navigate('/projects')}
        />

        <StatCard
          title="Active Projects"
          value={activeProjects}
          icon={TrendingUp}
          colorVariant="sky"
          description="In delivery & review"
          onClick={() => navigate('/projects')}
        />

        <StatCard
          title="Completed Tasks"
          value={`${completedTasks}/${totalTasks}`}
          icon={CheckSquare}
          colorVariant="emerald"
          description={
            totalTasks > 0
              ? `${Math.round((completedTasks / totalTasks) * 100)}% overall completion`
              : 'No tasks tracked'
          }
          onClick={() => navigate('/tasks')}
        />

        <StatCard
          title="Overdue Tasks"
          value={overdueTasksCount}
          icon={AlertTriangle}
          colorVariant={overdueTasksCount > 0 ? 'red' : 'emerald'}
          description={
            overdueTasksCount > 0
              ? 'Action required on overdue milestones'
              : 'All deadlines on track'
          }
          onClick={() => navigate('/tasks')}
        />
      </div>

      {/* Middle Row: Task Status Distribution Chart + Overdue Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Chart Card */}
        <div className="lg:col-span-2 p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Task Status Distribution
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Workload allocation across 4 workflow stages
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
              {totalTasks} Total Tasks
            </span>
          </div>

          <TaskStatusChart tasks={tasks} />
        </div>

        {/* Overdue Alerts / Milestone Highlights */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4.5 h-4.5 text-amber-500" />
                Attention Needed
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 bg-red-50 text-red-700 rounded-full border border-red-200">
                {overdueTasksCount} Overdue
              </span>
            </div>

            {overdueTasksCount === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No overdue tasks! All sprint milestones are on schedule.
              </div>
            ) : (
              <div className="space-y-3">
                {overdueTasksList.slice(0, 4).map((task) => (
                  <div
                    key={task._id}
                    className="p-3 rounded-xl border border-red-100 bg-red-50/40 flex items-start justify-between gap-2.5"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {task.title}
                      </p>
                      <p className="text-[11px] text-red-600 mt-0.5 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUpdateTaskStatus(task._id, 'done')}
                      className="px-2 py-1 rounded-md text-[11px] font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 shrink-0"
                    >
                      Mark Done
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate('/tasks')}
            className="w-full mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-1 transition-colors"
          >
            Manage All Tasks
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Active Projects Preview Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Active Projects</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Current initiatives and sprint progress
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            View All ({totalProjects})
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {previewProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              tasks={tasks}
              onEdit={openEditProjectModal}
              onDelete={(p) =>
                setDeleteDialog({
                  isOpen: true,
                  type: 'project',
                  target: p,
                })
              }
            />
          ))}
        </div>
      </div>

      {/* Recent Tasks Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Tasks</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Recently updated tasks across all workspace initiatives
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/tasks')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            View All Tasks
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <TaskTable
          tasks={recentTasks}
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

      {/* Destructive Confirm Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onCancel={() => setDeleteDialog({ isOpen: false, type: null, target: null })}
        onConfirm={confirmDelete}
        title={deleteDialog.type === 'project' ? 'Delete Project' : 'Delete Task'}
        message={
          deleteDialog.type === 'project'
            ? `Are you sure you want to delete "${deleteDialog.target?.name}"? All associated tasks will be removed.`
            : `Are you sure you want to permanently delete task "${deleteDialog.target?.title}"?`
        }
      />
    </div>
  );
}
