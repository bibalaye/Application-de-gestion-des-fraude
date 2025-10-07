import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TransactionDTO, FraudPredictionDTO } from '../models/ingestion.model';

@Injectable({
  providedIn: 'root'
})
export class IngestionService {
  private apiUrl = '/api/ingest';

  constructor(private http: HttpClient) { }

  ingestTransactions(transactions: TransactionDTO[]): Observable<FraudPredictionDTO[]> {
    return this.http.post<FraudPredictionDTO[]>(`${this.apiUrl}/transactions`, transactions);
  }
}