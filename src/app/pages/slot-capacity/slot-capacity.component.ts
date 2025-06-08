import { Component, inject } from '@angular/core';
import { ModalSlotCapacityComponent } from '../../shared/components/form-modals/modal-slot-capacity/modal-slot-capacity.component';
import { TitleComponent } from '@shared/utils/title/title.component';
import { TableModule } from 'primeng/table';
import { TimeSlotService } from '@services/timeSlot.service';
import { TimeSlotResponse } from '@interfaces/reserve';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { SlotCapacityStateService } from './slot-capacity-state.service';

@Component({
  selector: 'app-slot-capacity',
  standalone: true,
  imports: [
    CommonModule,
    ModalSlotCapacityComponent,
    TitleComponent,
    TableModule,
    TagModule,
  ],
  templateUrl: './slot-capacity.component.html',
  styleUrl: './slot-capacity.component.css',
})
export class SlotCapacityComponent {
  timeSlotService = inject(TimeSlotService);
  timeSlotStateService = inject(SlotCapacityStateService);
  timeSlots!: TimeSlotResponse[];

  ngOnInit() {
    this.timeSlotStateService.getAllTimeSlot();
    this.timeSlotStateService.timeSlots$.subscribe(
      (slots: TimeSlotResponse[]) => {
        this.timeSlots = slots.map((slot: TimeSlotResponse) => ({
          ...slot,
          dateSeverity: this.getDateSeverity(slot.date),
        }));
      }
    );
    //this.getTimeSlots();
  }

  getDateSeverity(
    dateString: string | Date
  ):
    | 'success'
    | 'secondary'
    | 'info'
    | 'warn'
    | 'danger'
    | 'contrast'
    | undefined {
    if (!dateString) return 'contrast';
    const slotDate = new Date(dateString);
    const today = new Date();
    slotDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (slotDate.getTime() === today.getTime()) return 'success';
    if (slotDate.getTime() < today.getTime()) return 'danger';
    if (slotDate.getTime() > today.getTime()) return 'info';
    return 'contrast';
  }

  sortTimeSlotsByDate(timeSlots: any[]): any[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return timeSlots.slice().sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      dateA.setHours(0, 0, 0, 0);
      dateB.setHours(0, 0, 0, 0);

      // Si a es hoy y b no, a va primero
      if (
        dateA.getTime() === today.getTime() &&
        dateB.getTime() !== today.getTime()
      )
        return -1;
      // Si b es hoy y a no, b va primero
      if (
        dateB.getTime() === today.getTime() &&
        dateA.getTime() !== today.getTime()
      )
        return 1;
      // Si ambos son hoy, iguales
      if (
        dateA.getTime() === today.getTime() &&
        dateB.getTime() === today.getTime()
      )
        return 0;

      // Si ambos son distintos de hoy
      // Futuras primero, luego pasadas
      if (dateA > today && dateB > today)
        return dateA.getTime() - dateB.getTime();
      if (dateA < today && dateB < today)
        return dateA.getTime() - dateB.getTime();
      if (dateA > today && dateB < today) return -1; // Futuro antes que pasado
      if (dateA < today && dateB > today) return 1; // Pasado después de futuro

      return 0;
    });
  }

  getTimeSlots() {
    this.timeSlotService.getAllTimeSlots().subscribe((slots) => {
      this.timeSlots = this.sortTimeSlotsByDate(slots);
    });
  }
}
