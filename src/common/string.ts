export function capitalize<T extends string>(str: T): Capitalize<T> {
  if (typeof str !== 'string') {
    return str;
  }
  if (!/^[A-Za-z]/.test(str)) {
    return str;
  }
  const first = str.substring(0, 1);
  let rest = str.substring(1);
  return `${first.toUpperCase()}${rest}`;
}

export function uncapitalize<T extends string>(str: T): Uncapitalize<T> {
  if (typeof str !== 'string') {
    return str;
  }
  if (!/^[A-Za-z]/.test(str)) {
    return str;
  }
  const first = str.substring(0, 1);
  let rest = str.substring(1);
  return `${first.toLowerCase()}${rest}`;
}

