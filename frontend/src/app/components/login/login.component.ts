import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-container">
      <div class="background-shapes"></div>
      <mat-card class="login-card">
        <mat-card-header class="login-header">
          <mat-icon class="header-icon">security</mat-icon>
          <mat-card-title>Accès Sécurisé</mat-card-title>
          <mat-card-subtitle>Système de Surveillance de Fraude</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form (ngSubmit)="login()">
            <mat-form-field class="full-width" appearance="outline">
              <mat-label>Nom d'utilisateur</mat-label>
              <input matInput [(ngModel)]="username" name="username" required>
              <mat-icon matPrefix>person</mat-icon>
            </mat-form-field>

            <mat-form-field class="full-width" appearance="outline">
              <mat-label>Mot de passe</mat-label>
              <input matInput type="password" [(ngModel)]="password" name="password" required>
              <mat-icon matPrefix>lock</mat-icon>
            </mat-form-field>

            <div *ngIf="errorMessage" class="error-message">
              <mat-icon>error</mat-icon>
              {{ errorMessage }}
            </div>

            <button mat-raised-button color="primary" class="login-button" type="submit" [disabled]="loading">
              <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
              <span *ngIf="!loading">Se connecter</span>
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
      position: relative;
      overflow: hidden;
      font-family: 'Roboto', sans-serif;
    }

    .login-card {
      width: 100%;
      max-width: 420px;
      padding: 40px;
      background: rgba(10, 25, 41, 0.8);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      animation: fadeIn 0.8s ease-out forwards;
      color: #ffffff;
    }

    .login-header {
      text-align: center;
      margin-bottom: 32px;
      color: #ffffff;
    }

    .header-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #00e5ff;
      margin-bottom: 16px;
    }

    .login-header mat-card-title {
      font-size: 28px;
      font-weight: 500;
      letter-spacing: 1px;
    }

    .login-header mat-card-subtitle {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.7);
      margin-top: 8px;
    }

    .full-width {
      width: 100%;
    }

    /* Style for MatFormField */
    :host ::ng-deep .mat-mdc-form-field {
      .mdc-text-field--outlined .mdc-notched-outline > * {
        border-color: rgba(255, 255, 255, 0.3) !important;
      }
      .mdc-text-field--outlined:not(.mdc-text-field--disabled):hover .mdc-notched-outline > * {
        border-color: #00e5ff !important;
      }
      .mdc-floating-label {
        color: rgba(255, 255, 255, 0.7) !important;
      }
    }
    :host ::ng-deep .mat-mdc-input-element {
      color: #ffffff !important;
    }
    :host ::ng-deep .mat-mdc-form-field .mat-icon {
      color: rgba(255, 255, 255, 0.7);
    }

    .error-message {
      color: #ff8a80;
      display: flex;
      align-items: center;
      gap: 8px;
      margin: -8px 0 16px;
      font-size: 14px;
      font-weight: 500;
    }

    .login-button {
      width: 100%;
      height: 48px;
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 1px;
      border-radius: 8px;
      background-color: #00b8d4;
      color: #ffffff;
      transition: background-color 0.3s ease, box-shadow 0.3s ease;
      margin-top: 16px;
    }

    .login-button:hover:not(:disabled) {
      background-color: #00e5ff;
      box-shadow: 0 0 15px rgba(0, 229, 255, 0.5);
    }

    .login-button:disabled {
      background-color: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.4);
    }

    mat-progress-spinner {
      display: inline-block;
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Identifiants invalides';
        console.error('Login error:', error);
      }
    });
  }
} 