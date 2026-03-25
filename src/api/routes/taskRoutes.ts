import { Router } from 'express';
import {
    createTaskController,
    getAllTasksController,
    getOneTaskController,
    updateTaskController,
    deleteTaskController,
} from '../../controllers/taskController';
import { authGuard } from '../middlewares/authGuard';
import { validate } from '../middlewares/validate';
import { createTaskSchema, updateTaskSchema } from '../../utils/schemas';

const router:Router = Router();


router.use(authGuard);

router.post('/', validate(createTaskSchema), createTaskController);
router.get('/', getAllTasksController);
router.get('/:id', getOneTaskController);
router.put('/:id', validate(updateTaskSchema), updateTaskController);
router.delete('/:id', deleteTaskController);

export default router;