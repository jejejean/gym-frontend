import { inject, Injectable } from '@angular/core';
import {
  ReserveByDayResponse,
  ReserveResponse,
  ReserveSimpleRequest,
} from '@interfaces/reserve';
import { ReserveService } from '@services/reserve.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReserveStateService {
  reserveService = inject(ReserveService);

  reserveSubject: BehaviorSubject<ReserveResponse[]> = new BehaviorSubject<
    ReserveResponse[]
  >([]);
  reserves$: Observable<ReserveResponse[]> = this.reserveSubject.asObservable();

  reserveByDaySubject: BehaviorSubject<ReserveByDayResponse[]> =
    new BehaviorSubject<ReserveByDayResponse[]>([]);
  reservesByDay$: Observable<ReserveByDayResponse[]> =
    this.reserveByDaySubject.asObservable();

  constructor() {}

  getAllReservation(): void {
    this.reserveService
      .getAllReservations()
      .subscribe((reserve: ReserveResponse[]) => {
        this.reserveSubject.next(reserve);
      });
  }

  getAllReservationByUser(userId: number): void {
    this.reserveService
      .getAllReservationsByUser(userId)
      .subscribe((reserve: ReserveResponse[]) => {
        this.reserveSubject.next(reserve);
      });
  }

  addReserve(reserveRequest: ReserveResponse): void {
    const reserveType = this.reserveSubject.getValue();
    reserveType.unshift(reserveRequest);
    this.reserveSubject.next(reserveType);
  }

  updateReserve(reserveResponse: ReserveResponse, id: number): void {
    const reserve = this.reserveSubject.getValue();
    const index = reserve.findIndex((reserve) => reserve.id === id);
    if (index !== -1) {
      reserve[index] = reserveResponse;
      this.reserveSubject.next(reserve);
    }
  }

  updateAttended(id: number, reserveResponse: ReserveSimpleRequest): void {
    const reserve = this.reserveByDaySubject.getValue();
    const index = reserve.findIndex((reserve) => reserve.id === id);
    if (index !== -1) {
      reserve[index] = {
        ...reserve[index],
        ...reserveResponse,
      };
      this.reserveByDaySubject.next(reserve);
    }
  }

  getAllReservationsByDate(date: string): void {
    this.reserveService
      .getReservationsByDate(date)
      .subscribe((reserve: ReserveByDayResponse[]) => {
        this.reserveByDaySubject.next(reserve);
      });
  }

  deleteReserve(id: number): void {
    const reserve = this.reserveSubject.getValue();
    const deletereserve = reserve.filter((doc) => doc.id !== id);
    this.reserveSubject.next(deletereserve);
  }
}
