import { Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth-guard.guard';
import { RoleRedirectGuard } from '@core/guards/RoleRedirectGuard.guard';

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
        path: 'view-all-reserves',
        title: 'Ver Reservas',
        loadComponent: () =>
          import('./pages/view-all-reserves/view-all-reserves.component').then(
            (m) => m.ViewAllReservesComponent
          ),
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
        path: 'slot-capacity',
        title: 'Capacidad de Horarios',
        loadComponent: () =>
          import('./pages/slot-capacity/slot-capacity.component').then(
            (m) => m.SlotCapacityComponent
          ),
      },
      {
        path: '',
        canActivate: [RoleRedirectGuard],
        component: class DummyComponent {},
      },
    ],
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];
