import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import ProjectFormModal from '../projects/ProjectFormModal';
import TaskFormModal from '../tasks/TaskFormModal';
import { useWorkspace } from '../../context/WorkspaceContext';

export default function AppShell() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const {
    projects,
    projectModalState,
    taskModalState,
    openNewProjectModal,
    openNewTaskModal,
    closeProjectModal,
    closeTaskModal,
    handleSaveProject,
    handleSaveTask,
  } = useWorkspace();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area (offset by 256px on desktop) */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0 transition-all">
        {/* Top Header */}
        <Topbar
          onMenuToggle={() => setIsMobileSidebarOpen((prev) => !prev)}
          onOpenNewTask={() => openNewTaskModal()}
          onOpenNewProject={openNewProjectModal}
        />

        {/* Dynamic Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Modals Mounted at Shell Level */}
      <ProjectFormModal
        isOpen={projectModalState.isOpen}
        onClose={closeProjectModal}
        onSubmit={handleSaveProject}
        initialData={projectModalState.editingProject}
      />

      <TaskFormModal
        isOpen={taskModalState.isOpen}
        onClose={closeTaskModal}
        onSubmit={handleSaveTask}
        projects={projects}
        defaultProjectId={taskModalState.defaultProjectId}
        initialData={taskModalState.editingTask}
      />
    </div>
  );
}
