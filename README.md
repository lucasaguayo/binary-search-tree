# Binary Search Tree

A JavaScript implementation of a balanced binary search tree (BST), built as part of [The Odin Project](https://www.theodinproject.com/lessons/javascript-binary-search-trees) curriculum.

## Purpose

This project was created for practice and study. Its goal is to better understand how binary search trees work: how they are built, searched, modified, traversed and kept balanced, and how recursion and queues come into play along the way.

## Features

The `Tree` class is built from an array. The array is sorted and stripped of duplicates before the tree is created, so the initial tree is always balanced.

| Method | Description |
| --- | --- |
| `includes(value)` | Checks whether a value exists in the tree. |
| `insert(value)` | Adds a new value as a leaf (duplicates are ignored). |
| `delete(value)` | Removes a value, handling leaf, one-child and two-children cases. |
| `levelOrderForEach(callback)` | Traverses the tree breadth-first. |
| `preOrderForEach(callback)` | Traverses the tree in pre-order (root, left, right). |
| `inOrderForEach(callback)` | Traverses the tree in order (left, root, right). |
| `postOrderForEach(callback)` | Traverses the tree in post-order (left, right, root). |
| `height(value)` | Returns the number of edges in the longest path from the node to a leaf. |
| `depth(value)` | Returns the number of edges from the root to the node. |
| `isBalanced()` | Checks whether the height difference between the left and right subtrees of every node is at most 1. |
| `rebalance()` | Rebuilds the tree from its current values so that it is balanced again. |
| `prettyPrint()` | Prints the tree to the console. |

The traversal methods throw an error if no callback function is provided. `height` and `depth` return `undefined` when the value is not in the tree.