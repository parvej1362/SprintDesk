import { Router } from 'express';
import { taskController } from '../controllers/taskController.js';
import {
  validateBody,
  validateQuery,
  validateObjectId,
} from '../middleware/validate.js';
import {
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
} from '../validators/taskValidator.js';

const router = Router();

router.get('/', validateQuery(taskQuerySchema), taskController.getTasks);
router.post('/', validateBody(createTaskSchema), taskController.createTask);
router.get('/:id', validateObjectId('id'), taskController.getTaskById);
router.patch(
  '/:id',
  validateObjectId('id'),
  validateBody(updateTaskSchema),
  taskController.updateTask
);
router.delete('/:id', validateObjectId('id'), taskController.deleteTask);

export default router;
