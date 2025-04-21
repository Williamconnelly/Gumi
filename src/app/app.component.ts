import { ChangeDetectionStrategy, Component, computed, inject, signal, Signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Destroyer } from './common';
import { LoadingComponent, NavbarComponent } from './components';

@Component({
  selector: 'gumi-root',
  imports: [RouterOutlet, LoadingComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent extends Destroyer {

  protected readonly showNavbar: WritableSignal<boolean> = signal(true);

  protected readonly navbarHeight: number = 49;

  protected readonly contentHeight: Signal<string> = computed(() => `calc(100vh - ${this.navbarHeight}px)`);

  private _router: Router = inject(Router);

  constructor() {
    super();
    this._listenToRouter();
  }

  private _listenToRouter(): void {
    this._router.events.pipe(
      filter(_event => _event instanceof NavigationEnd),
      this.takeUntilDestroyed()
    ).subscribe({
      next: () => {
        const _currentRoute: ActivatedRoute | null = this._router.routerState.root.firstChild;

        this.showNavbar.set(_currentRoute?.snapshot.data['showNavbar'] !== false);
      }
    });
  }

}
