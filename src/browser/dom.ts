export function closest(dom: Node, selectors: keyof HTMLElementTagNameMap): Node {
  const nodes = document.querySelectorAll(selectors);

  function find(node: Node) {
    const parent = node.parentNode;
    if (parent) {
      for (const iterator of nodes) {
        if (iterator === parent) {
          return parent;
        }
      }
      return find(parent);
    }
    return null;
  }

  return find(dom);
}
