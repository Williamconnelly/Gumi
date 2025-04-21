import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApolloError } from '@apollo/client';
import { EIconTypes, EUserFeedFilterOption } from '@gumi/common/enums';
import { getProductionItemDateTime, isNullOrUndefined } from '@gumi/common/functions';
import { Destroyer, FeedFilter, IErrorMessage, IMediaFeedFilter, IProductionFeedItem, IStaffMapItem, IStaffMedia, IUserList, StaffMap } from '@gumi/common/models';
import { IsNullOrUndefinedPipe } from '@gumi/common/pipes';
import { ExpandableManagerService, LoadingService, MediaFeedFilterService, QueryService, UserStorageService } from '@gumi/common/services';
import { USER_ID } from '@gumi/common/tokens';
import { AccordionComponent, AccordionItemComponent, ErrorCardComponent, IconComponent, InputComponent, ISelectionOption, ISliderRange, NoResultsCardComponent, ProductionCardComponent, SelectorComponent, SliderComponent, ToggleSwitchComponent } from '@gumi/components';
import { EMediaFormat, EMediaSeason, EMediaStatus, IUserInformation } from '@gumi/graphql';
import { switchMap, take } from 'rxjs';
import { IsActiveFilterPipe, IsInIgnoreListPipe, IsInUserListPipe } from './pipes';

@Component({
  selector: 'gumi-media-feed',
  imports: [
    AccordionComponent,
    AccordionItemComponent,
    CommonModule,
    ErrorCardComponent,
    FormsModule,
    IconComponent,
    InputComponent,
    IsActiveFilterPipe,
    IsInIgnoreListPipe,
    IsInUserListPipe,
    NoResultsCardComponent,
    ProductionCardComponent,
    ScrollingModule,
    SelectorComponent,
    SliderComponent,
    ToggleSwitchComponent,
    IsNullOrUndefinedPipe
  ],
  providers: [
    ExpandableManagerService,
    MediaFeedFilterService,
    {
      provide: USER_ID,
      useFactory: (route: ActivatedRoute) => {
        return Number(route.snapshot.params['userId']);
      },
      deps: [ActivatedRoute]
    },
    UserStorageService
  ],
  templateUrl: './media-feed.component.html',
  styleUrl: './media-feed.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaFeedComponent extends Destroyer implements OnInit, AfterViewInit {

  @ViewChild(CdkVirtualScrollViewport)
  protected viewport!: CdkVirtualScrollViewport;

  @ViewChild('UserListSelector')
  protected userListSelector!: SelectorComponent<string>;

  @ViewChild('FormatSelector')
  protected formatSelector!: SelectorComponent<string>;

  @ViewChild('StatusSelector')
  protected statusSelector!: SelectorComponent<string>;

  @ViewChild('SeasonSelector')
  protected seasonSelector!: SelectorComponent<string>;

  @ViewChild('OccupationSelector')
  protected occupationSelector!: SelectorComponent<string>;

  protected static readonly FALLBACK_YEAR: number = 1950;

  protected readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  protected readonly changeDetector: ChangeDetectorRef = inject(ChangeDetectorRef);

  protected readonly filterService: MediaFeedFilterService = inject(MediaFeedFilterService);

  protected readonly queryService: QueryService = inject(QueryService);

  protected readonly router: Router = inject(Router);

  protected readonly userStorage: UserStorageService = inject(UserStorageService);

  protected readonly errorIconType: EIconTypes = EIconTypes.ERROR;

  protected readonly linkIconType: EIconTypes = EIconTypes.LINK;

  protected userId: number | null = null;

  protected userList: WritableSignal<IUserList | null> = signal(null);

  protected userInfo!: IUserInformation;

  protected userFavoriteStaffIds: number[] | null = null;

  protected userMediaListIds: number[] | null = null;

  protected userIgnoredIds: number[] = [];

  protected staffMap: StaffMap = new Map();

  protected staffNameQuery: string = '';

  protected mediaTitleQuery: string = '';

  protected creditsQuery: string = '';

  protected productionFeed: WritableSignal<IProductionFeedItem[] | null> = signal(null);

  protected filters: Map<string, FeedFilter> = new Map();

  protected userFeedFilterSelection: EUserFeedFilterOption = EUserFeedFilterOption.SHOW_ALL;

  protected showIgnoredItems: boolean = false;

  protected loading: LoadingService = inject(LoadingService);

  protected errorMessage: WritableSignal<IErrorMessage | null> = signal(null);

  protected readonly noResultsMessage: IErrorMessage = {
    message: 'No Staff Favorites Found',
    subMessage: 'Unable to create Production Feed. Please add favorites on AniList.'
  }

  protected readonly formatOptions: ISelectionOption<EMediaFormat>[] = EMediaFormat.getArray().map((_format: string, i: number) => ({
    display: _format,
    id: i.toString(),
    value: EMediaFormat.fromDisplay(_format),
  }));

  protected readonly statusOptions: ISelectionOption<EMediaStatus>[] = EMediaStatus.getArray().map((_status: string, i: number) => ({
    display: _status,
    id: i.toString(),
    value: EMediaStatus.fromDisplay(_status),
  }));

  protected readonly seasonOptions: ISelectionOption<EMediaSeason>[] = EMediaSeason.getArray().map((_season: string, i: number) => ({
    display: _season,
    id: i.toString(),
    value: EMediaSeason.fromDisplay(_season)
  }));

  protected readonly userListOptions: ISelectionOption<EUserFeedFilterOption>[] = EUserFeedFilterOption.getArray().map((_optionValue: EUserFeedFilterOption, i: number) => ({
    display: EUserFeedFilterOption.toDisplay(_optionValue),
    id: i.toString(),
    value: _optionValue
  }))

  protected yearSliderRange!: ISliderRange;

  protected occupationOptions: ISelectionOption<string>[] = [];

  protected readonly activeFilterProperties: WritableSignal<Set<keyof IMediaFeedFilter>> = signal(new Set());

  public ngOnInit(): void {
    const _userInfo: IUserInformation = history?.state?.userInfo;

    if (_userInfo)
      this.userId = _userInfo.id;
    else {
      const _userIdParam: string | null = this.activatedRoute.snapshot.paramMap.get('userId');

      if (!isNullOrUndefined(_userIdParam) && !isNaN(+_userIdParam))
        this.userId = +_userIdParam;
      else
        return;
    }

    this.listenToFilters();
    this.listenToIgnoreList();
    this.initializeMediaFeed();
  }

  public ngAfterViewInit(): void {
    this._listenToFilteredData();
  }

  protected listenToFilters(): void {
    this.filterService.filters$.pipe(
      this.takeUntilDestroyed()
    ).subscribe({
      next: (_filter: IMediaFeedFilter) => {
        const _activeFilterProperties: Set<keyof IMediaFeedFilter> = new Set<keyof IMediaFeedFilter>();

        (Object.keys(_filter) as (keyof IMediaFeedFilter)[]).forEach((_key: keyof IMediaFeedFilter) => {
          const _filterValue: any = _filter[_key];

          if (_filterValue !== null && _filterValue.length > 0)
            _activeFilterProperties.add(_key);
        });

        this.activeFilterProperties.set(_activeFilterProperties);
      }
    });
  }

  protected listenToIgnoreList(): void {
    this.userStorage.watchIgnoreList.pipe(
      this.takeUntilDestroyed()
    ).subscribe({
      next: (_ignoredIds: number[]) => {
        this.userIgnoredIds = _ignoredIds;
        this.filterService.updateFilter({ ignoredMediaIds: this.showIgnoredItems ? [] : this.userIgnoredIds });
      }
    });
  }

  protected initializeMediaFeed(): void {
    this.queryService.getUserAnimeList(this.userId as number).pipe(
      take(1),
      switchMap((_userList: IUserList) => {
        this.userList.set(_userList);
        this.userFavoriteStaffIds = _userList.favoriteStaff.map(s => s.staffId);
        this.userMediaListIds = _userList.mediaList.map(l => l.mediaId);

        return this.queryService.getMediaByStaffIds(this.userFavoriteStaffIds || []);
      }),
      take(1)
    ).subscribe({
      next: (_staffMap: StaffMap) => {
        this.staffMap = _staffMap;
        this.createProductionFeed();
      },
      error: (_error: ApolloError) => {
        this.loading.stopLoading();
        this.errorMessage.set({
          message: _error.message
        });
      }
    });
  }

  protected createProductionFeed(): void {
    let _productionItems: IProductionFeedItem[] = [];

    if (!this.staffMap.size) {
      this.productionFeed.set([]);

      return;
    }

    this.staffMap.forEach((_mapItem: IStaffMapItem, _staffId: number) => {
      _mapItem.staffMedia.forEach((_staffMedia: IStaffMedia, _mediaId: number) => {
        const _feedItem: IProductionFeedItem = {
          ..._mapItem.staffInfo,
          ..._staffMedia,
          guid: `${_staffId}-${_mediaId}`
        };

        _productionItems.push(_feedItem);
      });
    });

    _productionItems = _productionItems.sort((a, b) => {
      return getProductionItemDateTime(b) - getProductionItemDateTime(a);
    });

    const _occupations: Set<string> = new Set();

    _productionItems.forEach((_item: IProductionFeedItem) => {
      _item.primaryOccupations?.forEach((_occupation: string) => {
        if (!_occupations.has(_occupation))
          _occupations.add(_occupation);
      });
    });

    this.occupationOptions = [..._occupations].map((_occupation: string, i: number) => ({
      id: i.toString(),
      display: _occupation,
      value: _occupation
    }));

    const _earliestMedia: IProductionFeedItem = _productionItems[_productionItems.length - 1];
    const _earliestYear: number = _earliestMedia.seasonYear || _earliestMedia.startDate?.year || MediaFeedComponent.FALLBACK_YEAR;

    this.yearSliderRange = { minValue: _earliestYear, maxValue: new Date().getFullYear() + 1 };

    this.productionFeed.set(_productionItems);
    this.filterService.setData(this.productionFeed() || []);
  }

  protected trackById(_index: number, _item: IProductionFeedItem): string {
    return _item.guid;
  }

  protected onStaffNameFilter(_staffNameFilter: string): void {
    this.staffNameQuery = _staffNameFilter;
    this.filterService.updateFilter({ staffName: _staffNameFilter });
  }

  protected onMediaTitleFilter(_mediaTitleFilter: string): void {
    this.mediaTitleQuery = _mediaTitleFilter;
    this.filterService.updateFilter({ mediaTitle: _mediaTitleFilter });
  }

  protected onCreditsFilter(_creditsFilter: string): void {
    this.creditsQuery = _creditsFilter;
    this.filterService.updateFilter({ roleTitle: _creditsFilter });
  }

  protected onFormatFilter(_formats: EMediaFormat[]): void {
    this.filterService.updateFilter({ formats: _formats })
  }

  protected onStatusFilter(_statuses: EMediaStatus[]): void {
    this.filterService.updateFilter({ statuses: _statuses });
  }

  protected onSeasonFilter(_seasons: EMediaSeason[]): void {
    this.filterService.updateFilter({ seasons: _seasons });
  }

  protected onOccupationFilter(_occupations: string[]): void {
    this.filterService.updateFilter({ occupations: _occupations });
  }

  protected onUserListFilter(_filterOption: EUserFeedFilterOption): void {
    this.userFeedFilterSelection = _filterOption;
    this.filterService.updateFilter({ userListFilter: _filterOption === EUserFeedFilterOption.SHOW_ALL ? null : this.filterByUserList.bind(this) });
  }

  protected filterByUserList(_item: IProductionFeedItem): boolean {
    if (!this.userMediaListIds)
      return true;

    const _listContainsMedia: boolean = this.userMediaListIds.includes(_item.mediaId);

    if (this.userFeedFilterSelection === EUserFeedFilterOption.EXCLUDE_MEDIA_ON_LIST)
      return !_listContainsMedia;
    else
      return _listContainsMedia;
  }

  protected onYearRangeFilter(_range: ISliderRange): void {
    const _isDefaultRange: boolean = this.yearSliderRange.minValue === _range.minValue && this.yearSliderRange.maxValue === _range.maxValue;

    this.filterService.updateFilter({ yearRange: _isDefaultRange ? null : _range });
  }

  protected resetFilter(_filter: keyof IMediaFeedFilter): void {
    let _selector: SelectorComponent<any>;

    switch (_filter) {
      case ('userListFilter'):
        _selector = this.userListSelector;
        break;
      case ('formats'):
        _selector = this.formatSelector;
        break;
      case ('statuses'):
        _selector = this.statusSelector;
        break;
      case ('occupations'):
        _selector = this.occupationSelector;
        break;
      case ('seasons'):
        _selector = this.seasonSelector;
        break;
      default: return;
    }

    _selector.reset();
  }

  protected onIgnoreToggled(_isIgnored: boolean, _item: IProductionFeedItem): void {
    if (_isIgnored)
      this.userStorage.addToIgnoreList(this.userId!, _item.mediaId);
    else
      this.userStorage.removeFromIgnoreList(this.userId!, _item.mediaId);
  }

  protected toggleIgnoredItems(_showItems: boolean): void {
    this.showIgnoredItems = _showItems;
    this.filterService.updateFilter({ ignoredMediaIds: _showItems ? [] : this.userIgnoredIds });
  }

  protected clearIgnoreList(): void {
    const _confirmResponse: boolean = confirm('Are you sure you want to clear the Ignore List?');

    if (_confirmResponse) {
      this.userStorage.clearUserIgnoreList(this.userId!);
      this.showIgnoredItems = false;
    }
  }

  protected onStaffSelected(_staffName: string): void {
    if (_staffName === this.staffNameQuery)
      _staffName = '';

    this.staffNameQuery = _staffName;
    this.mediaTitleQuery = '';
    this.filterService.updateFilter({ staffName: _staffName, mediaTitle: '' });
  }

  protected onMediaSelected(_mediaTitle: string): void {
    if (_mediaTitle === this.mediaTitleQuery)
      _mediaTitle = '';

    this.mediaTitleQuery = _mediaTitle;
    this.staffNameQuery = '';
    this.filterService.updateFilter({ mediaTitle: _mediaTitle, staffName: '' });
  }

  private _listenToFilteredData(): void {
    this.filterService.filteredData$.pipe(
      this.takeUntilDestroyed()
    ).subscribe({
      next: () => this.viewport?.scrollToIndex(0)
    })
  }

}
