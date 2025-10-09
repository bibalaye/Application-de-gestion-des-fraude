import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { User, Role, UserCreate, UserUpdate } from '../../models/user.model';
import { selectUsers, selectRoles, selectUserLoading, selectUserTotal, selectUserPage, selectUserPageSize, selectUserSearch } from '../../store/user.selectors';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import * as UserActions from '../../store/user.actions';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { UserDetailsDialogComponent } from './user-details-dialog.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserDialogComponent } from './user-dialog.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatTooltipModule
  ],
  template: `
    <div class="container">
      <mat-card class="user-card">
        <mat-card-header>
          <mat-card-title>Gestion des Utilisateurs</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="actions-bar">
            <button mat-raised-button color="primary" (click)="openUserDialog()">
              <mat-icon>add</mat-icon> Nouvel Utilisateur
            </button>
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Rechercher un utilisateur...</mat-label>
              <input matInput [(ngModel)]="search" (ngModelChange)="onSearchChange()">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>

          <div class="table-container">
            <mat-progress-bar *ngIf="loading$ | async" mode="indeterminate"></mat-progress-bar>
            <table mat-table [dataSource]="(users$ | async) ?? []" class="users-table">
              <ng-container matColumnDef="username">
                <th mat-header-cell *matHeaderCellDef> Nom d'utilisateur </th>
                <td mat-cell *matCellDef="let user"> {{user.username}} </td>
              </ng-container>
              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef> Email </th>
                <td mat-cell *matCellDef="let user"> {{user.email}} </td>
              </ng-container>
              <ng-container matColumnDef="role">
                <th mat-header-cell *matHeaderCellDef> Rôle </th>
                <td mat-cell *matCellDef="let user"> {{user.role?.name}} </td>
              </ng-container>
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef> Actions </th>
                <td mat-cell *matCellDef="let user">
                  <button mat-icon-button color="primary" 
                          (click)="openUserDialog(user)"
                          [disabled]="isProtectedUser(user)"
                          [matTooltip]="isProtectedUser(user) ? 'Utilisateur protégé - Modification interdite' : 'Modifier'">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" 
                          (click)="openDeleteDialog(user)"
                          [disabled]="isProtectedUser(user)"
                          [matTooltip]="isProtectedUser(user) ? 'Utilisateur protégé - Suppression interdite' : 'Supprimer'">
                    <mat-icon>delete_outline</mat-icon>
                  </button>
                  <button mat-icon-button color="info" 
                          (click)="openUserDetailsDialog(user)"
                          matTooltip="Voir les détails">
                    <mat-icon>info</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
            <mat-paginator
              [length]="total$ | async"
              [pageSize]="pageSize$ | async"
              [pageIndex]="page$ | async"
              [pageSizeOptions]="[5, 10, 25, 50]"
              (page)="onPageChange($event)">
            </mat-paginator>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { padding: 24px; }
    .user-card { background-color: #2c3e50; color: white; }
    .actions-bar { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; }
    .search-field { width: 300px; }
    .table-container { position: relative; }
    .users-table { width: 100%; background-color: transparent; }
    mat-header-cell { color: #90a4ae; }
    mat-cell { color: white; }
    mat-paginator { background-color: transparent; color: white; }
    :host ::ng-deep .mat-mdc-form-field {
      .mdc-text-field--outlined .mdc-notched-outline > * { border-color: rgba(255, 255, 255, 0.3) !important; }
      .mdc-text-field--outlined:not(.mdc-text-field--disabled):hover .mdc-notched-outline > * { border-color: #00e5ff !important; }
      .mdc-floating-label { color: rgba(255, 255, 255, 0.7) !important; }
    }
    :host ::ng-deep .mat-mdc-input-element { color: #ffffff !important; }
    :host ::ng-deep .mat-mdc-select-arrow { color: rgba(255, 255, 255, 0.7); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit {
  users$: Observable<User[]> = this.store.select(selectUsers);
  roles$: Observable<Role[]> = this.store.select(selectRoles);
  loading$: Observable<boolean> = this.store.select(selectUserLoading);
  total$: Observable<number> = this.store.select(selectUserTotal);
  page$: Observable<number> = this.store.select(selectUserPage);
  pageSize$: Observable<number> = this.store.select(selectUserPageSize);
  search$: Observable<string> = this.store.select(selectUserSearch);

  displayedColumns = ['username', 'email', 'role', 'actions'];
  search = '';

  // Protected user that cannot be modified or deleted
  private readonly PROTECTED_USERNAME = 'bibou';

  constructor(private store: Store, public dialog: MatDialog) {}

  isProtectedUser(user: User): boolean {
    return user.username.toLowerCase() === this.PROTECTED_USERNAME.toLowerCase();
  }

  ngOnInit() {
    this.store.dispatch(UserActions.loadUsers());
    this.store.dispatch(UserActions.loadRoles());
    this.search$.pipe(take(1)).subscribe(s => this.search = s);
  }

  onSearchChange() {
    this.store.dispatch(UserActions.setUserSearch({ search: this.search }));
  }

  onPageChange(event: PageEvent) {
    this.store.dispatch(UserActions.setUserPage({ page: event.pageIndex }));
    this.store.dispatch(UserActions.setUserPageSize({ pageSize: event.pageSize }));
  }

  openUserDialog(user: User | null = null): void {
    // Block editing protected user
    if (user && this.isProtectedUser(user)) {
      return;
    }

    // Prevent opening multiple dialogs
    if (this.dialog.openDialogs.length > 0) {
      return;
    }

    // Use take(1) to automatically unsubscribe after first emission
    this.roles$.pipe(take(1)).subscribe(roles => {
      const dialogRef = this.dialog.open(UserDialogComponent, {
        width: '450px',
        data: { user, roles, editMode: !!user }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (user) {
            const updatedUser: UserUpdate = {};
            if (result.email !== user.email) {
              updatedUser.email = result.email;
            }
            if (result.roleId !== user.role?.id) {
              updatedUser.role = { id: result.roleId };
            }
            if (result.password && result.password.length > 0) {
              updatedUser.password = result.password;
            }
            this.store.dispatch(UserActions.updateUser({ id: user.id, user: updatedUser }));
          } else {
            const newUser: UserCreate = {
              username: result.username,
              email: result.email,
              password: result.password,
              role: { id: result.roleId } // Construct the role object
            };
            this.store.dispatch(UserActions.createUser({ user: newUser }));
          }
        }
      });
    });
  }

  openUserDetailsDialog(user: User): void {
    this.dialog.open(UserDetailsDialogComponent, {
      width: '500px',
      data: { user }
    });
  }

  openDeleteDialog(user: User): void {
    // Block deleting protected user
    if (this.isProtectedUser(user)) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title: 'Confirmer la suppression', message: `Voulez-vous vraiment supprimer l'utilisateur ${user.username} ?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(UserActions.deleteUser({ id: user.id }));
      }
    });
  }
}
 