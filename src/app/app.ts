import { Component } from '@angular/core';

import { SignupForm } from './signup/signup-form';

@Component({
  selector: 'app-root',
  imports: [SignupForm],
  template: '<app-signup-form />',
})
export class App {}
