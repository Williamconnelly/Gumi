export function isNullOrUndefined<T = any>(_value: T | null | undefined): _value is null | undefined {
  return _value === null || _value === undefined;
}
