import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { factionGuard } from './core/guards/faction-guard';

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
    path: 'faction',
    canActivate: [authGuard, factionGuard],
    loadComponent: () => import('./pages/faction/faction').then((m) => m.FactionPage),
  },
  {
    path: 'auberge',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/auberge/auberge').then((m) => m.Auberge),
  },
  {
    path: '**',
    redirectTo: 'accueil',
  },
];
