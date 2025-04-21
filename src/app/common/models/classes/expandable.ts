import { ChangeDetectorRef, Directive, inject, Input, OnInit } from '@angular/core';
import { Destroyer, ExpandableManagerService } from '../..';
import { IExpandable } from '../interfaces/expandable.interface';

@Directive()
export abstract class Expandable extends Destroyer implements IExpandable, OnInit {

  @Input()
  public isExpanded: boolean = false;

  public id: string = crypto.randomUUID();

  protected readonly expandableManager: ExpandableManagerService = inject(ExpandableManagerService);

  protected readonly changeDetector: ChangeDetectorRef = inject(ChangeDetectorRef);

  public ngOnInit(): void {
    if (this.isExpanded)
      this.expandableManager.openExpandable(this.id);

    this.expandableManager.expandableChanges().pipe(
      this.takeUntilDestroyed()
    ).subscribe({
      next: (_expandableId: string | null) => {
        this.isExpanded = this.id === _expandableId
        this.changeDetector.detectChanges();
      }
    });
  }

  public toggleExpanded(): void {
    this.expandableManager.toggleExpandable(this.id);
  };

}