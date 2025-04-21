import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ExpandableManagerService } from '@gumi/common/services';

@Component({
  selector: 'gumi-accordion',
  imports: [CommonModule],
  providers: [
    ExpandableManagerService
  ],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionComponent {

}
