import { Component, input, output, signal } from '@angular/core';
import { email, form, maxLength, required } from '@angular/forms/signals';

import { UiAlert } from '../../../../shared/ui/alert/ui-alert';
import { UiButton } from '../../../../shared/ui/button/ui-button';
import { TextField } from '../../../../shared/ui/text-field/text-field';
import { EMPTY_SIGNUP, SignupData } from '../../data/signup.model';

@Component({
  selector: 'app-signup-form',
  imports: [TextField, UiAlert, UiButton],
  templateUrl: './signup-form.html',
  styleUrl: './signup-form.scss',
})
export class SignupForm {
  readonly submitting = input(false);
  readonly error = input(false);
  readonly submitted = output<SignupData>();

  private readonly model = signal<SignupData>({ ...EMPTY_SIGNUP });

  protected readonly form = form(this.model, (path) => {
    required(path.firstName, { message: 'Enter your first name' });
    maxLength(path.firstName, 100, { message: 'First name must be 100 characters or fewer' });
    required(path.lastName, { message: 'Enter your last name' });
    maxLength(path.lastName, 100, { message: 'Last name must be 100 characters or fewer' });
    required(path.email, { message: 'Enter your email address' });
    email(path.email, { message: 'Enter a valid email address, like name@example.com' });
    maxLength(path.email, 254, { message: 'Email must be 254 characters or fewer' });
  });

  protected onSubmit(event: Event): void {
    event.preventDefault();

    if (this.form().invalid()) {
      this.form().markAsTouched();
      this.form().errorSummary()[0]?.fieldTree().focusBoundControl();
      return;
    }

    this.submitted.emit(this.form().value());
  }
}
