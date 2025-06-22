import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ModalUserComponent } from '../../shared/components/form-modals/modal-user/modal-user.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { UserService } from '@services/user.service';
import { ToastrService } from 'ngx-toastr';
import { UserRequest, UserResponse } from '@interfaces/user';
import { Table, TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { UserStateService } from './user-state.service';
import { TitleComponent } from '@shared/utils/title/title.component';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import * as XLSX from 'xlsx';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormErrorComponent } from '../../shared/components/form-errors/form-error.component';
import { planType } from '@shared/data/planType';
import { State, states } from '@shared/data/states';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalUserComponent,
    TitleComponent,
    ConfirmDialogModule,
    ToastModule,
    TableModule,
    InputIconModule,
    IconFieldModule,
    MultiSelectModule,
    SelectModule,
    TagModule,
    CommonModule,
    InputGroupModule,
    InputGroupAddonModule,
    ButtonModule,
    DialogModule,
    DividerModule,
    InputTextModule,
    FormErrorComponent,
    DatePickerModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  providers: [ConfirmationService, MessageService],
})
export class UsersComponent implements OnInit {
  toastr = inject(ToastrService);
  userService = inject(UserService);
  userStateService = inject(UserStateService);
  formBuilder = inject(FormBuilder);
  @ViewChild('dt2') dt2!: Table;

  userForm: FormGroup = this.formBuilder.group({
    username: [''],
    email: [''],
    phone: [''],
    planType: [''],
    planStartDate: [''],
    planEndDate: [''],
    planDuration: [''],
    status: [''],
  });

  userList: UserResponse[] = [];
  activityValues: number[] = [0, 100];
  modalUpdateUser: boolean = false;
  planType = planType;
  userData!: UserResponse;
  states: State[] = states;

  constructor() {}

  ngOnInit(): void {
    this.userStateService.getAllUsersByUserType();

    this.userStateService.users$.subscribe((response: UserResponse[]) => {
      this.userList = response.map((user: UserResponse) => {
        const lastPlan =
          user.userPlansResponse[user.userPlansResponse.length - 1];
        return {
          ...user,
          planName: lastPlan?.planTypeResponse?.name ?? '',
          planStartDate: lastPlan?.startDate ?? '',
          planEndDate: lastPlan?.endDate ?? '',
          planDuration: lastPlan?.planTypeResponse?.durationDays ?? '',
        };
      });
    });
  }

  clear(table: Table) {
    table.clear();
  }

  onGlobalFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.dt2.filterGlobal(input.value, 'contains');
  }

  getUserDataById(id: number) {
    console.log('id', id);

    this.userService.getUserById(id).subscribe({
      next: (response) => {
        this.initUserUpdate(response);
        this.userData = response;
        this.modalUpdateUser = true;
      },
    });
  }

  initUserUpdate(user: UserResponse) {
    const lastPlan = user.userPlansResponse[user.userPlansResponse.length - 1];
    const plan = this.planType.find(
      (p) =>
        p.name.toLowerCase() ===
        (lastPlan?.planTypeResponse?.name ?? '').toLowerCase()
    );
    this.userForm = this.formBuilder.group({
      username: [user.username],
      planType: [plan ? plan.id : null],
      planStartDate: [
        lastPlan?.startDate ? new Date(lastPlan.startDate) : null,
      ],
      planEndDate: [lastPlan?.endDate ? new Date(lastPlan.endDate) : null],
      planDuration: [lastPlan?.planTypeResponse?.durationDays ?? ''],
      status: [user.status, Validators.required],
    });
    console.log('userForm', this.userForm.value);

    this.userForm
      .get('planType')
      ?.valueChanges.subscribe((planTypeId: number) => {
        const selectedPlan = this.planType.find((p) => p.id === planTypeId);
        this.userForm
          .get('planDuration')
          ?.setValue(selectedPlan ? selectedPlan.durationDays : '');
      });
  }

  onSubmitUser() {
    if (this.userForm.valid) {
      const { username, planType, planStartDate, planEndDate, status } =
        this.userForm.getRawValue();

      const formatDate = (date: Date | null) =>
        date ? date.toISOString().slice(0, 10) : '';

      const userUpdateRequest: UserRequest = {
        idUser: this.userData.idUser,
        username: username,
        email: this.userData.email,
        phone: this.userData.phone,
        userType: this.userData.userType,
        status: status,
        userProfileRequest: {
          id: 0,
          sex: '',
          height: 0,
          weight: 0,
        },
        userPlansRequest: [
          {
            id: 0,
            startDate: formatDate(planStartDate),
            endDate: formatDate(planEndDate),
            planTypeId: planType,
            status: 'RENOVADO',
          },
        ],
      };
      console.log('User Update Request:', userUpdateRequest);

      this.userService
        .updateUserPlanType(this.userData.idUser, userUpdateRequest)
        .subscribe({
          next: (response) => {
            this.toastr.success(
              'Usuario actualizado correctamente',
              'Actualizado'
            );
            this.closeModalUpdate();
            this.userStateService.getAllUsersByUserType();
          },
          error: (error) => {
            this.toastr.error(error.error.message, 'Error al actualizar');
          },
        });
    } else {
      this.toastr.error('Por favor, completa todos los campos requeridos');
    }
  }

  closeModalUpdate() {
    this.modalUpdateUser = false;
  }

  exportTable() {
    const columns = [
      { header: 'Nombre', key: 'username' },
      { header: 'Correo', key: 'email' },
      { header: 'Teléfono', key: 'phone' },
      { header: 'Estado', key: 'status' },
      { header: 'Plan', key: 'planName' },
      { header: 'Inicio', key: 'planStartDate' },
      { header: 'Fin', key: 'planEndDate' },
      { header: 'Duración', key: 'planDuration' },
    ];

    // Prepara los datos
    const data = this.userList.map((user) =>
      columns.map((col) => (user as any)[col.key] ?? '')
    );

    // Agrega el título como la primera fila
    const title = [['Registro de usuarios']];
    // Encabezados
    const headers = [columns.map((col) => col.header)];
    // Junta todo
    const worksheetData = [...title, ...headers, ...data];

    // Crea la hoja de cálculo
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);

    // Estilos personalizados
    const titleStyle = {
      fill: { fgColor: { rgb: '000000' } }, // fondo negro
      font: { bold: true, sz: 16, color: { rgb: 'FFFFFF' } }, // blanco, negrita, 16px
      alignment: { horizontal: 'center', vertical: 'center' },
    };
    const headerStyle = {
      fill: { fgColor: { rgb: 'B6E0FE' } }, // azul pastel
      font: { bold: true, color: { rgb: '222222' } },
      alignment: { horizontal: 'center', vertical: 'center' },
    };

    // Aplica estilos al título
    ws['A1'].s = titleStyle;
    // Merge del título en todas las columnas
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: columns.length - 1 } }];

    // Aplica estilos al encabezado
    for (let i = 0; i < columns.length; i++) {
      const cell = XLSX.utils.encode_cell({ r: 1, c: i });
      if (ws[cell]) ws[cell].s = headerStyle;
    }

    // Ajusta el ancho de columnas
    ws['!cols'] = columns.map(() => ({ wch: 18 }));

    // Crea el libro y exporta
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');

    XLSX.writeFile(wb, 'usuarios.xlsx');
  }
}
