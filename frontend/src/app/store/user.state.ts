import { User, Role } from '../models/user.model';

export interface UserState {
  users: User[];
  roles: Role[];
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  total: number;
  search: string;
}

export const initialUserState: UserState = {
  users: [],
  roles: [],
  loading: false,
  error: null,
  page: 0,
  pageSize: 10,
  total: 0,
  search: ''
}; 