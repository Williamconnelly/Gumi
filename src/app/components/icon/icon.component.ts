import { CommonModule } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';
import { EIconTypes } from '@gumi/common/enums';

@Component({
  selector: 'gumi-icon',
  imports: [CommonModule],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.css'
})
export class IconComponent {

  public readonly type: InputSignal<number> = input<number>(0);

  public readonly size: InputSignal<string> = input('24');

  public readonly color: InputSignal<string> = input('currentColor');

  protected Icon: typeof EIconTypes = EIconTypes;

}
