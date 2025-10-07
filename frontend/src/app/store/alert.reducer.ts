import { createReducer, on } from '@ngrx/store';
import { AlertState, initialAlertState } from './alert.state';
import * as AlertActions from './alert.actions';

export const alertReducer = createReducer(
  initialAlertState,
  on(AlertActions.loadAlerts, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AlertActions.loadAlertsSuccess, (state, { alerts }) => ({
    ...state,
    alerts,
    filteredAlerts: alerts,
    loading: false,
    error: null
  })),
  on(AlertActions.loadAlertsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(AlertActions.selectAlert, (state, { alert }) => ({
    ...state,
    selectedAlert: alert
  })),
  on(AlertActions.clearSelectedAlert, (state) => ({
    ...state,
    selectedAlert: null
  })),
  on(AlertActions.loadAlertById, (state) => ({
    ...state,
    loading: true,
    error: null,
    selectedAlert: null
  })),
  on(AlertActions.loadAlertByIdSuccess, (state, { alert }) => ({
    ...state,
    selectedAlert: alert,
    loading: false,
    error: null
  })),
  on(AlertActions.loadAlertByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(AlertActions.qualifyAlert, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AlertActions.qualifyAlertSuccess, (state, { alert }) => ({
    ...state,
    alerts: state.alerts.map(a => a.id === alert.id ? alert : a),
    //filteredAlerts: state.filteredAlerts.map(a => a.id === alert.id ? alert : a),
    selectedAlert: state.selectedAlert?.id === alert.id ? alert : state.selectedAlert,
    loading: false,
    error: null
  })),
  on(AlertActions.qualifyAlertFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(AlertActions.loadDashboardKPIs, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AlertActions.loadDashboardKPIsSuccess, (state, { kpis }) => ({
    ...state,
    dashboardKPIs: kpis,
    loading: false,
    error: null
  })),
  on(AlertActions.loadDashboardKPIsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);