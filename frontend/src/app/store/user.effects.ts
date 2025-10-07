import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserService } from '../services/user.service';
import * as UserActions from './user.actions';
import { catchError, map, mergeMap, switchMap, withLatestFrom, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectUserPage, selectUserPageSize, selectUserSearch } from './user.selectors';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
    private store: Store,
    private snackBar: MatSnackBar
  ) {}

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers, UserActions.setUserPage, UserActions.setUserPageSize, UserActions.setUserSearch),
      withLatestFrom(
        this.store.select(selectUserPage),
        this.store.select(selectUserPageSize),
        this.store.select(selectUserSearch)
      ),
      switchMap(([action, page, pageSize, search]) =>
        this.userService.getUsers().pipe( // Remplacer par un endpoint paginé si dispo
          map(users => {
            // Pagination et recherche côté front si backend ne gère pas
            let filtered = users;
            if (search) {
              filtered = filtered.filter(u => u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
            }
            const total = filtered.length;
            const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
            return UserActions.loadUsersSuccess({ users: paged, total });
          }),
          catchError(error => of(UserActions.loadUsersFailure({ error: error.message || 'Erreur chargement utilisateurs' })))
        )
      )
    )
  );

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.createUser),
      mergeMap(({ user }) =>
        this.userService.createUser(user).pipe(
          map(newUser => UserActions.createUserSuccess({ user: newUser })),
          catchError(error => of(UserActions.createUserFailure({ error: error.message || 'Erreur création utilisateur' })))
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      mergeMap(({ id, user }) =>
        this.userService.updateUser(id, user).pipe(
          map(updated => UserActions.updateUserSuccess({ user: updated })),
          catchError(error => of(UserActions.updateUserFailure({ error: error.message || 'Erreur modification utilisateur' })))
        )
      )
    )
  );

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteUser),
      mergeMap(({ id }) =>
        this.userService.deleteUser(id).pipe(
          map(() => UserActions.deleteUserSuccess({ id })),
          catchError(error => of(UserActions.deleteUserFailure({ error: error.message || 'Erreur suppression utilisateur' })))
        )
      )
    )
  );

  // Rôles
  loadRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadRoles),
      switchMap(() =>
        this.userService.getRoles().pipe(
          map(roles => UserActions.loadRolesSuccess({ roles })),
          catchError(error => of(UserActions.loadRolesFailure({ error: error.message || 'Erreur chargement rôles' })))
        )
      )
    )
  );

  createRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.createRole),
      mergeMap(({ role }) =>
        this.userService.createRole(role).pipe(
          map(newRole => UserActions.createRoleSuccess({ role: newRole })),
          catchError(error => of(UserActions.createRoleFailure({ error: error.message || 'Erreur création rôle' })))
        )
      )
    )
  );

  updateRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateRole),
      mergeMap(({ id, role }) =>
        this.userService.updateRole(id, role).pipe(
          map(updated => UserActions.updateRoleSuccess({ role: updated })),
          catchError(error => of(UserActions.updateRoleFailure({ error: error.message || 'Erreur modification rôle' })))
        )
      )
    )
  );

  deleteRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteRole),
      mergeMap(({ id }) =>
        this.userService.deleteRole(id).pipe(
          map(() => UserActions.deleteRoleSuccess({ id })),
          catchError(error => of(UserActions.deleteRoleFailure({ error: error.message || 'Erreur suppression rôle' })))
        )
      )
    )
  );

  notifyUserSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        UserActions.createUserSuccess,
        UserActions.updateUserSuccess,
        UserActions.deleteUserSuccess
      ),
      tap(action => {
        let msg = 'Opération utilisateur réussie';
        if (action.type === UserActions.createUserSuccess.type) msg = 'Utilisateur créé';
        if (action.type === UserActions.updateUserSuccess.type) msg = 'Utilisateur mis à jour';
        if (action.type === UserActions.deleteUserSuccess.type) msg = 'Utilisateur supprimé';
        this.snackBar.open(msg, '', { duration: 2000 });
      })
    ),
    { dispatch: false }
  );

  notifyUserError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        UserActions.createUserFailure,
        UserActions.updateUserFailure,
        UserActions.deleteUserFailure
      ),
      tap(action => {
        this.snackBar.open(action.error, '', { duration: 2500 });
      })
    ),
    { dispatch: false }
  );

  notifyRoleSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        UserActions.createRoleSuccess,
        UserActions.updateRoleSuccess,
        UserActions.deleteRoleSuccess
      ),
      tap(action => {
        let msg = 'Opération rôle réussie';
        if (action.type === UserActions.createRoleSuccess.type) msg = 'Rôle créé';
        if (action.type === UserActions.updateRoleSuccess.type) msg = 'Rôle mis à jour';
        if (action.type === UserActions.deleteRoleSuccess.type) msg = 'Rôle supprimé';
        this.snackBar.open(msg, '', { duration: 2000 });
      })
    ),
    { dispatch: false }
  );

  notifyRoleError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        UserActions.createRoleFailure,
        UserActions.updateRoleFailure,
        UserActions.deleteRoleFailure
      ),
      tap(action => {
        this.snackBar.open(action.error, '', { duration: 2500 });
      })
    ),
    { dispatch: false }
  );
} 