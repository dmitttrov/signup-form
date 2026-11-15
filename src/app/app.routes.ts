import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'signup',
    // Lazy: the whole signup feature (routes + components) ships as its own chunk.
    loadChildren: () => import('./features/signup/signup.routes'),
  },
  { path: '', pathMatch: 'full', redirectTo: 'signup' },
  { path: '**', redirectTo: 'signup' },
];
