export interface User {
  email: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  role: string;
}

export interface RegisterRequest {
  name: string;
  role: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  name: string;
  role: string;
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}
