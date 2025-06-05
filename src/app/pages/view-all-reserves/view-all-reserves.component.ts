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

@Component({
  selector: 'app-view-all-reserves',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TableModule,
    InputIconModule,
    IconFieldModule,
    MultiSelectModule,
    SelectModule,
    TagModule,
    CommonModule,
    InputIcon,
    IconField,
    ButtonModule,
    DialogModule,
    DividerModule,
    FormErrorComponent,
    DatePickerModule,
  ],
  templateUrl: './view-all-reserves.component.html',
  styleUrl: './view-all-reserves.component.css',
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
  constructor() {}

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

    this.reserveStateService.getAllReservationsByDate(todayString);
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
        id: 35,
        attendanceRequest: {
          id: 35,
          attended: attended,
          checkinTime: checkinTime,
        },
      };
      console.log('Attendance Request:', attendanceRequest);

      this.reserveService.updateAttendance(35, attendanceRequest).subscribe({
        next: (response) => {
          this.reserveStateService.updateAttended(35, {
            id: 35,
            attendanceRequest: response,
          });

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
}
