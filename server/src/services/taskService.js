import { Task } from '../models/Task.js';
import { Project } from '../models/Project.js';
import { ApiError } from '../utils/apiError.js';

export const taskService = {
  async getTasks({ projectId, status, priority, search, sort = '-createdAt', page = 1, limit = 10 }) {
    const filter = {};

    if (projectId) {
      filter.projectId = projectId;
    }

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { assignee: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate('projectId', 'name color')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Task.countDocuments(filter),
    ]);

    // Format tasks to include project details and overdue flag
    const now = new Date();
    const enrichedTasks = tasks.map((t) => {
      const isOverdue =
        t.dueDate && t.status !== 'done' && new Date(t.dueDate) < now;
      return {
        ...t,
        project: t.projectId, // Populated project object
        isOverdue: Boolean(isOverdue),
      };
    });

    return {
      tasks: enrichedTasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  },

  async getTaskById(id) {
    const task = await Task.findById(id).populate('projectId', 'name color').lean();
    if (!task) {
      throw ApiError.notFound('Task not found with the specified identifier');
    }

    const isOverdue =
      task.dueDate && task.status !== 'done' && new Date(task.dueDate) < new Date();

    return {
      ...task,
      project: task.projectId,
      isOverdue: Boolean(isOverdue),
    };
  },

  async createTask(data) {
    // Referential integrity check: verify parent project exists
    const projectExists = await Project.exists({ _id: data.projectId });
    if (!projectExists) {
      throw ApiError.badRequest('Referenced project does not exist in the database');
    }

    const task = await Task.create({
      ...data,
      completedAt: data.status === 'done' ? new Date() : null,
    });

    return task.populate('projectId', 'name color');
  },

  async updateTask(id, updateData) {
    const existingTask = await Task.findById(id);
    if (!existingTask) {
      throw ApiError.notFound('Task not found with the specified identifier');
    }

    // If updating projectId, check that target project exists
    if (updateData.projectId && updateData.projectId !== existingTask.projectId.toString()) {
      const projectExists = await Project.exists({ _id: updateData.projectId });
      if (!projectExists) {
        throw ApiError.badRequest('Target project does not exist in the database');
      }
    }

    // Lifecycle completedAt management
    if (updateData.status) {
      if (updateData.status === 'done' && existingTask.status !== 'done') {
        updateData.completedAt = new Date();
      } else if (updateData.status !== 'done' && existingTask.status === 'done') {
        updateData.completedAt = null;
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updateData, {
      returnDocument: 'after',
      runValidators: true,
    })
      .populate('projectId', 'name color')
      .lean();

    return updatedTask;
  },

  async deleteTask(id) {
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      throw ApiError.notFound('Task not found with the specified identifier');
    }
    return {
      deletedTaskId: id,
    };
  },
};
