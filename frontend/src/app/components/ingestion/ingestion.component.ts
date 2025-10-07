import { Component } from '@angular/core';
import { IngestionService } from '../../services/ingestion.service';
import { TransactionDTO, FraudPredictionDTO } from '../../models/ingestion.model';
import * as Papa from 'papaparse';

// Importation des modules Angular Material nécessaires pour le template HTML
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ingestion',
  templateUrl: './ingestion.component.html',
  styleUrls: ['./ingestion.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatCardModule,
    MatDividerModule,
    MatBadgeModule
  ]
})
export class IngestionComponent {
  fileName: string = '';
  transactions: TransactionDTO[] = [];
  tableHeaders: string[] = [];
  isLoading = false;
  message: string | null = null;
  messageType: 'success' | 'error' = 'success';
  predictions: FraudPredictionDTO[] = [];

  constructor(private ingestionService: IngestionService) {}

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      this.message = null;
      this.transactions = [];
      this.predictions = [];
      this.parseFile(file);
    }
  }

  parseFile(file: File): void {
    if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (result) => {
          this.tableHeaders = result.meta.fields || [];
          this.transactions = this.cleanData(result.data as any[]);
        },
        error: (error) => {
          console.error('CSV parsing error:', error);
          this.handleError('Erreur lors de l\'analyse du fichier CSV.');
        }
      });
    } else if (file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const lines = e.target.result.split('\n');
          const transactions: TransactionDTO[] = [];
          for (const line of lines) {
            if (line.trim() !== '') {
              transactions.push(JSON.parse(line));
            }
          }

          if (transactions.length > 0) {
            this.tableHeaders = Object.keys(transactions[0]);
            this.transactions = this.cleanData(transactions);
          } else {
            this.handleError('Format JSON invalide ou tableau vide.');
          }
        } catch (error) {
          console.error('JSON parsing error:', error);
          this.handleError('Erreur lors de l\'analyse du fichier JSON.');
        }
      };
      reader.readAsText(file);
    }
  }

  cleanData(data: any[]): TransactionDTO[] {
    return data.map(item => {
      const transaction: any = {};
      for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          let value = item[key];
          if (typeof value === 'string') {
            value = value.trim();
          }
          if (value === '' || value === null || value === undefined) {
            value = 0;
          }
          transaction[key] = value;
        }
      }
      return transaction as TransactionDTO;
    });
  }

  ingestTransactions(): void {
    if (this.transactions.length > 0) {
      this.isLoading = true;
      this.message = null;
      this.predictions = [];
      this.ingestionService.ingestTransactions(this.transactions).subscribe(
        (response) => {
          this.isLoading = false;
          this.message = 'Transactions ingérées avec succès !';
          this.messageType = 'success';
          this.predictions = response;
          this.transactions = [];
          this.fileName = '';
        },
        (error) => {
          this.isLoading = false;
          console.error('Ingestion error:', error);
          this.handleError("Erreur lors de l'ingestion des transactions.");
        }
      );
    }
  }

  private handleError(errorMessage: string) {
    this.message = errorMessage;
    this.messageType = 'error';
    this.isLoading = false;
  }

  get alertCount(): number {
    // Adapte le seuil si besoin
    return this.predictions.filter(p => p.fraud_probability >= 0.5).length;
  }
}