export enum EMediaStatus {
  FINISHED = 'FINISHED',
  RELEASING = 'RELEASING',
  NOT_YET_RELEASED = 'NOT_YET_RELEASED',
  CANCELLED = 'CANCELLED',
  HIATUS = 'HIATUS'
}

export namespace EMediaStatus {

  export function toDisplay(_format: EMediaStatus): string {
    return _format
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (_char: string) => _char.toUpperCase())
  }

  export function fromDisplay(_display: string): EMediaStatus {
    switch (_display) {
      case (toDisplay(EMediaStatus.FINISHED)): return EMediaStatus.FINISHED;
      case (toDisplay(EMediaStatus.RELEASING)): return EMediaStatus.RELEASING;
      case (toDisplay(EMediaStatus.NOT_YET_RELEASED)): return EMediaStatus.NOT_YET_RELEASED;
      case (toDisplay(EMediaStatus.CANCELLED)): return EMediaStatus.CANCELLED;
      case (toDisplay(EMediaStatus.HIATUS)): return EMediaStatus.HIATUS;
      default: throw new Error(`Unknown status display: ${_display}`);
    }
  }

  export function getArray(): string[] {
    return Object.values(EMediaStatus)
      .filter(value => typeof value === 'string')
      .map(_format => toDisplay(_format as EMediaStatus));
  }

}