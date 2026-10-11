import mongoose from 'mongoose';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { connectDB } from '../config/db.js';

const SEED_PROJECTS = [
  {
    name: 'Mobile App Redesign',
    description: 'Refactoring mobile UX, responsive navigation, and user onboarding flow.',
    status: 'active',
    color: '#6366F1',
    startDate: new Date('2026-10-01'),
    dueDate: new Date('2026-11-15'),
  },
  {
    name: 'API Gateway Modernization',
    description: 'Upgrading Express microservices, rate limiting, and centralized monitoring.',
    status: 'active',
    color: '#0EA5E9',
    startDate: new Date('2026-09-15'),
    dueDate: new Date('2026-10-25'),
  },
  {
    name: 'Design System V2',
    description: 'Building cohesive Dark Navy and Indigo component library with accessible tokens.',
    status: 'completed',
    color: '#10B981',
    startDate: new Date('2026-09-01'),
    dueDate: new Date('2026-10-05'),
  },
  {
    name: 'Security Audit & Compliance',
    description: 'Penetration testing, Helmet HTTP header verification, and query sanitization review.',
    status: 'planned',
    color: '#F59E0B',
    startDate: new Date('2026-11-01'),
    dueDate: new Date('2026-12-01'),
  },
];

async function seed() {
  try {
    await connectDB();
    console.log('[Seed] Clearing existing collections...');
    await Promise.all([Project.deleteMany({}), Task.deleteMany({})]);

    console.log('[Seed] Inserting sample projects...');
    const createdProjects = await Project.insertMany(SEED_PROJECTS);

    const proj1 = createdProjects[0]._id;
    const proj2 = createdProjects[1]._id;
    const proj3 = createdProjects[2]._id;
    const proj4 = createdProjects[3]._id;

    const SEED_TASKS = [
      {
        projectId: proj1,
        title: 'Implement Bottom Navigation Drawer',
        description: 'Create mobile navigation drawer with backdrop blur and keyboard focus trapping.',
        status: 'in_progress',
        priority: 'high',
        assignee: 'Alex Rivera',
        labels: ['ui', 'mobile', 'frontend'],
        dueDate: new Date('2026-10-18'),
      },
      {
        projectId: proj1,
        title: 'Design Dark Mode Color Palette',
        description: 'Ensure color tokens meet WCAG 2.1 AA 4.5:1 minimum contrast standards.',
        status: 'done',
        priority: 'medium',
        assignee: 'Elena Chen',
        labels: ['design', 'tokens'],
        dueDate: new Date('2026-10-05'),
        completedAt: new Date('2026-10-05'),
      },
      {
        projectId: proj1,
        title: 'Profile Screen Layout Optimization',
        description: 'Refactor user profile cards to eliminate unnecessary re-renders.',
        status: 'todo',
        priority: 'low',
        assignee: 'Marcus Vance',
        labels: ['frontend', 'performance'],
        dueDate: new Date('2026-10-28'),
      },
      {
        projectId: proj1,
        title: 'Resolve User Onboarding Lag',
        description: 'Overdue task: fix animation frame drop during multi-step onboarding carousel.',
        status: 'in_review',
        priority: 'high',
        assignee: 'Alex Rivera',
        labels: ['bug', 'urgent'],
        dueDate: new Date('2026-10-08'), // Overdue
      },
      {
        projectId: proj2,
        title: 'Configure Rate Limiter Middleware',
        description: 'Set express-rate-limit to 100 requests per 15 minutes window per IP.',
        status: 'done',
        priority: 'high',
        assignee: 'Devon Miles',
        labels: ['backend', 'security'],
        dueDate: new Date('2026-09-25'),
        completedAt: new Date('2026-09-24'),
      },
      {
        projectId: proj2,
        title: 'Implement Health Endpoint Metrics',
        description: 'Expose process uptime, memory usage, and DB status at GET /api/health.',
        status: 'in_progress',
        priority: 'medium',
        assignee: 'Devon Miles',
        labels: ['backend', 'monitoring'],
        dueDate: new Date('2026-10-10'), // Overdue
      },
      {
        projectId: proj3,
        title: 'Publish Reusable Button & Modal Atoms',
        description: 'Finalize accessible Button, Modal, and ConfirmDialog components.',
        status: 'done',
        priority: 'high',
        assignee: 'Elena Chen',
        labels: ['design-system'],
        dueDate: new Date('2026-10-02'),
        completedAt: new Date('2026-10-02'),
      },
      {
        projectId: proj4,
        title: 'Audit Environment Secrets and .env Files',
        description: 'Ensure no database credentials or API keys exist in git tracking history.',
        status: 'todo',
        priority: 'high',
        assignee: 'Marcus Vance',
        labels: ['security'],
        dueDate: new Date('2026-11-10'),
      },
    ];

    console.log('[Seed] Inserting sample tasks...');
    await Task.insertMany(SEED_TASKS);

    console.log('[Seed] Database seeded successfully!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    process.exit(1);
  }
}

seed();
