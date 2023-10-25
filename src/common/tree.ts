interface OptBase<T> {
  idKey: keyof T,
  parentIdKey: keyof T,
}

interface Opt<T> extends OptBase<T> {
  childrenKey: keyof T,
  pId: string | number;
}

type TreeItem<Ck extends string = 'children'> = {
  [P in Ck]?: TreeItem<Ck>[];
} & Record<string, any>;

function flatTree<Ck extends string, T extends TreeItem<Ck>>(tree: T[], options?: Partial<Opt<T>>): T[] {
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

/**
 * 支持自定义 pIdKey 和 cKey
 * @param tree 
 * @param idKey 
 * @param pId 
 * @returns 
 */
export function tree2Arr<T extends { children: T[] }, R = { pId: string } & Omit<T, 'children'>>(
  tree: T[],
  idKey: keyof T,
  pId: string | number | undefined
): R[] {
  const array: R[] = [];

  tree.forEach(({ children = [], [idKey]: id, ...node }) => {
    const item = { [idKey]: id, ...node, pId, } as R;
    array.push(item);
    const list: R[] = tree2Arr(children, idKey, id as string | number | undefined);
    array.push(...list);
  });

  return array;
}

function findParents<T extends TreeItem>(
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

// T extends { children: T[] }
function findPath<T>(
  list: T[],
  id: string | number,
  idKey: keyof T,
  childrenKey: keyof T,
): T[] {
  let path: T[] = [];

  for (const item of list) {
    if (item[idKey] === id) {
      return [item];
    }
    const children = item[childrenKey] as T[];
    if (children && children.length) {
      path = findPath(children, id, idKey, childrenKey);
      if (path && path.length) {
        path.unshift(item);
        return path;
      }
    }
  }

  return path;
}

/**
 * Map
 * @param array 
 * @param idKey 
 * @param pIdKey 
 * @returns 
 */
function arr2TreeMap<U, T extends U & { children: T[] }>(
  array: U[],
  idKey: keyof U,
  pIdKey: keyof U,
): T[] {
  if (!Array.isArray(array)) {
    return [];
  }

  const tree: T[] = [];
  const map = new Map<string, T>();

  array.forEach((item) => {
    const id = item[idKey] as string;
    const value = Object.assign({}, { ...item }, { children: [] }) as unknown as T;
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

/**
 * 递归
 * @param arr 
 * @param idKey 
 * @param pIdKey 
 * @param pId 
 * @returns 
 */
function arr2TreeRecursion<U, T extends U & { children: T[] }>(
  array: U[],
  idKey: keyof U,
  pIdKey: keyof U,
  pId?: string | number,
): T[] {
  if (!Array.isArray(array)) {
    return [];
  }

  const tree: T[] = [];

  if (['null', 'undefined', ''].includes(`${pId}`.trim())) {
    // const ids = array.map((item) => item[idKey]);
    array.forEach(({ [pIdKey]: parentId, [idKey]: id, ...item }) => {
      const parent = array.find((item2) => item2[pIdKey] === id);
      // if (!ids.includes(parentId)) { }
      if (!parent) {
        const children = arr2TreeRecursion(array, idKey, pIdKey, id as number | string);
        tree.push({ [pIdKey]: parentId, [idKey]: id, ...item, children } as T);
      }
    });
  } else {
    array.forEach(({ [pIdKey]: parentId, [idKey]: id, ...item }) => {
      if (pId === parentId) {
        const children = arr2TreeRecursion(array, idKey, pIdKey, id as number | string);
        tree.push({ [pIdKey]: parentId, [idKey]: id, ...item, children } as T);
      }
    });
  }

  return tree;
}

/**
 * 查找当前 item 的 paernt , 将其 push 到 paernt.children 中
 * @param array 
 * @param idKey 
 * @param pIdKey 
 * @returns 
 */
function arr2TreeFindParent<U, T extends U & { children: T[] }>(
  array: U[],
  idKey: keyof U,
  pIdKey: keyof U,
): T[] {
  if (!Array.isArray(array)) {
    return [];
  }

  // 1. 浅拷贝
  // 2. 绕过类型错误提示
  const arr = array.map((item) => {
    return Object.assign({}, { ...item }, { children: [] }) as unknown as T;
  });

  const tree: T[] = [];

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

/**
 * 查找当前 item 所有 children , 将 item.children 设置为新的 children
 * @param array 
 * @param idKey 
 * @param pIdKey 
 * @returns 
 */
function arr2TreeFindChildren<U, T extends U & { children: T[] }>(
  array: U[],
  idKey: keyof U,
  pIdKey: keyof U,
): T[] {
  if (!Array.isArray(array)) {
    return [];
  }

  const arr: T[] = [];
  const ids: Array<string | number> = [];

  // 1. 浅拷贝
  // 2. 绕过类型错误提示
  array.forEach((item) => {
    const id = item[idKey] as string | number;
    arr.push(Object.assign({}, { ...item }, { children: [] }) as unknown as T);
    ids.push(id);
  });

  return arr.filter((item) => {
    const children = arr.filter((child) => child[pIdKey] === item[idKey]);
    item.children = children;
    const pId = item[pIdKey] as string | number;
    return !ids.includes(pId);
  });
}

export function arr2Tree<U, T extends U & { children: T[] }>(
  array: U[],
  idKey: keyof U,
  pIdKey: keyof U,
  strategy: 'map' | 'recursion' | 'findParent' | 'findChildren' = 'map'
): T[] {
  let tree: T[] = [];
  switch (strategy) {
    case 'map':
      tree = arr2TreeMap(array, idKey, pIdKey)
      break;
    case 'recursion':
      tree = arr2TreeRecursion(array, idKey, pIdKey);
    case 'findParent':
      tree = arr2TreeFindParent(array, idKey, pIdKey);
    case 'findChildren':
      tree = arr2TreeFindChildren(array, idKey, pIdKey);
    default:
      break;
  }

  return tree;
}
