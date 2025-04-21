import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ExpandableManagerService {

  private readonly _activeExpandableId: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  public get activeExpandableId(): string | null {
    return this._activeExpandableId.value;
  }

  public toggleExpandable(_expandableId: string): void {
    this._activeExpandableId.next(this.activeExpandableId === _expandableId ? null : _expandableId);
  }

  public openExpandable(_expandableId: string): void {
    this._activeExpandableId.next(_expandableId);
  }

  public closeAll(): void {
    this._activeExpandableId.next(null);
  }

  public isExpanded(_expandableId: string): boolean {
    return this.activeExpandableId === _expandableId;
  }

  public expandableChanges(): Observable<string | null> {
    return this._activeExpandableId.asObservable()
  }

}