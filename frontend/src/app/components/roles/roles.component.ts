
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Role, RoleCreate, RoleUpdate } from '../../models/user.model';
import * as UserActions from '../../store/user.actions';
import { selectRoles, selectUserLoading } from '../../store/user.selectors';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RoleDialogComponent } from './role-dialog.component';
import { ConfirmDialogComponent } from '../users/confirm-dialog.component';

@Component({
  selector: 'app-roles',
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
    MatCardModule,
    MatProgressBarModule
  ],
  template: `
    <div class="container">
      <mat-card class="roles-card">
        <mat-card-header>
          <mat-card-title>Gestion des Rôles</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="actions-bar">
            <button mat-raised-button color="primary" (click)="openRoleDialog()">
              <mat-icon>add</mat-icon> Nouveau Rôle
            </button>
          </div>

          <div class="table-container">
            <mat-progress-bar *ngIf="loading$ | async" mode="indeterminate"></mat-progress-bar>
            <table mat-table [dataSource]="(roles$ | async) ?? []" class="roles-table">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef> Nom du Rôle </th>
                <td mat-cell *matCellDef="let role"> {{role.name}} </td>
              </ng-container>
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef> Actions </th>
                <td mat-cell *matCellDef="let role">
                  <button mat-icon-button color="primary" (click)="openRoleDialog(role)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="openDeleteDialog(role)">
                    <mat-icon>delete_outline</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { padding: 24px; }
    .roles-card { }
    .actions-bar { display: flex; justify-content: flex-end; align-items: center; padding: 16px 0; }
    .table-container { position: relative; }
    .roles-table { width: 100%; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RolesComponent implements OnInit {
  roles$: Observable<Role[]> = this.store.select(selectRoles);
  loading$: Observable<boolean> = this.store.select(selectUserLoading);

  displayedColumns = ['name', 'actions'];

  constructor(private store: Store, public dialog: MatDialog) {}

  ngOnInit() {
    this.store.dispatch(UserActions.loadRoles());
  }

  openRoleDialog(role: Role | null = null): void {
    // Prevent opening multiple dialogs
    if (this.dialog.openDialogs.length > 0) {
      return;
    }

    const dialogRef = this.dialog.open(RoleDialogComponent, {
      width: '400px',
      data: { role, editMode: !!role }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (role) {
          const updatedRole: RoleUpdate = { name: result.name };
          this.store.dispatch(UserActions.updateRole({ id: role.id, role: updatedRole }));
        } else {
          const newRole: RoleCreate = result;
          this.store.dispatch(UserActions.createRole({ role: newRole }));
        }
      }
    });
  }

  openDeleteDialog(role: Role): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title: 'Confirmer la suppression', message: `Voulez-vous vraiment supprimer le rôle ${role.name} ?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(UserActions.deleteRole({ id: role.id }));
      }
    });
  }
}
 