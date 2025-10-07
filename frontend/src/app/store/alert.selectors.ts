import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AlertState } from './alert.state';

export const selectAlertState = createFeatureSelector<AlertState>('alerts');

export const selectAllAlerts = createSelector(
  selectAlertState,
  (state: AlertState) => state.alerts
);

export const selectSelectedAlert = createSelector(
  selectAlertState,
  (state: AlertState) => state.selectedAlert
);

export const selectAlertsLoading = createSelector(
  selectAlertState,
  (state: AlertState) => state.loading
);

export const selectAlertsError = createSelector(
  selectAlertState,
  (state: AlertState) => state.error
);

export const selectDashboardKPIs = createSelector(
  selectAlertState,
  (state: AlertState) => state.dashboardKPIs
);