import { EMediaFormat, EMediaSeason, EMediaStatus, IFuzzyDate, IImageLinks, IMediaTitle } from '@gumi/graphql';

export interface IStaffMedia {
  malId: number;
  mediaFormat: EMediaFormat;
  mediaId: number;
  mediaImage: IImageLinks;
  mediaStatus: EMediaStatus;
  mediaTitle: IMediaTitle;
  roles: string[];
  season: EMediaSeason;
  seasonYear: number;
  startDate: IFuzzyDate;
}