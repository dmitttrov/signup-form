import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ui-alert',
  templateUrl: './ui-alert.html',
  styleUrl: './ui-alert.scss',
})
export class UiAlert {}
