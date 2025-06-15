import { Component, inject, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import { ModalReserveComponent } from '../../shared/components/form-modals/modal-reserve/modal-reserve.component';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ReserveService } from '@services/reserve.service';
import {
  AttendanceRequest,
  ReserveRequest,
  ReserveResponse,
} from '@interfaces/reserve';
import { ReserveStateService } from './reserve-state.service';
import { DialogModule } from 'primeng/dialog';
import { FormErrorComponent } from '../../shared/components/form-errors/form-error.component';
import { ButtonModule } from 'primeng/button';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { TitleComponent } from '@shared/utils/title/title.component';
import { DividerModule } from 'primeng/divider';
import { timeSlots } from '@shared/data/timeSlot';

@Component({
  selector: 'app-reserve',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ModalReserveComponent,
    TitleComponent,
    FullCalendarModule,
    ConfirmDialogModule,
    ToastModule,
    DialogModule,
    DividerModule,
    FormErrorComponent,
    ButtonModule,
    SelectModule,
  ],
  templateUrl: './reserve.component.html',
  styleUrl: './reserve.component.css',
  providers: [ConfirmationService, MessageService],
})
export class ReserveComponent implements OnInit {
  toastr = inject(ToastrService);
  reserveService = inject(ReserveService);
  reserveStateService = inject(ReserveStateService);
  formBuilder = inject(FormBuilder);

  reserveForm: FormGroup = this.formBuilder.group({
    startTime: [null],
    endTime: [null],
  });
  resevations: ReserveResponse[] = [];
  reserve!: ReserveResponse;
  userId!: number;
  modalReserve: boolean = false;
  idReserve!: number;
  timeSlots = timeSlots;
  filteredStartSlots = this.timeSlots;
  filteredEndSlots = this.timeSlots;

  constructor(private readonly confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    this.loadUserData();
    this.reserveStateService.getAllReservationByUser(this.userId);
    this.reserveStateService.reserves$.subscribe(
      (response: ReserveResponse[]) => {
        this.calendarOptions = {
          ...this.calendarOptions,
          events: this.mapReservationsToEvents(response),
        };
      }
    );
  }

  loadUserData() {
    const user = JSON.parse(sessionStorage.getItem('user_data') ?? '{}');
    const { userPrincipal } = user;
    const { idUser } = userPrincipal;
    this.userId = idUser;
  }

  mapReservationsToEvents(reservations: ReserveResponse[]): any[] {
    return reservations.map((res) => {
      let timeRange = '';
      if (res.timeSlotResponse && res.timeSlotResponse.length > 0) {
        const firstSlot = res.timeSlotResponse[0];
        const lastSlot = res.timeSlotResponse[res.timeSlotResponse.length - 1];
        const start = firstSlot.startTime.slice(0, 5);
        const end = lastSlot.endTime.slice(0, 5);
        timeRange = `${start} - ${end}`;
      }
      return {
        id: res.id,
        title: `🗓️ Reserva ${timeRange}`,
        start: res.reservationDate,
        end: res.reservationDate,
      };
    });
  }

  calendarOptions: {
    initialView: string;
    plugins: any[];
    locale: any;
    events: any[];
    [key: string]: any;
  } = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    locale: esLocale,
    events: [],
    eventClick: this.onEventClick.bind(this),
  };

  onEventClick(arg: any) {
    const event = arg.event;
    const id = event.id;
    this.idReserve = id;
    if (id) {
      this.getReservation(id);
    }
    this.modalReserve = true;
  }

  getReservation(id: number) {
    this.reserveService.getReservationById(id).subscribe((response) => {
      this.reserve = response;
      this.initReserveForm(response);
      this.modalReserve = true;
    });
  }

  filterStartSlots() {
    this.reserveForm
      .get('startTime')
      ?.valueChanges.subscribe((start: string) => {
        if (start) {
          const startIndex = this.timeSlots.findIndex(
            (slot) => slot.startTime === start
          );
          this.filteredEndSlots = this.timeSlots
            .slice(startIndex, Math.min(startIndex + 3, this.timeSlots.length))
            .filter((slot) => slot.endTime !== this.timeSlots[0].endTime);
          const currentEnd = this.reserveForm.get('endTime')?.value;
          if (currentEnd) {
            const valid = this.filteredEndSlots.some(
              (slot) => slot.endTime === currentEnd
            );
            if (!valid) this.reserveForm.get('endTime')?.setValue(null);
          }
        } else {
          this.filteredEndSlots = this.timeSlots.filter(
            (slot, idx) => idx !== 0
          );
        }
      });
  }

  filterEndSlots() {
    this.reserveForm.get('endTime')?.valueChanges.subscribe((end: string) => {
      if (end) {
        const endIndex = this.timeSlots.findIndex(
          (slot) => slot.endTime === end
        );
        const start = Math.max(0, endIndex - 2);
        this.filteredStartSlots = this.timeSlots
          .slice(start, endIndex + 1)
          .filter(
            (slot) =>
              slot.startTime !==
              this.timeSlots[this.timeSlots.length - 1].startTime
          );
        const currentStart = this.reserveForm.get('startTime')?.value;
        if (currentStart) {
          const valid = this.filteredStartSlots.some(
            (slot) => slot.startTime === currentStart
          );
          if (!valid) this.reserveForm.get('startTime')?.setValue(null);
        }
      } else {
        this.filteredStartSlots = this.timeSlots.filter(
          (slot, idx, arr) => idx !== arr.length - 1
        );
      }
    });
  }

  getAvailableTimeSlots(date: Date): typeof timeSlots {
    const now = new Date();
    if (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    ) {
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      return this.timeSlots.filter((slot) => {
        const [h, m] = slot.startTime.split(':').map(Number);
        const slotMinutes = h * 60 + m;
        return slotMinutes >= currentMinutes;
      });
    }
    return this.timeSlots;
  }

  initReserveForm(reserve: ReserveResponse) {
    const firstSlot = reserve.timeSlotResponse[0];
    const lastSlot =
      reserve.timeSlotResponse[reserve.timeSlotResponse.length - 1];

    this.reserveForm = this.formBuilder.group({
      startTime: [firstSlot.startTime, Validators.required],
      endTime: [lastSlot.endTime, Validators.required],
    });

    this.filteredStartSlots = this.timeSlots.filter(
      (slot, idx, arr) => idx !== arr.length - 1
    );
    this.filteredEndSlots = this.timeSlots.filter((slot, idx) => idx !== 0);

    this.filterStartSlots();
    this.filterEndSlots();
  }

  getTimeSlotIds(start: string, end: string): number[] {
    const startIndex = timeSlots.findIndex((slot) => slot.startTime === start);
    const endIndex = timeSlots.findIndex((slot) => slot.endTime === end);

    if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
      return [];
    }
    return timeSlots.slice(startIndex, endIndex + 1).map((slot) => slot.id);
  }

  onUpdateReserve() {
    if (this.reserveForm.valid) {
      const { startTime, endTime } = this.reserveForm.getRawValue();
      const timeSlotId = this.getTimeSlotIds(startTime, endTime);
      const attendence = this.reserve.attendanceResponse;

      const attendanceRequest: AttendanceRequest = {
        id: attendence.id,
        attended: attendence.attended,
        checkinTime: attendence.checkinTime,
      };

      const reserveRequest: ReserveRequest = {
        id: this.reserve.id,
        userId: this.reserve.userId,
        reservationDate: this.reserve.reservationDate,
        details: this.reserve.details,
        timeSlotId: timeSlotId,
        attendanceRequest: attendanceRequest,
      };
      console.log('reserveRequest', reserveRequest);
      this.reserveService
        .updateReservation(this.idReserve, reserveRequest)
        .subscribe({
          next: (response) => {
            this.reserveStateService.updateReserve(response, this.idReserve);
            this.reserveStateService.getAllReservationByUser(this.userId);
            this.reserveStateService.reserves$.subscribe((allReserves) => {
              this.calendarOptions = {
                ...this.calendarOptions,
                events: this.mapReservationsToEvents(allReserves),
              };
            });
            this.toastr.success(
              'Reserva actualizada correctamente',
              'Actualizado'
            );
            this.closeModalReserve();
          },
        });
    } else {
      this.reserveForm.markAllAsTouched();
    }
  }

  deleteReserve(id: number) {
    this.reserveService.deleteReservation(id).subscribe(() => {
      this.reserveStateService.deleteReserve(id);
      this.modalReserve = false;
    });
  }

  modalDeleteReserve(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Te gustaría eliminar esta reserva?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancelar',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Eliminar',
        severity: 'danger',
      },
      accept: () => {
        this.deleteReserve(id);
        this.toastr.success(
          'La reserva se a eliminado correctamente',
          'Eliminado'
        );
      },
    });
  }

  closeModalReserve() {
    this.reserveForm.reset();
    this.modalReserve = false;
  }
}
