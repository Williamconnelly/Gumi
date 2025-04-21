import { IStaffInformation } from './staff-information.interface';
import { IStaffMedia } from './staff-media.interface';

export interface IProductionFeedItem extends IStaffInformation, IStaffMedia {
  guid: string;
}