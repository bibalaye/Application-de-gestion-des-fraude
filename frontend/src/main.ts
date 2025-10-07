import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/interceptors/auth.interceptor';

import { routes } from './app/app.routes';
import { alertReducer } from './app/store/alert.reducer';
import { AlertEffects } from './app/store/alert.effects';
import { authReducer } from './app/store/auth.reducer';
import { AuthEffects } from './app/store/auth.effects';
import { SidebarComponent } from './app/components/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { userReducer } from './app/store/user.reducer';
import { UserEffects } from './app/store/user.effects';
import { Store } from '@ngrx/store';
import * as AuthActions from './app/store/auth.actions';
import { AuthService } from './app/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    SidebarComponent
  ],
  template: `
    <app-sidebar *ngIf="!isLoginPage"></app-sidebar>
    <main [class.main-content]="!isLoginPage">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    :host {
      display: flex;
      min-height: 100vh;
    }
  `]
})
export class App {
  isLoginPage = false;
  constructor() {
    const router = inject(Router);
    const store = inject(Store);
    router.events.subscribe(() => {
      this.isLoginPage = router.url === '/login';
    });
    this.isLoginPage = router.url === '/login';
    store.dispatch(AuthActions.rehydrateAuth());
  }
}

bootstrapApplication(App, {
  providers: [
    importProvidersFrom(BrowserAnimationsModule),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes),
    provideAnimations(),
    provideStore({
      alerts: alertReducer,
      auth: authReducer,
      user: userReducer
    }),
    provideEffects([AlertEffects, AuthEffects, UserEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
      autoPause: true,
      trace: false,
      traceLimit: 75
    })
  ]
}).catch(err => console.error(err));