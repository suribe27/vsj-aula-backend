import { Request, Response } from 'express';
import { EvaluationUseCases } from '../../application/use-cases/EvaluationUseCases';
import { idParamsSchema } from '../../infrastructure/dtos/common.dto';
import {
  evaluationAnswersSchema,
  listEvaluationsQuerySchema,
} from '../../infrastructure/dtos/evaluation.dto';
import { requesterOf } from '../http/requester';
import { parse } from '../http/validation';

export class EvaluationController {
  constructor(private readonly evaluations: EvaluationUseCases) {}

  list = async (req: Request, res: Response): Promise<void> => {
    const { page, limit, riskLevel } = parse(listEvaluationsQuerySchema, req.query);
    res.status(200).json(await this.evaluations.list(requesterOf(req), riskLevel, { page, limit }));
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const { id } = parse(idParamsSchema, req.params);
    res.status(200).json({ data: await this.evaluations.getById(id, requesterOf(req)) });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const answers = parse(evaluationAnswersSchema, req.body);
    res.status(201).json({ data: await this.evaluations.create(answers, requesterOf(req)) });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const { id } = parse(idParamsSchema, req.params);
    const answers = parse(evaluationAnswersSchema, req.body);
    res.status(200).json({ data: await this.evaluations.update(id, answers, requesterOf(req)) });
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    const { id } = parse(idParamsSchema, req.params);
    await this.evaluations.remove(id, requesterOf(req));
    res.status(204).send();
  };

  summary = async (_req: Request, res: Response): Promise<void> => {
    res.status(200).json({ data: await this.evaluations.summary() });
  };
}
