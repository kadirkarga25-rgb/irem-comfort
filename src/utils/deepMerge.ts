/**
 * Immutable Deep Merge utility for application state updates.
 * Recursively merges `source` into `target` without mutating either input object.
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  source: Partial<T> | Record<string, any>
): T {
  if (target === null || typeof target !== 'object') {
    if (source !== null && typeof source === 'object') {
      return deepMerge(Array.isArray(source) ? ([] as any) : {}, source);
    }
    return source as T;
  }

  if (source === null || typeof source !== 'object') {
    return Array.isArray(target) ? ([...target] as unknown as T) : ({ ...target } as T);
  }

  const result: any = Array.isArray(target) ? [...target] : { ...target };

  Object.keys(source).forEach((key) => {
    const sourceVal = source[key];
    const targetVal = result[key];

    if (sourceVal === undefined) {
      return;
    }

    if (
      sourceVal !== null &&
      typeof sourceVal === 'object' &&
      !Array.isArray(sourceVal)
    ) {
      if (targetVal !== null && typeof targetVal === 'object' && !Array.isArray(targetVal)) {
        result[key] = deepMerge(targetVal, sourceVal);
      } else {
        result[key] = deepMerge({}, sourceVal);
      }
    } else if (Array.isArray(sourceVal)) {
      result[key] = sourceVal.map((item) => {
        if (item !== null && typeof item === 'object') {
          return deepMerge(Array.isArray(item) ? [] : {}, item);
        }
        return item;
      });
    } else {
      result[key] = sourceVal;
    }
  });

  return result;
}
