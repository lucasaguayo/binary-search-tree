import { Node, Tree } from './binarySearchTree.js';

// Helpers.
const collect = (tree, method) => {
  const values = [];
  tree[method]((node) => values.push(node.data));
  return values;
};

const inOrder = (tree) => collect(tree, 'inOrderForEach');

// A tree is a valid BST if its in-order traversal is strictly increasing.
const isValidBST = (tree) => {
  const values = inOrder(tree);
  return values.every((value, i) => i === 0 || values[i - 1] < value);
};

// Balanced tree used in most tests:
//          4
//        /   \
//       2     6
//      / \   / \
//     1   3 5   7
const buildSample = () => new Tree([1, 2, 3, 4, 5, 6, 7]);

describe('Node', () => {
  test('stores its data and starts without children', () => {
    const node = new Node(10);
    expect(node.data).toBe(10);
    expect(node.left).toBeNull();
    expect(node.right).toBeNull();
  });
});

describe('Tree constructor', () => {
  test('builds a balanced tree from a sorted array', () => {
    const tree = buildSample();
    expect(tree.root.data).toBe(4);
    expect(tree.root.left.data).toBe(2);
    expect(tree.root.right.data).toBe(6);
    expect(tree.isBalanced()).toBe(true);
  });

  test('sorts an unsorted array', () => {
    const tree = new Tree([7, 3, 5, 1, 6, 2, 4]);
    expect(inOrder(tree)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(tree.root.data).toBe(4);
  });

  test('removes duplicate values', () => {
    const tree = new Tree([5, 3, 1, 3, 5, 1]);
    expect(inOrder(tree)).toEqual([1, 3, 5]);
    expect(tree.root.data).toBe(3);
  });

  test('creates an empty tree from an empty array', () => {
    const tree = new Tree([]);
    expect(tree.root).toBeNull();
  });

  test('creates a single-node tree', () => {
    const tree = new Tree([42]);
    expect(tree.root.data).toBe(42);
    expect(tree.root.left).toBeNull();
    expect(tree.root.right).toBeNull();
  });
});

// Includes.
describe('includes', () => {
  test('returns true for every value in the tree', () => {
    const tree = buildSample();
    [1, 2, 3, 4, 5, 6, 7].forEach((value) => {
      expect(tree.includes(value)).toBe(true);
    });
  });

  test('returns false for values that are not in the tree', () => {
    const tree = buildSample();
    [0, 8, -3, 100].forEach((value) => {
      expect(tree.includes(value)).toBe(false);
    });
  });

  test('returns false on an empty tree', () => {
    expect(new Tree([]).includes(1)).toBe(false);
  });
});

// Insert.
describe('insert', () => {
  test('inserts the root when the tree is empty', () => {
    const tree = new Tree([]);
    tree.insert(5);
    expect(tree.root.data).toBe(5);
  });

  test('inserts a smaller value as a left leaf', () => {
    const tree = buildSample();
    tree.insert(0);
    expect(tree.root.left.left.left.data).toBe(0);
    expect(tree.includes(0)).toBe(true);
  });

  test('inserts a greater value as a right leaf', () => {
    const tree = buildSample();
    tree.insert(8);
    expect(tree.root.right.right.right.data).toBe(8);
    expect(tree.includes(8)).toBe(true);
  });

  test('does not insert duplicate values', () => {
    const tree = buildSample();
    tree.insert(3);
    tree.insert(4);
    expect(inOrder(tree)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  test('keeps the BST property after several inserts', () => {
    const tree = new Tree([50]);
    [30, 70, 20, 40, 60, 80, 35, 65].forEach((value) => tree.insert(value));
    expect(isValidBST(tree)).toBe(true);
    expect(inOrder(tree)).toEqual([20, 30, 35, 40, 50, 60, 65, 70, 80]);
  });
});

// Delete.
describe('delete', () => {
  test('removes a leaf node', () => {
    const tree = buildSample();
    tree.delete(1);
    expect(tree.includes(1)).toBe(false);
    expect(tree.root.left.left).toBeNull();
    expect(inOrder(tree)).toEqual([2, 3, 4, 5, 6, 7]);
  });

  test('removes a node with only a left child', () => {
    const tree = new Tree([2, 4, 6]);
    tree.insert(1);
    // Node 2 now has only a left child (1).
    tree.delete(2);
    expect(tree.root.left.data).toBe(1);
    expect(inOrder(tree)).toEqual([1, 4, 6]);
  });

  test('removes a node with only a right child', () => {
    const tree = new Tree([2, 4, 6]);
    tree.insert(3);
    // Node 2 now has only a right child (3).
    tree.delete(2);
    expect(tree.root.left.data).toBe(3);
    expect(inOrder(tree)).toEqual([3, 4, 6]);
  });

  test('removes a node with two children (replaced by its in-order successor)', () => {
    const tree = buildSample();
    tree.delete(2);
    expect(tree.root.left.data).toBe(3);
    expect(tree.root.left.left.data).toBe(1);
    expect(tree.root.left.right).toBeNull();
    expect(inOrder(tree)).toEqual([1, 3, 4, 5, 6, 7]);
  });

  test('removes the root when it has two children', () => {
    const tree = buildSample();
    tree.delete(4);
    expect(tree.root.data).toBe(5);
    expect(tree.root.right.data).toBe(6);
    expect(tree.root.right.left).toBeNull();
    expect(tree.includes(4)).toBe(false);
    expect(inOrder(tree)).toEqual([1, 2, 3, 5, 6, 7]);
    expect(isValidBST(tree)).toBe(true);
  });

  test('removes the only node, leaving an empty tree', () => {
    const tree = new Tree([5]);
    tree.delete(5);
    expect(tree.root).toBeNull();
  });

  test('does nothing when the value does not exist', () => {
    const tree = buildSample();
    tree.delete(99);
    expect(inOrder(tree)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  test('does nothing on an empty tree', () => {
    const tree = new Tree([]);
    expect(() => tree.delete(1)).not.toThrow();
    expect(tree.root).toBeNull();
  });

  test('keeps the BST property after deleting several values', () => {
    const tree = new Tree([10, 20, 30, 40, 50, 60, 70, 80, 90]);
    [50, 20, 90, 10].forEach((value) => tree.delete(value));
    expect(isValidBST(tree)).toBe(true);
    expect(inOrder(tree)).toEqual([30, 40, 60, 70, 80]);
  });
});

// Traversals.
describe('levelOrderForEach', () => {
  test('visits the nodes level by level, left to right', () => {
    expect(collect(buildSample(), 'levelOrderForEach')).toEqual([4, 2, 6, 1, 3, 5, 7]);
  });

  test('passes node objects to the callback', () => {
    const nodes = [];
    buildSample().levelOrderForEach((node) => nodes.push(node));
    expect(nodes).toHaveLength(7);
    nodes.forEach((node) => expect(node).toBeInstanceOf(Node));
  });

  test('calls the callback once per node', () => {
    const callback = jest.fn();
    buildSample().levelOrderForEach(callback);
    expect(callback).toHaveBeenCalledTimes(7);
  });

  test('does not call the callback on an empty tree', () => {
    const callback = jest.fn();
    new Tree([]).levelOrderForEach(callback);
    expect(callback).not.toHaveBeenCalled();
  });

  test('throws if no callback is provided', () => {
    expect(() => buildSample().levelOrderForEach()).toThrow('A callback function is required.');
  });

  test('throws if the callback is not a function', () => {
    expect(() => buildSample().levelOrderForEach('not a function')).toThrow();
  });
});

describe('preOrderForEach', () => {
  test('visits root, left, right', () => {
    expect(collect(buildSample(), 'preOrderForEach')).toEqual([4, 2, 1, 3, 6, 5, 7]);
  });

  test('does not call the callback on an empty tree', () => {
    const callback = jest.fn();
    new Tree([]).preOrderForEach(callback);
    expect(callback).not.toHaveBeenCalled();
  });

  test('throws if no callback is provided', () => {
    expect(() => buildSample().preOrderForEach()).toThrow('A callback function is required.');
  });
});

describe('inOrderForEach', () => {
  test('visits left, root, right (sorted order)', () => {
    expect(collect(buildSample(), 'inOrderForEach')).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  test('does not call the callback on an empty tree', () => {
    const callback = jest.fn();
    new Tree([]).inOrderForEach(callback);
    expect(callback).not.toHaveBeenCalled();
  });

  test('throws if no callback is provided', () => {
    expect(() => buildSample().inOrderForEach()).toThrow('A callback function is required.');
  });
});

describe('postOrderForEach', () => {
  test('visits left, right, root', () => {
    expect(collect(buildSample(), 'postOrderForEach')).toEqual([1, 3, 2, 5, 7, 6, 4]);
  });

  test('does not call the callback on an empty tree', () => {
    const callback = jest.fn();
    new Tree([]).postOrderForEach(callback);
    expect(callback).not.toHaveBeenCalled();
  });

  test('throws if no callback is provided', () => {
    expect(() => buildSample().postOrderForEach()).toThrow('A callback function is required.');
  });
});

// Height.
describe('height', () => {
  test('returns the number of edges of the longest path to a leaf', () => {
    const tree = buildSample();
    expect(tree.height(4)).toBe(2);
    expect(tree.height(2)).toBe(1);
    expect(tree.height(6)).toBe(1);
  });

  test('returns 0 for a leaf node', () => {
    const tree = buildSample();
    [1, 3, 5, 7].forEach((value) => expect(tree.height(value)).toBe(0));
  });

  test('uses the longest path in an uneven tree', () => {
    const tree = new Tree([1]);
    tree.insert(2);
    tree.insert(3);
    expect(tree.height(1)).toBe(2);
    expect(tree.height(2)).toBe(1);
    expect(tree.height(3)).toBe(0);
  });

  test('returns undefined if the value is not in the tree', () => {
    expect(buildSample().height(99)).toBeUndefined();
  });

  test('returns undefined on an empty tree', () => {
    expect(new Tree([]).height(1)).toBeUndefined();
  });
});

// Depth.
describe('depth', () => {
  test('returns the number of edges from the root to the node', () => {
    const tree = buildSample();
    expect(tree.depth(4)).toBe(0);
    expect(tree.depth(2)).toBe(1);
    expect(tree.depth(6)).toBe(1);
    expect(tree.depth(1)).toBe(2);
    expect(tree.depth(7)).toBe(2);
  });

  test('grows as nodes are inserted deeper', () => {
    const tree = buildSample();
    tree.insert(8);
    expect(tree.depth(8)).toBe(3);
  });

  test('returns undefined if the value is not in the tree', () => {
    expect(buildSample().depth(99)).toBeUndefined();
  });

  test('returns undefined on an empty tree', () => {
    expect(new Tree([]).depth(1)).toBeUndefined();
  });
});

// Balancing.
describe('isBalanced', () => {
  test('returns true for a tree built from an array', () => {
    expect(buildSample().isBalanced()).toBe(true);
    expect(new Tree([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).isBalanced()).toBe(true);
  });

  test('returns true for an empty tree and a single node', () => {
    expect(new Tree([]).isBalanced()).toBe(true);
    expect(new Tree([1]).isBalanced()).toBe(true);
  });

  test('returns true when the height difference is exactly 1', () => {
    const tree = new Tree([2, 4, 6]);
    tree.insert(1);
    expect(tree.isBalanced()).toBe(true);
  });

  test('returns false when the height difference is greater than 1', () => {
    const tree = new Tree([1]);
    tree.insert(2);
    tree.insert(3);
    expect(tree.isBalanced()).toBe(false);
  });

  test('returns false when only a deeper subtree is unbalanced', () => {
    // The root is balanced (both sides have height 2),
    // but node 5 has a left subtree of height 1 and no right subtree.
    const tree = new Tree([10]);
    [5, 15, 3, 1, 20, 25].forEach((value) => tree.insert(value));
    expect(tree.height(10)).toBe(3);
    expect(tree.isBalanced()).toBe(false);
  });

  test('returns false after inserting several large values', () => {
    const tree = new Tree([1, 2, 3, 4, 5, 6, 7]);
    [100, 200, 300, 400].forEach((value) => tree.insert(value));
    expect(tree.isBalanced()).toBe(false);
  });
});

describe('rebalance', () => {
  test('balances an unbalanced tree', () => {
    const tree = new Tree([1, 2, 3, 4, 5, 6, 7]);
    [100, 200, 300, 400].forEach((value) => tree.insert(value));
    expect(tree.isBalanced()).toBe(false);

    tree.rebalance();
    expect(tree.isBalanced()).toBe(true);
  });

  test('keeps all the values in the tree', () => {
    const tree = new Tree([1, 2, 3]);
    [10, 20, 30, 40].forEach((value) => tree.insert(value));
    const before = inOrder(tree);

    tree.rebalance();
    expect(inOrder(tree)).toEqual(before);
    expect(isValidBST(tree)).toBe(true);
  });

  test('balances a tree that degenerated into a linked list', () => {
    const tree = new Tree([1]);
    for (let i = 2; i <= 15; i += 1) tree.insert(i);
    expect(tree.height(1)).toBe(14);

    tree.rebalance();
    expect(tree.isBalanced()).toBe(true);
    expect(tree.height(tree.root.data)).toBe(3);
  });

  test('does not break an empty tree', () => {
    const tree = new Tree([]);
    expect(() => tree.rebalance()).not.toThrow();
    expect(tree.root).toBeNull();
  });

  test('works after deleting nodes', () => {
    const tree = new Tree([1, 2, 3, 4, 5, 6, 7]);
    [1, 2, 3].forEach((value) => tree.delete(value));
    tree.rebalance();
    expect(inOrder(tree)).toEqual([4, 5, 6, 7]);
    expect(tree.isBalanced()).toBe(true);
  });
});
