import { UserSimpleResponse } from './user';

export interface ReserveRequest {
  id: number;
  userId: number;
  reservationDate: string;
  machineRequest: MachineRequest[];
  timeSlotId: number[];
  attendanceRequest: AttendanceRequest;
}

export interface ReserveResponse {
  id: number;
  userId: number;
  reservationDate: string;
  machineResponse: MachineResponse[];
  timeSlotResponse: TimeSlotResponse[];
  attendanceResponse: AttendanceResponse;
}

export interface TimeSlotResponse {
  id: number;
  startTime: string;
  endTime: string;
  date: string;
  machineTimeSlotResponse: MachineTimeSlotResponse[];
}

export interface MachineTimeSlotResponse {
  id: number;
  capacity: number;
  machine: MachineResponse;
  timeSlot: TimeSlotSummaryResponse;
}

export interface TimeSlotSummaryResponse {
  id: number;
  startTime: string;
  endTime: string;
  date: string;
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

export interface ReserveByDayResponse {
  id: number;
  userSimpleResponse: UserSimpleResponse;
  reservationDate: string;
  machineResponse: MachineResponse[];
  timeSlotResponse: TimeSlotResponse[];
  attendanceResponse: AttendanceResponse;
}

export interface ReserveSimpleRequest {
  id: number;
  attendanceRequest: AttendanceRequest;
}

export interface TimeSlotRequest {
  date: string;
  capacity: number;
  idsMachine: number[];
}

export interface MachineResponse {
  id: number;
  name: string;
}

export interface MachineRequest {
  id: number;
  name: string;
}
