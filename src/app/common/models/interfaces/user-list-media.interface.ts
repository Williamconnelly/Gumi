import { EMediaListStatus } from '@gumi/graphql';

export interface IUserListMedia {
  mediaId: number,
  score: number,
  status: EMediaListStatus
}
