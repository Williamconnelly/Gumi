import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { EIconTypes } from '@gumi/common/enums';
import { Expandable, IProductionFeedItem } from '@gumi/common/models';
import { EMediaFormat, EMediaStatus } from '@gumi/graphql';
import { IconComponent } from '../icon';
import { MediaSeasonDisplayPipe } from './pipes';

@Component({
  selector: 'gumi-production-card',
  imports: [CommonModule, MediaSeasonDisplayPipe, IconComponent],
  templateUrl: './production-card.component.html',
  styleUrl: './production-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductionCardComponent extends Expandable implements OnInit {

  protected static readonly UNKNOWN_VALUE: string = 'Unknown';

  @Input()
  public item!: IProductionFeedItem;

  @Input()
  public isIgnored: boolean = false;

  @Input()
  public isListed: boolean = false;

  @Output()
  public readonly ignoreToggled: EventEmitter<boolean> = new EventEmitter();

  @Output()
  public readonly staffSelected: EventEmitter<string> = new EventEmitter();

  @Output()
  public readonly mediaSelected: EventEmitter<string> = new EventEmitter();

  protected readonly roles: WritableSignal<string[]> = signal([]);

  protected readonly mediaTitle: WritableSignal<string> = signal('');

  protected readonly staffName: WritableSignal<string> = signal('');

  protected readonly premiereDate: WritableSignal<string> = signal('');

  protected readonly alternativeTitles: WritableSignal<string[]> = signal([]);

  protected readonly mediaDetails: WritableSignal<string> = signal('');

  protected readonly calendarIconType: EIconTypes = EIconTypes.CALENDAR;

  protected readonly checkIconType: EIconTypes = EIconTypes.CHECK;

  protected readonly plusIconType: EIconTypes = EIconTypes.PLUS;

  protected readonly cancelIconType: EIconTypes = EIconTypes.CANCEL;

  protected readonly linkIconType: EIconTypes = EIconTypes.LINK;

  protected readonly chevronDownType: EIconTypes = EIconTypes.CHEVRON_DOWN;

  protected readonly chevronUpType: EIconTypes = EIconTypes.CHEVRON_UP;

  public override ngOnInit(): void {
    super.ngOnInit();

    if (this.item)
      this._initializeCard();
  }

  private _initializeCard(): void {
    this.roles.set(this.item.roles);
    this.mediaTitle.set(this.getMediaTitle());
    this.staffName.set(this.getStaffName());
    this.premiereDate.set(this.getPremiereDate());
    this.alternativeTitles.set(this.getAlternativeTitles());
    this.mediaDetails.set(this.getMediaDetails());
  }

  protected getMediaTitle(): string {
    return this.item.mediaTitle.english
      || this.item.mediaTitle.romaji
      || this.item.mediaTitle.native
      || 'Untitled';
  }

  protected getStaffName(): string {
    return this.item.staffName.full
      || this.item.staffName.native
      || ProductionCardComponent.UNKNOWN_VALUE;
  }

  protected onIgnoreToggle(_isIgnored: boolean): void {
    this.ignoreToggled.emit(_isIgnored);
  }

  protected getAlternativeTitles(): string[] {
    const _alternativeTitles: Set<string> = new Set();

    for (const _title of [
      this.item.mediaTitle.romaji,
      this.item.mediaTitle.english,
      this.item.mediaTitle.native
    ]) {
      if (_title && _title !== this.mediaTitle() && !_alternativeTitles.has(_title))
        _alternativeTitles.add(_title);
    }

    return [..._alternativeTitles];
  }

  protected getPremiereDate(): string {
    const { year: _year, month: _month, day: _day } = this.item.startDate;

    if (!_year || !_month || !_day)
      return 'Unknown Date';

    const _date: Date = new Date(_year, _month - 1, _day);

    return _date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  protected getMediaDetails(): string {
    let _details: string = '';
    const _status: string = this.item.mediaStatus ? EMediaStatus.toDisplay(this.item.mediaStatus!) : '';
    const _format: string = this.item.mediaFormat ? EMediaFormat.toDisplay(this.item.mediaFormat!) : '';

    if (_status)
      _details += _status;

    if (_format)
      _details += _status ? ` (${_format})` : ` ${_format}`;

    return _details || ProductionCardComponent.UNKNOWN_VALUE;
  }

  protected selectStaff(_staffName: string): void {
    this.staffSelected.emit(_staffName);
  }

  protected selectMedia(_mediaTitle: string): void {
    this.mediaSelected.emit(_mediaTitle);
  }

}
