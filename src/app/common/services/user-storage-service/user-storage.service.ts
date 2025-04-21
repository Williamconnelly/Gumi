import { Inject, inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService, USER_ID } from '../..';

@Injectable()
export class UserStorageService {

  private readonly _storage: StorageService = inject(StorageService);

  private _userIgnoreList: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);

  private _userId!: number;

  constructor(@Inject(USER_ID) _userId: number) {
    this._userId = _userId;
    this._userIgnoreList.next(this.getIgnoreList(this._userId) || []);
  }

  public get watchIgnoreList(): Observable<number[]> {
    return this._userIgnoreList.asObservable();
  }

  protected getKey(_userId: number): string {
    return `ignoreList.${_userId}`;
  }

  public getIgnoreList(_userId: number): number[] {
    return this._storage.get<number[]>(this.getKey(_userId)) || [];
  }

  public addToIgnoreList(_userId: number, _mediaId: number): void {
    const _ignoreList: number[] = this.getIgnoreList(_userId);

    if (!_ignoreList.includes(_mediaId)) {
      const _newList: number[] = [..._ignoreList, _mediaId];

      this._storage.set(this.getKey(_userId), _newList);
      this._userIgnoreList.next(_newList);
    }
  }

  public removeFromIgnoreList(_userId: number, _mediaId: number): void {
    const _ignoreList: number[] = this.getIgnoreList(_userId).filter(id => id !== _mediaId);

    if (!_ignoreList.length)
      this.clearUserIgnoreList(_userId);
    else {
      this._storage.set(this.getKey(_userId), _ignoreList);
      this._userIgnoreList.next(_ignoreList);
    }

  }

  public toggleIgnore(_userId: number, _mediaId: number): void {
    const _ignoreList: number[] = this.getIgnoreList(_userId);

    if (_ignoreList.includes(_mediaId))
      this.removeFromIgnoreList(_userId, _mediaId);
    else
      this.addToIgnoreList(_userId, _mediaId);
  }

  public clearUserIgnoreList(_userId: number): void {
    const _userListKey: string = this.getKey(_userId);

    if (this._storage.get(_userListKey))
      this._storage.remove(_userListKey);

    this._userIgnoreList.next([]);
  }

}