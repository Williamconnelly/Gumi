export enum EMediaListStatus {
  CURRENT = 'CURRENT',
  PLANNING = 'PLANNING',
  COMPLETED = 'COMPLETED',
  DROPPED = 'DROPPED',
  PAUSED = 'PAUSED',
  REPEATING = 'REPEATING'
}

export namespace EMediaListStatus {

  export function toDisplay(_format: EMediaListStatus): string {
    return _format
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (_char: string) => _char.toUpperCase())
  }

  export function fromDisplay(_display: string): EMediaListStatus {
    switch (_display) {
      case (toDisplay(EMediaListStatus.CURRENT)): return EMediaListStatus.CURRENT;
      case (toDisplay(EMediaListStatus.PLANNING)): return EMediaListStatus.PLANNING;
      case (toDisplay(EMediaListStatus.COMPLETED)): return EMediaListStatus.COMPLETED;
      case (toDisplay(EMediaListStatus.DROPPED)): return EMediaListStatus.DROPPED;
      case (toDisplay(EMediaListStatus.PAUSED)): return EMediaListStatus.PAUSED;
      case (toDisplay(EMediaListStatus.REPEATING)): return EMediaListStatus.REPEATING;
      default: throw new Error(`Unknown status display: ${_display}`);
    }
  }

  export function getArray(): string[] {
    return Object.values(EMediaListStatus)
      .filter(value => typeof value === 'string')
      .map(_format => toDisplay(_format as EMediaListStatus));
  }

}