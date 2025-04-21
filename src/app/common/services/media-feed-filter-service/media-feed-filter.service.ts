import { Injectable } from '@angular/core';
import { getProductionItemDateTime } from '@gumi/common/functions';
import { IMediaFeedFilter, IProductionFeedItem } from '@gumi/common/models';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

@Injectable()
export class MediaFeedFilterService {

  private readonly _defaultFilters: IMediaFeedFilter = {
    staffName: '',
    mediaTitle: '',
    roleTitle: '',
    yearRange: null,
    userListFilter: null,
    formats: [],
    statuses: [],
    seasons: [],
    occupations: [],
    ignoredMediaIds: []
  };

  private readonly _filters: BehaviorSubject<IMediaFeedFilter> = new BehaviorSubject<IMediaFeedFilter>(this._defaultFilters);

  public filters$: Observable<IMediaFeedFilter> = this._filters.asObservable();

  private readonly _data: BehaviorSubject<IProductionFeedItem[]> = new BehaviorSubject<IProductionFeedItem[]>([]);

  public filteredData$: Observable<IProductionFeedItem[]> = combineLatest([
    this._data.asObservable(),
    this.filters$
  ]).pipe(
    map(([_data, _filters]) => this._applyFilters(_data, _filters))
  );

  public setData(_data: IProductionFeedItem[]): void {
    this._data.next(_data);
  }

  public updateFilter(_filterUpdate: Partial<IMediaFeedFilter>): void {
    const _currentFilters: IMediaFeedFilter = this._filters.getValue();

    this._filters.next({
      ..._currentFilters,
      ..._filterUpdate
    });
  }

  public resetAllFilters(): void {
    this._filters.next(this._defaultFilters);
  }

  public resetFilter(_filter: keyof IMediaFeedFilter): void {
    this.updateFilter({ [_filter]: this._defaultFilters[_filter] });
  }

  private _applyFilters(_data: IProductionFeedItem[], _filters: IMediaFeedFilter): IProductionFeedItem[] {
    return _data.filter((_item: IProductionFeedItem) => {
      if (_filters.ignoredMediaIds.includes(_item.mediaId))
        return false;

      if (_filters.statuses?.length && !_filters.statuses.includes(_item.mediaStatus))
        return false;

      if (_filters.formats?.length && !_filters.formats.includes(_item.mediaFormat))
        return false;

      if (_filters.seasons?.length && !_filters.seasons.includes(_item.season))
        return false;

      if (_filters.yearRange) {
        const _mediaYear: number = new Date(getProductionItemDateTime(_item)).getFullYear();
        let _maxYear: number = _filters.yearRange.maxValue;
        const _currentYear: number = new Date().getFullYear();

        if (_filters.yearRange.maxValue === _currentYear + 1)
          _maxYear = _currentYear + 2;

        if (_mediaYear < _filters.yearRange.minValue || _mediaYear > _maxYear)
          return false;
      }

      if (_filters.occupations?.length) {
        const _occupations: Set<string> = new Set(_filters.occupations.map(o => o.toLowerCase()));

        if (!_item.primaryOccupations.map(o => o.toLowerCase()).some(o => _occupations.has(o)))
          return false;
      }

      if (_filters.staffName) {
        const _staffNames: string[] = [
          _item.staffName.full,
          ...(_item.staffName.native ? [_item.staffName.native] : []),
          ..._item.staffName.alternative,
        ];

        if (!_staffNames.some((_staffName: string) => _staffName.toLowerCase().includes(_filters.staffName.toLowerCase())))
          return false;
      }

      if (_filters.mediaTitle) {
        const _mediaTitles: string[] = [
          _item.mediaTitle.romaji,
          ...(_item.mediaTitle.english ? [_item.mediaTitle.english] : []),
          ...(_item.mediaTitle.native ? [_item.mediaTitle.native] : []),
        ];

        if (!_mediaTitles.some((_staffName: string) => _staffName.toLowerCase().includes(_filters.mediaTitle.toLowerCase())))
          return false;
      }

      if (_filters.roleTitle) {
        if (!_item.roles.some((_role: string) => _role.toLowerCase().includes(_filters.roleTitle.toLowerCase())))
          return false;
      }

      if (_filters.userListFilter)
        return _filters.userListFilter(_item);

      return true;
    });
  }
}