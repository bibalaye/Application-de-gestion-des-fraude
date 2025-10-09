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
        <mat-icon class="header-icon">dashboard</mat-icon>
        <h1>Tableau de Bord</h1>
        <p class="subtitle">Vue d'ensemble du système de détection de fraude</p>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading$ | async" class="loading-container">
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
        <p class="loading-text">Chargement des données...</p>
      </div>

      <!-- No Data State -->
      <div *ngIf="!(loading$ | async) && !(kpis$ | async)" class="no-data-container">
        <mat-icon class="no-data-icon">info_outline</mat-icon>
        <h2>Aucune donnée disponible</h2>
        <p>Les statistiques du tableau de bord ne sont pas encore disponibles.</p>
        <button mat-raised-button color="primary" (click)="refreshData()">
          <mat-icon>refresh</mat-icon>
          Actualiser
        </button>
      </div>

      <!-- Data Display -->
      <div *ngIf="!(loading$ | async) && (kpis$ | async) as kpis" class="data-container">
        <!-- Alertes KPIs Section -->
        <section class="kpi-section alert-kpis">
          <div class="section-header">
            <mat-icon class="section-icon">notifications_active</mat-icon>
            <h2>Statistiques des Alertes</h2>
          </div>
          <div class="dashboard-grid">
            <mat-card class="kpi-card">
              <div class="kpi-icon-wrapper warn">
                <mat-icon class="kpi-icon">notification_important</mat-icon>
              </div>
              <div class="kpi-content">
                <div class="kpi-value">{{ kpis.newAlerts }}</div>
                <div class="kpi-label">Nouvelles Alertes</div>
              </div>
            </mat-card>

            <mat-card class="kpi-card">
              <div class="kpi-icon-wrapper primary">
                <mat-icon class="kpi-icon">pending</mat-icon>
              </div>
              <div class="kpi-content">
                <div class="kpi-value">{{ kpis.inInvestigation }}</div>
                <div class="kpi-label">En Investigation</div>
              </div>
            </mat-card>

            <mat-card class="kpi-card">
              <div class="kpi-icon-wrapper success">
                <mat-icon class="kpi-icon">check_circle</mat-icon>
              </div>
              <div class="kpi-content">
                <div class="kpi-value">{{ kpis.resolvedToday }}</div>
                <div class="kpi-label">Résolues Aujourd'hui</div>
              </div>
            </mat-card>

            <mat-card class="kpi-card">
              <div class="kpi-icon-wrapper primary">
                <mat-icon class="kpi-icon">analytics</mat-icon>
              </div>
              <div class="kpi-content">
                <div class="kpi-value">{{ (kpis.detectionRate).toFixed(2) }}%</div>
                <div class="kpi-label">Taux de Détection</div>
              </div>
            </mat-card>

            <mat-card class="kpi-card">
              <div class="kpi-icon-wrapper warn">
                <mat-icon class="kpi-icon">warning</mat-icon>
              </div>
              <div class="kpi-content">
                <div class="kpi-value">{{ kpis.totalAlerts }}</div>
                <div class="kpi-label">Alertes Totales</div>
              </div>
            </mat-card>

            <mat-card class="kpi-card">
              <div class="kpi-icon-wrapper error">
                <mat-icon class="kpi-icon">gavel</mat-icon>
              </div>
              <div class="kpi-content">
                <div class="kpi-value">{{ kpis.fraudulentAlerts }}</div>
                <div class="kpi-label">Alertes Frauduleuses</div>
              </div>
            </mat-card>

            <mat-card class="kpi-card">
              <div class="kpi-icon-wrapper success">
                <mat-icon class="kpi-icon">verified</mat-icon>
              </div>
              <div class="kpi-content">
                <div class="kpi-value">{{ kpis.nonFraudulentAlerts }}</div>
                <div class="kpi-label">Alertes Non Frauduleuses</div>
              </div>
            </mat-card>
          </div>
        </section>

        <!-- Utilisateurs KPIs Section -->
        <section class="kpi-section user-kpis">
          <div class="section-header">
            <mat-icon class="section-icon">people</mat-icon>
            <h2>Statistiques des Utilisateurs</h2>
          </div>
          <div class="dashboard-grid">
            <mat-card class="kpi-card">
              <div class="kpi-icon-wrapper info">
                <mat-icon class="kpi-icon">group</mat-icon>
              </div>
              <div class="kpi-content">
                <div class="kpi-value">{{ kpis.totalUsers }}</div>
                <div class="kpi-label">Utilisateurs Totaux</div>
              </div>
            </mat-card>

            <mat-card class="kpi-card">
              <div class="kpi-icon-wrapper success">
                <mat-icon class="kpi-icon">person_add</mat-icon>
              </div>
              <div class="kpi-content">
                <div class="kpi-value">{{ kpis.activeUsers }}</div>
                <div class="kpi-label">Utilisateurs Actifs</div>
              </div>
            </mat-card>

            <mat-card class="kpi-card">
              <div class="kpi-icon-wrapper warn">
                <mat-icon class="kpi-icon">person_off</mat-icon>
              </div>
              <div class="kpi-content">
                <div class="kpi-value">{{ kpis.inactiveUsers }}</div>
                <div class="kpi-label">Utilisateurs Inactifs</div>
              </div>
            </mat-card>

            <mat-card class="kpi-card">
              <div class="kpi-icon-wrapper primary">
                <mat-icon class="kpi-icon">person_add_alt_1</mat-icon>
              </div>
              <div class="kpi-content">
                <div class="kpi-value">{{ kpis.newUsersToday }}</div>
                <div class="kpi-label">Nouveaux Aujourd'hui</div>
              </div>
            </mat-card>

            <mat-card class="kpi-card">
              <div class="kpi-icon-wrapper error">
                <mat-icon class="kpi-icon">admin_panel_settings</mat-icon>
              </div>
              <div class="kpi-content">
                <div class="kpi-value">{{ kpis.adminUsers }}</div>
                <div class="kpi-label">Administrateurs</div>
              </div>
            </mat-card>

            <mat-card class="kpi-card">
              <div class="kpi-icon-wrapper info">
                <mat-icon class="kpi-icon">person</mat-icon>
              </div>
              <div class="kpi-content">
                <div class="kpi-value">{{ kpis.regularUsers }}</div>
                <div class="kpi-label">Utilisateurs Réguliers</div>
              </div>
            </mat-card>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      padding: 0;
      background: #1a202c;
      min-height: calc(100vh - 64px);
    }

    .dashboard-container {
      max-width: 1600px;
      margin: 0 auto;
      padding: 24px 20px;
      animation: fadeIn 0.6s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .dashboard-header {
      margin-bottom: 30px;
      text-align: center;
      padding: 30px 24px;
      background: #2d3748;
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(0, 229, 255, 0.2);
      position: relative;
      overflow: hidden;
    }

    .dashboard-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #00e5ff 0%, #00b8d4 100%);
    }

    .header-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #00e5ff;
      margin-bottom: 12px;
      filter: drop-shadow(0 0 15px rgba(0, 229, 255, 0.5));
    }
    
    .dashboard-header h1 {
      font-size: 2.2em;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 8px 0;
      letter-spacing: -0.5px;
    }
    
    .subtitle {
      font-size: 0.95em;
      color: #90a4ae;
      font-weight: 500;
      line-height: 1.5;
      margin: 0;
    }

    /* Loading State */
    .loading-container {
      text-align: center;
      padding: 80px 40px;
      background: #2d3748;
      border-radius: 20px;
      border: 1px solid rgba(0, 229, 255, 0.2);
    }

    .loading-text {
      margin-top: 20px;
      color: #90a4ae;
      font-size: 1.1em;
      font-weight: 500;
    }

    /* No Data State */
    .no-data-container {
      text-align: center;
      padding: 100px 40px;
      background: #2d3748;
      border-radius: 20px;
      border: 2px dashed rgba(0, 229, 255, 0.3);
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    }

    .no-data-icon {
      font-size: 120px;
      width: 120px;
      height: 120px;
      color: rgba(0, 229, 255, 0.4);
      margin-bottom: 30px;
    }

    .no-data-container h2 {
      color: #ffffff;
      font-size: 2em;
      font-weight: 700;
      margin-bottom: 16px;
    }

    .no-data-container p {
      color: #90a4ae;
      font-size: 1.1em;
      margin-bottom: 30px;
    }

    .no-data-container button {
      background: #00e5ff;
      color: #1a202c;
      font-weight: 700;
      padding: 12px 30px;
      font-size: 1.1em;
    }

    .no-data-container button:hover {
      box-shadow: 0 0 30px rgba(0, 229, 255, 0.5);
      transform: translateY(-2px);
    }

    .kpi-section {
      background: #2d3748;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: transform 0.3s ease;
    }

    .kpi-section:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(0, 229, 255, 0.2);
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 2px solid rgba(0, 229, 255, 0.3);
    }

    .section-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: #00e5ff;
      filter: drop-shadow(0 0 8px rgba(0, 229, 255, 0.5));
    }

    .section-header h2 {
      font-size: 1.4em;
      font-weight: 600;
      color: #ffffff;
      margin: 0;
      letter-spacing: -0.3px;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    }

    .kpi-card {
      padding: 16px !important;
      border-radius: 12px;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      display: flex;
      align-items: center;
      gap: 14px;
      height: 100%;
      background: #1e2936;
      border: 2px solid rgba(0, 229, 255, 0.2);
      position: relative;
      overflow: hidden;
      cursor: pointer;
    }

    .kpi-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #00e5ff 0%, #00b8d4 100%);
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }

    .kpi-card:hover::before {
      transform: scaleX(1);
    }

    .kpi-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 229, 255, 0.3);
      border-color: #00e5ff;
    }

    .kpi-icon-wrapper {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      transition: transform 0.3s ease;
    }

    .kpi-card:hover .kpi-icon-wrapper {
      transform: scale(1.08) rotate(3deg);
    }

    .kpi-icon {
      font-size: 24px !important;
      width: 24px !important;
      height: 24px !important;
      color: #ffffff;
    }

    .kpi-icon-wrapper.warn { 
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }
    
    .kpi-icon-wrapper.primary { 
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }
    
    .kpi-icon-wrapper.success { 
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }
    
    .kpi-icon-wrapper.info { 
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    }
    
    .kpi-icon-wrapper.error { 
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
    }

    .kpi-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .kpi-value {
      font-size: 1.8em;
      font-weight: 700;
      color: #ffffff;
      line-height: 1;
      letter-spacing: -0.5px;
    }
    
    .kpi-label {
      color: #90a4ae;
      font-size: 0.75em;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      line-height: 1.2;
    }

    .alert-kpis {
      background: rgba(0, 229, 255, 0.03);
      border: 1px solid rgba(0, 229, 255, 0.2);
    }

    .user-kpis {
      background: rgba(0, 229, 255, 0.03);
      border: 1px solid rgba(0, 229, 255, 0.2);
    }

    @media (max-width: 992px) {
      .dashboard-grid {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 14px;
      }
      .kpi-section {
        padding: 20px;
      }
      .section-header h2 {
        font-size: 1.3em;
      }
      .kpi-value {
        font-size: 1.6em;
      }
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 16px 12px;
      }
      .dashboard-grid {
        grid-template-columns: 1fr;
        gap: 12px;
      }
      .kpi-section {
        padding: 16px;
        margin-bottom: 20px;
      }
      .section-header {
        margin-bottom: 16px;
      }
      .section-header h2 {
        font-size: 1.2em;
      }
      .section-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
      .kpi-icon-wrapper {
        width: 42px;
        height: 42px;
      }
      .kpi-icon {
        font-size: 20px !important;
        width: 20px !important;
        height: 20px !important;
      }
      .kpi-value {
        font-size: 1.5em;
      }
      .kpi-label {
        font-size: 0.7em;
      }
      .subtitle {
        font-size: 0.85em;
      }
      .dashboard-header h1 {
        font-size: 1.8em;
      }
      .header-icon {
        font-size: 36px;
        width: 36px;
        height: 36px;
      }
      .no-data-container {
        padding: 60px 30px;
      }
      .no-data-icon {
        font-size: 80px;
        width: 80px;
        height: 80px;
      }
    }

    @media (max-width: 480px) {
      .dashboard-header {
        padding: 20px 16px;
      }
      .dashboard-header h1 {
        font-size: 1.6em;
      }
      .section-header h2 {
        font-size: 1.1em;
      }
      .kpi-value {
        font-size: 1.4em;
      }
      .kpi-card {
        padding: 14px !important;
        gap: 12px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  kpis$: Observable<DashboardKPIs | null>;
  loading$: Observable<boolean>;

  constructor(private store: Store) {
    this.kpis$ = this.store.select(selectDashboardKPIs);
    this.loading$ = this.store.select(state => false); // Vous pouvez ajouter un sélecteur de loading si nécessaire
  }

  ngOnInit() {
    console.log('Dashboard: Loading KPIs...');
    this.store.dispatch(AlertActions.loadDashboardKPIs());
    
    // Subscribe to see the data
    this.kpis$.subscribe(kpis => {
      console.log('Dashboard KPIs received:', kpis);
    });
  }

  refreshData() {
    console.log('Dashboard: Refreshing KPIs...');
    this.store.dispatch(AlertActions.loadDashboardKPIs());
  }
}