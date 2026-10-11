import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Task title must be at least 3 characters long')
    .max(150, 'Task title cannot exceed 150 characters'),
  projectId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Valid project ObjectId is required'),
  description: z
    .string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional()
    .default(''),
  status: z
    .enum(['todo', 'in_progress', 'in_review', 'done'])
    .optional()
    .default('todo'),
  priority: z
    .enum(['low', 'medium', 'high'])
    .optional()
    .default('medium'),
  assignee: z
    .string()
    .max(50, 'Assignee name cannot exceed 50 characters')
    .optional()
    .default(''),
  labels: z.array(z.string()).optional().default([]),
  dueDate: z.string().datetime().nullable().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const taskQuerySchema = z.object({
  projectId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  status: z.enum(['todo', 'in_progress', 'in_review', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  search: z.string().optional(),
  sort: z.string().optional().default('-createdAt'),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});
