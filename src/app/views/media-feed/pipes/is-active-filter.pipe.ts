import { Pipe, PipeTransform } from '@angular/core';
import { IMediaFeedFilter } from '@gumi/common/models';

@Pipe({
  name: 'isActiveFilter'
})
export class IsActiveFilterPipe implements PipeTransform {

  public transform(_activeFilters: Set<keyof IMediaFeedFilter> | null, _filterProperty: keyof IMediaFeedFilter): boolean {
    return _activeFilters?.has(_filterProperty) ?? false;
  }

}
