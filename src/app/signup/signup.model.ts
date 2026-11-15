/**
 * The data captured by the sign-up form. Adding a future question means adding
 * a field here, one schema rule in `signup-form.ts`, and one field block in
 * its template.
 */
export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
}

export interface SignupResponse {
  ok: boolean;
}

export const EMPTY_SIGNUP: SignupData = {
  firstName: '',
  lastName: '',
  email: '',
};
