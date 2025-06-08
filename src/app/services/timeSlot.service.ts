import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TIME_SLOT } from '@core/global/constans/api-endpoints';
import { environment } from '@environments/environments.dev';
import { TimeSlotRequest, TimeSlotResponse } from '@interfaces/reserve';
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
}
