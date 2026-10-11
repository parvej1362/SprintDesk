import { useState, useCallback, useEffect } from 'react';
import { INITIAL_PROJECTS } from '../services/mockData';

// Local storage key for persistent client mock state
const STORAGE_KEY = 'sprintdesk_projects';

export function useProjects() {
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to sync projects to localStorage', e);
    }
  }, [projects]);

  const createProject = useCallback(async (projectData) => {
    setIsLoading(true);
    try {
      const newProject = {
        ...projectData,
        _id: 'proj_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProjects((prev) => [newProject, ...prev]);
      return newProject;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProject = useCallback(async (id, updateData) => {
    setIsLoading(true);
    try {
      let updatedProject = null;
      setProjects((prev) =>
        prev.map((p) => {
          if (p._id === id) {
            updatedProject = {
              ...p,
              ...updateData,
              updatedAt: new Date().toISOString(),
            };
            return updatedProject;
          }
          return p;
        })
      );
      return updatedProject;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteProject = useCallback(async (id) => {
    setIsLoading(true);
    try {
      setProjects((prev) => prev.filter((p) => p._id !== id));
      return { success: true, deletedId: id };
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getProjectById = useCallback(
    (id) => {
      return projects.find((p) => p._id === id) || null;
    },
    [projects]
  );

  return {
    projects,
    isLoading,
    error,
    createProject,
    updateProject,
    deleteProject,
    getProjectById,
    setProjects,
  };
}
