import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../../core/api-base-url';
import { SignupData, SignupResponse } from './signup.model';

@Injectable({ providedIn: 'root' })
export class SignupApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  signup(data: SignupData): Observable<SignupResponse> {
    return this.http.post<SignupResponse>(`${this.baseUrl}/signup`, data);
  }
}
