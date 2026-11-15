import { Component, ElementRef, afterNextRender, inject, input, output } from '@angular/core';

import { UiButton } from '../../../../shared/ui/button/ui-button';
import { SignupData } from '../../data/signup.model';

@Component({
  selector: 'app-signup-success',
  imports: [UiButton],
  templateUrl: './signup-success.html',
  styleUrl: './signup-success.scss',
})
export class SignupSuccess {
  readonly data = input.required<SignupData>();
  readonly restart = output<void>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    afterNextRender(() => {
      this.host.nativeElement.querySelector<HTMLElement>('#signup-success-heading')?.focus();
    });
  }
}
