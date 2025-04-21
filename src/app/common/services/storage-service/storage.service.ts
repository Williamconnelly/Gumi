import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  public static readonly PREFIX: string = 'gumi.';

  protected createPrefixedKey(_key: string): string {
    return `${StorageService.PREFIX}${_key}`;
  }

  public set<T>(_key: string, _value: T): void {
    try {
      localStorage.setItem(this.createPrefixedKey(_key), JSON.stringify(_value));
    } catch (e) {
      console.error(`StorageService.set: Failed to set key "${_key}"`, e);
    }
  }

  public get<T>(_key: string): T | null {
    const _storageItem: string | null = localStorage.getItem(this.createPrefixedKey(_key));

    try {
      return _storageItem ? JSON.parse(_storageItem) as T : null;
    } catch (e) {
      console.error(`StorageService.get: Failed to parse key "${_key}"`, e);

      return null;
    }
  }

  public update<T>(_key: string, _partial: Partial<T>): void {
    const _existing: T = this.get<T>(_key) || {} as T;
    const _updated: T & Partial<T> = { ..._existing, ..._partial };

    this.set<T>(_key, _updated);
  }

  public remove(_key: string): void {
    try {
      localStorage.removeItem(this.createPrefixedKey(_key));
    } catch (e) {
      console.error(`StorageService.remove: Failed to remove key "${_key}"`, e);
    }
  }

  public clearAll(): void {
    Object.keys(localStorage).forEach((_key: string) => {
      if (_key.startsWith(StorageService.PREFIX))
        localStorage.removeItem(_key);
    });
  }

  public has(_key: string): boolean {
    return localStorage.getItem(this.createPrefixedKey(_key)) !== null;
  }

}