import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { EIconTypes } from '@gumi/common/enums';
import { IErrorMessage } from '@gumi/common/models';
import { IconComponent } from '../icon';

@Component({
  selector: 'gumi-error-card',
  imports: [IconComponent],
  templateUrl: './error-card.component.html',
  styleUrl: './error-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorCardComponent {

  public errorMessage: InputSignal<IErrorMessage> = input<IErrorMessage>({
    message: 'Error Loading Data',
    subMessage: 'An error occurred while fetching the data. Please try again.'
  });

  protected readonly errorIconType: EIconTypes = EIconTypes.ERROR;

  protected readonly retryIconType: EIconTypes = EIconTypes.RETRY;

  protected onRetry(): void {
    window.location.reload();
  }

}
