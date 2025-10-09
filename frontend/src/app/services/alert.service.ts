import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Alert } from '../models/alert.model';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private apiUrl = '/api/alerts';

  constructor(private http: HttpClient) {}

  // Récupérer la liste des alertes
  getAllAlerts(): Observable<Alert[]> {
    return this.http.get<Alert[]>(this.apiUrl);
  }

  private mapApiAlertToAlert(apiAlert: any): Alert {
    return {
      id: apiAlert.id,
      amount: apiAlert.amount,
      time: apiAlert.time,
      fraudProbability: apiAlert.fraudProbability,
      status: apiAlert.status,
      comments: apiAlert.comments,
      updatedAt: apiAlert.updatedAt,
      createdAt: apiAlert.createdAt
    };
  }

  // Récupérer une alerte par son ID
  getAlertById(id: number): Observable<Alert> {
    return this.http.get<Alert>(`${this.apiUrl}/${id}`);
  }

  // Qualifier une alerte
  qualifyAlert(id: number, status: string, comments?: string): Observable<Alert> {
    let params = new HttpParams().set('status', status);
    if (comments) {
      params = params.set('comments', comments);
    }
    return this.http.put<Alert>(`${this.apiUrl}/${id}/qualify`, {}, { params });
  }

  // Récupérer les KPIs du dashboard
  getDashboardKPIs(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard/kpis`);
  }
}