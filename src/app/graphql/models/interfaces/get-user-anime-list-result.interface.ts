import { IMediaListGroup } from './media-list-group.interface';
import { IUserInformation } from './user-information.interface';

export interface IGetUserAnimeListResult {
  MediaListCollection: {
    hasNextChunk: boolean;
    lists: IMediaListGroup[],
    user: IUserInformation
  }
}