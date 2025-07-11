import { UserPlansResponse, UserProfileResponse } from "./user";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  userPrincipal: UserPrincipal;
  bearer: string;
  token: string;
  authorities: string[];
}

export interface UserPrincipal {
  email: string;
  idUser: number;
  phone: string;
  status: string;
  userType: string;
  userProfileResponse: UserProfileResponse;
  userPlansResponse: UserPlansResponse[];
 
  active : boolean;
  username: string;
  roles: string[];
}
