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
import { ReserveResponse } from '@interfaces/reserve';
@Component({
  selector: 'app-reserve',
  standalone: true,
  imports: [
    ModalReserveComponent,
    FullCalendarModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  templateUrl: './reserve.component.html',
  styleUrl: './reserve.component.css',
  providers: [ConfirmationService, MessageService],
})
export class ReserveComponent implements OnInit {
  toastr = inject(ToastrService);
  reserveService = inject(ReserveService);

  reservationsByUser!: ReserveResponse[];
  reservations: ReserveResponse[] = [];
  userId!: number;

  constructor() {}

  ngOnInit(): void {
    this.loadUserData();
    this.getAllReservationByUser();
    this.getAllReservation();
  }

  loadUserData() {
    const user = JSON.parse(sessionStorage.getItem('user_data') ?? '{}');
    const { userPrincipal } = user;
    const { idUser } = userPrincipal;
    this.userId = idUser;
  }

  getAllReservation() {
    this.reserveService.getAllReservations().subscribe({
      next: (response) => {
        this.reservations = response;
      },
    });
  }

  mapReservationsToEvents(reservations: ReserveResponse[]): any[] {
    return reservations.map((res) => {
      let timeRange = '';
      if (res.timeSlotResponse && res.timeSlotResponse.length > 0) {
        const firstSlot = res.timeSlotResponse[0];
        const lastSlot = res.timeSlotResponse[res.timeSlotResponse.length - 1];
        timeRange = `${firstSlot.startTime} - ${lastSlot.endTime}`;
      }
      return {
        title: `Reserva ${timeRange}`,
        start: res.reservationDate,
        end: res.reservationDate,
      };
    });
  }

  getAllReservationByUser() {
    this.reserveService.getAllReservationsByUser(this.userId).subscribe({
      next: (response) => {
        this.reservationsByUser = response;
        this.calendarOptions = {
          ...this.calendarOptions,
          events: this.mapReservationsToEvents(this.reservationsByUser),
        };
      },
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
  };
}
