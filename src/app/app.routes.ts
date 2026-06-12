import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'accueil',
    pathMatch: 'full',
  },
  {
    path: 'accueil',
    loadComponent: () => import('./pages/accueil/accueil').then((m) => m.Accueil),
  },
  {
    path: 'connexion',
    loadComponent: () => import('./pages/connexion/connexion').then((m) => m.Connexion),
  },
  {
    path: 'inscription',
    loadComponent: () => import('./pages/inscription/inscription').then((m) => m.Inscription),
  },
  {
    path: 'profil',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/profil/profil').then((m) => m.Profil),
  },
  {
    path: 'monde',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/monde/monde').then((m) => m.Monde),
  },
  {
    path: 'ile/:ileId',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/ile/ile').then((m) => m.Ile),
  },
  {
    path: 'combat/:zoneId',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/combat/combat').then((m) => m.Combat),
  },
  {
    path: '**',
    redirectTo: 'accueil',
  },
];
