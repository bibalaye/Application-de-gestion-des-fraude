import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { forkJoin } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';
import * as AlertActions from './alert.actions';
import { DashboardKPIs } from '../models/alert.model';

@Injectable()
export class AlertEffects {
  constructor(
    private actions$: Actions,
    private alertService: AlertService,
    private authService: AuthService
  ) {}

  loadAlerts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertActions.loadAlerts),
      switchMap(() =>
        this.alertService.getAllAlerts().pipe(
          map(alerts => AlertActions.loadAlertsSuccess({ alerts })),
          catchError(error =>
            of(AlertActions.loadAlertsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadAlertById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertActions.loadAlertById),
      switchMap(({ id }) =>
        this.alertService.getAlertById(id).pipe(
          map(alert => AlertActions.loadAlertByIdSuccess({ alert })),
          catchError(error => of(AlertActions.loadAlertByIdFailure({ error: error.message })))
        )
      )
    )
  );

  qualifyAlert$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertActions.qualifyAlert),
      switchMap(({ id, status, comments }) =>
        this.alertService.qualifyAlert(id, status, comments).pipe(
          map(alert => AlertActions.qualifyAlertSuccess({ alert })),
          catchError(error => of(AlertActions.qualifyAlertFailure({ error: error.message })))
        )
      )
    )
  );
}