import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { exhaustMap, pipe, tap } from 'rxjs';

import { SignupApi } from './signup-api';
import { SignupData } from './signup.model';

export type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

interface SignupState {
  status: SubmissionStatus;
  /** Snapshot of what was actually sent, so the confirmation can't drift from it. */
  submitted: SignupData | null;
}

/**
 * Owns the submission lifecycle so the form component stays presentational.
 * Provided at component level: its lifetime is tied to the form that uses it.
 */
export const SignupStore = signalStore(
  withState<SignupState>({ status: 'idle', submitted: null }),
  withComputed(({ status }) => ({
    isSubmitting: computed(() => status() === 'submitting'),
    isSuccess: computed(() => status() === 'success'),
    hasError: computed(() => status() === 'error'),
  })),
  withMethods((store, api = inject(SignupApi)) => ({
    // exhaustMap ignores re-submissions while a request is in flight.
    submit: rxMethod<SignupData>(
      pipe(
        tap((data) => patchState(store, { status: 'submitting', submitted: data })),
        exhaustMap((data) =>
          api.signup(data).pipe(
            tapResponse({
              next: () => patchState(store, { status: 'success' }),
              error: () => patchState(store, { status: 'error' }),
            }),
          ),
        ),
      ),
    ),
    reset(): void {
      patchState(store, { status: 'idle', submitted: null });
    },
  })),
);
