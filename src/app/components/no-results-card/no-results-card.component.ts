import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { EIconTypes } from '@gumi/common/enums';
import { IErrorMessage } from '@gumi/common/models';
import { IconComponent } from '../icon';

@Component({
  selector: 'gumi-no-results-card',
  imports: [CommonModule, IconComponent],
  templateUrl: './no-results-card.component.html',
  styleUrl: './no-results-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoResultsCardComponent {

  public message: InputSignal<IErrorMessage> = input<IErrorMessage>({
    message: 'No Results Found',
  });

  protected readonly errorIconType: EIconTypes = EIconTypes.ERROR;

}
