import { Component } from '@angular/core';
import { ModalSlotCapacityComponent } from '../../shared/components/form-modals/modal-slot-capacity/modal-slot-capacity.component';
import { TitleComponent } from '@shared/utils/title/title.component';

@Component({
  selector: 'app-slot-capacity',
  standalone: true,
  imports: [ModalSlotCapacityComponent, TitleComponent],
  templateUrl: './slot-capacity.component.html',
  styleUrl: './slot-capacity.component.css',
})
export class SlotCapacityComponent {}
