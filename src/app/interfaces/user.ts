export interface UserRequest {
  idUser: number;
  username: string;
  email: string;
  phone: string;
  userType: string;
  userProfileRequest: UserProfileRequest;
  userPlansRequest: UserPlansRequest[];
}

export interface UserProfileRequest {
  id: number;
  sex: string;
  height: number;
  weight: number;
}

export interface UserPlansRequest {
  id: number;
  startDate: string;
  endDate: string;
  planTypeId: string;
  status: string;
}

export interface UserResponse {
  idUser: number;
  username: string;
  email: string;
  roles: string;
  phone: string;
  status: string;
  userType: string;
  userProfileResponse: UserProfileResponse;
  userPlansResponse: UserPlansResponse[];
}

export interface UserProfileResponse {
  id: number;
  sex: string;
  height: number;
  weight: number;
}

export interface UserPlansResponse {
  id: number;
  startDate: string;
  endDate: string;
  status: string;
  planTypeResponse: PlanTypeResponse;
}

export interface PlanTypeResponse {
  id: number;
  name: string;
  durationDays: number;
  price: number;
}
