import { Component, inject, OnInit } from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastrService } from 'ngx-toastr';
import { CardModule } from 'primeng/card';
import { AuthenticationService } from '@auth/services/authentication.service';
import { FormErrorComponent } from "../../shared/components/form-errors/form-error.component";
import { UserService } from '@services/user.service';
import { UpdatePasswordRequest } from '@interfaces/user';
import { UserSessionService } from '@auth/services/UserSessionService.service';
import { log } from 'console';

@Component({
  selector: 'app-change-pass',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PasswordModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    FormErrorComponent
],
  templateUrl: './change-pass.component.html',
  styleUrl: './change-pass.component.css'
})
export class ChangePassComponent {
  toastr = inject(ToastrService);
  userService = inject(UserService);
  userSessionService = inject(UserSessionService);
  userId!: number;
  loginForm!: FormGroup;
  constructor(
    readonly formBuilder: FormBuilder,
    readonly router: Router,
    readonly authenticationService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.buildFormLogin();
    this.loadUserData();
  }
  
  loadUserData() {
    const user = this.userSessionService.getUser(); // Obtener datos del usuario desde el servicio

    if (user) {
      this.userId = user.idUser; // Asignar el ID del usuario
    } else {
      this.toastr.error('No se encontró información del usuario en la sesión.', 'Error');
      this.router.navigate(['/login']); // Redirigir al login si no hay datos
    }
  }

  buildFormLogin() {
    this.loginForm = this.formBuilder.group({
      newpassword: ['', Validators.required],
      confirmPassword: ['', [Validators.required]],
    });
  }


  onSubmitLogin() {
    if (this.loginForm.valid) {
      const { newpassword, confirmPassword } = this.loginForm.value;

      const updatePasswordRequest: UpdatePasswordRequest = {
      userId: this.userId, 
      newPassword: newpassword,
      confirmPassword: confirmPassword,
    };
      this.userService.updatePassword(updatePasswordRequest).subscribe({
        next: () => {
          this.toastr.success('Contraseña actualizada correctamente', 'Éxito');
          this.router.navigate(['/login']);
          sessionStorage.clear();
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
