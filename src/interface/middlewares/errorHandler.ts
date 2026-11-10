import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { MulterError } from 'multer';
import { AppError } from '../../application/errors/AppError';

interface ErrorBody {
  message: string;
  details?: Record<string, string[]>;
}

function send(res: Response, status: number, body: ErrorBody): void {
  res.status(status).json({ error: body });
}

function handlePrismaError(error: Prisma.PrismaClientKnownRequestError, res: Response): void {
  switch (error.code) {
    case 'P2002':
      send(res, 409, { message: 'Ya existe un registro con ese valor único' });
      return;
    case 'P2025':
      send(res, 404, { message: 'El registro no existe' });
      return;
    case 'P2003':
      send(res, 400, { message: 'El registro relacionado no existe' });
      return;
    default:
      send(res, 500, { message: 'Error de base de datos' });
  }
}

function isJsonSyntaxError(error: unknown): boolean {
  return error instanceof SyntaxError && 'body' in error;
}

export function notFoundHandler(req: Request, res: Response): void {
  send(res, 404, { message: `La ruta ${req.method} ${req.originalUrl} no existe` });
}

/** Punto único de manejo de errores: nunca expone el stack trace. */
export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof AppError) {
    send(res, error.statusCode, { message: error.message, details: error.details });
    return;
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    handlePrismaError(error, res);
    return;
  }
  if (error instanceof Prisma.PrismaClientValidationError) {
    send(res, 400, { message: 'Los datos enviados no son válidos' });
    return;
  }
  if (error instanceof MulterError) {
    const message =
      error.code === 'LIMIT_FILE_SIZE' ? 'La imagen no puede pesar más de 5 MB' : error.message;
    send(res, 400, { message });
    return;
  }
  if (isJsonSyntaxError(error)) {
    send(res, 400, { message: 'El cuerpo de la petición no es un JSON válido' });
    return;
  }

  console.error('Error no controlado:', error instanceof Error ? error.message : error);
  send(res, 500, { message: 'Error interno del servidor' });
}
