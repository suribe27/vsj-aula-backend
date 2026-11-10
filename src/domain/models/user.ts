import { Status } from './shared';

export type Role = 'ADMIN' | 'USER';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: Status;
  createdAt: Date;
}

export interface UserWithPassword extends User {
  password: string;
}

/** Usuario autenticado que hace la petición (sale del JWT). */
export interface AuthUser {
  id: number;
  role: Role;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: Role;
}
