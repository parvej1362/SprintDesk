import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { useToast } from './ToastContext';

const WorkspaceContext = createContext(null);

export function WorkspaceProvider({ children }) {
  const { showToast } = useToast();

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Global Modals State
  const [projectModalState, setProjectModalState] = useState({
    isOpen: false,
    editingProject: null,
  });

  const [taskModalState, setTaskModalState] = useState({
    isOpen: false,
    editingTask: null,
    defaultProjectId: '',
  });

  // Fetch live workspace data from backend API
  const fetchWorkspaceData = useCallback(async () => {
    try {
      const [projectsRes, tasksRes] = await Promise.all([
        projectService.getProjects({ limit: 100 }),
        taskService.getTasks({ limit: 100 }),
      ]);

      if (projectsRes?.data) {
        setProjects(projectsRes.data);
      }
      if (tasksRes?.data) {
        setTasks(tasksRes.data);
      }
    } catch (err) {
      console.warn('[Workspace] Error fetching from backend API:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([
      projectService.getProjects({ limit: 100 }),
      taskService.getTasks({ limit: 100 }),
    ])
      .then(([projectsRes, tasksRes]) => {
        if (active) {
          if (projectsRes?.data) setProjects(projectsRes.data);
          if (tasksRes?.data) setTasks(tasksRes.data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          console.warn('[Workspace] Error fetching from backend API:', err.message);
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // Modal handlers
  const openNewProjectModal = useCallback(() => {
    setProjectModalState({ isOpen: true, editingProject: null });
  }, []);

  const openEditProjectModal = useCallback((project) => {
    setProjectModalState({ isOpen: true, editingProject: project });
  }, []);

  const closeProjectModal = useCallback(() => {
    setProjectModalState({ isOpen: false, editingProject: null });
  }, []);

  const openNewTaskModal = useCallback((defaultProjectId = '') => {
    setTaskModalState({
      isOpen: true,
      editingTask: null,
      defaultProjectId: defaultProjectId || (projects[0]?._id || ''),
    });
  }, [projects]);

  const openEditTaskModal = useCallback((task) => {
    setTaskModalState({
      isOpen: true,
      editingTask: task,
      defaultProjectId: task.projectId?._id || task.projectId,
    });
  }, []);

  const closeTaskModal = useCallback(() => {
    setTaskModalState({ isOpen: false, editingTask: null, defaultProjectId: '' });
  }, []);

  const getProjectById = useCallback(
    (id) => {
      return projects.find((p) => p._id === id) || null;
    },
    [projects]
  );

  // Real Backend API Handlers with Toast Feedback
  const handleSaveProject = async (formData) => {
    try {
      if (projectModalState.editingProject) {
        await projectService.updateProject(projectModalState.editingProject._id, formData);
        showToast('Project updated successfully.', 'success');
      } else {
        await projectService.createProject(formData);
        showToast('New project created successfully.', 'success');
      }
      closeProjectModal();
      await fetchWorkspaceData();
    } catch (err) {
      showToast(err.message || 'Failed to save project.', 'error');
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await projectService.deleteProject(projectId, true);
      showToast('Project and child tasks deleted successfully.', 'success');
      await fetchWorkspaceData();
    } catch (err) {
      showToast(err.message || 'Failed to delete project.', 'error');
    }
  };

  const handleSaveTask = async (formData) => {
    try {
      if (taskModalState.editingTask) {
        await taskService.updateTask(taskModalState.editingTask._id, formData);
        showToast('Task updated successfully.', 'success');
      } else {
        await taskService.createTask(formData);
        showToast('New task added successfully.', 'success');
      }
      closeTaskModal();
      await fetchWorkspaceData();
    } catch (err) {
      showToast(err.message || 'Failed to save task.', 'error');
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await taskService.updateTask(taskId, { status: newStatus });
      showToast('Task status updated.', 'success');
      await fetchWorkspaceData();
    } catch (err) {
      showToast(err.message || 'Failed to update task status.', 'error');
      await fetchWorkspaceData();
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      showToast('Task deleted successfully.', 'success');
      await fetchWorkspaceData();
    } catch (err) {
      showToast(err.message || 'Failed to delete task.', 'error');
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{
        projects,
        tasks,
        isLoading,
        getProjectById,
        refetch: fetchWorkspaceData,
        // Modals
        projectModalState,
        taskModalState,
        openNewProjectModal,
        openEditProjectModal,
        closeProjectModal,
        openNewTaskModal,
        openEditTaskModal,
        closeTaskModal,
        // Handlers
        handleSaveProject,
        handleDeleteProject,
        handleSaveTask,
        handleUpdateTaskStatus,
        handleDeleteTask,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
