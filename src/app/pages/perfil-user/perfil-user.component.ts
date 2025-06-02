import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  UserPlansRequest,
  UserPlansResponse,
  UserProfileRequest,
  UserRequest,
  UserResponse,
} from '@interfaces/user';
import { UserService } from '@services/user.service';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FormErrorComponent } from '../../shared/components/form-errors/form-error.component';
import { userTypes } from '@shared/data/userType';
import { planType } from '@shared/data/planType';
import { gender } from '@shared/data/gender';

import { ImageModule } from 'primeng/image';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-perfil-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    DividerModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    InputNumberModule,
    DatePickerModule,
    FormErrorComponent,
    ImageModule,
  ],
  templateUrl: './perfil-user.component.html',
  styleUrl: './perfil-user.component.css',
})
export class PerfilUserComponent implements OnInit {
  userService = inject(UserService);
  formBuilder = inject(FormBuilder);
  route = inject(ActivatedRoute);
  toastr = inject(ToastrService);

  UserData!: UserResponse;
  userForm!: FormGroup;

  userType = userTypes;
  gender = gender;
  planType = planType;
  isEditMode = false;

  constructor() {}

  ngOnInit(): void {
    const user = JSON.parse(sessionStorage.getItem('user_data') ?? '{}');
    const { userPrincipal } = user;
    const { idUser } = userPrincipal;
    this.getUserData(idUser);
  }

  getUserData(id: number) {
    this.userService.getUserById(id).subscribe({
      next: (response) => {
        this.initUserData(response);
        this.UserData = response;
        console.log('userData', this.UserData);
      },
    });
  }

  initUserData(userdata: UserResponse) {
    const userProfile = userdata.userProfileResponse;
    this.userForm = this.formBuilder.group({
      username: [userdata.username, Validators.required],
      email: [userdata.email, Validators.required],
      phone: [userdata.phone, Validators.required],
      userProfileResponse: this.formBuilder.group({
        sex: [userProfile.sex],
        height: [userProfile.height],
        weight: [userProfile.weight],
      }),
      userPlansResponse: this.formBuilder.array([]),
    });

    const userPlansList = this.userForm.get('userPlansResponse') as FormArray;
    userdata.userPlansResponse.forEach((userPlans) => {
      userPlansList.push(this.initUserPlans(userPlans));
    });
  }

  initUserPlans(userPlans: UserPlansResponse): FormGroup {
    const planType = userPlans.planTypeResponse;
    return this.formBuilder.group({
      startDate: [
        {
          value: userPlans.startDate
            ? new Date(userPlans.startDate + 'T00:00:00')
            : null,
          disabled: true,
        },
      ],
      endDate: [
        {
          value: userPlans.endDate
            ? new Date(userPlans.endDate + 'T00:00:00')
            : null,
          disabled: true,
        },
      ],
      planTypeResponse: this.formBuilder.group({
        name: [{ value: planType.name, disabled: true }],
        durationDays: [{ value: planType.durationDays, disabled: true }],
      }),
    });
  }

  get userPlansResponse(): FormArray {
    return this.userForm.get('userPlansResponse') as FormArray;
  }

  onEditPerfil() {
    this.isEditMode = true;
    this.toastr.info(
      'Ahora puedes editar tu perfil',
      'Editar Perfil'
    );
  }

  onCancelEdit() {
    this.isEditMode = false;
    this.initUserData(this.UserData);
  }

  onSubmitUser() {
    if (this.userForm.valid) {
      const { username, email, phone, userProfileResponse, userPlansResponse } =
        this.userForm.getRawValue();

      const userProfile: UserProfileRequest = {
        id: userProfileResponse.id,
        sex: userProfileResponse.sex,
        height: userProfileResponse.height,
        weight: userProfileResponse.weight,
      };
      const userPlan: UserPlansRequest[] = userPlansResponse.map(
        (plan: UserPlansRequest) => ({
          id: plan.id,
          startDate: plan.startDate,
          endDate: plan.endDate,
          planTypeId: plan.planTypeId,
          status: plan.status,
        })
      );
      const UserRequest: UserRequest = {
        idUser: this.UserData.idUser,
        username: username,
        email: email,
        phone: phone,
        userType: this.UserData.userType,
        userProfileRequest: userProfile,
        userPlansRequest: userPlan,
      };
      console.log('User Request:', UserRequest);

      this.userService.updateUser(this.UserData.idUser, UserRequest).subscribe({
        next: () => {
          this.toastr.success(
            'El usuario ha sido actualizado correctamente',
            'Actualizado'
          );
          this.isEditMode = false;
        },
        error: (error) => {
          this.toastr.error(error.error.message, 'Error');
        },
      });

      this.isEditMode = false;
    } else {
      this.userForm.markAllAsTouched(); // Mark all controls as touched to show validation errors
    }
  }
}
