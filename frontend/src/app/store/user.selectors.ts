import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UserState } from './user.state';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUsers = createSelector(
  selectUserState,
  (state: UserState) => state.users
);

export const selectRoles = createSelector(
  selectUserState,
  (state: UserState) => state.roles
);

export const selectUserLoading = createSelector(
  selectUserState,
  (state: UserState) => state.loading
);

export const selectUserError = createSelector(
  selectUserState,
  (state: UserState) => state.error
);

export const selectUserPage = createSelector(
  selectUserState,
  (state: UserState) => state.page
);

export const selectUserPageSize = createSelector(
  selectUserState,
  (state: UserState) => state.pageSize
);

export const selectUserTotal = createSelector(
  selectUserState,
  (state: UserState) => state.total
);

export const selectUserSearch = createSelector(
  selectUserState,
  (state: UserState) => state.search
); 