export enum EMediaSeason {
  WINTER = 'WINTER',
  SPRING = 'SPRING',
  SUMMER = 'SUMMER',
  FALL = 'FALL'
}

export namespace EMediaSeason {

  export function toDisplay(_season: EMediaSeason): string {
    return _season.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
  }

  export function fromDisplay(_display: string): EMediaSeason {
    switch (_display) {
      case (toDisplay(EMediaSeason.WINTER)): return EMediaSeason.WINTER;
      case (toDisplay(EMediaSeason.SPRING)): return EMediaSeason.SPRING;
      case (toDisplay(EMediaSeason.SUMMER)): return EMediaSeason.SUMMER;
      case (toDisplay(EMediaSeason.FALL)): return EMediaSeason.FALL;
      default: throw new Error(`Unknown season display: ${_display}`);
    }
  }

  export function fromMonth(_month: number | null): string {
    if (!_month)
      return '';

    const _winterDisplay: string = EMediaSeason.toDisplay(EMediaSeason.WINTER);
    const _springDisplay: string = EMediaSeason.toDisplay(EMediaSeason.SPRING);
    const _summerDisplay: string = EMediaSeason.toDisplay(EMediaSeason.SUMMER);
    const _fallDisplay: string = EMediaSeason.toDisplay(EMediaSeason.FALL);

    const _seasonMap: Record<number, string> = {
      1: _winterDisplay,
      2: _winterDisplay,
      3: _springDisplay,
      4: _springDisplay,
      5: _springDisplay,
      6: _summerDisplay,
      7: _summerDisplay,
      8: _summerDisplay,
      9: _fallDisplay,
      10: _fallDisplay,
      11: _fallDisplay,
      12: _winterDisplay
    };

    return _seasonMap[_month];

  }

  export function toMonth(_season: EMediaSeason): number | null {
    const _seasonStartMonthMap: Record<EMediaSeason, number> = {
      [EMediaSeason.WINTER]: 0,
      [EMediaSeason.SPRING]: 3,
      [EMediaSeason.SUMMER]: 6,
      [EMediaSeason.FALL]: 9
    };

    return _seasonStartMonthMap[_season] || null;
  }

  export function getArray(): string[] {
    return Object.values(EMediaSeason)
      .filter(value => typeof value === 'string')
      .map(_format => toDisplay(_format as EMediaSeason));
  }

}