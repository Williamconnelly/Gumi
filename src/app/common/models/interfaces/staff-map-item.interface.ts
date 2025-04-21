import { IStaffInformation } from './staff-information.interface';
import { IStaffMedia } from './staff-media.interface';

export interface IStaffMapItem {
  staffInfo: IStaffInformation;
  staffMedia: Map<number, IStaffMedia>
}