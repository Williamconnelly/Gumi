import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ILoadingState } from '@gumi/common/models';
import { LoadingService } from '@gumi/common/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'gumi-loading',
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingComponent {

  protected readonly loadingService: LoadingService = inject(LoadingService);

  protected get loading$(): Observable<ILoadingState> {
    return this.loadingService.loading$;
  }

}
