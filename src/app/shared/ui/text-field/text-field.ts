import { Component, computed, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-text-field',
  imports: [FormField],
  templateUrl: './text-field.html',
  styleUrl: './text-field.scss',
})
export class TextField {
  readonly label = input.required<string>();
  readonly field = input.required<FieldTree<string>>();
  readonly name = input.required<string>();
  readonly type = input<'text' | 'email'>('text');
  readonly autocomplete = input<string>('on');

  protected readonly errorId = computed(() => `${this.name()}-error`);

  protected readonly showErrors = computed(() => {
    const state = this.field()();
    return state.touched() && state.invalid();
  });

  protected readonly errorMessage = computed(() => {
    const errors = this.field()().errors();
    return errors.length > 0 ? (errors[0].message ?? 'This value is invalid') : '';
  });
}
