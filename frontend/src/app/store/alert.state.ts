import { Alert, DashboardKPIs } from '../models/alert.model';

export interface AlertState {
  alerts: Alert[];
  selectedAlert: Alert | null;
  loading: boolean;
  error: string | null;
  dashboardKPIs: DashboardKPIs | null;
}

export const initialAlertState: AlertState = {
  alerts: [],
  selectedAlert: null,
  loading: false,
  error: null,
  dashboardKPIs: null
};