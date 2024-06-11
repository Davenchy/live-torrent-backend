/**
 * returns the first available item from the passed array, if no available items
 * returns the defaultValue.
 *
 * Example:
 *
 * options: `['', undefined, null, 'a', 'b']`
 * returns `a`
 *
 * options: `['', undefined, null]`
 * defaultValue: `'b'`
 * returns `b`
 */
export const firstAvailable = <T>(
  options: (T | undefined | null)[],
  defaultValue: T,
): T => {
  for (const item of options)
    if (item && item !== undefined && item !== null) return item
  return defaultValue
}

export type FlattenType<T> = T | undefined | null
/**
 * flattens an array of (objects and arrays) and validate them.
 *
 * Example:
 *
 * data: `[null, undefined, 'a', 'b', [null, 'c', undefined, '']]`
 * returns `['a', 'b', 'c']`
 */
export const flatten = <T>(
  data: (FlattenType<T> | FlattenType<T>[])[],
): T[] => {
  let results: T[] = []

  for (const item of data)
    if (Array.isArray(item)) results = concat(results, flatten<T>(item))
    else if (item && item !== undefined && item !== null) results.push(item)

  return results
}

/**
 * Concats to arrays with a an optional filter for the second array.
 *
 * Example:
 * ```typescript
 * const a = [1, 2, 3, 4, 5]
 * const b = [6, 7, 8, 9, 10]
 *
 * concat(a, b, v => v % 2 === 0)
 * // [1, 2, 3, 4, 5, 6, 8, 10]
 *
 * ```
 */
export const concat = <T>(
  a: T[],
  b: T[],
  filter: (item: T, index: number, array: T[]) => boolean = () => true,
): T[] => [...a, ...b.filter(filter)]
