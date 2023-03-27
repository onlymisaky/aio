export function randomNum(start: number, end: number) {
  let _end = Math.max(start, end) + 1;
  return Math.floor(Math.random() * (_end - start)) + start;
}

function randomId(idLength = 3) {
  let idCount = Math.pow(10, idLength);
  // let idCount = Math.pow(10, idLength - 1) * 9;
  let map: Record<string, string> = {};

  function createId(): string {
    if (Object.keys(map).length >= idCount) {
      throw new Error('该区间内 ID 已用完')
    }
    let id = '';
    for (let i = 0; i < idLength; i++) {
      id = `${id}${randomNum(0, 9)}`
      // id = `${id}${randomNum(i === 0 ? 1 : 0, 9)}`
    }
    if (map[id]) {
      return createId();
    }
    map[id] = id;
    return id;
  }

  return createId;
}

export const createId = randomId();

export function randomLetter(): string {
  const index = randomNum(0, 25)
  return String.fromCharCode(65 + index);
}

function toCase(str: string) {
  return Math.random() > 0.5 ? String.prototype.toLowerCase.call(str) : str;
}

export function randomName() {
  const count = randomNum(4, 10);
  let name = '';
  for (let index = 0; index < count; index++) {
    name = `${name}${toCase(randomLetter())}`
  }
  return name
}
