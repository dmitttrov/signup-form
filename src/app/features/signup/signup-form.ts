import {
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  effect,
  inject,
  signal,
} from '@angular/core';
import { email, form, maxLength, required } from '@angular/forms/signals';

import { TextField } from '../../shared/ui/text-field/text-field';
import { SignupStore } from './data/signup-store';
import { EMPTY_SIGNUP, SignupData } from './data/signup.model';

@Component({
  selector: 'app-signup-form',
  imports: [TextField],
  providers: [SignupStore],
  templateUrl: './signup-form.html',
  styleUrl: './signup-form.scss',
})
export class SignupForm {
  protected readonly store = inject(SignupStore);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);

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

  constructor() {
    // Replacing the form with the success panel would otherwise drop keyboard
    // focus to <body> and leave screen readers silent.
    effect(() => {
      if (this.store.isSuccess()) {
        this.focusAfterRender('#signup-success-heading');
      }
    });
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();

    if (this.form().invalid()) {
      this.form().markAsTouched();
      this.form().errorSummary()[0]?.fieldTree().focusBoundControl();
      return;
    }

    this.store.submit(this.form().value());
  }

  protected startOver(): void {
    this.form().reset({ ...EMPTY_SIGNUP });
    this.store.reset();
    this.focusAfterRender('#firstName');
  }

  private focusAfterRender(selector: string): void {
    afterNextRender(() => this.host.nativeElement.querySelector<HTMLElement>(selector)?.focus(), {
      injector: this.injector,
    });
  }
}
