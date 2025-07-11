import { Injectable } from '@angular/core';
import { UserResponse } from '@interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserSessionService {
  private userKey = 'user_data';

  setUser(user: UserResponse): void {
    sessionStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUser(): UserResponse | null {
    const userData = sessionStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  clearUser(): void {
    sessionStorage.removeItem(this.userKey);
  }
}