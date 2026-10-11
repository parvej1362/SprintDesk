import { useState } from 'react';
import Modal from '../common/Modal';
import { PRESET_PROJECT_COLORS, PROJECT_STATUS } from '../../utils/constants';

function ProjectFormContent({
  onClose,
  onSubmit,
  initialData,
  isLoading,
}) {
  const isEditing = Boolean(initialData?._id);

  const [formData, setFormData] = useState(() => ({
    name: initialData?.name || '',
    description: initialData?.description || '',
    status: initialData?.status || PROJECT_STATUS.ACTIVE,
    color: initialData?.color || '#6366F1',
    startDate: initialData?.startDate ? initialData.startDate.slice(0, 10) : '',
    dueDate: initialData?.dueDate ? initialData.dueDate.slice(0, 10) : '',
  }));

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Project name is required.';
    } else if (formData.name.trim().length < 3) {
      errs.name = 'Project name must be at least 3 characters.';
    } else if (formData.name.trim().length > 100) {
      errs.name = 'Project name cannot exceed 100 characters.';
    }

    if (formData.description && formData.description.length > 500) {
      errs.description = 'Description cannot exceed 500 characters.';
    }

    if (formData.startDate && formData.dueDate) {
      if (new Date(formData.dueDate) < new Date(formData.startDate)) {
        errs.dueDate = 'Due date cannot precede start date.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit?.({
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim(),
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Project Name */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          Project Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Mobile App Redesign"
          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 transition-all ${
            errors.name
              ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
              : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
          }`}
        />
        {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
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
          placeholder="Outline objectives, sprint goals, and milestone outcomes..."
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
        />
        {errors.description && (
          <p className="text-xs text-red-600 mt-1">{errors.description}</p>
        )}
      </div>

      {/* Status & Color Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
          >
            <option value={PROJECT_STATUS.PLANNED}>Planned</option>
            <option value={PROJECT_STATUS.ACTIVE}>Active</option>
            <option value={PROJECT_STATUS.COMPLETED}>Completed</option>
            <option value={PROJECT_STATUS.ON_HOLD}>On Hold</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Theme Accent Color
          </label>
          <div className="flex items-center gap-2 pt-1">
            {PRESET_PROJECT_COLORS.map((col) => (
              <button
                type="button"
                key={col}
                onClick={() => setFormData({ ...formData, color: col })}
                className={`w-6 h-6 rounded-full transition-transform ${
                  formData.color === col ? 'scale-125 ring-2 ring-offset-2 ring-indigo-500' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: col }}
                aria-label={`Select color ${col}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Start Date & Due Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Start Date
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Target Due Date
          </label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white focus:outline-hidden focus:ring-2 transition-all ${
              errors.dueDate
                ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
            }`}
          />
          {errors.dueDate && <p className="text-xs text-red-600 mt-1">{errors.dueDate}</p>}
        </div>
      </div>

      {/* Modal Actions */}
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
          {isEditing ? 'Save Changes' : 'Create Project'}
        </button>
      </div>
    </form>
  );
}

export default function ProjectFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false,
}) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData?._id ? 'Edit Project' : 'Create New Project'}
      maxWidth="max-w-lg"
    >
      <ProjectFormContent
        key={initialData?._id || 'new_project'}
        onClose={onClose}
        onSubmit={onSubmit}
        initialData={initialData}
        isLoading={isLoading}
      />
    </Modal>
  );
}
