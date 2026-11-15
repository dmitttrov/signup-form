import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'signup',
    loadChildren: () => import('./features/signup/signup.routes'),
  },
  { path: '', pathMatch: 'full', redirectTo: 'signup' },
  { path: '**', redirectTo: 'signup' },
];
