import { useState } from 'react';
import Modal from '../common/Modal';
import { TASK_STATUS, TASK_PRIORITY } from '../../utils/constants';

function TaskFormContent({
  onClose,
  onSubmit,
  projects,
  defaultProjectId,
  initialData,
  isLoading,
}) {
  const isEditing = Boolean(initialData?._id);

  const [formData, setFormData] = useState(() => ({
    title: initialData?.title || '',
    description: initialData?.description || '',
    projectId: initialData?.projectId || defaultProjectId || (projects[0]?._id || ''),
    status: initialData?.status || TASK_STATUS.TODO,
    priority: initialData?.priority || TASK_PRIORITY.MEDIUM,
    assignee: initialData?.assignee || '',
    labels: Array.isArray(initialData?.labels) ? initialData.labels.join(', ') : '',
    dueDate: initialData?.dueDate ? initialData.dueDate.slice(0, 10) : '',
  }));

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = 'Task title is required.';
    } else if (formData.title.trim().length < 3) {
      errs.title = 'Title must be at least 3 characters.';
    } else if (formData.title.trim().length > 150) {
      errs.title = 'Title cannot exceed 150 characters.';
    }

    if (!formData.projectId) {
      errs.projectId = 'You must select a parent project.';
    }

    if (formData.description && formData.description.length > 1000) {
      errs.description = 'Description cannot exceed 1000 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const parsedLabels = formData.labels
      ? formData.labels
          .split(',')
          .map((l) => l.trim())
          .filter(Boolean)
      : [];

    onSubmit?.({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      assignee: formData.assignee.trim(),
      labels: parsedLabels,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          Task Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g. Implement Bottom Navigation Drawer"
          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 transition-all ${
            errors.title
              ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
              : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
          }`}
        />
        {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
      </div>

      {/* Project Selector */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          Parent Project <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.projectId}
          onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white focus:outline-hidden focus:ring-2 transition-all ${
            errors.projectId
              ? 'border-red-300 focus:border-red-500'
              : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
          }`}
        >
          <option value="" disabled>
            Select a project...
          </option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
        {errors.projectId && <p className="text-xs text-red-600 mt-1">{errors.projectId}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          Description
        </label>
        <textarea
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the acceptance criteria and implementation requirements..."
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
        />
      </div>

      {/* Priority & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Priority
          </label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
          >
            <option value={TASK_PRIORITY.LOW}>Low</option>
            <option value={TASK_PRIORITY.MEDIUM}>Medium</option>
            <option value={TASK_PRIORITY.HIGH}>High</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
          >
            <option value={TASK_STATUS.TODO}>To Do</option>
            <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
            <option value={TASK_STATUS.IN_REVIEW}>In Review</option>
            <option value={TASK_STATUS.DONE}>Done</option>
          </select>
        </div>
      </div>

      {/* Assignee & Due Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Assignee Name
          </label>
          <input
            type="text"
            value={formData.assignee}
            onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
            placeholder="e.g. Alex Rivera"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Due Date
          </label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>
      </div>

      {/* Labels */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          Labels (comma-separated)
        </label>
        <input
          type="text"
          value={formData.labels}
          onChange={(e) => setFormData({ ...formData, labels: e.target.value })}
          placeholder="e.g. frontend, ui, performance"
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end items-center gap-3 pt-5 border-t border-slate-100">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50 flex items-center gap-2 shadow-xs"
        >
          {isLoading && (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          {isEditing ? 'Save Changes' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}

export default function TaskFormModal({
  isOpen,
  onClose,
  onSubmit,
  projects = [],
  defaultProjectId = '',
  initialData = null,
  isLoading = false,
}) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData?._id ? 'Edit Task' : 'Create New Task'}
      maxWidth="max-w-lg"
    >
      <TaskFormContent
        key={initialData?._id || 'new_task'}
        onClose={onClose}
        onSubmit={onSubmit}
        projects={projects}
        defaultProjectId={defaultProjectId}
        initialData={initialData}
        isLoading={isLoading}
      />
    </Modal>
  );
}
