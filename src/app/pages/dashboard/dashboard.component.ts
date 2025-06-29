import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { DashboardService } from '@services/dashboard.service';
import { TitleComponent } from '../../shared/utils/title/title.component';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TitleComponent, CardModule, ChartModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  dashboardService = inject(DashboardService);

  constructor() {}

  reservations!: number;
  TotalClients!: number;
  attendancePercentage!: { asistencia: number; inasistencia: number };

  reservationsByMachineData: any;
  reservationsByMachineOptions: any;

  reservationsByTypeMachineData: any;
  reservationsByTypeMachineOptions: any;

  reservationsByMonthData: any;
  reservationsByMonthOptions: any;

  cd = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.getAllReservations();
    this.getAttendancePercentage();
    this.getReservationsByMonth();
    this.getReservationsByMachine();
    this.getReservationsByTypeMachine();
    this.getAllClients();
  }

  getAllReservations() {
    this.dashboardService.getAllReservations().subscribe({
      next: (data) => {
        this.reservations = data;
      },
    });
  }

  getAllClients() {
    this.dashboardService.getTotalClients().subscribe({
      next: (data) => {
        this.TotalClients = data;
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
  get attendancePercent(): number {
    const a = this.attendancePercentage?.asistencia ?? 0;
    const i = this.attendancePercentage?.inasistencia ?? 0;
    const total = a + i;
    return total ? Math.round((a / total) * 100) : 0;
  }

  getReservationsByMonth() {
    this.dashboardService.getReservationsByMonth().subscribe({
      next: (data) => {
        const labels = Object.keys(data);
        const values = Object.values(data);

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--p-text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
          '--p-text-muted-color'
        );
        const surfaceBorder = documentStyle.getPropertyValue(
          '--p-content-border-color'
        );

        this.reservationsByMonthData = {
          labels: labels,
          datasets: [
            {
              label: 'Reservas por mes',
              backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
              borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
              data: values,
            },
          ],
        };

        this.reservationsByMonthOptions = {
          maintainAspectRatio: false,
          aspectRatio: 0.8,
          plugins: {
            legend: {
              labels: {
                color: textColor,
              },
            },
          },
          scales: {
            x: {
              ticks: {
                color: textColorSecondary,
                font: {
                  weight: 500,
                },
              },
              grid: {
                color: surfaceBorder,
                drawBorder: false,
              },
            },
            y: {
              ticks: {
                color: textColorSecondary,
              },
              grid: {
                color: surfaceBorder,
                drawBorder: false,
              },
            },
          },
        };

        this.cd.markForCheck();
      },
    });
  }

  getReservationsByMachine() {
    this.dashboardService.getReservationsByMachine().subscribe({
      next: (data) => {
        const labels = Object.keys(data);
        const values = Object.values(data);

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--p-text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
          '--p-text-muted-color'
        );
        const surfaceBorder = documentStyle.getPropertyValue(
          '--p-content-border-color'
        );

        this.reservationsByMachineData = {
          labels: labels,
          datasets: [
            {
              label: 'Reservas por máquina',
              backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
              borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
              data: values,
            },
          ],
        };

        this.reservationsByMachineOptions = {
          indexAxis: 'y',
          maintainAspectRatio: false,
          aspectRatio: 0.8,
          plugins: {
            legend: {
              labels: {
                color: textColor,
              },
            },
          },
          scales: {
            x: {
              ticks: {
                color: textColorSecondary,
                font: {
                  weight: 500,
                },
              },
              grid: {
                color: surfaceBorder,
                drawBorder: false,
              },
            },
            y: {
              ticks: {
                color: textColorSecondary,
              },
              grid: {
                color: surfaceBorder,
                drawBorder: false,
              },
            },
          },
        };

        this.cd.markForCheck();
      },
    });
  }

  getReservationsByTypeMachine() {
    this.dashboardService.getReservationsByTypeMachine().subscribe({
      next: (data) => {
        const labels = Object.keys(data);
        const values = Object.values(data);

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--p-text-color');

        // Puedes agregar más colores si tienes más tipos
        const backgroundColors = [
          documentStyle.getPropertyValue('--p-cyan-500'),
          documentStyle.getPropertyValue('--p-orange-500'),
          documentStyle.getPropertyValue('--p-gray-500'),
        ];
        const hoverBackgroundColors = [
          documentStyle.getPropertyValue('--p-cyan-400'),
          documentStyle.getPropertyValue('--p-orange-400'),
          documentStyle.getPropertyValue('--p-gray-400'),
        ];

        this.reservationsByTypeMachineData = {
          labels: labels,
          datasets: [
            {
              data: values,
              backgroundColor: backgroundColors.slice(0, labels.length),
              hoverBackgroundColor: hoverBackgroundColors.slice(
                0,
                labels.length
              ),
            },
          ],
        };

        this.reservationsByTypeMachineOptions = {
          cutout: '60%',
          plugins: {
            legend: {
              labels: {
                color: textColor,
              },
            },
          },
        };

        this.cd.markForCheck();
      },
    });
  }
}
