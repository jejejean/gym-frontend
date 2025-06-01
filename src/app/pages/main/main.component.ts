import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MegaMenuItem, MessageService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { AuthoritiesService } from '@auth/services/authorities.service';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ButtonModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
  ],
  templateUrl: './main.component.html',
  styles: `
    .opacity-reduced {
      background-opacity: 0.5;
    }
  `,
  providers: [ConfirmationService, MessageService],
})
export class MainComponent implements OnInit {
  toastr = inject(ToastrService);
  router = inject(Router);
  authorities = inject(AuthoritiesService);

  roles: string = '';
  userName: string = '';
  openSidebar: boolean = true;
  isScreenSmall = window.innerWidth < 640;
  showTooltipExit = false;
  showTooltip = false;

  constructor(private readonly confirmationService: ConfirmationService) {}

  navigateTo(route: string): void {
    this.toastr.info(`Hasta pronto ${this.userName}`, 'Información');
    this.router.navigate([route]);
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  items: MegaMenuItem[] | undefined;

  ngOnInit() {
    this.getUserData();
  }

  getUserData() {
    this.userName = this.authorities.getUsername();
    this.roles = this.authorities.getRoles();
    console.log('User Name:', this.roles);
  }

  toogleButton(): void {
    this.openSidebar = !this.openSidebar;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.isScreenSmall = window.innerWidth < 640;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const sidebar = document.getElementById('logo-sidebar');
    const button = target.closest('button[aria-controls="logo-sidebar"]');

    // Cierra el sidebar si haces clic fuera de él y no en el botón
    if (
      !sidebar?.contains(target) &&
      !button &&
      this.openSidebar &&
      this.isScreenSmall
    ) {
      this.openSidebar = false;
    }
  }

  modalLogout(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Te gustaría cerrar la sesión?',
      header: 'Cierre de sesión',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancelar',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Salir',
        severity: 'danger',
      },
      accept: () => {
        this.toastr.info(`Hasta pronto ${this.userName}`, 'Información');
        this.router.navigate(['/login']);
      },
    });
  }
}
