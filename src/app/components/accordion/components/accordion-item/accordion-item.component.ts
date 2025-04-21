import { CommonModule } from '@angular/common';
import {
  AfterViewInit, ChangeDetectionStrategy,
  Component, ElementRef, EventEmitter, inject, Input, OnDestroy, OnInit, Output, signal, ViewChild,
  WritableSignal
} from '@angular/core';
import { Expandable } from '@gumi/common/models';
import { MediaFeedFilterService } from '@gumi/common/services';

@Component({
  selector: 'gumi-accordion-item',
  imports: [CommonModule],
  templateUrl: './accordion-item.component.html',
  styleUrl: './accordion-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionItemComponent extends Expandable implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('content')
  protected contentRef!: ElementRef;

  @ViewChild('contentWrapper')
  protected wrapperRef!: ElementRef;

  @Input()
  public label!: string;

  @Input()
  public showCancelIcon: boolean = false;

  @Output()
  public cancelClicked: EventEmitter<void> = new EventEmitter<void>();

  protected readonly filterService: MediaFeedFilterService = inject(MediaFeedFilterService);

  protected readonly contentHeight: WritableSignal<number> = signal(0);

  private _observer!: MutationObserver;

  public ngAfterViewInit(): void {
    this.updateContentHeight();

    this._observer = new MutationObserver(() => this.updateContentHeight());

    if (this.contentRef && this.contentRef.nativeElement) {
      this._observer.observe(this.contentRef.nativeElement, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
      });
    }
  }

  protected updateContentHeight(): void {
    if (this.contentRef && this.contentRef.nativeElement)
      this.contentHeight.set(this.contentRef.nativeElement.scrollHeight)
  }

  protected onButtonClick(_event: MouseEvent): void {
    _event.stopPropagation();

    if (this.showCancelIcon)
      this.cancelClicked.emit();
    else
      this.toggleExpanded();
  }

  public override ngOnDestroy(): void {
    super.ngOnDestroy();
    this._observer?.disconnect();
  }

}
