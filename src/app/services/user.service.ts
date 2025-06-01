import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { USER } from '@core/global/constans/api-endpoints';
import { environment } from '@environments/environments.dev';
import { UserRequest, UserResponse } from '@interfaces/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  httpClient = inject(HttpClient);

  apiBaseUrl = environment.url;

  constructor() {}

  getAllUsers(): Observable<UserResponse[]> {
    const url = `${this.apiBaseUrl}/${USER.GET_ALL}`;
    return this.httpClient.get<UserResponse[]>(url);
  }

  getAllUsersByUserType(): Observable<UserResponse[]> {
    const url = `${this.apiBaseUrl}/${USER.GET_ALL_BY_USER_TYPE}`;
    return this.httpClient.get<UserResponse[]>(url);
  }
  
  getUserById(id: number): Observable<UserResponse> {
    const url = `${this.apiBaseUrl}/${USER.GET_BY_ID}/${id}`;
    return this.httpClient.get<UserResponse>(url);
  }

  createUser(User: UserRequest): Observable<UserResponse> {
    const url = `${this.apiBaseUrl}/${USER.CREATE}`;
    return this.httpClient.post<UserResponse>(url, User);
  }

  updateUser(id: number, User: UserRequest): Observable<UserResponse> {
    const url = `${this.apiBaseUrl}/${USER.UPDATE}/${id}`;
    return this.httpClient.put<UserResponse>(url, User);
  }

  deleteUser(id: number) {
    const url = `${this.apiBaseUrl}/${USER.DELETE}/${id}`;
    return this.httpClient.delete(url, { responseType: 'text' });
  }
    
}
