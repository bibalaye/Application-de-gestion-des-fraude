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
      
      <div class="login-wrapper">
        <!-- Left Side - Login Form -->
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

          <!-- Footer -->
          <mat-card-footer class="login-footer">
            <p>© 2025 - Projet de Mémoire MIAGE</p>
            <p class="footer-subtitle">Détection de Fraudes par Intelligence Artificielle</p>
          </mat-card-footer>
        </mat-card>

        <!-- Right Side - Info Panel -->
        <div class="info-panel">
          <!-- POC Banner -->
          <div class="poc-section">
            <mat-icon class="poc-icon">school</mat-icon>
            <h3>Proof of Concept</h3>
            <p class="poc-subtitle">Mémoire MIAGE</p>
            <div class="poc-description">
              <p>Système de Détection de Fraudes Financières par Machine Learning</p>
            </div>
          </div>

          <!-- Demo Credentials -->
          <div class="demo-section">
            <div class="demo-header">
              <mat-icon>info</mat-icon>
              <h4>Identifiants de démonstration</h4>
            </div>
            <div class="credentials-list">
              <div class="credential-item">
                <mat-icon>person</mat-icon>
                <div class="credential-details">
                  <span class="label">Utilisateur</span>
                  <span class="value">admin</span>
                </div>
              </div>
              <div class="credential-item">
                <mat-icon>lock</mat-icon>
                <div class="credential-details">
                  <span class="label">Mot de passe</span>
                  <span class="value">admin123</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Features -->
          <div class="features-section">
            <h4>Fonctionnalités</h4>
            <div class="feature-item">
              <mat-icon>dashboard</mat-icon>
              <span>Tableau de bord en temps réel</span>
            </div>
            <div class="feature-item">
              <mat-icon>notifications_active</mat-icon>
              <span>Gestion des alertes de fraude</span>
            </div>
            <div class="feature-item">
              <mat-icon>people</mat-icon>
              <span>Administration des utilisateurs</span>
            </div>
            <div class="feature-item">
              <mat-icon>upload_file</mat-icon>
              <span>Ingestion de transactions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-30px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(30px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
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
      padding: 20px;
    }

    .login-wrapper {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      max-width: 100%;
      width: 100%;
      align-items: start;
      padding: 0 40px;
    }

    .login-card {
      width: 100%;
      max-width: 550px;
      margin: 0 auto;
      padding: 40px;
      background: rgba(10, 25, 41, 0.9);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      animation: slideInLeft 0.8s ease-out forwards;
      color: #ffffff;
    }

    /* Info Panel - Right Side */
    .info-panel {
      display: flex;
      flex-direction: column;
      gap: 24px;
      max-width: 500px;
      margin: 0 auto;
      animation: slideInRight 0.8s ease-out forwards;
    }

    /* POC Section */
    .poc-section {
      background: linear-gradient(135deg, rgba(0, 229, 255, 0.15), rgba(0, 184, 212, 0.15));
      border: 2px solid rgba(0, 229, 255, 0.3);
      border-radius: 16px;
      padding: 30px;
      text-align: center;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 20px rgba(0, 229, 255, 0.2);
    }

    .poc-icon {
      font-size: 56px;
      width: 56px;
      height: 56px;
      color: #00e5ff;
      margin-bottom: 16px;
      animation: pulse 2s ease-in-out infinite;
    }

    .poc-section h3 {
      margin: 0 0 8px 0;
      font-size: 24px;
      font-weight: 600;
      color: #00e5ff;
      letter-spacing: 0.5px;
    }

    .poc-subtitle {
      margin: 0 0 16px 0;
      font-size: 16px;
      color: rgba(255, 255, 255, 0.7);
      font-weight: 500;
    }

    .poc-description p {
      margin: 0;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.6;
    }

    /* Demo Section */
    .demo-section {
      background: rgba(10, 25, 41, 0.9);
      border: 1px solid rgba(0, 229, 255, 0.2);
      border-radius: 16px;
      padding: 24px;
      backdrop-filter: blur(10px);
    }

    .demo-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(0, 229, 255, 0.2);
    }

    .demo-header mat-icon {
      color: #00e5ff;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .demo-header h4 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #00e5ff;
    }

    .credentials-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .credential-item {
      display: flex;
      align-items: center;
      gap: 16px;
      background: rgba(0, 229, 255, 0.05);
      border: 1px solid rgba(0, 229, 255, 0.2);
      border-radius: 8px;
      padding: 16px;
      transition: all 0.3s ease;
    }

    .credential-item:hover {
      background: rgba(0, 229, 255, 0.1);
      border-color: rgba(0, 229, 255, 0.4);
      transform: translateX(5px);
    }

    .credential-item mat-icon {
      color: #00e5ff;
      font-size: 28px;
      width: 28px;
      height: 28px;
      flex-shrink: 0;
    }

    .credential-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
    }

    .credential-details .label {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 500;
    }

    .credential-details .value {
      font-size: 16px;
      color: #ffffff;
      font-family: 'Courier New', monospace;
      font-weight: 600;
    }

    /* Features Section */
    .features-section {
      background: rgba(10, 25, 41, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 24px;
      backdrop-filter: blur(10px);
    }

    .features-section h4 {
      margin: 0 0 20px 0;
      font-size: 16px;
      font-weight: 600;
      color: #00e5ff;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(0, 229, 255, 0.2);
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
      transition: all 0.3s ease;
    }

    .feature-item:hover {
      color: #00e5ff;
      transform: translateX(5px);
    }

    .feature-item mat-icon {
      color: #00e5ff;
      font-size: 20px;
      width: 20px;
      height: 20px;
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



    /* Footer */
    .login-footer {
      text-align: center;
      padding: 20px 0 0 0;
      margin-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .login-footer p {
      margin: 4px 0;
      color: rgba(255, 255, 255, 0.7);
      font-size: 13px;
    }

    .footer-subtitle {
      font-size: 12px !important;
      color: rgba(255, 255, 255, 0.5) !important;
      font-style: italic;
    }

    /* Responsive */
    @media (max-width: 1200px) {
      .login-wrapper {
        grid-template-columns: 1fr;
        max-width: 600px;
        gap: 30px;
        margin: 0 auto;
        padding: 0 20px;
      }

      .info-panel {
        order: -1;
        max-width: 100%;
      }

      .login-card {
        max-width: 100%;
      }

      .poc-section {
        padding: 24px;
      }

      .poc-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
      }

      .poc-section h3 {
        font-size: 20px;
      }
    }

    @media (max-width: 600px) {
      .login-container {
        padding: 16px;
      }

      .login-wrapper {
        padding: 0 16px;
      }

      .login-card {
        padding: 30px 24px;
      }

      .poc-section {
        padding: 20px;
      }

      .demo-section,
      .features-section {
        padding: 20px;
      }

      .credential-item {
        padding: 12px;
      }

      .credential-details .value {
        font-size: 14px;
      }
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
  ) { }

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