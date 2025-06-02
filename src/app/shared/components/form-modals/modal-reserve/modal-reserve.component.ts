import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormErrorComponent } from '@shared/components/form-errors/form-error.component';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { timeSlots } from '@shared/data/timeSlot';
import { AttendanceRequest, ReserveRequest } from '@interfaces/reserve';
import { SelectModule } from 'primeng/select';
import { ReserveService } from '@services/reserve.service';
import { ReserveStateService } from '@pages/reserve/reserve-state.service';

@Component({
  selector: 'app-modal-reserve',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    DividerModule,
    DialogModule,
    InputTextModule,
    DatePickerModule,
    FormErrorComponent,
    SelectModule,
  ],
  templateUrl: './modal-reserve.component.html',
  styleUrls: ['./modal-reserve.component.css'],
})
export class ModalReserveComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  toastr = inject(ToastrService);
  reserveService = inject(ReserveService);
  reserveStateService = inject(ReserveStateService);

  reservationForm!: FormGroup;
  modalReserve: boolean = false;
  timeSlots = timeSlots;
  filteredStartSlots = this.timeSlots;
  filteredEndSlots = this.timeSlots;
  userId!: number;
  disabledDates: Date[] = [];
  minDate: Date = new Date();
  maxDate: Date = (() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 2);
    return date;
  })();

  constructor() {}

  ngOnInit(): void {
    this.buildFormReserve();
    this.updateDinamicDay();
    this.filterStartSlots();
    this.filterEndSlots();
    this.loadUserData();
  }

  loadUserData() {
    const user = JSON.parse(sessionStorage.getItem('user_data') ?? '{}');
    const { userPrincipal } = user;
    const { idUser } = userPrincipal;
    this.userId = idUser;
  }

  updateDinamicDay() {
    this.reservationForm
      .get('reservationDate')
      ?.valueChanges.subscribe((date: Date) => {
        if (date) {
          const dayName =
            date
              .toLocaleDateString('es-ES', { weekday: 'long' })
              .charAt(0)
              .toUpperCase() +
            date.toLocaleDateString('es-ES', { weekday: 'long' }).slice(1);
          this.reservationForm
            .get('day')
            ?.setValue(dayName, { emitEvent: false });

          this.filteredStartSlots = this.getAvailableTimeSlots(date);
          this.filteredEndSlots = this.filteredStartSlots;
          this.reservationForm.get('startTime')?.setValue(null);
          this.reservationForm.get('endTime')?.setValue(null);
        }
      });
  }

  buildFormReserve() {
    const now = new Date();
    let initialDate = new Date(now);

    if (
      now.getHours() > 21 ||
      (now.getHours() === 21 && now.getMinutes() >= 30)
    ) {
      this.disabledDates = [
        new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      ];
      initialDate.setDate(initialDate.getDate() + 1);
    } else {
      this.disabledDates = [];
    }

    const currentDay =
      initialDate
        .toLocaleDateString('es-ES', { weekday: 'long' })
        .charAt(0)
        .toUpperCase() +
      initialDate.toLocaleDateString('es-ES', { weekday: 'long' }).slice(1);

    this.filteredStartSlots = this.getAvailableTimeSlots(initialDate);
    this.filteredEndSlots = this.filteredStartSlots;

    this.reservationForm = this.formBuilder.group({
      reservationDate: [
        { value: initialDate, disabled: false },
        Validators.required,
      ],
      day: [{ value: currentDay, disabled: true }],
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
      details: [''],
    });
  }

  filterStartSlots() {
    this.reservationForm
      .get('startTime')
      ?.valueChanges.subscribe((start: string) => {
        if (start) {
          const startIndex = this.timeSlots.findIndex(
            (slot) => slot.startTime === start
          );
          this.filteredEndSlots = this.timeSlots.slice(
            startIndex,
            startIndex + 6
          );
          const currentEnd = this.reservationForm.get('endTime')?.value;
          if (currentEnd) {
            const valid = this.filteredEndSlots.some(
              (slot) => slot.endTime === currentEnd
            );
            if (!valid) this.reservationForm.get('endTime')?.setValue(null);
          }
        } else {
          this.filteredEndSlots = this.timeSlots;
        }
      });
  }
  findFirstAvailableDate(): Date {
    let date = new Date(this.minDate);
    while (
      date <= this.maxDate &&
      this.disabledDates.some(
        (d) =>
          d.getFullYear() === date.getFullYear() &&
          d.getMonth() === date.getMonth() &&
          d.getDate() === date.getDate()
      )
    ) {
      date.setDate(date.getDate() + 1);
    }
    return date > this.maxDate ? this.minDate : date;
  }
  filterEndSlots() {
    this.reservationForm
      .get('endTime')
      ?.valueChanges.subscribe((end: string) => {
        if (end) {
          const endIndex = this.timeSlots.findIndex(
            (slot) => slot.endTime === end
          );
          const start = Math.max(0, endIndex - 5); // 6 slots incluyendo el seleccionado
          this.filteredStartSlots = this.timeSlots.slice(start, endIndex + 1);
          const currentStart = this.reservationForm.get('startTime')?.value;
          if (currentStart) {
            const valid = this.filteredStartSlots.some(
              (slot) => slot.startTime === currentStart
            );
            if (!valid) this.reservationForm.get('startTime')?.setValue(null);
          }
        } else {
          this.filteredStartSlots = this.timeSlots;
        }
      });
  }

  getTimeSlotIds(start: string, end: string): number[] {
    const startIndex = timeSlots.findIndex((slot) => slot.startTime === start);
    const endIndex = timeSlots.findIndex((slot) => slot.endTime === end);

    if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
      return [];
    }
    return timeSlots.slice(startIndex, endIndex + 1).map((slot) => slot.id);
  }

  getAvailableTimeSlots(date: Date): typeof timeSlots {
    const now = new Date();
    if (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    ) {
      // Busca el primer slot cuyo startTime sea mayor o igual a la hora actual
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      return this.timeSlots.filter((slot) => {
        const [h, m] = slot.startTime.split(':').map(Number);
        const slotMinutes = h * 60 + m;
        return slotMinutes >= currentMinutes;
      });
    }
    // Si no es hoy, muestra todos los slots
    return this.timeSlots;
  }

  loadReservedDates() {
    this.reserveService
      .getReservationDatesByUser(this.userId)
      .subscribe((dates: string[]) => {
        this.disabledDates = dates.map((d) => {
          const [day, month, year] = d.split('/').map(Number);
          return new Date(year, month - 1, day);
        });

        // Busca la primera fecha disponible y actualiza el formulario
        const firstAvailable = this.findFirstAvailableDate();
        this.reservationForm.get('reservationDate')?.setValue(firstAvailable);
        const dayName =
          firstAvailable
            .toLocaleDateString('es-ES', { weekday: 'long' })
            .charAt(0)
            .toUpperCase() +
          firstAvailable
            .toLocaleDateString('es-ES', { weekday: 'long' })
            .slice(1);
        this.reservationForm
          .get('day')
          ?.setValue(dayName, { emitEvent: false });
      });
  }

  onSubmitReserve() {
    if (this.reservationForm.valid) {
      const { reservationDate, details, startTime, endTime } =
        this.reservationForm.getRawValue();
      const timeSlotId = this.getTimeSlotIds(startTime, endTime);
      
      const attendanceRequest: AttendanceRequest = {
        id: 0,
        attended: false,
        checkinTime: '',
      }

      const reservationRequest: ReserveRequest = {
        id: 0,
        reservationDate: reservationDate,
        details: details,
        userId: this.userId,
        timeSlotId: timeSlotId,
        attendanceRequest: attendanceRequest,
      };
      this.reserveService.createReservation(reservationRequest).subscribe({
        next: (response) => {
          this.reserveStateService.addReserve(response);
          this.toastr.success('Se ha registrado la reserva', 'Reservado');
          this.closeModalReserve();
        },
        error: (error) => {
          this.toastr.error(error.error.mesagge, 'Error');
        },
      });
    } else {
      this.reservationForm.markAllAsTouched();
    }
  }

  openModalReserve() {
    this.modalReserve = true;
    this.loadReservedDates();
  }

  closeModalReserve() {
    this.reservationForm.reset();
    const firstAvailable = this.findFirstAvailableDate();
    this.reservationForm.get('reservationDate')?.setValue(firstAvailable);
    const dayName =
      firstAvailable
        .toLocaleDateString('es-ES', { weekday: 'long' })
        .charAt(0)
        .toUpperCase() +
      firstAvailable.toLocaleDateString('es-ES', { weekday: 'long' }).slice(1);
    this.reservationForm.get('day')?.setValue(dayName, { emitEvent: false });

    this.modalReserve = false;
  }
}
