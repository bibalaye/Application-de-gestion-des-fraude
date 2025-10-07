import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Alert } from '../../models/alert.model';
import { selectSelectedAlert, selectAlertsLoading } from '../../store/alert.selectors';
import * as AlertActions from '../../store/alert.actions';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';


@Component({
  selector: 'app-alert-investigation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressBarModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <div class="alert-investigation-container fade-in">
      <mat-progress-bar mode="indeterminate" *ngIf="loading$ | async"></mat-progress-bar>

      <div class="header">
        <button mat-icon-button (click)="goBack()" class="back-button">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>Détails de l'Alerte</h1>
        <p class="subtitle">Examinez et qualifiez les alertes de fraude</p>
      </div>

      <mat-card *ngIf="selectedAlert$ | async as alert" class="alert-details-card">
        <mat-card-header>
          <mat-card-title class="alert-title-header">Alerte #{{ alert.id }}</mat-card-title>
          <mat-card-subtitle>Transaction ID: {{ alert.id }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="details-grid">
            <div><strong> ID:</strong> {{ alert.id }}</div>
             <div><strong> Montant:</strong> {{ (alert.amount * 655).toFixed(2)}} FCFA</div>
            <div><strong>Sévérité:</strong> <span [class]="getSeverityClass(alert.fraudProbability * 100)">{{ alert.fraudProbability * 100 }}%</span></div>
            <div><strong>Statut:</strong> <span [class]="getStatusClass(alert.status)">{{ alert.status }}</span></div>
            <div><strong>Date de Création:</strong> {{ alert.createdAt | date:'dd/MM/yyyy HH:mm' }}</div>
            <div *ngIf="alert.updatedAt"><strong>Dernière Mise à Jour:</strong> {{ alert.updatedAt | date:'dd/MM/yyyy HH:mm' }}</div>
            <div class="full-width"><strong>Description:</strong> {{ alert.comments }}</div>
          </div>

          <mat-divider class="section-divider"></mat-divider>

          <ng-container *ngIf="!isAlertProcessed(alert)">
            <h3 class="qualify-title">Qualifier l'Alerte</h3>
            <form (ngSubmit)="qualifyAlert()" class="qualify-form">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Nouveau Statut</mat-label>
                <mat-select [(ngModel)]="newStatus" name="newStatus" required>
                  <mat-option value="CLOTUREE_FRAUDE">CLOTUREE_FRAUDE</mat-option>
                  <mat-option value="CLOTUREE_NON_FRAUDE">CLOTUREE_NON_FRAUDE</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Commentaires (Optionnel)</mat-label>
                <textarea matInput [(ngModel)]="comments" name="comments" rows="3"></textarea>
              </mat-form-field>

              <button mat-raised-button color="primary" type="submit" [disabled]="(loading$ | async)" class="qualify-button">
                <mat-icon>check_circle</mat-icon> Qualifier
              </button>
            </form>
          </ng-container>

          <div *ngIf="isAlertProcessed(alert)" class="processed-message">
            <mat-icon>archive</mat-icon>
            <p>Cette alerte a déjà été traitée et archivée.</p>
          </div>
        </mat-card-content>
      </mat-card>

      <div *ngIf="!(selectedAlert$ | async) && !(loading$ | async)" class="no-alert-message">
        <mat-icon>info</mat-icon>
        <p>Aucune alerte sélectionnée ou trouvée.</p>
      </div>
    </div>
  `,
  styles: [`
    .alert-investigation-container {
      padding: 20px;
      max-width: 900px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
      text-align: center;
      position: relative;
      justify-content: center;
    }

    .header h1 {
      color: #1976d2;
      margin: 0;
      font-size: 2em;
    }

    .header .subtitle {
      color: #666;
      font-size: 16px;
      margin-top: 5px;
      width: 100%;
      text-align: center;
    }

    .back-button {
      position: absolute;
      left: 0;
      color: #1976d2;
    }

    .alert-details-card {
      margin-top: 20px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
    }

    .alert-details-card mat-card-header {
      background-color: #e3f2fd;
      padding: 20px;
      border-bottom: 1px solid #bbdefb;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }

    .alert-details-card mat-card-title {
      font-size: 24px;
      margin-bottom: 5px;
      color: #1976d2;
    }

    .alert-details-card mat-card-subtitle {
      color: #555;
    }

    .alert-details-card mat-card-content {
      padding: 20px;
    }

    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }

    .details-grid div {
      padding: 8px 0;
      border-bottom: 1px dashed #eee;
    }

    .details-grid div:last-child {
      border-bottom: none;
    }

    .details-grid .full-width {
      grid-column: 1 / -1;
    }

    .section-divider {
      margin: 25px 0;
    }

    .qualify-title {
      margin-top: 20px;
      margin-bottom: 15px;
      color: #1976d2;
      font-size: 1.5em;
      text-align: center;
    }

    .qualify-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 0 20px;
    }

    .qualify-button {
      align-self: flex-end;
      padding: 10px 25px;
      font-size: 16px;
    }

    .processed-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      color: #4CAF50;
      text-align: center;
      background-color: #e8f5e8;
      border-radius: 8px;
      margin-top: 20px;
      border: 1px solid #c8e6c9;
    }

    .processed-message mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #4CAF50;
      margin-bottom: 10px;
    }

    .processed-message p {
      font-size: 1.1em;
      font-weight: 500;
    }

    .no-alert-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      color: #666;
      text-align: center;
      margin-top: 20px;
    }

    .no-alert-message mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #ccc;
      margin-bottom: 10px;
    }

    /* Chip-like styles for status and severity */
    .status-CLOTUREE_FRAUDE, .status-CLOTUREE_NON_FRAUDE {
      background-color: #d32f2f;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: bold;
    }

    .status-NOUVELLE, .status-EN_COURS {
      background-color: #1976d2;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: bold;
    }

    .severity-HIGH {
      background-color: #f44336;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: bold;
    }

    .severity-MEDIUM {
      background-color: #ff9800;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: bold;
    }

    .severity-LOW {
      background-color: #4caf50;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: bold;
    }
  `]
})
export class AlertInvestigationComponent implements OnInit, OnDestroy {
  selectedAlert$: Observable<Alert | null>;
  loading$: Observable<boolean>;
  private subscriptions = new Subscription();

  newStatus: string = '';
  comments: string = '';
  currentAlertId: number | null = null;

  constructor(private store: Store, private route: ActivatedRoute, private router: Router) {
    this.selectedAlert$ = this.store.select(selectSelectedAlert);
    this.loading$ = this.store.select(selectAlertsLoading);
  }

  ngOnInit() {
    this.subscriptions.add(this.route.paramMap.subscribe(params => {
      const alertId = Number(params.get('id'));
      if (alertId) {
        this.currentAlertId = alertId;
        this.store.dispatch(AlertActions.loadAlertById({ id: alertId }));
      }
    }));

    this.subscriptions.add(this.selectedAlert$.subscribe(alert => {
      if (alert) {
        this.newStatus = alert.status;
        this.comments = alert.comments || '';
      }
    }));
  }

  qualifyAlert() {
    if (this.currentAlertId && this.newStatus) {
      this.store.dispatch(AlertActions.qualifyAlert({
        id: this.currentAlertId,
        status: this.newStatus,
        comments: this.comments
      }));
    }
  }

  isAlertProcessed(alert: Alert): boolean {
    return alert.status === 'CLOTUREE_FRAUDE' || alert.status === 'CLOTUREE_NON_FRAUDE';
  }

  getSeverityClass(fraudProbability: number): string {
    if (fraudProbability >= 85) {
      return 'severity-HIGH';
    } else if (fraudProbability >= 70) {
      return 'severity-MEDIUM';
    } else {
      return 'severity-LOW';
    }
  }

  getStatusClass(status: string): string {
    return `status-${status.toUpperCase().replace(' ', '_')}`;
  }

  goBack(): void {
    this.router.navigate(['/alerts']);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}