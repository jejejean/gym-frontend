import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private apiCount = 0;
  isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  constructor() { }

  showLoader() {
    if (this.apiCount === 0) {
      setTimeout(() => this.isLoadingSubject.next(true));
    }
    this.apiCount++;
  }

  hideLoader() {
    this.apiCount--;
    if (this.apiCount === 0) {
      setTimeout(() => this.isLoadingSubject.next(false));
    }
  }
}