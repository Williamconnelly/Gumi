import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RouterModule } from '@angular/router';
import { ApolloQueryResult } from '@apollo/client';
import { Destroyer } from '@gumi/common/models';
import { LoadingService, QueryService } from '@gumi/common/services';
import { ErrorCardComponent, NoResultsCardComponent, SearchBarComponent } from '@gumi/components';
import { IGetUsersByNameResult, IUserInformation } from '@gumi/graphql';
import { finalize, take } from 'rxjs';

@Component({
  selector: 'gumi-user-results',
  imports: [CommonModule, SearchBarComponent, RouterModule, NoResultsCardComponent, ErrorCardComponent],
  templateUrl: './user-results.component.html',
  styleUrl: './user-results.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserResultsComponent extends Destroyer implements OnInit {

  protected readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  protected readonly queryService: QueryService = inject(QueryService);

  protected readonly router: Router = inject(Router);

  protected readonly loading: LoadingService = inject(LoadingService);

  protected userQuery: string | null = null;

  protected readonly userResults: WritableSignal<IUserInformation[] | null> = signal(null);

  protected readonly hasError: WritableSignal<boolean> = signal(false);

  public ngOnInit(): void {
    this._listenToRouteParams();
  }

  protected getResults(): void {
    const _trimmedQuery: string | undefined = this.userQuery?.trim();

    if (!_trimmedQuery)
      return;

    this.queryService.getUsersByName(_trimmedQuery).pipe(
      take(1),
      finalize(() => this.loading.stopLoading())
    ).subscribe({
      next: ((_result: ApolloQueryResult<IGetUsersByNameResult>) => {
        const _userResults: IUserInformation[] = _result.data.users.results;

        // TODO: Fix Navigation Loop
        // if (_userResults.length === 1) {
        //   this.onUserSelect(_userResults[0]);

        //   return;
        // }

        this.userResults.set(_userResults);
      }),
      error: () => {
        this.userResults.set([]);
        this.hasError.set(true);
      }
    })
  }

  protected onSearch(_searchQuery: string): void {
    if (_searchQuery.trim())
      this.router.navigate(['/search', _searchQuery.trim()]);
  }

  protected onUserSelect(_userInfo: IUserInformation): void {
    this.router.navigate(['/feed', _userInfo.id], { state: { userInfo: _userInfo } });
  }

  private _listenToRouteParams(): void {
    this.activatedRoute.paramMap.pipe(
      this.takeUntilDestroyed()
    ).subscribe({
      next: (_params: ParamMap) => {
        this.userQuery = _params.get('query');
        this.getResults();
      }
    });
  }

}
