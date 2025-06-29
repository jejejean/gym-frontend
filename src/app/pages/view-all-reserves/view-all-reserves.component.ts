import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Table, TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { IconField, IconFieldModule } from 'primeng/iconfield';
import { InputIcon, InputIconModule } from 'primeng/inputicon';
import { ReserveService } from '@services/reserve.service';
import {
  AttendanceRequest,
  ReserveByDayResponse,
  ReserveResponse,
  ReserveSimpleRequest,
} from '@interfaces/reserve';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DatePickerModule } from 'primeng/datepicker';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormErrorComponent } from '../../shared/components/form-errors/form-error.component';
import { State, states } from '@shared/data/states';
import { ReserveStateService } from '@pages/reserve/reserve-state.service';
import { TitleComponent } from '@shared/utils/title/title.component';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-view-all-reserves',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TitleComponent,
    TableModule,
    InputIconModule,
    IconFieldModule,
    MultiSelectModule,
    SelectModule,
    TagModule,
    CommonModule,
    ButtonModule,
    DialogModule,
    DividerModule,
    FormErrorComponent,
    DatePickerModule,
    InputGroupModule,
    InputGroupAddonModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  templateUrl: './view-all-reserves.component.html',
  styleUrl: './view-all-reserves.component.css',
  providers: [ConfirmationService, MessageService],
})
export class ViewAllReservesComponent implements OnInit {
  toastr = inject(ToastrService);
  reserveService = inject(ReserveService);
  formBuilder = inject(FormBuilder);
  reserveStateService = inject(ReserveStateService);

  reserveData: ReserveByDayResponse[] = [];
  reserve!: ReserveResponse;

  activityValues: number[] = [0, 100];
  modalAttendance: boolean = false;
  states: State[] = states;

  attendanceForm: FormGroup = this.formBuilder.group({
    attended: [null, Validators.required],
    checkinTime: [null, Validators.required],
  });

  reserveId!: number;

  @ViewChild('dt2') dt2!: Table;

  constructor(private readonly confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    this.reserveStateService.reservesByDay$.subscribe((data) => {
      this.reserveData = data;
    });
    this.getAllReservations();
  }

  getAllReservations() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayString = `${yyyy}-${mm}-${dd}`;

    this.reserveStateService.getAllReservationsByDate('2025-06-28');
  }

  clear(table: Table) {
    table.clear();
  }

  onGlobalFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.dt2.filterGlobal(input.value, 'contains');
  }

  getAttendance(id: number) {
    this.reserveService.getReservationById(id).subscribe((response) => {
      this.reserve = response;
      this.initAttendanceForm(response.attendanceResponse);
      this.modalAttendance = true;
    });
  }

  initAttendanceForm(attendance: AttendanceRequest) {
    this.attendanceForm = this.formBuilder.group({
      attended: [attendance.attended, Validators.required],
      checkinTime: [
        attendance.checkinTime ? new Date(attendance.checkinTime) : new Date(),
        Validators.required,
      ],
    });
  }

  onUpdateAttendance() {
    if (this.attendanceForm.valid) {
      const { attended, checkinTime } = this.attendanceForm.getRawValue();

      const attendanceRequest: ReserveSimpleRequest = {
        id: this.reserve.id,
        attendanceRequest: {
          id: 0,
          attended: attended,
          checkinTime: checkinTime,
        },
      };
      console.log('Attendance Request:', attendanceRequest);

      this.reserveService
        .updateAttendance(this.reserve.id, attendanceRequest)
        .subscribe({
          next: (response) => {
            this.reserveStateService.updateAttended(this.reserve.id, response);
            this.toastr.success(
              'Se actualizó la asistencia correctamente',
              'Asistencia actualizada'
            );
            this.closeModalAttendance();
          },
        });
    } else {
      this.attendanceForm.markAllAsTouched();
    }
  }

  closeModalAttendance() {
    this.modalAttendance = false;
  }

  submitNotification(event: Event, id: number) {
    const reserve = this.reserveData.find((reserve) => reserve.id === id);
    if (reserve) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: `¿Te gustaría enviar el recordatorio al cliente ${reserve.userSimpleResponse.username}?`,
        header: 'Recordatorio',
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: 'Cancelar',
        rejectButtonProps: {
          label: 'Cancelar',
          severity: 'secondary',
          outlined: true,
        },
        acceptButtonProps: {
          label: 'Aceptar',
        },
        accept: () => {
          this.reserveService.sendNotification(reserve.id).subscribe({
            error: (error) => {
              this.toastr.error(
                `Error al enviar el recordatorio: ${error.error.message}`,
                'Error'
              );
            },
          });
          this.toastr.success(
            `Se ha enviado el recordatorio al cliente ${reserve.userSimpleResponse.username}`,
            'Recordatorio'
          );
        },
      });
    } else {
      this.toastr.error(
        'No se encontró la reserva para el cliente especificado.',
        'Error'
      );
    }
  }
}
