import { createAction, props } from '@ngrx/store';
import { Alert, DashboardKPIs } from '../models/alert.model';

// Load Actions
export const loadAlerts = createAction(
  '[Alert] Load Alerts'
);
export const loadAlertsSuccess = createAction(
  '[Alert] Load Alerts Success',
  props<{ alerts: Alert[] }>()
);
export const loadAlertsFailure = createAction(
  '[Alert] Load Alerts Failure',
  props<{ error: string }>()
);

// Selection Actions
export const selectAlert = createAction(
  '[Alert] Select Alert',
  props<{ alert: Alert }>()
);
export const clearSelectedAlert = createAction('[Alert] Clear Selected Alert');

export const loadAlertById = createAction(
  '[Alert] Load Alert By Id',
  props<{ id: number }>()
);

export const loadAlertByIdSuccess = createAction(
  '[Alert] Load Alert By Id Success',
  props<{ alert: Alert }>()
);

export const loadAlertByIdFailure = createAction(
  '[Alert] Load Alert By Id Failure',
  props<{ error: string }>()
);

// Qualify Alert Actions
export const qualifyAlert = createAction(
  '[Alert] Qualify Alert',
  props<{ id: number; status: string; comments?: string }>()
);

export const qualifyAlertSuccess = createAction(
  '[Alert] Qualify Alert Success',
  props<{ alert: Alert }>()
);

export const qualifyAlertFailure = createAction(
  '[Alert] Qualify Alert Failure',
  props<{ error: string }>()
);

// Dashboard KPI Actions
export const loadDashboardKPIs = createAction(
  '[Dashboard] Load KPIs'
);

export const loadDashboardKPIsSuccess = createAction(
  '[Dashboard] Load KPIs Success',
  props<{ kpis: DashboardKPIs }>()
);

export const loadDashboardKPIsFailure = createAction(
  '[Dashboard] Load KPIs Failure',
  props<{ error: string }>()
);