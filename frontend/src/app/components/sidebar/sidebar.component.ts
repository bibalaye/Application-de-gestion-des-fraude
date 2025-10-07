import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectAuthUser } from '../../store/auth.selectors';
import * as AuthActions from '../../store/auth.actions';
import { UserProfile } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule
  ],
  template: `
    <nav class="sidebar">
      <div class="sidebar-header">
        <mat-icon class="logo-icon">shield</mat-icon>
        <span class="logo-text">FraudGuard</span>
      </div>

      <mat-nav-list class="navigation-list">
        <h3 class="nav-section-title">ANALYSE</h3>
        <a mat-list-item routerLink="/dashboard" routerLinkActive="active-link">
          <mat-icon matListItemIcon>dashboard</mat-icon>
          <span>Tableau de Bord</span>
        </a>
        <a mat-list-item routerLink="/alerts" routerLinkActive="active-link">
          <mat-icon matListItemIcon>warning</mat-icon>
          <span>Alertes</span>
        </a>

        <h3 class="nav-section-title">ADMINISTRATION</h3>
        <a mat-list-item routerLink="/users" routerLinkActive="active-link">
          <mat-icon matListItemIcon>people</mat-icon>
          <span>Utilisateurs</span>
        </a>
        <a mat-list-item routerLink="/roles" routerLinkActive="active-link">
          <mat-icon matListItemIcon>admin_panel_settings</mat-icon>
          <span>Rôles</span>
        </a>
        <a mat-list-item routerLink="/ingestion" routerLinkActive="active-link">
          <mat-icon matListItemIcon>publish</mat-icon>
          <span>Ingestion</span>
        </a>
      </mat-nav-list>

      <div class="sidebar-footer">
        <div class="user-info" *ngIf="user$ | async as user">
          <div class="user-avatar">
            <mat-icon>person</mat-icon>
          </div>
          <div class="user-details">
            <span class="user-name">{{ user.username }}</span>
            <span class="user-role">{{ user?.roles?.[0] || '' }}</span>
          </div>
        </div>
        <button mat-icon-button class="logout-button" (click)="logout()" *ngIf="user$ | async">
          <mat-icon>logout</mat-icon>
        </button>
      </div>
    </nav>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      height: 100vh;
      background-color: var(--background-light);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1000;
      transition: width 0.3s ease;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px;
      border-bottom: 1px solid var(--border-color);
    }

    .logo-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: var(--primary-accent);
    }

    .logo-text {
      font-size: 22px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .navigation-list {
      flex: 1;
      padding-top: 16px;
      overflow-y: auto;
    }

    .nav-section-title {
      font-size: 12px;
      font-weight: 500;
      color: var(--text-secondary);
      padding: 0 16px 8px 16px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .mat-mdc-list-item {
      color: var(--text-secondary);
      margin: 0 12px 8px 12px !important;
      border-radius: 8px !important;
      height: 44px !important;
    }

    .mat-mdc-list-item:hover {
      background-color: rgba(0, 229, 255, 0.1);
      color: var(--primary-accent-hover);
    }

    .active-link {
      background-color: var(--primary-accent) !important;
      color: #000 !important;
      font-weight: 500;
    }

    .active-link .mat-icon {
      color: #000 !important;
    }

    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: var(--primary-accent);
      color: #000;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-details {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
    }

    .user-role {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .logout-button {
      color: var(--text-secondary);
    }

    .logout-button:hover {
      color: var(--warn-color);
    }
  `]
})
export class SidebarComponent {
  user$: Observable<UserProfile | null>;

  constructor(private store: Store) {
    this.user$ = this.store.select(selectAuthUser);
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }

  getRoleLabel(roleName: string): string {
    switch (roleName?.toLowerCase()) {
      case 'analyst': return 'Analyste';
      case 'manager': return 'Manager';
      case 'admin': return 'Administrateur';
      default: return roleName;
    }
  }
}