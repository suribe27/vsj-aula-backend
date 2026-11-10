import { RequestHandler, Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { authorize } from '../middlewares/authorize';

export function categoryRouter(controller: CategoryController, authenticate: RequestHandler): Router {
  const router = Router();
  const adminOnly = [authenticate, authorize('ADMIN')];

  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.post('/', ...adminOnly, controller.create);
  router.put('/:id', ...adminOnly, controller.update);
  router.delete('/:id', ...adminOnly, controller.remove);
  return router;
}
