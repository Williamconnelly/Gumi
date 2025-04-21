import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApolloError, ApolloQueryResult, DocumentNode } from '@apollo/client';
import { batchArray } from '@gumi/common/functions';
import { IGetMediaByStaffVariables, IGetUserAnimeListVariables, IProgress, IStaffMapItem, IStaffMedia, IUserList, StaffMap } from '@gumi/common/models';
import {
  GET_MEDIA_BY_STAFF_IDS,
  GET_USER_ANIME_LIST,
  GET_USER_BY_ID,
  GET_USERS_BY_NAME,
  IGetMediaByStaffResult,
  IGetUserAnimeListResult,
  IGetUserByIdResult,
  IGetUsersByNameResult, IMediaEdge, IMediaList, IMediaListGroup, IStaff, IUserInformation
} from '@gumi/graphql';
import { Apollo } from 'apollo-angular';
import { concatMap, defer, finalize, from, interval, map, MonoTypeOperatorFunction, Observable, ObservableInput, Observer, of, reduce, retry, Subscription, take, takeWhile, tap, throwError, timer } from 'rxjs';
import { LoadingService } from '../loading-service';

@Injectable({
  providedIn: 'root',
})
export class QueryService {

  protected static readonly PAGE_SIZE: number = 50;

  protected static readonly CHUNK_SIZE: number = 500;

  protected static readonly RETRY_TIME: number = 35 * 1000;

  protected static readonly RETRY_COUNT: number = 3;

  protected readonly apollo: Apollo = inject(Apollo);

  protected readonly loading: LoadingService = inject(LoadingService);

  private _retrySubscription: Subscription | null = null;

  public getUsersByName(_userQuery: string): Observable<ApolloQueryResult<IGetUsersByNameResult>> {
    this.loading.startLoading({ message: 'Fetching Users' });

    return this._createRequest<IGetUsersByNameResult>(
      GET_USERS_BY_NAME, {
      perPage: QueryService.PAGE_SIZE,
      userName: _userQuery,
    }).pipe(
      finalize(() => this.loading.stopLoading())
    );
  }

  public getUserById(_userId: number): Observable<ApolloQueryResult<IGetUserByIdResult>> {
    this.loading.startLoading({ message: 'Fetching User' });

    return this._createRequest<IGetUserByIdResult>(
      GET_USER_BY_ID, {
      favoritePage: 1,
      perPage: QueryService.PAGE_SIZE,
      userId: _userId,
    }).pipe(
      tap(() => this.loading.stopLoading())
    );
  }

  public getMediaByStaffIds(_staffIds: number[]): Observable<StaffMap> {
    if (!_staffIds?.length)
      return of(new Map());

    const _progress: IProgress = { current: 0, total: _staffIds.length };

    this.loading.startLoading({ message: 'Fetching Staff Media' });

    return from(batchArray(_staffIds, QueryService.PAGE_SIZE)).pipe(
      concatMap((_staffBatch: number[]) => {
        return new Observable<StaffMap>((_observer: Observer<StaffMap>) => {
          this._fetchStaffMediaBatch(_observer, {
            mediaPage: 1,
            perPage: QueryService.PAGE_SIZE,
            staffIds: _staffBatch,
            staffPage: 1
          }, _progress);
        })
      }),
      reduce((_resultMap: StaffMap, _batchMap: StaffMap) => {
        _batchMap.forEach((_batchItem: IStaffMapItem, _staffId: number) => {
          if (!_resultMap.has(_staffId))
            _resultMap.set(_staffId, _batchItem);
        });

        return _resultMap;
      }, new Map()),
      tap(() => this.loading.stopLoading())
    )
  }

  private _fetchStaffMediaBatch(
    _observer: Observer<StaffMap>,
    _variables: IGetMediaByStaffVariables,
    _progress: IProgress,
    _staffMap: StaffMap = new Map()
  ): void {

    if (!_variables.staffIds.length) {
      _observer.next(_staffMap);
      _observer.complete();

      return;
    }

    this._createRequest<IGetMediaByStaffResult, IGetMediaByStaffVariables>(
      GET_MEDIA_BY_STAFF_IDS,
      _variables
    ).subscribe({
      next: (_queryResult: ApolloQueryResult<IGetMediaByStaffResult>) => {
        const _remainingStaffIds: number[] = [];

        _queryResult.data.Page.staff.forEach((_staff: IStaff) => {
          if (!_staffMap.has(_staff.id)) {
            _staffMap.set(_staff.id, {
              staffInfo: {
                primaryOccupations: _staff.primaryOccupations,
                staffId: _staff.id,
                staffImage: _staff.image,
                staffName: _staff.name
              },
              staffMedia: new Map()
            });
          }

          const _staffMediaMap: Map<number, IStaffMedia> = _staffMap.get(_staff.id)!.staffMedia;

          _staff.staffMedia.edges.forEach((_edge: IMediaEdge) => {
            if (!_staffMediaMap.has(_edge.node.id)) {
              _staffMediaMap.set(_edge.node.id, {
                malId: _edge.node.idMal,
                mediaFormat: _edge.node.format,
                mediaId: _edge.node.id,
                mediaImage: _edge.node.coverImage,
                mediaStatus: _edge.node.status,
                mediaTitle: _edge.node.title,
                roles: [_edge.staffRole],
                season: _edge.node.season,
                seasonYear: _edge.node.seasonYear,
                startDate: _edge.node.startDate
              });
            } else
              _staffMediaMap.get(_edge.node.id)!.roles.push(_edge.staffRole);
          });

          if (_staff.staffMedia.pageInfo.hasNextPage)
            _remainingStaffIds.push(_staff.id);
        });

        _progress.current += _variables.staffIds.length - _remainingStaffIds.length;
        this.loading.updateProgress(_progress, [{ message: `Fetching Staff Media: [${_progress.current} / ${_progress.total}]` }]);

        this._fetchStaffMediaBatch(_observer, {
          ..._variables,
          staffIds: _remainingStaffIds,
          mediaPage: _variables.mediaPage + 1
        }, _progress, _staffMap);
      },
      error: (_error: ApolloError) => _observer.error(_error)
    });
  }

  public getUserAnimeList(_userId: number): Observable<IUserList> {
    this.loading.startLoading({ message: 'Fetching Anime List' });

    return new Observable<IUserList>((_observer: Observer<IUserList>) => {
      this._getUserAnimeListPage(_observer, {
        chunk: 1,
        perChunk: QueryService.CHUNK_SIZE,
        type: 'ANIME',
        userId: _userId,
      });
    })
  }

  private _getUserAnimeListPage(
    _observer: Observer<IUserList>,
    _variables: IGetUserAnimeListVariables,
    _result?: IUserList
  ): void {
    this._createRequest<IGetUserAnimeListResult, IGetUserAnimeListVariables>(
      GET_USER_ANIME_LIST,
      _variables
    ).subscribe({
      next: (_queryResult: ApolloQueryResult<IGetUserAnimeListResult>) => {
        const _userInfo: IUserInformation = _queryResult.data.MediaListCollection.user;

        if (!_result) {
          _result = {
            avatar: _userInfo.avatar,
            favoriteStaff: [],
            mediaList: [],
            userId: _userInfo.id,
            userName: _userInfo.name,
          }
        }

        _result.favoriteStaff.push(..._userInfo.favourites.staff.edges.map(e => ({
          staffId: e.node.id,
          favoriteOrder: e.favouriteOrder
        })));

        _queryResult.data.MediaListCollection.lists.forEach((_listGroup: IMediaListGroup) => {
          _listGroup.entries.forEach((_list: IMediaList) => {
            _result!.mediaList.push({
              mediaId: _list.mediaId,
              score: _list.score,
              status: _list.status
            });
          });
        });

        if (_queryResult.data.MediaListCollection.hasNextChunk || _userInfo.favourites.staff.pageInfo.hasNextPage)
          this._getUserAnimeListPage(_observer, { ..._variables, chunk: _variables.chunk + 1 }, _result);
        else {
          this.loading.stopLoading();
          _observer.next(_result);
          _observer.complete();
        }
      },
      error: (_err: ApolloError) => _observer.error(_err)
    });
  }

  private _createRequest<T, V extends object = object>(_query: DocumentNode, _variables: V): Observable<ApolloQueryResult<T>> {
    return defer(() => this.apollo.watchQuery<T>({
      query: _query,
      variables: _variables
    }).valueChanges.pipe(
      take(1)
    )).pipe(
      this._retryRequest()
    )
  }

  private _retryRequest<T>(
    _retryCount: number = QueryService.RETRY_COUNT,
    _delay?: number | ((error: any, retryCount: number) => ObservableInput<number>)
  ): MonoTypeOperatorFunction<T> {
    if (!_delay) {
      const _maxRetry: number = QueryService.RETRY_COUNT;
      const _retryTime: number = QueryService.RETRY_TIME;

      _delay = (_error: ApolloError, _retryCount: number) => {
        if (this._isPrivateApiError(_error)) {
          this._retrySubscription?.unsubscribe();

          return throwError(() => new Error('PRIVATE_USER'));
        }

        this._retrySubscription?.unsubscribe();
        this._retrySubscription = interval(50).pipe(
          map((_interval: number) => (_retryTime) - _interval * 50),
          takeWhile((remaining: number) => remaining >= 0)
        ).subscribe({
          next: (_remaining: number) => {
            const _seconds: string = Math.floor(_remaining / 1000).toString();
            const _milliseconds: string = (_remaining % 1000).toString().padStart(3, '0');
            const _countdownDisplay: string = `${_seconds}.${_milliseconds}`;

            this.loading.setErrors({ message: 'AniList Error Occured', subMessages: [`Retrying [${_retryCount}/${_maxRetry}] in: ${_countdownDisplay}`] })
          }
        });

        return timer(_retryTime);
      }
    }

    return retry({
      count: _retryCount,
      delay: _delay
    });
  }

  private _isPrivateApiError(_error: ApolloError): boolean {
    const _errorMessage: string = (_error.cause as HttpErrorResponse)?.error?.errors?.[0]?.message;

    return _errorMessage === 'Private User';
  }

}
