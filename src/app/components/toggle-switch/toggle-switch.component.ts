import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, input, Input, InputSignal, Output } from '@angular/core';

@Component({
  selector: 'gumi-toggle-switch',
  imports: [CommonModule],
  templateUrl: './toggle-switch.component.html',
  styleUrl: './toggle-switch.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleSwitchComponent {

  @Input()
  public checked: boolean = false;

  public readonly label: InputSignal<string> = input('');

  protected readonly inputId: string = `toggle-${Math.random().toString(36).substring(2, 8)}`;

  @Input()
  public disabled: boolean = false;

  @Output()
  public readonly checkedChange: EventEmitter<boolean> = new EventEmitter();

  protected onToggleChange(event: Event): void {
    const _isChecked: boolean = (event.target as HTMLInputElement).checked;

    this.checked = _isChecked;
    this.checkedChange.emit(_isChecked);
  }

}
