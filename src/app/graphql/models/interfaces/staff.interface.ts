import { IImageLinks } from './image-links.interface'
import { IMediaEdge } from './media-edge.interface'
import { IPageInfo } from './page-info.interface'
import { IStaffName } from './staff-name.interface'

export interface IStaff {
  id: number,
  name: IStaffName,
  image: IImageLinks,
  primaryOccupations: string[],
  staffMedia: {
    pageInfo: IPageInfo,
    edges: IMediaEdge[]
  }
}