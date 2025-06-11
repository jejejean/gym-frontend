import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { CommonModule } from '@angular/common';
import { FormErrorComponent } from '../../form-errors/form-error.component';
import { ToastrService } from 'ngx-toastr';
import { TimeSlotRequest } from '@interfaces/reserve';
import { TimeSlotService } from '@services/timeSlot.service';
import { SlotCapacityStateService } from '@pages/slot-capacity/slot-capacity-state.service';

@Component({
  selector: 'app-modal-slot-capacity',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    DatePickerModule,
    DividerModule,
    DialogModule,
    InputNumberModule,
    FormErrorComponent,
  ],
  templateUrl: './modal-slot-capacity.component.html',
  styleUrl: './modal-slot-capacity.component.css',
})
export class ModalSlotCapacityComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  toastr = inject(ToastrService);
  timeSlotService = inject(TimeSlotService);
  timeSlotStateService = inject(SlotCapacityStateService);

  capacityForm!: FormGroup;
  modalCapacity: boolean = false;

  ngOnInit(): void {
    this.buildFormCapacity();
  }

  buildFormCapacity() {
    this.capacityForm = this.formBuilder.group({
      capacity: [20, [Validators.required, Validators.min(1)]],
      date: [new Date(), Validators.required],
    });
  }

  obSubmitCapacity() {
    if (this.capacityForm.valid) {
      const { capacity, date } = this.capacityForm.getRawValue();
      const timeSlot: TimeSlotRequest = {
        id: 0,
        startTime: '09:00',
        endTime: '22:00',
        capacity: capacity,
        date: date,
      }
      this.timeSlotService.createTimeSlot(timeSlot).subscribe({
        next: (response) => {
          this.timeSlotStateService.addTimeSlot(response);
          this.toastr.success('Se ha registrado la capacidad del horario', 'Agregado');
          this.closeModalCapacity();
        },
        error: (error) => {
          this.toastr.error(error.error.message, 'Error al agregar');
        },
      });

    } else {
      this.toastr.error('Please fill in all required fields');
    }
  }

  openModalCapacity() {
    this.modalCapacity = true;
  }
  closeModalCapacity() {
    this.modalCapacity = false;
  }
}
