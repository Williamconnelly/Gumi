import { EMediaSeason } from '@gumi/graphql';
import { IProductionFeedItem } from '../models';

export function getProductionItemDateTime(_item: IProductionFeedItem): number {
  const _year: number = _item.startDate?.year || _item.seasonYear || new Date().getFullYear() + 2;
  const _mediaSeason: number | null = EMediaSeason.toMonth(_item.season);
  const _month: number = _item.startDate?.month ?? (_mediaSeason ? _mediaSeason + 1 : 1);
  const _day: number = _item.startDate?.day || 1;

  return new Date(_year, _month - 1, _day).getTime();
}