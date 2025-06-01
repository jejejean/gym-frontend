export interface ReserveRequest {
  id: number;
  userId: number;
  reservationDate: string;
  details: string;
  timeSlotId: number[];
  attendanceRequest: any;
}

export interface ReserveResponse {
  id: number;
  userId: number;
  reservationDate: string;
  details: string;
  timeSlotResponse: TimeSlotResponse[];
  attendanceRequest: any;
}

export interface TimeSlotResponse {
  id: number;
  startTime: string;
  endTime: string;
}
