export function uniqueByKey<T>(array: T[], key: keyof T): T[] {
  const map = new Map();
  return array.filter((item) => {
    if (map.has(item[key])) {
      return false;
    } else {
      map.set(item[key], item);
      return true;
    }
  });
}