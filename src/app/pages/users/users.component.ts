import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ModalUserComponent } from '../../shared/components/form-modals/modal-user/modal-user.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { UserService } from '@services/user.service';
import { ToastrService } from 'ngx-toastr';
import { UserResponse } from '@interfaces/user';
import { Table, TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { IconField, IconFieldModule } from 'primeng/iconfield';
import { InputIcon, InputIconModule } from 'primeng/inputicon';
import { UserStateService } from './user-state.service';
import { TitleComponent } from '@shared/utils/title/title.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    ModalUserComponent,
    TitleComponent,
    ConfirmDialogModule,
    ToastModule,
    TableModule,
    InputIconModule,
    IconFieldModule,
    MultiSelectModule,
    SelectModule,
    TagModule,
    CommonModule,
    InputIcon,
    IconField,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  providers: [ConfirmationService, MessageService],
})
export class UsersComponent implements OnInit {
  toastr = inject(ToastrService);
  userService = inject(UserService);
  userStateService = inject(UserStateService);
  userData: UserResponse[] = [];

  activityValues: number[] = [0, 100];

  @ViewChild('dt2') dt2!: Table;

  constructor() {}

  ngOnInit(): void {
    this.userStateService.getAllUsersByUserType();

    this.userStateService.users$.subscribe((response: UserResponse[]) => {
      this.userData = response.map((user: UserResponse) => ({
        ...user,
        planName: user.userPlansResponse[0]?.planTypeResponse?.name ?? '',
        planStartDate: user.userPlansResponse[0]?.startDate ?? '',
        planEndDate: user.userPlansResponse[0]?.endDate ?? '',
        planDuration:
          user.userPlansResponse[0]?.planTypeResponse?.durationDays ?? '',
      }));
    });
  }

  clear(table: Table) {
    table.clear();
  }

  onGlobalFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.dt2.filterGlobal(input.value, 'contains');
  }
}
