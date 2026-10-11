// SprintDesk Date & Metric Formatters

export function formatDate(dateString) {
  if (!dateString) return 'No date';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return 'Invalid date';
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatShortDate(dateString) {
  if (!dateString) return '-';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function isOverdue(dueDate, status) {
  if (!dueDate || status === 'done') return false;
  const due = new Date(dueDate);
  if (isNaN(due.getTime())) return false;
  const now = new Date();
  // Clear time for date-only comparison
  now.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return due < now;
}

export function calculateProjectProgress(tasks = []) {
  if (!tasks || tasks.length === 0) return 0;
  const completed = tasks.filter((t) => t.status === 'done').length;
  return Math.min(100, Math.max(0, Math.round((completed / tasks.length) * 100)));
}
