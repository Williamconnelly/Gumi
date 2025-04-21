import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EIconTypes } from '@gumi/common/enums';
import { IconComponent } from '../icon';

@Component({
  selector: 'gumi-input',
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent<T = string> {

  @Input()
  public value?: T;

  @Input()
  public placeholder?: string;

  @Output()
  public readonly valueChange: EventEmitter<T> = new EventEmitter();

  @Output()
  public readonly valueSubmit: EventEmitter<T> = new EventEmitter();

  protected cancelIconType: EIconTypes = EIconTypes.CANCEL;

  protected onInputChange(_event: Event): void {
    const _value: string = (_event.target as HTMLInputElement).value;

    this.valueChange.emit(_value as unknown as T);
  }

  protected onSubmit(): void {
    this.valueSubmit.emit(this.value);
  }

  protected onClear(): void {
    this.value = '' as T;
    this.valueChange.emit(this.value);
  }
}