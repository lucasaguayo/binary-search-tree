// Node class.
class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

// Tree class.
class Tree {
  constructor(array) {
    // The data is sorted and duplicates are removed before building the tree.
    const sorted = [...new Set(array)].sort((a, b) => a - b);
    this.root = this.#buildTree(sorted, 0, sorted.length - 1);
  }

  // Checks if a value exists in the tree.
  includes(value) {
    let current = this.root;

    while (current !== null) {
      if (value === current.data) return true;
      if (value < current.data) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    return false;
  }

  // Inserts a new node to the tree with the given value.
  insert(value) {
    const newNode = new Node(value);

    // If the tree is empty, it creates the root.
    if (this.root === null) {
      this.root = newNode;
      return;
    };

    // It finds the node that is going to have the new node as its child.
    let current = this.root; 
    
    while(current !== null) {
      if (value === current.data) return;

      // If the value is less than the value of the current node, 
      if (value < current.data) {
        // it is added to the first leaf node encountered on the left side.
        if (current.left === null) {
          current.left = newNode;
          return;
        }
        current = current.left;
      } else {
        // Otherwise, it is added to the first leaf node found on the right side.
        if (current.right === null) {
          current.right = newNode;
          return;
        }
        current = current.right;
      }
    }
  }

  // Removes a node from the tree given a value.
  delete(value) {
    this.root = this.#removeNode(this.root, value)
  }

  // Returns the height from a given value.
  // Height is defined as the number of edges in the longest path from that node to a leaf node.
  height(value) {
    const node = this.#findNode(value);
    if (node === null) return;
    return this.#nodeHeight(node);
  }
  
  // Returns the depth from a given value.
  // Depth is defined as the number of edges in the path from that node to a the root.
  depth(value) {
    let currentNode = this.root;
    let edges = 0;

    while (currentNode !== null) {
      if (value === currentNode.data) return edges;
      if (value < currentNode.data) {
        currentNode = currentNode.left;
      } else {
        currentNode = currentNode.right;
      }

      edges++;
    }

    return;
  }

  // Checks if the BST is balanced.
  // A binary tree is considered balanced if, for every node in the tree, the height difference between 
  // its left and right subtrees is no more than 1, and both the left and right subtrees are also balanced.
  isBalanced() {
    return this.#checkBalance(this.root) !== null;
  }

  // Rebuilds the tree, balancing it, based on its current values.
  rebalance() {
    const values = [];
    this.inOrderForEach((node) => values.push(node.data));
    this.root = this.#buildTree(values, 0, values.length - 1);
  }

  // Traversals.
  // Level order traversal.
  levelOrderForEach(callback) {
    if (typeof callback !== 'function') {
      throw new Error('A callback function is required.');
    }

    if (this.root === null) return;

    const queue = [this.root];
     
    // Until the queue is empty.
    while (queue.length > 0) {
      // Removes the first element of the queue,
      const node = queue.shift();
      // and processes it, printing it out.
      callback(node);

      // If the node has children, we add them to the queue.
      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }
    
  }

  // Traverse the tree in pre order: root, left, right.
  preOrderForEach(callback, node = this.root) {
    if (typeof callback !== 'function') {
      throw new Error('A callback function is required.');
    }

    if (node === null) return;

    callback(node);
    this.preOrderForEach(callback, node.left);
    this.preOrderForEach(callback, node.right);

  }

  // Traverse the tree in order: left, root, right.
  inOrderForEach(callback, node = this.root) {
    if (typeof callback !== 'function') {
      throw new Error('A callback function is required.');
    }

    if (node === null) return;

    this.inOrderForEach(callback, node.left);
    callback(node);
    this.inOrderForEach(callback, node.right);
  }

  // Traverse the tree in post order: left, right, root.
  postOrderForEach(callback, node = this.root) {
    if (typeof callback !== 'function') {
      throw new Error('A callback function is required.');
    }

    if (node === null) return;

    this.postOrderForEach(callback, node.left);
    this.postOrderForEach(callback, node.right);
    callback(node);
  }

  // Printer.
  prettyPrint(node, prefix = '', isLeft = true) {
    if (node === null || node === undefined) return;

    this.prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
    this.prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
  }


  // Helpers
  // Builds the tree from a given array.
  #buildTree(array, start, end) {
    if (start > end) return null;
    const mid = Math.floor(start + (end - start) / 2);
    const root = new Node(array[mid]);

    // Creates the tree nodes recursively.
    root.left = this.#buildTree(array, start, mid - 1);
    root.right = this.#buildTree(array, mid + 1, end);
  
    return root;
  }

  // Searches for and returns a node given a value
  #findNode(value) {
    let currentNode = this.root;
     
    while (currentNode !== null) {
      if (value === currentNode.data) return currentNode;
      if (value < currentNode.data) {
        currentNode = currentNode.left;
      } else {
        currentNode = currentNode.right;
      }
    }

    return null;
  }

  // Returns the height of a node.
  #nodeHeight(node) {
    if (node === null) return -1;
    const leftHeight = this.#nodeHeight(node.left);
    const rightHeight = this.#nodeHeight(node.right);
    return Math.max(leftHeight, rightHeight) + 1;
  }

  // It removes a node from the tree.
  #removeNode(node, value) {
    if (node === null) return null;

    if (value < node.data) {
      node.left = this.#removeNode(node.left, value);
      return node;
    }

    if (value > node.data) {
      node.right = this.#removeNode(node.right, value);
      return node;
    }
 
    // Case 1 and 2. Without children, or with only one child.
    // If the left side is empty, it means that either it has no children, or it has only one child on the right side.
    if (node.left === null) return node.right;
    // If the right side is empty, it means that either it has no children, or it has only one child on the left side.
    if (node.right === null) return node.left;


    // Case 3. Two children, it is replaced by its in-order successor.
    // Takes a step to the right to proceed toward obtaining the largest number.
    let successor = node.right;
    // It moves to the left as far as it can go, looking for the smallest of the larger numbers.
    while (successor.left !== null) {
      successor = successor.left;
    }

    // Replaces the value of the node to be deleted with the value of its successor.
    node.data = successor.data;
    node.right = this.#removeNode(node.right, successor.data);

    return node;
  }

  // Checks if a node is balanced.
  #checkBalance(node) {
    // When it reaches the end and finds null, it returns -1.
    if (node === null) return -1;
    
    // These validations (sideHeight === null) simply pass 'null' to the preceding recursive function, which is awaiting a return value.
    const leftHeight = this.#checkBalance(node.left);
    if (leftHeight === null) return null;

    const rightHeight = this.#checkBalance(node.right);
    if (rightHeight === null) return null;
    
    // If at any point an imbalance is detected (Math.abs(...) > 1), it returns null.
    // If it returns null, a domino effect is triggered. All the calls that were paused and waiting on the call stack receive that null.
    if (Math.abs(leftHeight - rightHeight) > 1) return null;

    // Otherwise, it is balanced.
    return Math.max(leftHeight, rightHeight) + 1;
  }
}

export { Node, Tree };

// Tests.
function getRandomValues(size = 10, max = 100) {
  return Array.from(
    { length: size },
    () => Math.floor(Math.random() * max)
  )
}

const randomData = getRandomValues();

// Creating the BST.
const tree = new Tree(randomData);

// Checking if the tree is balanced.
console.log(tree.isBalanced());

// Printing.
console.log('\nLevel Order Traversal.');
tree.levelOrderForEach(node => process.stdout.write(node.data + " "));

console.log('\nPre Order Traversal.');
tree.preOrderForEach(node => process.stdout.write(node.data + " "));

console.log('\nIn Order Traversal.');
tree.inOrderForEach(node => process.stdout.write(node.data + " "));

console.log('\nPost Order Traversal.');
tree.postOrderForEach(node => process.stdout.write(node.data + " "));

// Inserting (and unbalancing the tree).
console.log("\nInserting values greater than 100.");
tree.insert(213);
tree.insert(178);
tree.insert(382);
tree.prettyPrint(tree.root);

// Checks if the tree is balanced.
console.log(tree.isBalanced());

// Balancing the tree.
tree.rebalance();
console.log(tree.isBalanced());
tree.prettyPrint(tree.root);

// Printing again.
console.log('\nLevel Order Traversal.');
tree.levelOrderForEach(node => process.stdout.write(node.data + " "));

console.log('\nPre Order Traversal.');
tree.preOrderForEach(node => process.stdout.write(node.data + " "));

console.log('\nIn Order Traversal.');
tree.inOrderForEach(node => process.stdout.write(node.data + " "));

console.log('\nPost Order Traversal.');
tree.postOrderForEach(node => process.stdout.write(node.data + " "));
