# Tree-N-Heap

_A simple AVL Tree and Max(Min) Heap library which works in both client side and server side with no dependency._


## Installation

### For NodeJS
> _Make sure you have NodeJS and NPM installed._

Install this library

`npm install tree-n-heap`

### For browser
Add script reference for tree-n-heap.js

`<script type="text/javascript" src="tree-n-heap.js"></script>`  

## Create Instance

### For NodeJS
```bash
let { Tree, Heap, Errors } = require('tree-n-heap');
```

### For Browser
```bash
let { Tree, Heap, Errors } = Tree_N_Heap;
```

## Get Started - Tree (AVL)

AVL Tree is a self balanced binary search tree. You can refer to <a href="https://en.wikipedia.org/wiki/AVL_tree">here</a> for details.

#### Init

The `init(list, isObjectMode)` has two arguments,
- _`list` is an `array`. The array element can be numerical value or JSON object. For JSON object, make sure each element has a key property. For example `{key: 6, ...}`_
- _`isObjectMode` is `boolean`. You can set it to `true` if you want to use the object mode. Default is `false`_


```bash
let tree = new Tree();
tree.init([2, 6, 3, 1, 4, 9]);
tree.print();
```

You should get below output in console

```bash
           3            
     /           \      
     1           6      
        \     /     \   
        2     4     9   
```

> _The initial data can be put in the constructor too. For example, `new Tree([1, 2, 3])` ._


#### Insert

```bash
tree.insert(12);
tree.insert([8, 17]);
tree.print();
```
> _`Insert()` supports both single and multiple values._

You should get below output in console

```bash
                       3                        
           /                       \            
           1                       9            
                 \           /           \      
                 2           6           12     
                          /     \           \   
                          4     8           17  
```

> _Notice several rotations have been done to maintain its AVL properties._

#### Search

```bash
let n = tree.search(3);
```
> _The returned `n` is a `Tree.Node` object._


#### Remove

```bash
tree.remove(6);
```

#### Traversal

There are three traversal orders: `PreOrder`, `InOrder` and `PostOrder`. You can use the built in enumerate values for order.  

```bash
tree.init([2, 6, 3, 1, 4, 9]);
let ORDER = tree.CONST.ORDER;
let result = tree.traversal(ORDER.PreOrder);
console.log(result);
```

Since it's PreOrder, the result is a sorted array. 

```bash
[1, 2, 3, 4, 6, 9]
```

#### Others

The `toJSON()` method will generate a JSON object of the tree. Just in case. 

```bash
 {
     "v": 3,
     "l": {
         "v": 1,
         "r": {
             "v": 2
         }
     },
     "r": {
         "v": 6,
         "l": {
             "v": 4
         },
         "r": {
             "v": 9
         }
     }
 }
 ```
	
The `toString()` method will generate a string to visualize the tree.

The `print()` method will print the result of `toString()` to `console`.


## Get Started - Heap

This library supports both Max Heap and Min Heap.

#### Init

The `init(list, isMinHeap, isObjectMode)` has three arguments,
- _`list` is an `array`. The array element can be numerical value or JSON object. For JSON object, make sure each element has a key property. For example `{key: 6, ...}`_
- _`isMinHeap` is `boolean`. You can set it to `true` if you want to build a Min Heap. Otherwise the heap will be a Max Heap. Default is `false`_
- _`isObjectMode` is `boolean`. You can set it to `true` if you want to use the object mode. Default is `false`_


```bash
let heap = new Heap();
heap.init([2, 6, 3, 1, 4, 9]);
heap.print();
```
> _The initial data can be put in the constructor too. For example, `new Heap([1, 2, 3])` ._

You should get below output in console

```bash
                       9                        
           /                       \            
           6                       3            
     /           \           /                  
     1           4           2                  
```

#### Push

```bash
heap.push(12);
heap.push([8, 17]);
heap.print();
```
> _`Push()` supports both single and multiple values._

You should get below output in console

```bash
                                               17                                               
                       /                                               \                        
                       12                                              9                        
           /                       \                       /                       \            
           8                       4                       2                       3            
     /           \                                                                              
     1           6                                                                             
```

#### Pop

```bash
console.log(heap.pop());
console.log(heap.pop());
heap.print();
```
> _`pop()` will remove the root node from the heap._

You should get below output in console

```bash
17
12

                       9                        
           /                       \            
           8                       3            
     /           \           /           \      
     6           4           2           1

```

#### Peek

Peek will return the root node of the heap, but won't remove it from heap.

```bash
let n = heap.peek();
```

#### Search

```bash
let n = heap.search(3);
```
> _The returned `n` is the found element._


#### Others
	
The `toString()` method will generate a string to visualize the heap.

The `print()` method will print the result of `toString()` to `console`.


