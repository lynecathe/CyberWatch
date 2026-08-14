import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { Machines } from './pages/machines/machines';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.Login)
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register')
        .then(m => m.Register)
  },

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard')
        .then(m => m.Dashboard),
    canActivate: [authGuard]
  },

  {
    path: 'alerts',
    loadComponent: () =>
      import('./features/alerts/alerts')
        .then(m => m.Alerts),
    canActivate: [authGuard]
  },

  {
    path: 'incidents',
    loadComponent: () =>
      import('./features/incidents/incidents')
        .then(m => m.Incidents),
    canActivate: [authGuard]
  },

  {
    path: 'machines',
    component: Machines,
    canActivate: [authGuard]
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];
