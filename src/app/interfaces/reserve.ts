export interface ReserveRequest {
  id: number;
  userId: number;
  reservationDate: string;
  details: string;
  timeSlotId: number[];
  attendanceRequest: AttendanceRequest;
}

export interface ReserveResponse {
  id: number;
  userId: number;
  reservationDate: string;
  details: string;
  timeSlotResponse: TimeSlotResponse[];
  attendanceResponse: AttendanceResponse;
}

export interface TimeSlotResponse {
  id: number;
  startTime: string;
  endTime: string;
}

export interface AttendanceRequest {
  id: number;
  attended: boolean;
  checkinTime: string;
}

export interface AttendanceResponse {
  id: number;
  attended: boolean;
  checkinTime: string;
}
