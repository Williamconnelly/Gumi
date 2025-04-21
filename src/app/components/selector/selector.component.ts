import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, signal, SimpleChanges, WritableSignal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Destroyer } from '@gumi/common/models';
import { Subscription } from 'rxjs';
import { ISelectionOption } from './interfaces';

@Component({
  selector: 'gumi-selector',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectorComponent<T> extends Destroyer implements OnInit, OnChanges {

  @Input()
  public options: ISelectionOption<T>[] = [];

  @Input()
  public title?: string;

  @Input()
  public isMultiselect?: boolean = true;

  @Input()
  public enableSelectAll?: boolean = false;

  @Input()
  public selectedIds: (string | number)[] = [];

  @Output()
  public readonly selectionChange: EventEmitter<T[]> = new EventEmitter();

  @Output()
  public readonly singleSelectionChange: EventEmitter<T> = new EventEmitter();

  private _valueSubscription!: Subscription;

  protected get formOptions(): FormArray {
    return this.form.get('options') as FormArray;
  }

  protected readonly formBuilder: FormBuilder = inject(FormBuilder);

  protected form!: FormGroup;

  protected allSelected: WritableSignal<boolean> = signal(false);

  public ngOnInit(): void {
    this.initializeForm();
  }

  public ngOnChanges(_changes: SimpleChanges): void {
    if (_changes['options'] || _changes['selectedIds'])
      this.initializeForm();
  }

  protected initializeForm(): void {
    if (this.isMultiselect) {
      const _formControls: FormControl<boolean | null>[] = this.options.map((_option: ISelectionOption) => {
        return this.formBuilder.control(this.selectedIds.includes(_option.id));
      });

      this.form = this.formBuilder.group({
        options: this.formBuilder.array(_formControls)
      });

      this.updateAllSelectedState();
      this.listenForChanges();
    } else {
      const _selectedOption: ISelectionOption | undefined = this.options.find(option => this.selectedIds.includes(option.id));

      this.form = this.formBuilder.group({
        selectedOption: [_selectedOption?.id || this.options[0].id || null]
      });

      this.form.get('selectedOption')?.valueChanges.pipe(
        this.takeUntilDestroyed()
      ).subscribe({
        next: (_value: any) => this.emitSingleSelectionChange(_value)
      });
    }
  }

  protected listenForChanges(): void {
    this._valueSubscription?.unsubscribe();
    this._valueSubscription = this.formOptions.valueChanges.pipe(
      this.takeUntilDestroyed()
    ).subscribe({
      next: () => {
        this.updateAllSelectedState();
        this.emitSelectionChange();
      }
    })
  }

  protected getFormControl(_index: number): FormControl {
    return this.formOptions.at(_index) as FormControl;
  }

  protected toggleSelectAll(): void {
    this.formOptions.controls.forEach((_control: AbstractControl) => {
      _control.setValue(!this.allSelected);
    });
  }

  protected updateAllSelectedState(): void {
    if (!this.formOptions)
      return;

    this.allSelected.set(this.formOptions.controls.every((_control: AbstractControl) => _control.value));
  }

  protected emitSelectionChange(): void {
    const _selectedOptions: ISelectionOption<T>[] = this.options.filter((_option: ISelectionOption, _index: number) =>
      this.formOptions.at(_index).value
    );

    this.selectionChange.emit(_selectedOptions.map(o => o.value));
  }

  protected emitSingleSelectionChange(_selectedId: string | number): void {
    const _selectedOption: ISelectionOption | undefined = this.options.find(option => option.id === _selectedId);

    if (_selectedOption)
      this.singleSelectionChange.emit(_selectedOption.value);
  }

  public reset(): void {
    if (this.isMultiselect) {
      this.formOptions.controls.forEach((control: AbstractControl) => {
        control.setValue(false);
      });
      this.allSelected.set(false);
    } else {
      const _selectedOption: ISelectionOption | undefined = this.options.find(option => option.id === this.options[0]?.id);

      this.form.get('selectedOption')?.setValue(_selectedOption?.id || null);
    }
  }

}