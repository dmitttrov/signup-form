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
