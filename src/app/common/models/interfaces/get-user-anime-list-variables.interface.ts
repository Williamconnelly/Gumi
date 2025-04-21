export interface IGetUserAnimeListVariables {
  chunk: number;
  perChunk: number;
  type: 'ANIME' | 'MANGA';
  userId: number;
}
