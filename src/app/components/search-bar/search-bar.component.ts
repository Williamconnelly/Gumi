import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'gumi-search-bar',
  imports: [FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBarComponent {

  @Output()
  public readonly userSubmit: EventEmitter<string> = new EventEmitter();

  protected searchQuery: string = '';

  protected onSearch(): void {
    this.userSubmit.emit(this.searchQuery);
  }

}
