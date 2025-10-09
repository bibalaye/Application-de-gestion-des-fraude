import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Alert } from '../../models/alert.model';
import { selectAllAlerts, selectAlertsLoading } from '../../store/alert.selectors';
import * as AlertActions from '../../store/alert.actions';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-alert-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatProgressBarModule,
    MatPaginatorModule
  ],
  template: `
    <div class="alert-list-container fade-in">
      <div class="header">
        <h1>Liste des Alertes</h1>
        <p class="subtitle">Gestion et investigation des alertes de fraude</p>
      </div>

      <!-- Progress Bar -->
      <mat-progress-bar mode="indeterminate" *ngIf="loading$ | async"></mat-progress-bar>

      <!-- Active Alert Cards -->
      <div class="alert-section">
        <h2>Alertes Actives</h2>
        <div class="alert-card-grid">
          <mat-card *ngFor="let alert of activeAlertsDataSource.connect() | async" class="alert-card" (click)="selectAlert(alert)">
            <mat-card-header>
              <mat-card-title class="alert-title">
                <mat-icon [class]="getSeverityIconClass(alert.fraudProbability.toString())">{{ getSeverityIcon(alert.fraudProbability.toString()) }}</mat-icon>
                Alerte #{{ alert.id }}
              </mat-card-title>
              <mat-card-subtitle>Transaction: {{ alert.id }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p><strong>Montant:</strong> {{ (alert.amount * 655).toFixed(2) }} FCFA</p>
              <p><strong>Temps:</strong> {{ alert.time }}</p>
              <p><strong>Description:</strong> {{ alert.comments }}</p>
              <div class="alert-meta">
                <mat-chip-listbox>
                  <mat-chip [class]="getSeverityClass(alert.fraudProbability * 100)">
                    {{ alert.fraudProbability * 100 }}%
                  </mat-chip>
                  <mat-chip [class]="getStatusClass(alert.status)">
                    {{ alert.status.toUpperCase() }}
                  </mat-chip>
                </mat-chip-listbox>
                <span class="created-at">
                  <mat-icon>access_time</mat-icon>
                  {{ alert.createdAt | date:'short' }}
                </span>
              </div>
            </mat-card-content>
            <mat-card-actions class="alert-actions">
              <button mat-button color="primary" (click)="viewAlert(alert)">
                <mat-icon>visibility</mat-icon> Voir Détails
              </button>
              <button mat-button color="accent" (click)="investigateAlert(alert)">
                <mat-icon>search</mat-icon> Investiguer
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
        <mat-paginator *ngIf="activeAlertsDataSource.data.length > 6" [pageSizeOptions]="[6, 12, 24]" [pageSize]="6" showFirstLastButtons></mat-paginator>
        <div *ngIf="activeAlertsDataSource.data.length === 0 && !(loading$ | async)" class="no-alerts-message">
          <mat-icon>info</mat-icon>
          <p>Aucune alerte active trouvée.</p>
        </div>
      </div>

      <!-- Archived Alert Cards -->
      <div class="alert-section archived-alerts">
        <h2>Alertes Archivées</h2>
        <div class="alert-card-grid">
          <mat-card *ngFor="let alert of archivedAlertsDataSource.connect() | async" class="alert-card" (click)="selectAlert(alert)">
            <mat-card-header>
              <mat-card-title class="alert-title">
                <mat-icon [class]="getSeverityIconClass(alert.fraudProbability.toString())">{{ getSeverityIcon(alert.fraudProbability.toString()) }}</mat-icon>
                Alerte #{{ alert.id }}
              </mat-card-title>
              <mat-card-subtitle>Transaction: {{ alert.id }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p><strong>Montant:</strong> {{ (alert.amount * 655).toFixed(2) }} FCFA</p>
              <p><strong>Temps:</strong> {{ alert.time }}</p>
              <p><strong>Description:</strong> {{ alert.comments }}</p>
              <div class="alert-meta">
                <mat-chip-listbox>
                  <mat-chip [class]="getSeverityClass(alert.fraudProbability * 100)">
                    {{ alert.fraudProbability * 100 }}%
                  </mat-chip>
                  <mat-chip [class]="getStatusClass(alert.status)">
                    {{ alert.status.toUpperCase() }}
                  </mat-chip>
                </mat-chip-listbox>
                <span class="created-at">
                  <mat-icon>access_time</mat-icon>
                  {{ alert.createdAt | date:'short' }}
                </span>
              </div>
            </mat-card-content>
            <mat-card-actions class="alert-actions">
              <button mat-button color="primary" (click)="viewAlert(alert)">
                <mat-icon>visibility</mat-icon> Voir Détails
              </button>
              <button mat-button color="accent" (click)="investigateAlert(alert)">
                <mat-icon>search</mat-icon> Investiguer
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
        <mat-paginator *ngIf="archivedAlertsDataSource.data.length > 6" [pageSizeOptions]="[6, 12, 24]" [pageSize]="6" showFirstLastButtons></mat-paginator>
        <div *ngIf="archivedAlertsDataSource.data.length === 0 && !(loading$ | async)" class="no-alerts-message">
          <mat-icon>info</mat-icon>
          <p>Aucune alerte archivée trouvée.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background: #1a202c;
      min-height: calc(100vh - 64px);
      padding: 0;
    }

    .alert-list-container {
      padding: 40px 30px;
      max-width: 1600px;
      margin: 0 auto;
      animation: fadeIn 0.6s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .header {
      margin-bottom: 40px;
      text-align: center;
      padding: 40px 20px;
      background: #2d3748;
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .header h1 {
      font-size: 3em;
      font-weight: 800;
      color: #00e5ff;
      margin-bottom: 12px;
      letter-spacing: -1px;
      text-shadow: 0 0 20px rgba(0, 229, 255, 0.3);
    }

    .subtitle {
      color: #90a4ae;
      font-size: 1.2em;
      font-weight: 500;
    }

    .alert-section {
      margin-bottom: 50px;
      background: #2d3748;
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .alert-section h2 {
      font-size: 2.2em;
      font-weight: 700;
      color: #00e5ff;
      margin-bottom: 30px;
      display: flex;
      align-items: center;
      gap: 15px;
      padding-bottom: 20px;
      border-bottom: 3px solid rgba(0, 229, 255, 0.3);
    }

    .alert-section h2::before {
      content: '';
      width: 6px;
      height: 40px;
      background: #00e5ff;
      border-radius: 3px;
      box-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
    }

    .alert-card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 28px;
      margin-top: 30px;
    }

    .alert-card {
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #1e2936;
      border: 2px solid rgba(0, 229, 255, 0.2);
      border-radius: 20px;
      overflow: hidden;
      position: relative;
    }

    .alert-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 5px;
      background: linear-gradient(90deg, #00e5ff 0%, #00b8d4 100%);
      transform: scaleX(0);
      transition: transform 0.4s ease;
    }

    .alert-card:hover::before {
      transform: scaleX(1);
    }

    .alert-card:hover {
      transform: translateY(-10px) scale(1.02);
      box-shadow: 0 20px 60px rgba(0, 229, 255, 0.3);
      border-color: #00e5ff;
    }

    .alert-card mat-card-header {
      padding: 20px 20px 0 20px;
      background: rgba(0, 229, 255, 0.05);
    }

    .alert-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.3em;
      font-weight: 700;
      color: #ffffff;
    }

    .alert-title mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      padding: 6px;
      border-radius: 10px;
      background: rgba(0, 229, 255, 0.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .severity-icon-HIGH {
      color: #ef4444;
      background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%) !important;
    }

    .severity-icon-MEDIUM {
      color: #f59e0b;
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%) !important;
    }

    .severity-icon-LOW {
      color: #10b981;
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%) !important;
    }

    .alert-card mat-card-subtitle {
      color: #90a4ae;
      font-weight: 600;
      margin-top: 8px;
    }

    .alert-card mat-card-content {
      padding: 20px;
      flex-grow: 1;
    }

    .alert-card mat-card-content p {
      margin-bottom: 12px;
      font-size: 0.95em;
      color: #b0bec5;
      line-height: 1.6;
    }

    .alert-card mat-card-content p strong {
      color: #ffffff;
      font-weight: 700;
    }

    .alert-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      padding-top: 16px;
      border-top: 2px dashed rgba(255, 255, 255, 0.1);
      flex-wrap: wrap;
      gap: 12px;
    }

    .alert-meta mat-chip-listbox {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .alert-meta mat-chip {
      font-weight: 700;
      font-size: 0.85em;
      padding: 8px 16px;
      border-radius: 12px;
      letter-spacing: 0.5px;
    }

    .created-at {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.85em;
      color: #90a4ae;
      font-weight: 600;
    }

    .created-at mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .alert-actions {
      padding: 16px 20px;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      background: rgba(0, 229, 255, 0.03);
      border-top: 2px solid rgba(255, 255, 255, 0.1);
    }

    .alert-actions button {
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.5px;
      border-radius: 10px;
      padding: 8px 16px;
    }

    /* Severity Chips */
    .severity-HIGH {
      background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
      color: #dc2626;
      border: 2px solid #fca5a5;
    }

    .severity-MEDIUM {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      color: #d97706;
      border: 2px solid #fcd34d;
    }

    .severity-LOW {
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
      color: #059669;
      border: 2px solid #6ee7b7;
    }

    /* Status Chips */
    .status-NOUVELLE {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      color: #d97706;
      border: 2px solid #fcd34d;
    }

    .status-EN_COURS {
      background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
      color: #1d4ed8;
      border: 2px solid #93c5fd;
    }

    .status-CLOTUREE_FRAUDE {
      background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
      color: #dc2626;
      border: 2px solid #fca5a5;
    }

    .status-CLOTUREE_NON_FRAUDE {
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
      color: #059669;
      border: 2px solid #6ee7b7;
    }

    .no-alerts-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 40px;
      color: #90a4ae;
      text-align: center;
      background: rgba(0, 229, 255, 0.05);
      border-radius: 16px;
      border: 2px dashed rgba(0, 229, 255, 0.3);
    }

    .no-alerts-message mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: rgba(0, 229, 255, 0.5);
      margin-bottom: 16px;
    }

    .no-alerts-message p {
      margin-bottom: 0;
      font-size: 1.1em;
      font-weight: 600;
      color: #ffffff;
    }

    .archived-alerts {
      opacity: 0.85;
    }

    .archived-alerts .alert-card {
      filter: grayscale(20%);
    }

    mat-paginator {
      background: rgba(0, 0, 0, 0.2);
      color: #ffffff;
      margin-top: 30px;
      border-radius: 12px;
    }

    :host ::ng-deep .mat-mdc-paginator {
      background: transparent;
      color: #ffffff;
    }

    :host ::ng-deep .mat-mdc-paginator .mat-mdc-icon-button {
      color: #00e5ff;
    }

    @media (max-width: 768px) {
      .alert-list-container {
        padding: 24px 16px;
      }
      .alert-card-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      .header {
        padding: 30px 16px;
      }
      .header h1 {
        font-size: 2.2em;
      }
      .alert-section {
        padding: 24px;
      }
      .alert-section h2 {
        font-size: 1.8em;
      }
    }
  `]
})
export class AlertListComponent implements OnInit, OnDestroy {
  alerts$: Observable<Alert[]>;
  loading$: Observable<boolean>;
  activeAlertsDataSource = new MatTableDataSource<Alert>();
  archivedAlertsDataSource = new MatTableDataSource<Alert>();

  @ViewChild('activePaginator') activePaginator!: MatPaginator;
  @ViewChild('archivedPaginator') archivedPaginator!: MatPaginator;

  private subscriptions = new Subscription();

  constructor(private store: Store, private router: Router) {
    this.alerts$ = this.store.select(selectAllAlerts);
    this.loading$ = this.store.select(selectAlertsLoading);
  }

  ngOnInit() {
    this.loadAlerts();

    const alertsSubscription = this.alerts$.subscribe(alerts => {
      console.log('[ALERT-LIST] Alerts reçues du store :', alerts);
      this.activeAlertsDataSource.data = alerts.filter(alert =>
        alert.status !== 'CLOTUREE_FRAUDE' && alert.status !== 'CLOTUREE_NON_FRAUDE'
      );
      this.archivedAlertsDataSource.data = alerts.filter(alert =>
        alert.status === 'CLOTUREE_FRAUDE' || alert.status === 'CLOTUREE_NON_FRAUDE'
      );
    });
    this.subscriptions.add(alertsSubscription);

    const loadingSubscription = this.loading$.subscribe(loading => {
      console.log('[ALERT-LIST] Loading :', loading);
    });
    this.subscriptions.add(loadingSubscription);
  }

  ngAfterViewInit() {
    this.activeAlertsDataSource.paginator = this.activePaginator;
    this.archivedAlertsDataSource.paginator = this.archivedPaginator;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  loadAlerts() {
    console.log('[ALERT-LIST] Dispatch loadAlerts');
    this.store.dispatch(AlertActions.loadAlerts());
  }

  selectAlert(alert: Alert) {
    this.store.dispatch(AlertActions.selectAlert({ alert }));
  }

  viewAlert(alert: Alert) {
    this.selectAlert(alert);
    this.router.navigate(['/alerts', alert.id]);
  }

  investigateAlert(alert: Alert) {
    this.selectAlert(alert);
    this.router.navigate(['/alerts', alert.id]);
  }

  getSeverityClass(fraudProbability: number): string {
    return `severity-${fraudProbability.toString()}`;
  }

  getStatusClass(status: string): string {
    return `status-${status.toUpperCase().replace(' ', '_')}`;
  }

  getSeverityIcon(severity: string): string {
      const value = parseFloat(severity);

      if (value >= 0.85 && value <= 1) {
        return 'error';
      } else if (value >= 0.7 && value < 0.85) {
        return 'warning';
      } else if (value >= 0.5 && value < 0.7) {
        return 'info';
      } else {
        return 'notifications';
      }

  }

  getSeverityIconClass(severity: string): string {
    const value = parseFloat(severity);
    if (value >= 0.85 && value <= 1) {
      return 'severity-icon-HIGH';
    } else if (value >= 0.7 && value < 0.85) {
      return 'severity-icon-MEDIUM';
    } else if (value >= 0.5 && value < 0.7) {
      return 'severity-icon-LOW';
    } else {
      return 'severity-icon-LOW';
    }
  }
}
