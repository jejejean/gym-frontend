import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TIME_SLOT } from '@core/global/constans/api-endpoints';
import { environment } from '@environments/environments.dev';
import {
  MachineResponse,
  TimeSlotRequest,
  TimeSlotResponse,
} from '@interfaces/reserve';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimeSlotService {
  httpClient = inject(HttpClient);

  apiBaseUrl = environment.url;
  constructor() {}

  getAllTimeSlots(): Observable<TimeSlotResponse[]> {
    const url = `${this.apiBaseUrl}/${TIME_SLOT.GET_ALL}`;
    return this.httpClient.get<TimeSlotResponse[]>(url);
  }

  createTimeSlot(timeSlot: TimeSlotRequest): Observable<TimeSlotResponse[]> {
    const url = `${this.apiBaseUrl}/${TIME_SLOT.CREATE}`;
    return this.httpClient.post<TimeSlotResponse[]>(url, timeSlot);
  }

  updateTimeSlot(timeSlot: TimeSlotRequest): Observable<TimeSlotResponse[]> {
    const url = `${this.apiBaseUrl}/${TIME_SLOT.UPDATE}`;
    return this.httpClient.put<TimeSlotResponse[]>(url, timeSlot);
  }

  getMachinesByDate(date: Date): Observable<MachineResponse[]> {
    const url = `${this.apiBaseUrl}/${TIME_SLOT.MACHINE_BY_DATE}`;
    const peruDateStr = this.formatDateToPeruString(date);
    return this.httpClient.get<MachineResponse[]>(url, {
      params: { date: peruDateStr },
    });
  }

  getTimeSlotsByDate(date: Date): Observable<TimeSlotResponse[]> {
    const url = `${this.apiBaseUrl}/${TIME_SLOT.TIME_SLOT_BY_DATE}`;
    const peruDateStr = this.formatDateToPeruString(date);
    return this.httpClient.get<TimeSlotResponse[]>(url, {
      params: { date: peruDateStr },
    });
  }

  getCapacity(machineIds: number[], timeSlotIds: number[]): Observable<number> {
    const url = `${this.apiBaseUrl}/${TIME_SLOT.CAPACITY}`;
    return this.httpClient.get<number>(url, {
      params: { machineIds: machineIds, timeSlotIds: timeSlotIds },
    });
  }

  private formatDateToPeruString(date: Date): string {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Lima',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  }
}
