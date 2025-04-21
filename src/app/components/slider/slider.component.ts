import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { EIconTypes } from '@gumi/common/enums';
import { IconComponent } from '../icon';
import { ISliderRange } from './interfaces';

@Component({
  selector: 'gumi-slider',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IconComponent
  ],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderComponent implements OnInit, AfterViewInit {

  @Input()
  public title: string = '';

  @Input()
  public sliderRange!: ISliderRange;

  @Input()
  public value!: ISliderRange;

  @Output()
  public valueChanged: EventEmitter<ISliderRange> = new EventEmitter();

  protected readonly formBuilder: FormBuilder = inject(FormBuilder);

  protected minValueControl: FormControl<number | null> = this.formBuilder.control(0);

  protected maxValueControl: FormControl<number | null> = this.formBuilder.control(0);

  protected leftPosition: number = 0;

  protected rightPosition: number = 0;

  protected readonly cancelIconType: EIconTypes = EIconTypes.CANCEL;

  protected readonly showResetButton: WritableSignal<boolean> = signal(false);

  private _initialRange!: ISliderRange

  public ngOnInit(): void {
    if (!this.sliderRange)
      return;

    if (!this.value)
      this.value = { ...this.sliderRange };

    this._initialRange = {
      minValue: this.value?.minValue || this.sliderRange.minValue,
      maxValue: this.value?.maxValue || this.sliderRange.maxValue
    }

    this.minValueControl.setValue(this._initialRange.minValue);
    this.maxValueControl.setValue(this._initialRange.maxValue);
  }

  public ngAfterViewInit(): void {
    this.calculatePositions();
  }

  protected onSliderChange(_slider: 'min' | 'max'): void {
    const _startValue: number = this.minValueControl.value ?? this.sliderRange.minValue;
    const _endValue: number = this.maxValueControl.value ?? this.sliderRange.maxValue;

    if (_slider === 'min') {
      if (_startValue > _endValue)
        this.minValueControl.setValue(_endValue);
    } else {
      if (_endValue < _startValue)
        this.maxValueControl.setValue(_startValue);
    }

    this.showResetButton.set(!this._hasInitialValues());
    this.calculatePositions();
    this.emitValue();
  }

  protected calculatePositions(): void {
    const _totalRange: number = this.sliderRange.maxValue - this.sliderRange.minValue;

    if (_totalRange > 0) {
      this.leftPosition = ((this.minValueControl.value! - this.sliderRange.minValue) / _totalRange) * 100;
      this.rightPosition = ((this.sliderRange.maxValue - this.maxValueControl.value!) / _totalRange) * 100;
    }
  }

  protected emitValue(): void {
    this.valueChanged.emit({
      minValue: this.minValueControl.value!,
      maxValue: this.maxValueControl.value!
    });
  }

  public resetValues(): void {
    this.minValueControl.setValue(this._initialRange.minValue);
    this.maxValueControl.setValue(this._initialRange.maxValue);
    this.calculatePositions();
    this.emitValue();
  }

  private _hasInitialValues(): boolean {
    return (
      this.minValueControl.value === this._initialRange.minValue &&
      this.maxValueControl.value === this._initialRange.maxValue
    );
  }

}
