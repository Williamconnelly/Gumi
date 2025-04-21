export function batchArray<T>(_array: T[], _batchSize: number): T[][] {
  const _batches: T[][] = [];

  if (!_array?.length)
    return _batches;

  for (let i: number = 0; i < _array.length; i += _batchSize)
    _batches.push(_array.slice(i, i + _batchSize));

  return _batches;
}
