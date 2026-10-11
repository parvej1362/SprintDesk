import { Router } from 'express';
import { projectController } from '../controllers/projectController.js';
import {
  validateBody,
  validateQuery,
  validateObjectId,
} from '../middleware/validate.js';
import {
  createProjectSchema,
  updateProjectSchema,
  projectQuerySchema,
} from '../validators/projectValidator.js';

const router = Router();

router.get('/', validateQuery(projectQuerySchema), projectController.getProjects);
router.post('/', validateBody(createProjectSchema), projectController.createProject);
router.get('/:id', validateObjectId('id'), projectController.getProjectById);
router.patch(
  '/:id',
  validateObjectId('id'),
  validateBody(updateProjectSchema),
  projectController.updateProject
);
router.delete('/:id', validateObjectId('id'), projectController.deleteProject);

export default router;
