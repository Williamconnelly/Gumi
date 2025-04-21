import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { isNullOrUndefined } from '@gumi/common/functions';
import { IUserInformation } from '@gumi/graphql';
import { filter, take } from 'rxjs';

@Component({
  selector: 'gumi-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class NavbarComponent implements OnInit {

  protected userId: number | null = null;

  private _router: Router = inject(Router);

  public ngOnInit(): void {
    const _userInfo: IUserInformation = history?.state?.userInfo;

    if (_userInfo)
      this.userId = _userInfo.id;
    else {
      this._router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        take(1),
      ).subscribe({
        next: () => {
          const _userIdParam: string | null | undefined = this._router.routerState.root.firstChild?.snapshot.paramMap.get('userId');

          if (!isNullOrUndefined(_userIdParam) && !isNaN(+_userIdParam))
            this.userId = +_userIdParam;
        }
      });
    }
  }

}
