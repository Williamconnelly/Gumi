import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SearchBarComponent } from '@gumi/components';

@Component({
  selector: 'gumi-home',
  imports: [
    CommonModule,
    SearchBarComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

  protected readonly router: Router = inject(Router);

  protected onSearch(_searchQuery: string): void {
    const _trimmedQuery: string = _searchQuery.trim();

    if (_trimmedQuery)
      this.router.navigate(['/search', _trimmedQuery]);
  }

}
