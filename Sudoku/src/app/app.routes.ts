import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'winner',
        loadComponent: () => import('./components/winner/winner.component').then(m => m.WinnerComponent)
    }
];
