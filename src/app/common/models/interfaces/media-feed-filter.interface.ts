import { ISliderRange } from '@gumi/components';
import { EMediaFormat, EMediaSeason, EMediaStatus } from '@gumi/graphql';
import { IProductionFeedItem } from './production-feed-item.interface';

export interface IMediaFeedFilter {
  staffName: string;
  mediaTitle: string;
  roleTitle: string;
  yearRange: ISliderRange | null;
  userListFilter: ((item: IProductionFeedItem) => boolean) | null;
  formats: EMediaFormat[];
  statuses: EMediaStatus[];
  seasons: EMediaSeason[];
  occupations: string[];
  ignoredMediaIds: number[];
}