export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  status: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  lastPasswordChange: string;
  displayName?: string; // Optionnel pour affichage
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
  role: { id: number };
}

export interface UserUpdate {
  email?: string;
  status?: string;
  role?: { id: number };
  password?: string;
}

export interface RoleCreate {
  name: string;
}

export interface RoleUpdate {
  name: string;
}
