import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';

export const dashboardService = {
  async getSummary() {
    const now = new Date();

    const [
      totalProjects,
      activeProjects,
      totalTasks,
      completedTasks,
      todoTasks,
      inProgressTasks,
      inReviewTasks,
      lowPriorityTasks,
      mediumPriorityTasks,
      highPriorityTasks,
      overdueTasks,
      recentTasks,
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ status: 'active' }),
      Task.countDocuments(),
      Task.countDocuments({ status: 'done' }),
      Task.countDocuments({ status: 'todo' }),
      Task.countDocuments({ status: 'in_progress' }),
      Task.countDocuments({ status: 'in_review' }),
      Task.countDocuments({ priority: 'low' }),
      Task.countDocuments({ priority: 'medium' }),
      Task.countDocuments({ priority: 'high' }),
      Task.countDocuments({ dueDate: { $lt: now }, status: { $ne: 'done' } }),
      Task.find()
        .sort('-createdAt')
        .limit(5)
        .populate('projectId', 'name color')
        .lean(),
    ]);

    const activeTasks = todoTasks + inProgressTasks + inReviewTasks;

    const formattedRecentTasks = recentTasks.map((t) => ({
      _id: t._id,
      title: t.title,
      projectName: t.projectId ? t.projectId.name : 'Unassigned',
      projectColor: t.projectId ? t.projectId.color : '#6366F1',
      status: t.status,
      priority: t.priority,
      dueDate: t.dueDate,
      createdAt: t.createdAt,
    }));

    return {
      metrics: {
        totalProjects,
        activeProjects,
        totalTasks,
        completedTasks,
        activeTasks,
        overdueTasks,
      },
      statusDistribution: {
        todo: todoTasks,
        in_progress: inProgressTasks,
        in_review: inReviewTasks,
        done: completedTasks,
      },
      priorityDistribution: {
        low: lowPriorityTasks,
        medium: mediumPriorityTasks,
        high: highPriorityTasks,
      },
      recentTasks: formattedRecentTasks,
    };
  },
};
