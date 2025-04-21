import { DestroyRef, Directive, inject, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, pipe, Subject, take, takeUntil, UnaryFunction } from 'rxjs';

@Directive()
export abstract class Destroyer implements OnDestroy {

  public readonly destroyed$: Subject<boolean> = new Subject();

  protected isDestroyed: boolean = false;

  protected readonly destroyRef: DestroyRef = inject(DestroyRef);

  public takeUntilDestroyed<T>(
    _destroyTrigger: Observable<any> = this.destroyed$
  ): UnaryFunction<Observable<T>, Observable<T>> {
    return pipe(takeUntil(_destroyTrigger));
  }

  public takeOneUntilDestroyed<T>(): UnaryFunction<
    Observable<T>,
    Observable<T>
  > {
    return pipe(this.takeUntilDestroyed(), take(1));
  }

  public ngTakeUntilDestroyed<T>(): UnaryFunction<
    Observable<T>,
    Observable<T>
  > {
    return takeUntilDestroyed(this.destroyRef);
  }

  public ngOnDestroy(): void {
    this.destroy();
  }

  protected destroy(): void {
    if (this.isDestroyed) return;

    this.isDestroyed = true;

    if (!this.destroyed$.closed) {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    }
  }
}
