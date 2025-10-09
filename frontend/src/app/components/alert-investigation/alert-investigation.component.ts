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
    :host {
      display: block;
      background: #1a202c;
      min-height: calc(100vh - 64px);
    }

    .alert-investigation-container {
      padding: 40px 30px;
      max-width: 1000px;
      margin: 0 auto;
      animation: fadeIn 0.6s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .header {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 40px;
      text-align: center;
      position: relative;
      padding: 40px 20px;
      background: #2d3748;
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .header h1 {
      color: #00e5ff;
      margin: 0;
      font-size: 3em;
      font-weight: 800;
      letter-spacing: -1px;
      text-shadow: 0 0 20px rgba(0, 229, 255, 0.3);
    }

    .header .subtitle {
      color: #90a4ae;
      font-size: 1.2em;
      margin-top: 12px;
      font-weight: 500;
    }

    .back-button {
      position: absolute;
      left: 20px;
      top: 20px;
      color: #00e5ff;
      background: rgba(0, 229, 255, 0.1);
      border: 1px solid rgba(0, 229, 255, 0.3);
    }

    .back-button:hover {
      background: rgba(0, 229, 255, 0.2);
      box-shadow: 0 0 20px rgba(0, 229, 255, 0.3);
    }

    .alert-details-card {
      margin-top: 20px;
      box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
      border-radius: 20px;
      background: #2d3748;
      border: 1px solid rgba(255, 255, 255, 0.1);
      overflow: hidden;
    }

    .alert-details-card mat-card-header {
      background: rgba(0, 229, 255, 0.05);
      padding: 30px;
      border-bottom: 2px solid rgba(0, 229, 255, 0.3);
    }

    .alert-details-card mat-card-title {
      font-size: 2em;
      margin-bottom: 8px;
      color: #00e5ff;
      font-weight: 700;
    }

    .alert-details-card mat-card-subtitle {
      color: #90a4ae;
      font-size: 1.1em;
    }

    .alert-details-card mat-card-content {
      padding: 30px;
    }

    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .details-grid div {
      padding: 12px 16px;
      background: rgba(0, 229, 255, 0.05);
      border-radius: 10px;
      border: 1px solid rgba(0, 229, 255, 0.2);
      color: #ffffff;
    }

    .details-grid div strong {
      color: #00e5ff;
      display: block;
      margin-bottom: 4px;
    }

    .details-grid .full-width {
      grid-column: 1 / -1;
    }

    .section-divider {
      margin: 30px 0;
      border-color: rgba(0, 229, 255, 0.3);
    }

    .qualify-title {
      margin-top: 30px;
      margin-bottom: 20px;
      color: #00e5ff;
      font-size: 1.8em;
      text-align: center;
      font-weight: 700;
    }

    .qualify-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding: 0 20px;
    }

    .qualify-button {
      align-self: flex-end;
      padding: 12px 30px;
      font-size: 16px;
      font-weight: 700;
      background: #00e5ff;
      color: #1a202c;
    }

    .qualify-button:hover {
      box-shadow: 0 0 20px rgba(0, 229, 255, 0.5);
    }

    .processed-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      color: #00e5ff;
      text-align: center;
      background: rgba(0, 229, 255, 0.1);
      border-radius: 16px;
      margin-top: 20px;
      border: 2px solid rgba(0, 229, 255, 0.3);
    }

    .processed-message mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #00e5ff;
      margin-bottom: 16px;
    }

    .processed-message p {
      font-size: 1.2em;
      font-weight: 600;
      color: #ffffff;
    }

    .no-alert-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 40px;
      color: #90a4ae;
      text-align: center;
      margin-top: 20px;
      background: #2d3748;
      border-radius: 20px;
      border: 2px dashed rgba(0, 229, 255, 0.3);
    }

    .no-alert-message mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: rgba(0, 229, 255, 0.5);
      margin-bottom: 16px;
    }

    .no-alert-message p {
      color: #ffffff;
      font-size: 1.1em;
      font-weight: 600;
    }

    /* Chip-like styles for status and severity */
    .status-CLOTUREE_FRAUDE {
      background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
      color: #dc2626;
      padding: 6px 12px;
      border-radius: 8px;
      font-weight: 700;
      border: 2px solid #fca5a5;
    }

    .status-CLOTUREE_NON_FRAUDE {
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
      color: #059669;
      padding: 6px 12px;
      border-radius: 8px;
      font-weight: 700;
      border: 2px solid #6ee7b7;
    }

    .status-NOUVELLE {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      color: #d97706;
      padding: 6px 12px;
      border-radius: 8px;
      font-weight: 700;
      border: 2px solid #fcd34d;
    }

    .status-EN_COURS {
      background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
      color: #1d4ed8;
      padding: 6px 12px;
      border-radius: 8px;
      font-weight: 700;
      border: 2px solid #93c5fd;
    }

    .severity-HIGH {
      background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
      color: #dc2626;
      padding: 6px 12px;
      border-radius: 8px;
      font-weight: 700;
      border: 2px solid #fca5a5;
    }

    .severity-MEDIUM {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      color: #d97706;
      padding: 6px 12px;
      border-radius: 8px;
      font-weight: 700;
      border: 2px solid #fcd34d;
    }

    .severity-LOW {
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
      color: #059669;
      padding: 6px 12px;
      border-radius: 8px;
      font-weight: 700;
      border: 2px solid #6ee7b7;
    }

    :host ::ng-deep .mat-mdc-form-field {
      .mdc-text-field--outlined .mdc-notched-outline > * { 
        border-color: rgba(0, 229, 255, 0.3) !important; 
      }
      .mdc-text-field--outlined:not(.mdc-text-field--disabled):hover .mdc-notched-outline > * { 
        border-color: #00e5ff !important; 
      }
      .mdc-floating-label { 
        color: #90a4ae !important; 
      }
    }

    :host ::ng-deep .mat-mdc-input-element,
    :host ::ng-deep .mat-mdc-select-value {
      color: #ffffff !important;
    }

    :host ::ng-deep .mat-mdc-select-arrow {
      color: #00e5ff;
    }

    @media (max-width: 768px) {
      .alert-investigation-container {
        padding: 24px 16px;
      }
      .header h1 {
        font-size: 2.2em;
      }
      .details-grid {
        grid-template-columns: 1fr;
      }
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