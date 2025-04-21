import { IImageLinks, IStaffName } from '@gumi/graphql';

export interface IStaffInformation {
  primaryOccupations: string[];
  staffId: number,
  staffImage: IImageLinks,
  staffName: IStaffName,
}