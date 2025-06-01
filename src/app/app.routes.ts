import { Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth-guard.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'main',
    loadComponent: () =>
      import('./pages/main/main.component').then((m) => m.MainComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'reserve',
        title: 'Reserva',
        loadComponent: () =>
          import('./pages/reserve/reserve.component').then(
            (m) => m.ReserveComponent
          ),
      },
      {
        path: 'users',
        title: 'Usuarios',
        loadComponent: () =>
          import('./pages/users/users.component').then((m) => m.UsersComponent),
      },
      {
        path: 'user/pefil',
        title: 'Actualizar Usuario',
        loadComponent: () =>
          import('./pages/perfil-user/perfil-user.component').then(
            (m) => m.PerfilUserComponent
          ),
      },
      {
        path: '',
        redirectTo: 'reserve',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];
