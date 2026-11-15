import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupPage } from './signup-page';

describe('SignupPage', () => {
  let fixture: ComponentFixture<SignupPage>;
  let element: HTMLElement;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(SignupPage);
    element = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  afterEach(() => {
    httpTesting.verify();
  });

  function fillField(selector: string, value: string): void {
    const input = element.querySelector<HTMLInputElement>(selector);
    expect(input).not.toBeNull();
    input!.value = value;
    input!.dispatchEvent(new Event('input', { bubbles: true }));
    input!.dispatchEvent(new Event('blur', { bubbles: true }));
  }

  function submitForm(): void {
    element.querySelector('form')!.dispatchEvent(new Event('submit'));
  }

  it('shows no validation errors before any interaction', () => {
    expect(element.querySelectorAll('[aria-invalid="true"]').length).toBe(0);
  });

  it('blocks submission and reveals all errors when the form is empty', async () => {
    submitForm();
    await fixture.whenStable();

    expect(element.querySelectorAll('[aria-invalid="true"]').length).toBe(3);
    expect(element.textContent).toContain('Enter your first name');
    httpTesting.expectNone('/api/signup');
  });

  it('rejects an invalid email address after interaction', async () => {
    fillField('#email', 'not-an-email');
    await fixture.whenStable();

    const emailInput = element.querySelector('#email')!;
    expect(emailInput.getAttribute('aria-invalid')).toBe('true');
    expect(emailInput.getAttribute('aria-describedby')).toBe('email-error');
    expect(element.textContent).toContain('Enter a valid email address');
  });

  it('submits valid data and shows the success state', async () => {
    fillField('#firstName', 'Ada');
    fillField('#lastName', 'Lovelace');
    fillField('#email', 'ada@example.com');
    submitForm();
    await fixture.whenStable();

    const req = httpTesting.expectOne('/api/signup');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
    });

    req.flush({ ok: true });
    await fixture.whenStable();

    expect(element.textContent).toContain('signed up');
    expect(element.textContent).toContain('ada@example.com');
    expect(element.querySelector('form')).toBeNull();

    expect(document.activeElement?.id).toBe('signup-success-heading');
  });

  it('marks the submit button aria-disabled while the request is in flight', async () => {
    fillField('#firstName', 'Ada');
    fillField('#lastName', 'Lovelace');
    fillField('#email', 'ada@example.com');
    submitForm();
    await fixture.whenStable();

    const button = element.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(button.disabled).toBe(false);

    submitForm();
    await fixture.whenStable();

    httpTesting.expectOne('/api/signup').flush({ ok: true });
  });

  it('shows a retryable error state when the request fails', async () => {
    fillField('#firstName', 'Ada');
    fillField('#lastName', 'Lovelace');
    fillField('#email', 'ada@example.com');
    submitForm();
    await fixture.whenStable();

    httpTesting
      .expectOne('/api/signup')
      .flush('boom', { status: 500, statusText: 'Internal Server Error' });
    await fixture.whenStable();

    expect(element.querySelector('[role="alert"]')).not.toBeNull();

    submitForm();
    await fixture.whenStable();
    httpTesting.expectOne('/api/signup').flush({ ok: true });
    await fixture.whenStable();

    expect(element.textContent).toContain('signed up');
  });
});
