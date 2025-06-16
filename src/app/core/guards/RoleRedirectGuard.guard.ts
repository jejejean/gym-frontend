import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import e from 'express';

@Injectable({ providedIn: 'root' })
export class RoleRedirectGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    // Obtén el usuario desde sessionStorage/localStorage o un servicio
    const user = JSON.parse(sessionStorage.getItem('user_data') ?? '{}');
    const tipoUsuario = user?.userPrincipal?.userType; // Ajusta según tu modelo

    if (tipoUsuario === 'Cliente') {
      this.router.navigate(['/main/reserve']);
    } else if (tipoUsuario === 'Administrador') {
      this.router.navigate(['/main/slot-capacity']);
    } else {
      this.router.navigate(['/main/view-all-reserves']);
    }

    return false; // Evita que la ruta vacía se active
  }
}
