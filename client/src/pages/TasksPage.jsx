import { useState, useMemo } from 'react';
import {
  Plus,
  List,
  Kanban,
  CheckSquare,
} from 'lucide-react';
import SearchInput from '../components/common/SearchInput';
import TaskTable from '../components/tasks/TaskTable';
import KanbanBoard from '../components/tasks/KanbanBoard';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import PaginationControls from '../components/common/PaginationControls';
import { useWorkspace } from '../context/WorkspaceContext';
import { TASK_STATUS, TASK_PRIORITY } from '../utils/constants';

export default function TasksPage() {
  const {
    tasks,
    projects,
    openNewTaskModal,
    openEditTaskModal,
    handleUpdateTaskStatus,
    handleDeleteTask,
  } = useWorkspace();

  const [activeTab, setActiveTab] = useState('table'); // 'table' | 'kanban'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [sortBy, setSortBy] = useState('latest'); // 'latest' | 'dueDate' | 'priority'
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [deleteTarget, setDeleteTarget] = useState(null);

  // Multi-criteria filter & sort
  const filteredAndSortedTasks = useMemo(() => {
    let result = tasks.filter((t) => {
      const matchesSearch =
        !searchQuery ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.assignee && t.assignee.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesProject =
        selectedProjectId === 'ALL' || t.projectId === selectedProjectId;

      const matchesStatus =
        selectedStatus === 'ALL' || t.status === selectedStatus;

      const matchesPriority =
        selectedPriority === 'ALL' || t.priority === selectedPriority;

      return matchesSearch && matchesProject && matchesStatus && matchesPriority;
    });

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (sortBy === 'priority') {
        const weight = { high: 3, medium: 2, low: 1 };
        return (weight[b.priority] || 0) - (weight[a.priority] || 0);
      }
      return 0;
    });

    return result;
  }, [tasks, searchQuery, selectedProjectId, selectedStatus, selectedPriority, sortBy]);

  // Paginated slice for table view
  const totalItems = filteredAndSortedTasks.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedTasks.slice(start, start + pageSize);
  }, [filteredAndSortedTasks, currentPage, pageSize]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await handleDeleteTask(deleteTarget._id);
    setDeleteTarget(null);
  };

  const hasActiveFilters =
    searchQuery ||
    selectedProjectId !== 'ALL' ||
    selectedStatus !== 'ALL' ||
    selectedPriority !== 'ALL';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedProjectId('ALL');
    setSelectedStatus('ALL');
    setSelectedPriority('ALL');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Title & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Task Center</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track sprint backlogs, task assignments, and lifecycle transitions.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Table / Kanban Switcher */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
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
              Table
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
              Kanban
            </button>
          </div>

          <button
            type="button"
            onClick={() => openNewTaskModal()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs hover:shadow transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>
      </div>

      {/* Multi-Criteria Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <SearchInput
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
            placeholder="Search by title, description, or assignee..."
            className="w-full md:max-w-sm"
          />

          {/* Quick Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Project Filter */}
            <select
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
            >
              <option value="ALL">All Projects</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
            >
              <option value="ALL">All Statuses</option>
              <option value={TASK_STATUS.TODO}>To Do</option>
              <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
              <option value={TASK_STATUS.IN_REVIEW}>In Review</option>
              <option value={TASK_STATUS.DONE}>Done</option>
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => {
                setSelectedPriority(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
            >
              <option value="ALL">All Priorities</option>
              <option value={TASK_PRIORITY.LOW}>Low Priority</option>
              <option value={TASK_PRIORITY.MEDIUM}>Medium Priority</option>
              <option value={TASK_PRIORITY.HIGH}>High Priority</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
            >
              <option value="latest">Sort: Latest Created</option>
              <option value="dueDate">Sort: Due Date</option>
              <option value="priority">Sort: Highest Priority</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 px-2 py-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* View Output (Table or Kanban) */}
      {filteredAndSortedTasks.length > 0 ? (
        activeTab === 'table' ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <TaskTable
              tasks={paginatedTasks}
              projects={projects}
              onStatusChange={handleUpdateTaskStatus}
              onEdit={openEditTaskModal}
              onDelete={setDeleteTarget}
            />
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        ) : (
          <KanbanBoard
            tasks={filteredAndSortedTasks}
            projects={projects}
            onStatusChange={handleUpdateTaskStatus}
            onEdit={openEditTaskModal}
            onDelete={setDeleteTarget}
          />
        )
      ) : (
        <EmptyState
          icon={CheckSquare}
          title={hasActiveFilters ? 'No tasks match your filters' : 'No tasks created yet'}
          description={
            hasActiveFilters
              ? 'Try widening your search terms or clearing status and priority filters.'
              : 'Add tasks to start organizing your sprint deliverables.'
          }
          actionLabel={hasActiveFilters ? 'Reset Filters' : 'Create Task'}
          onAction={hasActiveFilters ? resetFilters : () => openNewTaskModal()}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Task"
        message={`Are you sure you want to delete task "${deleteTarget?.title}"? This cannot be undone.`}
      />
    </div>
  );
}
