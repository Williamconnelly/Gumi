import { ILoadingMessage } from './loading-message.interface';

export interface ILoadingState {
  isLoading: boolean;
  errors?: ILoadingMessage[];
  messages?: ILoadingMessage[];
  progress?: number;
}