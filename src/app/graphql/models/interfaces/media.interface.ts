import { EMediaFormat, EMediaSeason, EMediaStatus } from '../enums'
import { IFuzzyDate } from './fuzzy-date.interface'
import { IImageLinks } from './image-links.interface'
import { IMediaTitle } from './media-title.interface'
import { IStudioConnection } from './studio-connection.interface'

export interface IMedia {
  id: number,
  idMal: number,
  title: IMediaTitle,
  format: EMediaFormat,
  coverImage: IImageLinks,
  status: EMediaStatus,
  season: EMediaSeason,
  seasonYear: number,
  startDate: IFuzzyDate,
  endDate: IFuzzyDate,
  episodes: number,
  duration: number,
  averageScore: number,
  studios: {
    nodes: IStudioConnection[]
  },
  genres: string[]
}