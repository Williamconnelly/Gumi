import { IImageLinks } from '@gumi/graphql'
import { IUserListMedia } from './user-list-media.interface'

export interface IUserList {
  userId: number,
  userName: string,
  avatar: IImageLinks,
  favoriteStaff: {
    staffId: number,
    favoriteOrder: number
  }[]
  mediaList: IUserListMedia[]
}
