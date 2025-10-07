import { UserProfile } from '../services/auth.service';

export interface AuthState {
  user: UserProfile | null;
  error: string | null;
  loading: boolean;
} 