import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { ApiError } from '../utils/apiError.js';

export const projectService = {
  async getProjects({ search, status, sort = '-createdAt', page = 1, limit = 10 }) {
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      Project.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Project.countDocuments(filter),
    ]);

    // Attach task progress metrics for each project
    const projectIds = projects.map((p) => p._id);
    const tasks = await Task.find({ projectId: { $in: projectIds } })
      .select('projectId status')
      .lean();

    const taskMap = new Map();
    for (const t of tasks) {
      const pId = t.projectId.toString();
      if (!taskMap.has(pId)) {
        taskMap.set(pId, { total: 0, completed: 0 });
      }
      const entry = taskMap.get(pId);
      entry.total += 1;
      if (t.status === 'done') {
        entry.completed += 1;
      }
    }

    const enrichedProjects = projects.map((p) => {
      const stats = taskMap.get(p._id.toString()) || { total: 0, completed: 0 };
      const progress = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
      return {
        ...p,
        taskCount: stats.total,
        completedTaskCount: stats.completed,
        progress,
      };
    });

    return {
      projects: enrichedProjects,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  },

  async getProjectById(id) {
    const project = await Project.findById(id).lean();
    if (!project) {
      throw ApiError.notFound('Project not found with the specified identifier');
    }

    const tasks = await Task.find({ projectId: id }).select('status').lean();
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'done').length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      ...project,
      taskCount: total,
      completedTaskCount: completed,
      progress,
    };
  },

  async createProject(data) {
    const project = await Project.create(data);
    return {
      ...project.toObject(),
      taskCount: 0,
      completedTaskCount: 0,
      progress: 0,
    };
  },

  async updateProject(id, updateData) {
    const project = await Project.findByIdAndUpdate(id, updateData, {
      returnDocument: 'after',
      runValidators: true,
    }).lean();

    if (!project) {
      throw ApiError.notFound('Project not found with the specified identifier');
    }

    return project;
  },

  async deleteProject(id, cascade = true) {
    const project = await Project.findById(id);
    if (!project) {
      throw ApiError.notFound('Project not found with the specified identifier');
    }

    let deletedTasksCount = 0;
    if (cascade) {
      const deleteResult = await Task.deleteMany({ projectId: id });
      deletedTasksCount = deleteResult.deletedCount || 0;
    }

    await Project.findByIdAndDelete(id);

    return {
      deletedProjectId: id,
      deletedTasksCount,
    };
  },
};
