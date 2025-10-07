import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');
export const selectAuthUser = createSelector(selectAuthState, (state) => state.user);
export const selectAuthError = createSelector(selectAuthState, (state) => state.error);
export const selectAuthLoading = createSelector(selectAuthState, (state) => state.loading); 