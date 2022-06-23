/**
 * 1234 -> 1,234
 * 123 -> 123
 */
export function readableNumber(n: number | string): string {
  if (isNaN(n)) {
    return n;
  }

  const [integer, decimal] = `${n}`.split('.')
  const len = integer.length;
  if (len < 3) {
    return `${n}`;
  }

  let result = '';
  for (let index = 0; index < len; index++) {
    result += integer[index];
    const flag = (len - index - 1) % 3;
    if (!flag && index !== len - 1) {
      result += ',';
    }
  }
  return result + (decimal === undefined ? '' : `.${decimal}`);
}
