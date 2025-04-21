import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isInIgnoreList'
})
export class IsInIgnoreListPipe implements PipeTransform {

  public transform(_ignoredIds: number[] | null, _mediaId: number): boolean {
    if (!_ignoredIds)
      return false;

    return _ignoredIds.includes(_mediaId);
  }

}
