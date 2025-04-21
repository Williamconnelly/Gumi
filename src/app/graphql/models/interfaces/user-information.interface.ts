import { IImageLinks } from './image-links.interface';
import { IPageInfo } from './page-info.interface';
import { IUserStatisticTypes } from './user-statistic-types.interface';

export interface IUserInformation {
  id: number,
  name: string,
  avatar: IImageLinks,
  favourites: {
    staff: {
      pageInfo: IPageInfo
      edges: {
        favouriteOrder: number,
        node: {
          id: number
        }
      }[],
    }
  },
  statistics: IUserStatisticTypes
}
