import { RequestHandler, Router } from 'express';
import { EvaluationController } from '../controllers/EvaluationController';
import { authorize } from '../middlewares/authorize';

export function evaluationRouter(
  controller: EvaluationController,
  authenticate: RequestHandler,
): Router {
  const router = Router();
  router.use(authenticate);

  router.get('/summary', authorize('ADMIN'), controller.summary);
  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.post('/', authorize('USER'), controller.create);
  router.put('/:id', authorize('USER'), controller.update);
  router.delete('/:id', controller.remove);
  return router;
}
