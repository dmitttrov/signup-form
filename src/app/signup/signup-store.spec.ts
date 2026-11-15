import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { SignupApi } from './signup-api';
import { SignupStore } from './signup-store';
import { SignupData, SignupResponse } from './signup.model';

describe('SignupStore', () => {
  const data: SignupData = { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' };

  let response$: Subject<SignupResponse>;
  let signupSpy: ReturnType<typeof vi.fn>;
  let store: InstanceType<typeof SignupStore>;

  beforeEach(() => {
    response$ = new Subject<SignupResponse>();
    signupSpy = vi.fn(() => response$.asObservable());

    TestBed.configureTestingModule({
      providers: [SignupStore, { provide: SignupApi, useValue: { signup: signupSpy } }],
    });
    store = TestBed.inject(SignupStore);
  });

  it('starts idle', () => {
    expect(store.status()).toBe('idle');
  });

  it('moves through submitting to success and snapshots the payload', () => {
    store.submit(data);
    expect(store.isSubmitting()).toBe(true);
    expect(store.submitted()).toEqual(data);

    response$.next({ ok: true });
    response$.complete();
    expect(store.isSuccess()).toBe(true);
  });

  it('flags an error when the request fails', () => {
    store.submit(data);
    response$.error(new Error('network down'));

    expect(store.hasError()).toBe(true);
  });

  it('ignores re-submission while a request is in flight', () => {
    store.submit(data);
    store.submit(data);

    expect(signupSpy).toHaveBeenCalledTimes(1);
  });

  it('returns to idle on reset', () => {
    store.submit(data);
    response$.next({ ok: true });
    response$.complete();

    store.reset();
    expect(store.status()).toBe('idle');
    expect(store.submitted()).toBeNull();
  });
});
