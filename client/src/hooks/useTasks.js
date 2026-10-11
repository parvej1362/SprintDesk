import { useState, useCallback, useEffect } from 'react';
import { INITIAL_TASKS } from '../services/mockData';

const STORAGE_KEY = 'sprintdesk_tasks';

export function useTasks() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to sync tasks to localStorage', e);
    }
  }, [tasks]);

  const createTask = useCallback(async (taskData) => {
    setIsLoading(true);
    try {
      const newTask = {
        ...taskData,
        _id: 'task_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
        completedAt: taskData.status === 'done' ? new Date().toISOString() : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (id, updateData) => {
    setIsLoading(true);
    try {
      let updatedTask = null;
      setTasks((prev) =>
        prev.map((t) => {
          if (t._id === id) {
            const isNowDone = updateData.status === 'done';
            const wasDone = t.status === 'done';
            let completedAt = t.completedAt;

            if (isNowDone && !wasDone) {
              completedAt = new Date().toISOString();
            } else if (!isNowDone && wasDone) {
              completedAt = null;
            }

            updatedTask = {
              ...t,
              ...updateData,
              completedAt,
              updatedAt: new Date().toISOString(),
            };
            return updatedTask;
          }
          return t;
        })
      );
      return updatedTask;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTaskStatus = useCallback(async (id, newStatus) => {
    return updateTask(id, { status: newStatus });
  }, [updateTask]);

  const deleteTask = useCallback(async (id) => {
    setIsLoading(true);
    try {
      setTasks((prev) => prev.filter((t) => t._id !== id));
      return { success: true, deletedId: id };
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteTasksByProject = useCallback(async (projectId) => {
    setTasks((prev) => prev.filter((t) => t.projectId !== projectId));
  }, []);

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    deleteTasksByProject,
    setTasks,
  };
}
