import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { AuthState } from './auth.state';
import { KeycloakProfile } from 'keycloak-js';

export const initialState: AuthState = {
  user: null,
  error: null,
  loading: false
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, state => ({ ...state, loading: true, error: null })),
  on(AuthActions.loginSuccess, (state, { user }) => ({ ...state, user, loading: false, error: null })),
  on(AuthActions.loginFailure, (state, { error }) => ({ ...state, error, loading: false })),
  on(AuthActions.logout, state => ({ ...state, user: null, loading: false, error: null })),
  on(AuthActions.setUser, (state, { user }) => ({ ...state, user })),
  on(AuthActions.rehydrateAuthSuccess, (state, { user }) => ({ ...state, user }))
); 