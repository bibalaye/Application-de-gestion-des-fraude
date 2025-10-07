import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DashboardKPIs } from '../../models/alert.model';
import { selectDashboardKPIs } from '../../store/alert.selectors';
import * as AlertActions from '../../store/alert.actions';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule
  ],
  template: `
    <div class="dashboard-container fade-in">
      <div class="dashboard-header">
        <h1>Tableau de Bord</h1>
        <p class="subtitle">Vue d'ensemble du système de détection de fraude</p>
      </div>

      <mat-progress-bar mode="indeterminate" *ngIf="!(kpis$ | async)"></mat-progress-bar>

      <div *ngIf="kpis$ | async as kpis">
        <!-- Alertes KPIs Section -->
        <section class="kpi-section alert-kpis">
          <h2><mat-icon>notifications_active</mat-icon> Statistiques des Alertes</h2>
          <div class="dashboard-grid">
            <mat-card class="kpi-card">
              <mat-card-header>
                <mat-icon mat-card-avatar class="kpi-icon warn">notification_important</mat-icon>
                <mat-card-title class="kpi-value">{{ kpis.newAlerts }}</mat-card-title>
                <mat-card-subtitle>Nouvelles Alertes</mat-card-subtitle>
              </mat-card-header>
            </mat-card>

            <mat-card class="kpi-card">
              <mat-card-header>
                <mat-icon mat-card-avatar class="kpi-icon primary">pending</mat-icon>
                <mat-card-title class="kpi-value">{{ kpis.inInvestigation }}</mat-card-title>
                <mat-card-subtitle>En Investigation</mat-card-subtitle>
              </mat-card-header>
            </mat-card>

            <mat-card class="kpi-card">
              <mat-card-header>
                <mat-icon mat-card-avatar class="kpi-icon success">check_circle</mat-icon>
                <mat-card-title class="kpi-value">{{ kpis.resolvedToday }}</mat-card-title>
                <mat-card-subtitle>Résolues Aujourd'hui</mat-card-subtitle>
              </mat-card-header>
            </mat-card>

            <mat-card class="kpi-card">
              <mat-card-header>
                <mat-icon mat-card-avatar class="kpi-icon primary">analytics</mat-icon>
                <mat-card-title class="kpi-value">{{ (kpis.detectionRate).toFixed(2) }}%</mat-card-title>
                <mat-card-subtitle>Taux de Détection</mat-card-subtitle>
              </mat-card-header>
            </mat-card>

            <mat-card class="kpi-card">
              <mat-card-header>
                <mat-icon mat-card-avatar class="kpi-icon warn">warning</mat-icon>
                <mat-card-title class="kpi-value">{{ kpis.totalAlerts }}</mat-card-title>
                <mat-card-subtitle>Alertes Totales</mat-card-subtitle>
              </mat-card-header>
            </mat-card>

            <mat-card class="kpi-card">
              <mat-card-header>
                <mat-icon mat-card-avatar class="kpi-icon error">gavel</mat-icon>
                <mat-card-title class="kpi-value">{{ kpis.fraudulentAlerts }}</mat-card-title>
                <mat-card-subtitle>Alertes Frauduleuses</mat-card-subtitle>
              </mat-card-header>
            </mat-card>

            <mat-card class="kpi-card">
              <mat-card-header>
                <mat-icon mat-card-avatar class="kpi-icon success">verified</mat-icon>
                <mat-card-title class="kpi-value">{{ kpis.nonFraudulentAlerts }}</mat-card-title>
                <mat-card-subtitle>Alertes Non Frauduleuses</mat-card-subtitle>
              </mat-card-header>
            </mat-card>
          </div>
        </section>

        <!-- Utilisateurs KPIs Section -->
        <section class="kpi-section user-kpis">
          <h2><mat-icon>people</mat-icon> Statistiques des Utilisateurs</h2>
          <div class="dashboard-grid">
            <mat-card class="kpi-card">
              <mat-card-header>
                <mat-icon mat-card-avatar class="kpi-icon info">group</mat-icon>
                <mat-card-title class="kpi-value">{{ kpis.totalUsers }}</mat-card-title>
                <mat-card-subtitle>Utilisateurs Totaux</mat-card-subtitle>
              </mat-card-header>
            </mat-card>

            <mat-card class="kpi-card">
              <mat-card-header>
                <mat-icon mat-card-avatar class="kpi-icon success">person_add</mat-icon>
                <mat-card-title class="kpi-value">{{ kpis.activeUsers }}</mat-card-title>
                <mat-card-subtitle>Utilisateurs Actifs</mat-card-subtitle>
              </mat-card-header>
            </mat-card>

            <mat-card class="kpi-card">
              <mat-card-header>
                <mat-icon mat-card-avatar class="kpi-icon warn">person_off</mat-icon>
                <mat-card-title class="kpi-value">{{ kpis.inactiveUsers }}</mat-card-title>
                <mat-card-subtitle>Utilisateurs Inactifs</mat-card-subtitle>
              </mat-card-header>
            </mat-card>

            <mat-card class="kpi-card">
              <mat-card-header>
                <mat-icon mat-card-avatar class="kpi-icon primary">person_add_alt_1</mat-icon>
                <mat-card-title class="kpi-value">{{ kpis.newUsersToday }}</mat-card-title>
                <mat-card-subtitle>Nouveaux Utilisateurs Aujourd'hui</mat-card-subtitle>
              </mat-card-header>
            </mat-card>

            <mat-card class="kpi-card">
              <mat-card-header>
                <mat-icon mat-card-avatar class="kpi-icon error">admin_panel_settings</mat-icon>
                <mat-card-title class="kpi-value">{{ kpis.adminUsers }}</mat-card-title>
                <mat-card-subtitle>Administrateurs</mat-card-subtitle>
              </mat-card-header>
            </mat-card>

            <mat-card class="kpi-card">
              <mat-card-header>
                <mat-icon mat-card-avatar class="kpi-icon info">person</mat-icon>
                <mat-card-title class="kpi-value">{{ kpis.regularUsers }}</mat-card-title>
                <mat-card-subtitle>Utilisateurs Réguliers</mat-card-subtitle>
              </mat-card-header>
            </mat-card>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      padding: 20px;
      background-color: #f0f2f5; /* Lighter background for the whole page */
      min-height: calc(100vh - 64px); /* Adjust based on header height */
    }

    .dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
      padding: 30px;
    }

    .dashboard-header {
      margin-bottom: 40px;
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #e0e0e0;
    }
    .dashboard-header h1 {
      font-size: 3em;
      font-weight: 800;
      color: #2c3e50; /* Darker, more prominent heading */
      margin-bottom: 10px;
      letter-spacing: -0.5px;
    }
    .subtitle {
      font-size: 1.2em;
      color: #7f8c8d;
      line-height: 1.5;
    }

    .kpi-section {
      background-color: #fdfefe; /* White background for sections */
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 40px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
      border: 1px solid #e9ecef;
    }

    .kpi-section h2 {
      font-size: 2em;
      font-weight: 700;
      color: #34495e; /* Darker section title */
      margin-bottom: 25px;
      display: flex;
      align-items: center;
      gap: 12px;
      padding-bottom: 15px;
      border-bottom: 2px solid #dcdcdc;
    }

    .kpi-section h2 mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #34495e;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 28px;
    }

    .kpi-card {
      padding: 20px !important;
      border-radius: 12px;
      transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%; /* Ensure cards in a row have same height */
    }

    .kpi-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    }

    .kpi-card mat-card-header {
      margin-bottom: 15px;
    }

    .kpi-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
      flex-shrink: 0;
    }

    .kpi-icon.warn { background-image: linear-gradient(45deg, #ffc107, #ff9800); } /* Amber to Orange */
    .kpi-icon.primary { background-image: linear-gradient(45deg, #2196f3, #1976d2); } /* Light Blue to Dark Blue */
    .kpi-icon.success { background-image: linear-gradient(45deg, #4caf50, #388e3c); } /* Light Green to Dark Green */
    .kpi-icon.info { background-image: linear-gradient(45deg, #00bcd4, #0097a7); } /* Cyan to Dark Cyan */
    .kpi-icon.error { background-image: linear-gradient(45deg, #f44336, #d32f2f); } /* Red to Dark Red */

    .kpi-value {
      font-size: 2.8em;
      font-weight: 800;
      color: #2c3e50; /* Darker text for values */
      margin-top: 10px;
      line-height: 1;
    }
    mat-card-subtitle {
      color: #95a5a6 !important;
      font-size: 1em;
      font-weight: 500;
      margin-top: 5px;
    }

    /* Specific section styling */
    .alert-kpis {
      background-color: #e8f4f8; /* Very light blue for alerts */
      border-color: #b3e5fc;
    }

    .alert-kpis h2 {
      color: #0277bd;
    }

    .alert-kpis h2 mat-icon {
      color: #0277bd;
    }

    .user-kpis {
      background-color: #e8f5e8; /* Very light green for users */
      border-color: #c8e6c9;
    }

    .user-kpis h2 {
      color: #2e7d32;
    }

    .user-kpis h2 mat-icon {
      color: #2e7d32;
    }

    @media (max-width: 992px) {
      .dashboard-grid {
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 20px;
      }
      .kpi-section {
        padding: 25px;
      }
      .kpi-section h2 {
        font-size: 1.8em;
      }
      .kpi-value {
        font-size: 2.4em;
      }
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 20px;
      }
      .dashboard-grid {
        grid-template-columns: 1fr;
        gap: 15px;
      }
      .kpi-section {
        padding: 20px;
        margin-bottom: 25px;
      }
      .kpi-section h2 {
        font-size: 1.6em;
        margin-bottom: 15px;
      }
      .kpi-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
      }
      .kpi-value {
        font-size: 2em;
      }
      .subtitle {
        font-size: 1em;
      }
    }

    @media (max-width: 480px) {
      .dashboard-header h1 {
        font-size: 2.2em;
      }
      .kpi-section h2 {
        font-size: 1.4em;
      }
      .kpi-value {
        font-size: 1.8em;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  kpis$: Observable<DashboardKPIs | null>;

  constructor(private store: Store) {
    this.kpis$ = this.store.select(selectDashboardKPIs);
  }

  ngOnInit() {
    this.store.dispatch(AlertActions.loadDashboardKPIs());
  }
}