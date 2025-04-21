import { Pipe, PipeTransform } from '@angular/core';
import { IProductionFeedItem } from '@gumi/common/models';
import { EMediaSeason } from '@gumi/graphql';

@Pipe({
  name: 'mediaSeasonDisplay'
})
export class MediaSeasonDisplayPipe implements PipeTransform {

  public transform(_item: IProductionFeedItem): string {
    const _season: string = _item.season ? EMediaSeason.toDisplay(_item.season) : '';
    let _display: string = '';

    if (_season || _item.seasonYear)
      _display = `${_season} ${_item.seasonYear}`;

    if (!_display && _item.startDate?.year)
      _display = `${EMediaSeason.fromMonth(_item.startDate.month)} ${_item.startDate.year}`;

    return _display || 'TBA'
  }

}