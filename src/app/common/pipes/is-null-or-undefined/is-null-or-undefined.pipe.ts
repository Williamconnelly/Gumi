import { Pipe, PipeTransform } from '@angular/core';
import { isNullOrUndefined } from '@gumi/common/functions';

@Pipe({
  name: 'isNullOrUndefined'
})
export class IsNullOrUndefinedPipe implements PipeTransform {

  public transform<T = any>(_value: T): boolean {
    return isNullOrUndefined<T>(_value);
  }

}
