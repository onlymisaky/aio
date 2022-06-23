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

export function arrayToTree(array) {
  const tree = [];
  const map = new Map();

  array.forEach((item) => {
    item.children = [];
    map.set(item.id, item)
  });

  map.forEach((value, key) => {
    const parent = map.get(value.id);
    if (parent) {
      parent.children.push(value);
    } else {
      tree.push(value);
    }
  });

  map.clear();
  return tree;
}