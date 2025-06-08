import { Component, OnInit } from '@angular/core';
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
import { CommonModule } from '@angular/common';

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
  ],
  templateUrl: './modal-slot-capacity.component.html',
  styleUrl: './modal-slot-capacity.component.css',
})
export class ModalSlotCapacityComponent implements OnInit {

  modalCapacity: boolean = false;

  ngOnInit(): void {
  }

  openModalCapacity() {
    this.modalCapacity = true;
  }

}
