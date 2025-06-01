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
  UserProfileRequest,
  UserRequest,
} from '@interfaces/user';
import { FormErrorComponent } from '@shared/components/form-errors/form-error.component';
import { userTypes } from '@shared/data/userType';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { gender } from '@shared/data/gender';
import { UserService } from '@services/user.service';
import { ToastrService } from 'ngx-toastr';
import { planType } from '@shared/data/planType';
import { DatePickerModule } from 'primeng/datepicker';
import { UserStateService } from '@pages/users/user-state.service';

@Component({
  selector: 'app-modal-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    DividerModule,
    DialogModule,
    InputTextModule,
    FormErrorComponent,
    SelectModule,
    InputNumberModule,
    DatePickerModule,
  ],
  templateUrl: './modal-user.component.html',
  styleUrl: './modal-user.component.css',
})
export class ModalUserComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  toastr = inject(ToastrService);
  userService = inject(UserService);
  userStateSerive = inject(UserStateService);
  userForm!: FormGroup;
  modalUser: boolean = false;
  userType = userTypes;
  gender = gender;
  planType = planType;

  ngOnInit(): void {
    this.buildFormUser();
  }

  buildFormUser() {
    this.userForm = this.formBuilder.group({
      username: [null, Validators.required],
      email: [null, Validators.required],
      phone: [null, Validators.required],
      userType: [null, Validators.required],
      userProfileRequest: this.formBuilder.group({
        sex: [null, Validators.required],
        height: [null, Validators.required],
        weight: [null, Validators.required],
      }),
      userPlansRequest: this.formBuilder.array([]),
    });
    this.addPlan();
  }

  addPlan() {
    this.userPlansRequest.push(
      this.formBuilder.group({
        startDate: [null, Validators.required],
        endDate: [null, Validators.required],
        planTypeId: [null, Validators.required],
      })
    );
  }

  get userPlansRequest(): FormArray {
    return this.userForm.get('userPlansRequest') as FormArray;
  }

  onSubmitUser() {
    if (this.userForm.valid) {
      const {
        username,
        email,
        phone,
        userType,
        userProfileRequest,
        userPlansRequest,
      } = this.userForm.getRawValue();

      const userProfile: UserProfileRequest = {
        id: userProfileRequest.id,
        sex: userProfileRequest.sex,
        height: userProfileRequest.height,
        weight: userProfileRequest.weight,
      };
      const userPlan: UserPlansRequest[] = userPlansRequest.map(
        (plan: UserPlansRequest) => ({
          startDate: plan.startDate,
          endDate: plan.endDate,
          planTypeId: plan.planTypeId,
        })
      );

      const userRequest: UserRequest = {
        idUser: 0,
        username: username,
        email: email,
        phone: phone,
        userType: userType,
        userProfileRequest: userProfile,
        userPlansRequest: userPlan,
      };
      console.log('User Request:', userRequest);
      this.userService.createUser(userRequest).subscribe({
        next: (response) => {
          this.userStateSerive.addUser(response);
          this.toastr.success('Se ha registrado la reserva', 'Reservado');
          this.closeModalUser();
        },
        error: (error) => {
          this.toastr.error(error.error.mesagge, 'Error');
        },
      });
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  openModalUser() {
    this.modalUser = true;
  }

  closeModalUser() {
    this.userForm.reset();
    this.modalUser = false;
  }
}
