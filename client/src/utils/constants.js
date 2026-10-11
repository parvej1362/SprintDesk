// SprintDesk Domain Constants & Visual Mappings

export const PROJECT_STATUS = {
  PLANNED: 'planned',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ON_HOLD: 'on_hold',
};

export const PROJECT_STATUS_LABELS = {
  [PROJECT_STATUS.PLANNED]: 'Planned',
  [PROJECT_STATUS.ACTIVE]: 'Active',
  [PROJECT_STATUS.COMPLETED]: 'Completed',
  [PROJECT_STATUS.ON_HOLD]: 'On Hold',
};

export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  IN_REVIEW: 'in_review',
  DONE: 'done',
};

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.TODO]: 'To Do',
  [TASK_STATUS.IN_PROGRESS]: 'In Progress',
  [TASK_STATUS.IN_REVIEW]: 'In Review',
  [TASK_STATUS.DONE]: 'Done',
};

export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

export const TASK_PRIORITY_LABELS = {
  [TASK_PRIORITY.LOW]: 'Low',
  [TASK_PRIORITY.MEDIUM]: 'Medium',
  [TASK_PRIORITY.HIGH]: 'High',
};

export const PRESET_PROJECT_COLORS = [
  '#6366F1', // Indigo (Default)
  '#0EA5E9', // Sky Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#8B5CF6', // Purple
  '#14B8A6', // Teal
  '#F43F5E', // Rose
];
