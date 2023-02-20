interface OptBase<T> {
  idKey: keyof T,
  parentIdKey: keyof T,
}

interface Opt<T> extends OptBase<T> {
  childrenKey: keyof T,
  pId: string | number;
}

function flatTree<T extends Obj>(tree: T[], options?: Partial<Opt<T>>): T[] {
  const {
    childrenKey = 'children',
    idKey = 'id',
    parentIdKey = 'parentId',
    pId = '',
  } = options || {};

  let list: T[] = [];

  for (const node of tree) {

    const {
      [childrenKey]: children, [idKey]: id, [parentIdKey]: parentId, ...data
    } = node;

    const item = {
      [idKey]: id, [parentIdKey]: parentId || pId, ...data
    } as T;

    if (children && children.length) {
      list = [
        ...list,
        item,
        ...flatTree(children, { childrenKey, idKey, parentIdKey, pId: pId || id }),
      ];
    } else {
      list.push(item);
    }
  }
  return list;
}

function findParents<T extends Obj>(
  list: T[],
  childId: string | number,
  options?: OptBase<T>
) {
  const { idKey = 'id', parentIdKey = 'parentId' } = options || {};

  const parents: T[] = [];

  function findParent(childId: string | number) {
    for (const { [idKey]: id, [parentIdKey]: parentId } of list) {
      if (childId === id) {
        for (const parent of list) {
          if (parent.id === parentId) {
            parents.unshift(parent);
            findParent(parentId);
          }
        }
      }
    }
  }

  findParent(childId);
  return parents;
}

function findPath(code, list) {
  for (const { children, ...item } of list) {
    if (item.code === code) {
      return [item]
    }
    if (children && children.length) {
      const path = findPath(code, children)
      if (path) {
        path.unshift(item)
        return path
      }
    }
  }
}

export function arrayToTree<U, T extends U & { children: T[] }>(
  array: U[],
  idKey: keyof U,
  pIdKey: keyof U,
): T[] {
  if (!Array.isArray(array)) {
    return [];
  }

  let tree: T[] = [];
  const map = new Map<string, T>();

  array.forEach((item) => {
    const id = item[idKey] as string;
    const value = Object.assign({}, { ...item }, { children: [] },) as unknown as T;
    map.set(id, value);
  });

  map.forEach((value) => {
    const parnetId = value[pIdKey] as string;
    const parent = map.get(parnetId);
    if (parent) {
      parent.children.push(value);
    } else {
      tree.push(value);
    }
  });

  map.clear();
  return tree;
}

export function arr2Tree<U, T extends U & { children: T[] }>(
  arr: U[],
  idKey: keyof U,
  pIdKey: keyof U,
  pId?: string | number,
): T[] {
  if (!Array.isArray(arr)) {
    return [];
  }

  let tree: T[] = [];

  if (pId === undefined) {
    const ids = arr.map((item) => item[idKey]);

    for (const item of arr) {
      const { [pIdKey]: parnetId, [idKey]: id, } = item;
      if (!ids.includes(parnetId)) {
        const child = {
          ...item,
          children: arr2Tree(arr, idKey, pIdKey, id as string),
        } as T;
        tree.push(child);
      }
    }

  } else {
    for (let index = 0; index < arr.length; index++) {
      const { [pIdKey]: parnetId, [idKey]: id, } = arr[index];
      if (pId === parnetId) {
        const child = {
          ...arr[index],
          children: arr2Tree(arr, idKey, pIdKey, id as string),
        } as T;
        tree.push(child);
      }
    }
  }

  return tree;
}
