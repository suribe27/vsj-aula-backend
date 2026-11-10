import { RequestHandler, Router } from 'express';
import { ServiceController } from '../controllers/ServiceController';
import { authorize } from '../middlewares/authorize';
import { uploadImage } from '../middlewares/uploadImage';

export function serviceRouter(controller: ServiceController, authenticate: RequestHandler): Router {
  const router = Router();
  const adminOnly = [authenticate, authorize('ADMIN')];

  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.post('/', ...adminOnly, uploadImage, controller.create);
  router.put('/:id', ...adminOnly, uploadImage, controller.update);
  router.delete('/:id', ...adminOnly, controller.remove);
  return router;
}
