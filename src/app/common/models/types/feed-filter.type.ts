import { IProductionFeedItem } from '../interfaces';

export type FeedFilter = (_item: IProductionFeedItem) => boolean;