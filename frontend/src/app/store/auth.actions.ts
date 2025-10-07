import { createAction, props } from '@ngrx/store';
import { UserProfile } from '../services/auth.service';

export const login = createAction('[Auth] Login', props<{ username: string; password: string }>());
export const loginSuccess = createAction('[Auth] Login Success', props<{ user: UserProfile }>());
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());
export const logout = createAction('[Auth] Logout');
export const setUser = createAction('[Auth] Set User', props<{ user: UserProfile }>());

export const rehydrateAuth = createAction('[Auth] Rehydrate Auth');
export const rehydrateAuthSuccess = createAction('[Auth] Rehydrate Auth Success', props<{ user: UserProfile }>()); 