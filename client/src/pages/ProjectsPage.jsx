import { useState, useMemo } from 'react';
import { Plus, FolderKanban } from 'lucide-react';
import SearchInput from '../components/common/SearchInput';
import ProjectCard from '../components/projects/ProjectCard';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useWorkspace } from '../context/WorkspaceContext';
import { PROJECT_STATUS } from '../utils/constants';

export default function ProjectsPage() {
  const {
    projects,
    tasks,
    openNewProjectModal,
    openEditProjectModal,
    handleDeleteProject,
  } = useWorkspace();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [deleteTarget, setDeleteTarget] = useState(null);

  // Filter projects by search and status
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === 'ALL' || p.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchQuery, statusFilter]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await handleDeleteProject(deleteTarget._id);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Projects</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage strategic initiatives, sprint milestones, and project completion rates.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewProjectModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs hover:shadow transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Project
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        {/* Search Input */}
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search projects by name or description..."
          className="w-full sm:max-w-xs"
        />

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: 'ALL', label: 'All Projects' },
            { key: PROJECT_STATUS.ACTIVE, label: 'Active' },
            { key: PROJECT_STATUS.PLANNED, label: 'Planned' },
            { key: PROJECT_STATUS.COMPLETED, label: 'Completed' },
            { key: PROJECT_STATUS.ON_HOLD, label: 'On Hold' },
          ].map((tab) => (
            <button
              type="button"
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab.key
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid or Empty State */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              tasks={tasks}
              onEdit={openEditProjectModal}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FolderKanban}
          title={searchQuery || statusFilter !== 'ALL' ? 'No projects match your filter' : 'No projects yet'}
          description={
            searchQuery || statusFilter !== 'ALL'
              ? 'Try adjusting your search query or reset status filters.'
              : 'Create your first project to start organizing tasks and tracking sprints.'
          }
          actionLabel={searchQuery || statusFilter !== 'ALL' ? 'Reset Filters' : 'Create Project'}
          onAction={
            searchQuery || statusFilter !== 'ALL'
              ? () => {
                  setSearchQuery('');
                  setStatusFilter('ALL');
                }
              : openNewProjectModal
          }
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? All associated tasks will be removed permanently.`}
      />
    </div>
  );
}
