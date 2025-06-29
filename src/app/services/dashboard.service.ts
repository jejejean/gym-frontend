import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DASHBOARD } from '@core/global/constans/api-endpoints';
import { environment } from '@environments/environments.dev';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  httpClient = inject(HttpClient);

  apiBaseUrl = environment.url;

  constructor() {}

  getAllReservations(): Observable<any> {
    const url = `${this.apiBaseUrl}/${DASHBOARD.GET_REVERVATIONS}`;
    return this.httpClient.get<any>(url);
  }

  getAttendancePercentage(): Observable<any> {
    const url = `${this.apiBaseUrl}/${DASHBOARD.ATTENDANCE_PERCENTAGE}`;
    return this.httpClient.get<any>(url);
  }

  getReservationsByMonth(): Observable<any> {
    const url = `${this.apiBaseUrl}/${DASHBOARD.RESERVATION_BY_MONTH}`;
    return this.httpClient.get<any>(url);
  }

  getReservationsByMachine(): Observable<any> {
    const url = `${this.apiBaseUrl}/${DASHBOARD.RESERVATIONS_BY_MACHINE}`;
    return this.httpClient.get<any>(url);
  }

  getReservationsByTypeMachine(): Observable<any> {
    const url = `${this.apiBaseUrl}/${DASHBOARD.RESERVATION_BY_TIPE_MACHINE}`;
    return this.httpClient.get<any>(url);
  }
  
  getTotalClients(): Observable<any> {
    const url = `${this.apiBaseUrl}/${DASHBOARD.GET_CLIENTS}`;
    return this.httpClient.get<any>(url);
  }
}
