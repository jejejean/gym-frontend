import { Component, inject, OnInit } from '@angular/core';
import { DashboardService } from '@services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  dashboardService = inject(DashboardService);

  constructor() {}

  reservations!: number;
  attendancePercentage!: any[];
  reservationsByMonth!: any[];
  reservationsByMachine!: any[];
  reservationsByTypeMachine!: any[];

  ngOnInit(): void {
    this.getAllReservations();
    this.getAttendancePercentage();
    this.getReservationsByMonth();
    this.getReservationsByMachine();
    this.getReservationsByTypeMachine();
  }

  getAllReservations() {
    this.dashboardService.getAllReservations().subscribe({
      next: (data) => {
        this.reservations = data;
      },
    });
  }
  getAttendancePercentage() {
    this.dashboardService.getAttendancePercentage().subscribe({
      next: (data) => {
        this.attendancePercentage = data;
      },
    });
  }

  getReservationsByMonth() {
    this.dashboardService.getReservationsByMonth().subscribe({
      next: (data) => {
        this.reservationsByMonth = data;
      },
    });
  }

  getReservationsByMachine() {
    this.dashboardService.getReservationsByMachine().subscribe({
      next: (data) => {
        this.reservationsByMachine = data;
      },
    });
  }

  getReservationsByTypeMachine() {
    this.dashboardService.getReservationsByTypeMachine().subscribe({
      next: (data) => {
        this.reservationsByTypeMachine = data;
      },
    });
  }

  

}
