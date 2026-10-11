import {
  BarChart3,
  PieChart as PieIcon,
} from 'lucide-react';
import TaskStatusChart from '../components/dashboard/TaskStatusChart';
import ProgressBar from '../components/common/ProgressBar';
import { useWorkspace } from '../context/WorkspaceContext';

export default function AnalyticsPage() {
  const { projects, tasks } = useWorkspace();

  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const overallProgress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Priority Breakdown
  const priorityCounts = {
    high: tasks.filter((t) => t.priority === 'high').length,
    medium: tasks.filter((t) => t.priority === 'medium').length,
    low: tasks.filter((t) => t.priority === 'low').length,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Sprint Analytics
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Detailed metrics, velocity tracking, and project health distributions.
        </p>
      </div>

      {/* Top Velocity Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Workspace Velocity
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            {overallProgress}% Total Completion
          </h2>
          <p className="text-xs text-slate-500">
            {completedTasks} of {totalTasks} sprint deliverables finalized across {totalProjects} active projects.
          </p>
        </div>

        <div className="w-full md:w-72">
          <ProgressBar progress={overallProgress} size="lg" />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              Status Lifecycle Allocation
            </h3>
            <span className="text-xs text-slate-400">All Tasks</span>
          </div>
          <TaskStatusChart tasks={tasks} />
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                <PieIcon className="w-4 h-4 text-amber-500" />
                Priority Stratification
              </h3>
              <span className="text-xs text-slate-400">Urgency Distribution</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-red-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    High Priority
                  </span>
                  <span className="text-slate-900">{priorityCounts.high} tasks</span>
                </div>
                <ProgressBar
                  progress={totalTasks > 0 ? (priorityCounts.high / totalTasks) * 100 : 0}
                  color="#EF4444"
                  showLabel={false}
                  size="sm"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-blue-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Medium Priority
                  </span>
                  <span className="text-slate-900">{priorityCounts.medium} tasks</span>
                </div>
                <ProgressBar
                  progress={totalTasks > 0 ? (priorityCounts.medium / totalTasks) * 100 : 0}
                  color="#3B82F6"
                  showLabel={false}
                  size="sm"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    Low Priority
                  </span>
                  <span className="text-slate-900">{priorityCounts.low} tasks</span>
                </div>
                <ProgressBar
                  progress={totalTasks > 0 ? (priorityCounts.low / totalTasks) * 100 : 0}
                  color="#94A3B8"
                  showLabel={false}
                  size="sm"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Critical Path Load</span>
            <span className="font-semibold text-slate-800">
              {totalTasks > 0 ? Math.round((priorityCounts.high / totalTasks) * 100) : 0}% High
            </span>
          </div>
        </div>
      </div>

      {/* Project Completion Velocity List */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <h3 className="font-bold text-slate-900 text-sm mb-4">
          Project Completion Breakdown
        </h3>
        <div className="divide-y divide-slate-100">
          {projects.map((proj) => {
            const projTasks = tasks.filter((t) => t.projectId === proj._id);
            const done = projTasks.filter((t) => t.status === 'done').length;
            const pct = projTasks.length > 0 ? Math.round((done / projTasks.length) * 100) : 0;

            return (
              <div key={proj._id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 w-64">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: proj.color }} />
                  <span className="font-semibold text-xs text-slate-800 truncate">
                    {proj.name}
                  </span>
                </div>
                <div className="flex-1 max-w-md">
                  <ProgressBar progress={pct} color={proj.color} size="sm" />
                </div>
                <div className="text-xs text-slate-500 sm:text-right font-medium">
                  {done} / {projTasks.length} tasks
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
