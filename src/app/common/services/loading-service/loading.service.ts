import { Injectable } from '@angular/core';
import { ILoadingMessage, ILoadingState, IProgress } from '@gumi/common/models';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private readonly _loading: BehaviorSubject<ILoadingState> = new BehaviorSubject<ILoadingState>({ isLoading: false });

  public loading$: Observable<ILoadingState> = this._loading.asObservable();

  public startLoading(..._messages: ILoadingMessage[]): void {
    this._loading.next({ isLoading: true, messages: _messages });
  }

  public updateProgress(_progress: IProgress, _messages?: ILoadingMessage[]): void {
    const _currentState: ILoadingState = this._loading.getValue();

    this._loading.next({
      ..._currentState,
      progress: (_progress.current / _progress.total) * 100,
      messages: _messages || _currentState.messages,
      errors: undefined
    });
  }

  public setMessages(..._messages: ILoadingMessage[]): void {
    this._loading.next({
      ...this._loading.getValue(),
      messages: _messages,
      errors: undefined
    });
  }

  public setErrors(..._errors: ILoadingMessage[]): void {
    this._loading.next({
      ...this._loading.getValue(),
      errors: _errors
    });
  }

  public stopLoading(): void {
    this._loading.next({ isLoading: false });
  }
}
