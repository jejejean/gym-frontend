import { inject, Injectable } from '@angular/core';
import { UserResponse } from '@interfaces/user';
import { UserService } from '@services/user.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  userService = inject(UserService);

  userSubject: BehaviorSubject<UserResponse[]> = new BehaviorSubject<
    UserResponse[]
  >([]);
  users$: Observable<UserResponse[]> = this.userSubject.asObservable();

  constructor() {}

  getAllUsersByUserType(): void {
    this.userService.getAllUsersByUserType().subscribe((user: UserResponse[]) => {
      this.userSubject.next(user);
    });
  }

  addUser(userRequest: UserResponse): void {
    const userType = this.userSubject.getValue();
    userType.unshift(userRequest);
    this.userSubject.next(userType);
  }

  updateUser(userResponse: UserResponse, id: number): void {
    const user = this.userSubject.getValue();
    const index = user.findIndex((user) => user.idUser === id);
    if (index !== -1) {
      user[index] = userResponse;
      this.userSubject.next(user);
    }
  }

  deleteUser(id: number): void {
    const user = this.userSubject.getValue();
    const deleteuser = user.filter((doc) => doc.idUser !== id);
    this.userSubject.next(deleteuser);
  }
}
