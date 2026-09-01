import { Routes } from '@angular/router';
import { socGuard } from './core/guards/soc.guard';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then(m => m.Login)
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register').then(m => m.Register)
  },

  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout').then(m => m.MainLayout),

    canActivate: [authGuard],

    children: [

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then(m => m.Dashboard)
      },

      {
        path: 'alerts',
        loadComponent: () =>
          import('./features/alerts/alerts').then(m => m.Alerts)
      },

     {
  path: 'incidents',
  canActivate: [socGuard],
  loadComponent: () =>
    import('./features/incidents/incidents')
      .then(m => m.Incidents)
},

      {
        path: 'machines',
        loadComponent: () =>
          import('./pages/machines/machines').then(m => m.Machines)
      },

     {
  path: 'analysts',
  canActivate: [socGuard],
  loadComponent: () =>
    import('./pages/analysts/analysts')
      .then(m => m.Analysts)
},

      {
        path: 'users',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./pages/users/users').then(m => m.Users)
      }

    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];