import { IPageInfo } from './page-info.interface'
import { IStaff } from './staff.interface'

export interface IGetMediaByStaffResult {
  Page: {
    pageInfo: IPageInfo,
    staff: IStaff[]
  }
}