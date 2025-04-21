export enum EMediaFormat {
  TV = 'TV',
  TV_SHORT = 'TV_SHORT',
  MOVIE = 'MOVIE',
  SPECIAL = 'SPECIAL',
  OVA = 'OVA',
  ONA = 'ONA',
  MUSIC = 'MUSIC',
  MANGA = 'MANGA',
  NOVEL = 'NOVEL',
  ONE_SHOT = 'ONE_SHOT'
}

export namespace EMediaFormat {

  export function toDisplay(_format: EMediaFormat): string {
    return _format
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (_char: string) => _char.toUpperCase())
      .replace(/\b(Tv|Ova|Ona)\b/gi, (_match: string) => _match.toUpperCase());
  }

  export function fromDisplay(_display: string): EMediaFormat {
    switch (_display) {
      case (toDisplay(EMediaFormat.TV)): return EMediaFormat.TV;
      case (toDisplay(EMediaFormat.TV_SHORT)): return EMediaFormat.TV_SHORT;
      case (toDisplay(EMediaFormat.MOVIE)): return EMediaFormat.MOVIE;
      case (toDisplay(EMediaFormat.SPECIAL)): return EMediaFormat.SPECIAL;
      case (toDisplay(EMediaFormat.OVA)): return EMediaFormat.OVA;
      case (toDisplay(EMediaFormat.ONA)): return EMediaFormat.ONA;
      case (toDisplay(EMediaFormat.MUSIC)): return EMediaFormat.MUSIC;
      case (toDisplay(EMediaFormat.MANGA)): return EMediaFormat.MANGA;
      case (toDisplay(EMediaFormat.NOVEL)): return EMediaFormat.NOVEL;
      case (toDisplay(EMediaFormat.ONE_SHOT)): return EMediaFormat.ONE_SHOT;
      default: throw new Error(`Unknown format display: ${_display}`);
    }
  }

  export function getArray(): string[] {
    return Object.values(EMediaFormat)
      .filter(value => typeof value === 'string')
      .map(_format => toDisplay(_format as EMediaFormat));
  }

}