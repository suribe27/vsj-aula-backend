import { Request, Response } from 'express';
import { AuthUseCases } from '../../application/use-cases/AuthUseCases';
import { loginSchema, registerSchema } from '../../infrastructure/dtos/auth.dto';
import { requesterOf } from '../http/requester';
import { parse } from '../http/validation';

export class AuthController {
  constructor(private readonly auth: AuthUseCases) {}

  register = async (req: Request, res: Response): Promise<void> => {
    const input = parse(registerSchema, req.body);
    res.status(201).json(await this.auth.register(input));
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const input = parse(loginSchema, req.body);
    res.status(200).json(await this.auth.login(input));
  };

  me = async (req: Request, res: Response): Promise<void> => {
    const user = await this.auth.profile(requesterOf(req).id);
    res.status(200).json({ data: user });
  };
}
