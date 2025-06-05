import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RESERVE } from '@core/global/constans/api-endpoints';
import { environment } from '@environments/environments.dev';
import { AttendanceResponse, ReserveByDayResponse, ReserveRequest, ReserveResponse, ReserveSimpleRequest } from '@interfaces/reserve';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReserveService {
  httpClient = inject(HttpClient);

  apiBaseUrl = environment.url;

  constructor() {}

  getAllReservations(): Observable<ReserveResponse[]> {
    const url = `${this.apiBaseUrl}/${RESERVE.GET_ALL}`;
    return this.httpClient.get<ReserveResponse[]>(url);
  }
  getReservationById(id: number): Observable<ReserveResponse> {
    const url = `${this.apiBaseUrl}/${RESERVE.GET_BY_ID}/${id}`;
    return this.httpClient.get<ReserveResponse>(url);
  }

  getAllReservationsByUser(userId: number): Observable<ReserveResponse[]> {
    const url = `${this.apiBaseUrl}/${RESERVE.GET_ALL_BY_USER}/${userId}`;
    return this.httpClient.get<ReserveResponse[]>(url);
  }

  createReservation(reservation: ReserveRequest): Observable<ReserveResponse> {
    const url = `${this.apiBaseUrl}/${RESERVE.CREATE}`;
    return this.httpClient.post<ReserveResponse>(url, reservation);
  }

  updateReservation(id: number, reservation: ReserveRequest): Observable<ReserveResponse> {
    const url = `${this.apiBaseUrl}/${RESERVE.UPDATE}/${id}`;
    return this.httpClient.put<ReserveResponse>(url, reservation);
  }

  deleteReservation(id: number) {
    const url = `${this.apiBaseUrl}/${RESERVE.DELETE}/${id}`;
    return this.httpClient.delete(url, { responseType: 'text' });
  }

  getReservationDatesByUser(userId: number): Observable<string[]> {
    const url = `${this.apiBaseUrl}/${RESERVE.GET_DATES_BY_USER}/${userId}`;
    return this.httpClient.get<string[]>(url);
  }

  getReservationsByDate(date: string): Observable<ReserveByDayResponse[]> {
    const url = `${this.apiBaseUrl}/${RESERVE.GET_BY_DATE}/${date}`;
    return this.httpClient.get<ReserveByDayResponse[]>(url);
  }

  updateAttendance(id: number, attendance: ReserveSimpleRequest): Observable<AttendanceResponse> {
    const url = `${this.apiBaseUrl}/${RESERVE.UPDATE_ATTENDANCE}/${id}`;
    return this.httpClient.put<AttendanceResponse>(url, attendance);
  }
}
