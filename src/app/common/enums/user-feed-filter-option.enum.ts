export enum EUserFeedFilterOption {
  SHOW_ALL = 1,
  SHOW_MEDIA_ON_LIST,
  EXCLUDE_MEDIA_ON_LIST
}

export namespace EUserFeedFilterOption {

  const _displayMap: Record<EUserFeedFilterOption, string> = {
    [EUserFeedFilterOption.SHOW_ALL]: 'Show All',
    [EUserFeedFilterOption.SHOW_MEDIA_ON_LIST]: 'Show List Media',
    [EUserFeedFilterOption.EXCLUDE_MEDIA_ON_LIST]: 'Exclude List Media',
  };

  export function toDisplay(_option: EUserFeedFilterOption): string {
    return _displayMap[_option] ?? '';
  }

  export function getArray(): EUserFeedFilterOption[] {
    return Object.values(EUserFeedFilterOption).filter(v => typeof v === 'number') as EUserFeedFilterOption[]
  }
}