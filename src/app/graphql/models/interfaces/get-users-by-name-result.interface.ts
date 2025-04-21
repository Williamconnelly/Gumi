import { IPageInfo } from './page-info.interface'
import { IUserInformation } from './user-information.interface'

export interface IGetUsersByNameResult {
  users: {
    pageInfo: IPageInfo,
    results: IUserInformation[],
  }
}