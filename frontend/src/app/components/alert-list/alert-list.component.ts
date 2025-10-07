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
    .alert-list-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 30px;
      text-align: center;
    }

    .header h1 {
      color: #1976d2;
      margin-bottom: 8px;
    }

    .subtitle {
      color: #666;
      font-size: 16px;
    }

    .alert-card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .alert-card {
      cursor: pointer;
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .alert-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .alert-card mat-card-header {
      padding-bottom: 0;
    }

    .alert-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.2em;
      font-weight: 600;
      color: #3f51b5;
    }

    .alert-title mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .severity-icon-HIGH {
      color: #f44336;
    }

    .severity-icon-MEDIUM {
      color: #ff9800;
    }

    .severity-icon-LOW {
      color: #4caf50;
    }

    .alert-card mat-card-subtitle {
      color: #777;
    }

    .alert-card mat-card-content {
      padding-top: 10px;
      flex-grow: 1;
    }

    .alert-card mat-card-content p {
      margin-bottom: 5px;
      font-size: 0.9em;
    }

    .alert-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 15px;
      flex-wrap: wrap;
      gap: 10px;
    }

    .alert-meta mat-chip-listbox {
      display: flex;
      gap: 5px;
    }

    .created-at {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 0.8em;
      color: #888;
    }

    .alert-actions {
      padding: 16px;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      border-top: 1px solid #eee;
    }

    .alert-actions button {
      text-transform: uppercase;
      font-weight: 500;
    }

    /* Severity Chips */
    .severity-HIGH {
      background-color: #ffebee;
      color: #d32f2f;
    }

    .severity-MEDIUM {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .severity-LOW {
      background-color: #e8f5e8;
      color: #388e3c;
    }

    /* Status Chips */
    .status-NOUVELLE {
      background-color: #ffecb3;
      color: #f57c00;
    }

    .status-EN_COURS {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .status-CLOTUREE_FRAUDE {
      background-color: #ffebee;
      color: #d32f2f;
    }

    .status-CLOTUREE_NON_FRAUDE {
      background-color: #e8f5e8;
      color: #388e3c;
    }

    @media (max-width: 768px) {
      .alert-list-container {
        padding: 16px;
      }
      .alert-card-grid {
        grid-template-columns: 1fr;
      }
    }

    .no-alerts-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      color: #666;
      text-align: center;
    }

    .no-alerts-message mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #ccc;
      margin-bottom: 10px;
    }

    .no-alerts-message p {
      margin-bottom: 20px;
      font-size: 16px;
    }

    .alert-section {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }

    .alert-section h2 {
      color: #1976d2;
      margin-bottom: 20px;
      text-align: center;
      font-size: 1.8em;
    }

    .archived-alerts {
      opacity: 0.7;
      filter: grayscale(50%);
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
