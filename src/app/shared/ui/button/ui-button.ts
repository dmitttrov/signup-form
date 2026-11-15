import { Component, input } from '@angular/core';

@Component({
  selector: 'button[ui-button]',
  template: '<ng-content />',
  styleUrl: './ui-button.scss',
  host: {
    '[class.ui-button--secondary]': "variant() === 'secondary'",
    '[attr.aria-disabled]': "busy() ? 'true' : null",
  },
})
export class UiButton {
  readonly variant = input<'primary' | 'secondary'>('primary');
  readonly busy = input(false);
}
