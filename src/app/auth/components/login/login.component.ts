import { Component, inject, OnInit } from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { PasswordModule } from 'primeng/password';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormErrorComponent } from '../../../shared/components/form-errors/form-error.component';
import { ToastrService } from 'ngx-toastr';
import { CardModule } from 'primeng/card';
import { UserResponse } from '@interfaces/user';
import { UserSessionService } from '@auth/services/UserSessionService.service';
import { LoginResponse } from '@interfaces/login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PasswordModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    ButtonModule,
    FormErrorComponent,
    CardModule,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  toastr = inject(ToastrService);
  userSessionService = inject(UserSessionService);
  loginForm!: FormGroup;
  userId!: number;
  constructor(
    readonly formBuilder: FormBuilder,
    readonly router: Router,
    readonly authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    sessionStorage.clear();
    this.buildFormLogin();
  }

  buildFormLogin() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmitLogin() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.authenticationService.login({ username, password }).subscribe({
        next: (response: LoginResponse) => {
          // Mapear LoginResponse a UserResponse
          const user: UserResponse = {
            idUser: response.userPrincipal.idUser,
            username: response.userPrincipal?.username,
            email: response.userPrincipal.email,
            roles: response.authorities.join(', '), // Convertir array a string
            phone: response.userPrincipal.phone,
            status: response.userPrincipal.status,
            userType: response.userPrincipal.userType,
            active: response.userPrincipal.active,
            userProfileResponse: response.userPrincipal.userProfileResponse,
            userPlansResponse: response.userPrincipal.userPlansResponse,
          };
          
          this.toastr.success(
            'Acceso exitoso, ¡todo listo para comenzar!',
            'Bienvenido'
          );
          
          if (user.active) {
            this.router.navigate(['/main/reserve']);
          } else {
            this.userSessionService.setUser(user); // Guardar el usuario en el servicio
            this.router.navigate(['/change-pass']);
          }
        },
        error: (err) => {
          this.toastr.error(err.error.message, 'Error');
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
