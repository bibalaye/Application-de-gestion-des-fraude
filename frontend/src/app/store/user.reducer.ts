import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';
import { UserState, initialUserState } from './user.state';

export const userReducer = createReducer(
  initialUserState,
  // Users
  on(UserActions.loadUsers, (state) => ({ ...state, loading: true, error: null })),
  on(UserActions.loadUsersSuccess, (state, { users, total }) => ({ ...state, users, total, loading: false })),
  on(UserActions.loadUsersFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(UserActions.createUser, (state) => ({ ...state, loading: true, error: null })),
  on(UserActions.createUserSuccess, (state, { user }) => ({ ...state, users: [user, ...state.users], loading: false })),
  on(UserActions.createUserFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(UserActions.updateUser, (state) => ({ ...state, loading: true, error: null })),
  on(UserActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map(u => u.id === user.id ? user : u),
    loading: false
  })),
  on(UserActions.updateUserFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(UserActions.deleteUser, (state) => ({ ...state, loading: true, error: null })),
  on(UserActions.deleteUserSuccess, (state, { id }) => ({
    ...state,
    users: state.users.filter(u => u.id !== id),
    loading: false
  })),
  on(UserActions.deleteUserFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(UserActions.setUserPage, (state, { page }) => ({ ...state, page })),
  on(UserActions.setUserPageSize, (state, { pageSize }) => ({ ...state, pageSize })),
  on(UserActions.setUserSearch, (state, { search }) => ({ ...state, search })),
  // Roles
  on(UserActions.loadRoles, (state) => ({ ...state, loading: true, error: null })),
  on(UserActions.loadRolesSuccess, (state, { roles }) => ({ ...state, roles, loading: false })),
  on(UserActions.loadRolesFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(UserActions.createRole, (state) => ({ ...state, loading: true, error: null })),
  on(UserActions.createRoleSuccess, (state, { role }) => ({ ...state, roles: [role, ...state.roles], loading: false })),
  on(UserActions.createRoleFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(UserActions.updateRole, (state) => ({ ...state, loading: true, error: null })),
  on(UserActions.updateRoleSuccess, (state, { role }) => ({
    ...state,
    roles: state.roles.map(r => r.id === role.id ? role : r),
    loading: false
  })),
  on(UserActions.updateRoleFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(UserActions.deleteRole, (state) => ({ ...state, loading: true, error: null })),
  on(UserActions.deleteRoleSuccess, (state, { id }) => ({
    ...state,
    roles: state.roles.filter(r => r.id !== id),
    loading: false
  })),
  on(UserActions.deleteRoleFailure, (state, { error }) => ({ ...state, loading: false, error }))
); 