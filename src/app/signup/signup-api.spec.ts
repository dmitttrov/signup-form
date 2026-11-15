import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { SignupApi } from './signup-api';
import { SignupResponse } from './signup.model';

describe('SignupApi', () => {
  let api: SignupApi;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(SignupApi);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('POSTs the captured data to /api/signup', () => {
    const data = { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' };
    let response: SignupResponse | undefined;

    api.signup(data).subscribe((r) => (response = r));

    const req = httpTesting.expectOne('/api/signup');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(data);

    req.flush({ ok: true });
    expect(response).toEqual({ ok: true });
  });
});
