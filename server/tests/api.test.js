import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';
import { Project } from '../src/models/Project.js';
import { Task } from '../src/models/Task.js';

let server;
let baseUrl;

test.before(async () => {
  await connectDB();
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}/api`;
      resolve();
    });
  });
});

test.after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await mongoose.connection.close();
});

test('GET /api/health should return ok and uptime', async () => {
  const res = await fetch(`${baseUrl}/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.data.status, 'ok');
  assert.ok(typeof data.data.uptime === 'number');
});

test('Project CRUD lifecycle and validation', async (t) => {
  let createdProjectId;

  await t.test('POST /api/projects with invalid payload should fail (400)', async () => {
    const res = await fetch(`${baseUrl}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'ab' }), // < 3 chars
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.equal(data.error.code, 'VALIDATION_ERROR');
  });

  await t.test('POST /api/projects with valid payload should create project (201)', async () => {
    const res = await fetch(`${baseUrl}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Integration Test Project',
        description: 'Created during automated API test suite execution',
        status: 'active',
        color: '#6366F1',
      }),
    });
    assert.equal(res.status, 201);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.data.name, 'Integration Test Project');
    assert.equal(data.data.progress, 0);
    createdProjectId = data.data._id;
  });

  await t.test('GET /api/projects should return paginated list', async () => {
    const res = await fetch(`${baseUrl}/projects?page=1&limit=5`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(Array.isArray(data.data));
    assert.ok(data.meta.total >= 1);
  });

  await t.test('GET /api/projects/:id should return single project', async () => {
    const res = await fetch(`${baseUrl}/projects/${createdProjectId}`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.data._id, createdProjectId);
  });

  await t.test('PATCH /api/projects/:id should update metadata', async () => {
    const res = await fetch(`${baseUrl}/projects/${createdProjectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: 'Updated description for test project',
      }),
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.data.description, 'Updated description for test project');
  });

  let createdTaskId;

  await t.test('POST /api/tasks linked to project should succeed (201)', async () => {
    const res = await fetch(`${baseUrl}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Integration Test Task',
        projectId: createdProjectId,
        description: 'Testing task creation within parent project',
        status: 'todo',
        priority: 'high',
      }),
    });
    assert.equal(res.status, 201);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.data.title, 'Integration Test Task');
    createdTaskId = data.data._id;
  });

  await t.test('POST /api/tasks with non-existent projectId should fail (400)', async () => {
    const res = await fetch(`${baseUrl}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Orphan task attempt',
        projectId: '670891a2e4b0123456789999',
      }),
    });
    assert.equal(res.status, 400);
  });

  await t.test('PATCH /api/tasks/:id status to done should set completedAt', async () => {
    const res = await fetch(`${baseUrl}/tasks/${createdTaskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'done' }),
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.data.status, 'done');
    assert.ok(data.data.completedAt !== null);
  });

  await t.test('DELETE /api/projects/:id should cascade delete child tasks', async () => {
    const res = await fetch(`${baseUrl}/projects/${createdProjectId}?cascade=true`, {
      method: 'DELETE',
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.data.deletedTasksCount, 1);

    // Verify task is gone
    const checkTask = await Task.findById(createdTaskId);
    assert.equal(checkTask, null);
  });
});

test('GET /api/dashboard/summary should return aggregated KPIs', async () => {
  const res = await fetch(`${baseUrl}/dashboard/summary`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.data.metrics);
  assert.ok(typeof data.data.metrics.totalProjects === 'number');
  assert.ok(typeof data.data.metrics.totalTasks === 'number');
  assert.ok(data.data.statusDistribution);
  assert.ok(data.data.priorityDistribution);
  assert.ok(Array.isArray(data.data.recentTasks));
});
