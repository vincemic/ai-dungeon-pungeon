import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/game-dashboard/game-dashboard').then(m => m.GameDashboard)
  },
  {
    path: 'map-generator',
    loadComponent: () => import('./features/map-generator/map-generator').then(m => m.MapGenerator)
  },
  {
    path: 'game-map',
    loadComponent: () => import('./features/game-map/game-map').then(m => m.GameMap)
  },
  {
    path: 'players',
    loadComponent: () => import('./features/player-management/player-management').then(m => m.PlayerManagement)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
