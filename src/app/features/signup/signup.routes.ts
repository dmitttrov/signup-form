import { Routes } from '@angular/router';

import { SignupForm } from './signup-form';

export default [
  {
    path: '',
    title: 'Sign up',
    component: SignupForm,
  },
] satisfies Routes;
