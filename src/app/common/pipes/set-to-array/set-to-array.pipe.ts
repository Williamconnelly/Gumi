import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'setToArray'
})
export class SetToArrayPipe implements PipeTransform {

  public transform<T = any>(_set: Set<T>): T[] {
    return _set?.size ? [..._set] : [];
  }

}
