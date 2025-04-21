import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isInUserList'
})
export class IsInUserListPipe implements PipeTransform {

  public transform(_userListIds: number[] | null, _mediaId: number): boolean {
    if (!_userListIds)
      return false;

    return _userListIds.includes(_mediaId);
  }

}
