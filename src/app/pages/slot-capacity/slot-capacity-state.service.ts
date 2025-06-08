import { inject, Injectable } from '@angular/core';
import { TimeSlotResponse } from '@interfaces/reserve';
import { TimeSlotService } from '@services/timeSlot.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SlotCapacityStateService {
  timeSlotService = inject(TimeSlotService);

  timeSlotSubject: BehaviorSubject<TimeSlotResponse[]> = new BehaviorSubject<
    TimeSlotResponse[]
  >([]);
  timeSlots$: Observable<TimeSlotResponse[]> =
    this.timeSlotSubject.asObservable();

  constructor() {}

  getAllTimeSlot(): void {
    this.timeSlotService
      .getAllTimeSlots()
      .subscribe((timeSlot: TimeSlotResponse[]) => {
        this.timeSlotSubject.next(timeSlot);
      });
  }

  addTimeSlot(timeSlotRequest: TimeSlotResponse[]): void {
    const timeSlotType = this.timeSlotSubject.getValue();
    this.timeSlotSubject.next([...timeSlotRequest, ...timeSlotType]);
  }
}
