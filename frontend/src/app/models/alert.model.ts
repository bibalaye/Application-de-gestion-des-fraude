export interface Alert {
  id?: number;
  fraudProbability: number;
  status: 'NOUVELLE' | 'EN_COURS' | 'CLOTUREE_FRAUDE' | 'CLOTUREE_NON_FRAUDE';
  amount: number;
  comments: string;
  time: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardKPIs {
  newAlerts: number;
  inInvestigation: number;
  resolvedToday: number;
  detectionRate: number;
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsersToday: number;
  adminUsers: number;
  regularUsers: number;
  totalAlerts: number;
  fraudulentAlerts: number;
  nonFraudulentAlerts: number;
}
