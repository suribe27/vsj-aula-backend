import { Request, Response } from 'express';
import { ImageFile } from '../../application/ports/ImageStorage';
import { ServiceUseCases } from '../../application/use-cases/ServiceUseCases';
import { idParamsSchema } from '../../infrastructure/dtos/common.dto';
import {
  createServiceSchema,
  listServicesQuerySchema,
  updateServiceSchema,
} from '../../infrastructure/dtos/service.dto';
import { parse } from '../http/validation';

function imageFrom(req: Request): ImageFile | undefined {
  if (!req.file) {
    return undefined;
  }
  return {
    buffer: req.file.buffer,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
  };
}

export class ServiceController {
  constructor(private readonly services: ServiceUseCases) {}

  list = async (req: Request, res: Response): Promise<void> => {
    const { page, limit, ...filters } = parse(listServicesQuerySchema, req.query);
    res.status(200).json(await this.services.list(filters, { page, limit }));
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const { id } = parse(idParamsSchema, req.params);
    res.status(200).json({ data: await this.services.getById(id) });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const input = parse(createServiceSchema, req.body);
    res.status(201).json({ data: await this.services.create(input, imageFrom(req)) });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const { id } = parse(idParamsSchema, req.params);
    const input = parse(updateServiceSchema, req.body ?? {});
    res.status(200).json({ data: await this.services.update(id, input, imageFrom(req)) });
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    const { id } = parse(idParamsSchema, req.params);
    await this.services.remove(id);
    res.status(204).send();
  };
}
