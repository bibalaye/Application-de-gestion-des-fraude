import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { User, Role, UserUpdate } from '../../models/user.model';
import { Store } from '@ngrx/store';
import * as UserActions from '../../store/user.actions';
import { UserDialogComponent } from './user-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { selectRoles } from '../../store/user.selectors';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-user-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule
  ],
  template: `
    <h1 mat-dialog-title class="dialog-title">Détails de l'utilisateur</h1>
    <div mat-dialog-content class="dialog-content">
      <mat-card class="user-details-card">
        <mat-card-header class="card-header">
          <div mat-card-avatar class="user-avatar">
            <mat-icon>person</mat-icon>
          </div>
          <mat-card-title class="user-name">{{ data.user.username }}</mat-card-title>
          <mat-card-subtitle class="user-email">{{ data.user.email }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content class="card-content">
          <div class="detail-item">
            <strong>ID:</strong> <span>{{ data.user.id }}</span>
          </div>
          <div class="detail-item">
            <strong>Rôle:</strong> <span>{{ data.user.role.name }}</span>
          </div>
          <div class="detail-item">
            <strong>Statut:</strong> <span [class.status-active]="data.user.status === 'ACTIVE'" [class.status-inactive]="data.user.status === 'INACTIVE'">{{ data.user.status }}</span>
          </div>
          <div class="detail-item">
            <strong>Créé le:</strong> <span>{{ data.user.createdAt | date:'short' }}</span>
          </div>
          <div class="detail-item" *ngIf="data.user.updatedAt">
            <strong>Mis à jour le:</strong> <span>{{ data.user.updatedAt | date:'short' }}</span>
          </div>
          <div class="detail-item" *ngIf="data.user.lastLogin">
            <strong>Dernière connexion:</strong> <span>{{ data.user.lastLogin | date:'short' }}</span>
          </div>
          <div class="detail-item" *ngIf="data.user.lastPasswordChange">
            <strong>Dernier changement de mot de passe:</strong> <span>{{ data.user.lastPasswordChange | date:'short' }}</span>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
    <div mat-dialog-actions align="end" class="dialog-actions">
      <button mat-button (click)="onClose()">Fermer</button>
      <button mat-raised-button color="primary" 
              (click)="onEdit()"
              [disabled]="isProtectedUser()"
              [matTooltip]="isProtectedUser() ? 'Utilisateur protégé - Modification interdite' : ''">
        <mat-icon>edit</mat-icon> Modifier
      </button>
      <button mat-raised-button 
              [color]="data.user.status === 'ACTIVE' ? 'warn' : 'accent'" 
              (click)="onToggleStatus()"
              [disabled]="isProtectedUser()"
              [matTooltip]="isProtectedUser() ? 'Utilisateur protégé - Changement de statut interdit' : ''">
        <mat-icon>{{ data.user.status === 'ACTIVE' ? 'block' : 'check_circle' }}</mat-icon>
        {{ data.user.status === 'ACTIVE' ? 'Désactiver' : 'Activer' }}
      </button>
      <button mat-raised-button color="accent" 
              (click)="onDelete()"
              [disabled]="isProtectedUser()"
              [matTooltip]="isProtectedUser() ? 'Utilisateur protégé - Suppression interdite' : ''">
        <mat-icon>delete</mat-icon> Supprimer
      </button>
    </div>
  `,
  styles: [`
    .dialog-title {
      background-color: #1976d2;
      color: white;
      padding: 15px 24px;
      margin: -24px -24px 0 -24px;
      font-size: 1.5em;
      font-weight: 600;
    }
    .dialog-content {
      padding: 20px 0;
    }
    .user-details-card {
      width: 100%;
      box-shadow: none;
      border: none;
    }
    .card-header {
      display: flex;
      align-items: center;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
      margin-bottom: 20px;
    }
    .user-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: #e0e0e0;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 15px;
    }
    .user-avatar mat-icon {
      font-size: 40px;
      color: #757575;
    }
    .user-name {
      font-size: 1.8em;
      font-weight: 700;
      color: #333;
    }
    .user-email {
      color: #777;
      font-size: 1.1em;
    }
    .card-content {
      padding: 0 20px;
    }
    .detail-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px dashed #eee;
    }
    .detail-item:last-child {
      border-bottom: none;
    }
    .detail-item strong {
      color: #555;
      font-weight: 600;
    }
    .detail-item span {
      color: #333;
    }
    .status-active {
      color: #4CAF50;
      font-weight: bold;
    }
    .status-inactive {
      color: #f44336;
      font-weight: bold;
    }
    .dialog-actions {
      padding: 15px 24px;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
  `]
})
export class UserDetailsDialogComponent {
  roles$: Observable<Role[]> = this.store.select(selectRoles);
  
  // Protected user that cannot be modified or deleted
  private readonly PROTECTED_USERNAME = 'bibou';

  constructor(
    public dialogRef: MatDialogRef<UserDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
    private store: Store,
    private dialog: MatDialog
  ) {}

  isProtectedUser(): boolean {
    return this.data.user.username.toLowerCase() === this.PROTECTED_USERNAME.toLowerCase();
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onEdit(): void {
    // Block editing protected user
    if (this.isProtectedUser()) {
      return;
    }

    // Use take(1) to automatically unsubscribe after first emission
    this.roles$.pipe(take(1)).subscribe(roles => {
      const dialogRef = this.dialog.open(UserDialogComponent, {
        width: '450px',
        data: { user: this.data.user, roles, editMode: true }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const updatedUser: UserUpdate = {};
          if (result.email !== this.data.user.email) {
            updatedUser.email = result.email;
          }
          if (result.roleId !== this.data.user.role?.id) {
            updatedUser.role = { id: result.roleId };
          }
          if (result.password && result.password.length > 0) {
            updatedUser.password = result.password;
          }
          this.store.dispatch(UserActions.updateUser({ id: this.data.user.id, user: updatedUser }));
          this.dialogRef.close(); // Close details dialog after edit
        }
      });
    });
  }

  onDelete(): void {
    // Block deleting protected user
    if (this.isProtectedUser()) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title: 'Confirmer la suppression', message: `Voulez-vous vraiment supprimer l'utilisateur ${this.data.user.username} ?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(UserActions.deleteUser({ id: this.data.user.id }));
        this.dialogRef.close(); // Close details dialog after delete
      }
    });
  }

  onToggleStatus(): void {
    // Block status change for protected user
    if (this.isProtectedUser()) {
      return;
    }

    const newStatus = this.data.user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const message = `Voulez-vous vraiment ${newStatus === 'ACTIVE' ? 'activer' : 'désactiver'} l'utilisateur ${this.data.user.username} ?`;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title: 'Confirmer le changement de statut', message }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updatedUser: UserUpdate = { status: newStatus };
        this.store.dispatch(UserActions.updateUser({ id: this.data.user.id, user: updatedUser }));
        this.dialogRef.close(); // Close details dialog after status change
      }
    });
  }
}
