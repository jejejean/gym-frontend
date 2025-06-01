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
import { ReserveStateService } from './reserve-state.service';
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
  reserveStateService = inject(ReserveStateService);

  //reservationsByUser!: ReserveResponse[];
  //reservations: ReserveResponse[] = [];
  userId!: number;

  constructor() {}

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
  };
}
