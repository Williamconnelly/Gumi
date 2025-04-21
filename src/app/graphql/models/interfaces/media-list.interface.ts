import { EMediaListStatus } from '../enums';

export interface IMediaList {
  mediaId: number,
  score: number,
  status: EMediaListStatus
}