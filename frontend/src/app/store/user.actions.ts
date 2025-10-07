import { createAction, props } from '@ngrx/store';
import { User, UserCreate, UserUpdate, Role, RoleCreate, RoleUpdate } from '../models/user.model';

// Utilisateurs
export const loadUsers = createAction('[User] Load Users');
export const loadUsersSuccess = createAction('[User] Load Users Success', props<{ users: User[], total: number }>());
export const loadUsersFailure = createAction('[User] Load Users Failure', props<{ error: string }>());

export const createUser = createAction('[User] Create User', props<{ user: UserCreate }>());
export const createUserSuccess = createAction('[User] Create User Success', props<{ user: User }>());
export const createUserFailure = createAction('[User] Create User Failure', props<{ error: string }>());

export const updateUser = createAction('[User] Update User', props<{ id: number, user: UserUpdate }>());
export const updateUserSuccess = createAction('[User] Update User Success', props<{ user: User }>());
export const updateUserFailure = createAction('[User] Update User Failure', props<{ error: string }>());

export const deleteUser = createAction('[User] Delete User', props<{ id: number }>());
export const deleteUserSuccess = createAction('[User] Delete User Success', props<{ id: number }>());
export const deleteUserFailure = createAction('[User] Delete User Failure', props<{ error: string }>());

export const setUserPage = createAction('[User] Set Page', props<{ page: number }>());
export const setUserPageSize = createAction('[User] Set Page Size', props<{ pageSize: number }>());
export const setUserSearch = createAction('[User] Set Search', props<{ search: string }>());

// Rôles
export const loadRoles = createAction('[Role] Load Roles');
export const loadRolesSuccess = createAction('[Role] Load Roles Success', props<{ roles: Role[] }>());
export const loadRolesFailure = createAction('[Role] Load Roles Failure', props<{ error: string }>());

export const createRole = createAction('[Role] Create Role', props<{ role: RoleCreate }>());
export const createRoleSuccess = createAction('[Role] Create Role Success', props<{ role: Role }>());
export const createRoleFailure = createAction('[Role] Create Role Failure', props<{ error: string }>());

export const updateRole = createAction('[Role] Update Role', props<{ id: number, role: RoleUpdate }>());
export const updateRoleSuccess = createAction('[Role] Update Role Success', props<{ role: Role }>());
export const updateRoleFailure = createAction('[Role] Update Role Failure', props<{ error: string }>());

export const deleteRole = createAction('[Role] Delete Role', props<{ id: number }>());
export const deleteRoleSuccess = createAction('[Role] Delete Role Success', props<{ id: number }>());
export const deleteRoleFailure = createAction('[Role] Delete Role Failure', props<{ error: string }>()); 