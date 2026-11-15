import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { SignupData, SignupResponse } from './signup.model';

@Injectable({ providedIn: 'root' })
export class SignupApi {
  private readonly http = inject(HttpClient);

  signup(data: SignupData): Observable<SignupResponse> {
    return this.http.post<SignupResponse>('/api/signup', data);
  }
}
