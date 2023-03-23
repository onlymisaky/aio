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

  if (['null', 'undefined', ''].includes(`${pId}`.trim())) {
    const ids = arr.map((item) => item[idKey]);
    arr.forEach(({ [pIdKey]: parentId, [idKey]: id, ...item }) => {
      if (!ids.includes(parentId)) {
        const children = arr2Tree(arr, idKey, pIdKey, id as number | string);
        tree.push({ [pIdKey]: parentId, [idKey]: id, ...item, children } as T);
      }
    });
  } else {
    arr.forEach(({ [pIdKey]: parentId, [idKey]: id, ...item }) => {
      if (pId === parentId) {
        const children = arr2Tree(arr, idKey, pIdKey, id as number | string);
        tree.push({ [pIdKey]: parentId, [idKey]: id, ...item, children } as T);
      }
    });
  }

  return tree;
}

export function arr2Tree2<U, T extends U & { children: T[] }>(
  arr: U[],
  idKey: keyof U,
  pIdKey: keyof U,
): T[] {
  if (!Array.isArray(arr)) {
    return [];
  }

  let tree: T[] = [];

  arr.forEach((item) => {
    if (!item.children) {
      item.children = [];
    }
    const parent = arr.find((item2) => item2[idKey] === item[pIdKey]);
    if (!parent) {
      tree.push({ ...item } as unknown as T);
    } else {
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push({ ...item });
    }
  });

  return tree;
}
