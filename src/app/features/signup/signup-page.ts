import { Component, ElementRef, Injector, afterNextRender, inject } from '@angular/core';

import { PageHeader } from '../../shared/ui/page-header/page-header';
import { SignupForm } from './components/signup-form/signup-form';
import { SignupSuccess } from './components/signup-success/signup-success';
import { SignupStore } from './data/signup-store';

@Component({
  selector: 'app-signup-page',
  imports: [PageHeader, SignupForm, SignupSuccess],
  providers: [SignupStore],
  templateUrl: './signup-page.html',
  styleUrl: './signup-page.scss',
})
export class SignupPage {
  protected readonly store = inject(SignupStore);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);

  protected startOver(): void {
    this.store.reset();
    afterNextRender(
      () => this.host.nativeElement.querySelector<HTMLElement>('#firstName')?.focus(),
      { injector: this.injector },
    );
  }
}
