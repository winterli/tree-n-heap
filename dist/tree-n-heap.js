(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
let Tree = require("./lib/tree");
let Heap = require("./lib/heap");
let Errors = require("./lib/errors");

if (typeof define === 'function' && define.amd) {
    define([], function() {
        return {
            Tree,
            Heap,
            Errors
        };
    });
}
else {
    window.Tree_N_Heap = {
        Tree,
        Heap,
        Errors
    };
}



},{"./lib/errors":2,"./lib/heap":3,"./lib/tree":4}],2:[function(require,module,exports){
'use strict'
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}
class DuplicationError extends Error {
    constructor(message) {
        super(message);
        this.name = "DuplicationError";
    }
}
module.exports={
    ValidationError,
    DuplicationError
}
},{}],3:[function(require,module,exports){
'use strict'
let Util = require('./util');
const ERROR = Util.ERROR();

let Heap =function(list, isMinHeap, isObjectMode){

    const _POSITION = {LEFT:0, RIGHT:1, ORPHAN:-1};
    const _VALUE_WIDTH = 6;

    Object.freeze(_POSITION);


    let _list = [];
    let _isObjectMode = false;
    let _isMinHeap=false;


    function init(list, isMinHeap, isObjectMode) {
        if(!!isMinHeap) _isMinHeap=true;
        if(!!isObjectMode) _isObjectMode=true;

        if(!list || list.length <= 0){
            return;
        }

        if(!Util.isValidList(list, _isObjectMode)) {
            Util.errorHandler(ERROR.Validation,'Input data list do not match the given data mode');
        }

        if(Util.hasDuplicates(list.map(x=> _isObjectMode ?  x.key : x))){
            Util.errorHandler(ERROR.Duplication,'Input data list has duplicate keys');
        }

        _list = list;
        build(_list);
    }

    function build(list) {
        let lv = level(list.length)-2;//start from 2nd last level.
        while(lv >= 0){
            let rg = range(lv);
            for(let i=rg.end; i>=rg.start; i--){
                shiftDown(i);
            }
            lv--;
        }
    }

    function checkChild(i) {
        let v = _list[i];
        let l = leftChild(i), r = rightChild(i);
        let c = -1;

        if(l<0 && r<0){
            return -1;
        }

        if(l>=0 && r>=0){
            c =  hasHigherWeight(_list[l], _list[r]) ? l : r;
        }else if(l>=0)
            c = l;
        else if(r>=0)
            c = r;

        if(hasHigherWeight(_list[c], v)){
            swap(i, c);
            return c;
        }else
            return -1;
    }

    function checkParent(i) {
        let v = _list[i];
        let p = parent(i);

        if(p>=0 && hasHigherWeight(v,_list[p])){
            swap(p, i);
            return p;
        }else
            return -1;
    }

    function isGreater(a, b) {
        return _isObjectMode ? a.key>b.key : a>b;
    }
    function hasHigherWeight(a, b) {
        return _isMinHeap ? !isGreater(a, b) : isGreater(a, b);
    }

    function swap(i, j) {
        let t = _list[i];
        _list[i] = _list[j];
        _list[j] = t;
    }

    function parent(i) {
        return i<=0 ? -1 : Math.floor((i-1)/2);
    }

    function leftChild(i) {
        let n = (i+1)*2-1;
        return n <= _list.length-1 ? n : -1;
    }
    function rightChild(i) {
        let n = (i+1)*2;
        return n <= _list.length-1 ? n : -1;
    }

    function level(i) {
        return Math.ceil(Math.log2(i+1));
    }


    function range(level) {
        //1+2+2^2+2^3+...+2^(n) = (2^(n+1)) - 1
        //http://mathcentral.uregina.ca/QQ/database/QQ.09.06/zamira1.html

        //level starts from 0.
        //Calculates the max total nodes of previous levels.
        let maxTotalTillPreviousLevel = Math.pow(2, level)-1;
        let maxTotalTillThisLevel = Math.pow(2, level+1)-1;

        return {start:maxTotalTillPreviousLevel, end: Math.min(maxTotalTillThisLevel - 1, _list.length - 1)};
    }

    function push(data) {
        if(data == null){
            Util.errorHandler(ERROR.Validation, 'Cannot push null');
        }
        if(Array.isArray(data)){
            if (!Util.isValidList(data, _isObjectMode)){
                Util.errorHandler(ERROR.Validation,'Input data list do not match the given data mode');
            }

            for(let d of data){
                push(d);
            }
        }else{
            if (!Util.isValidData(data, _isObjectMode)){
                Util.errorHandler(ERROR.Validation,'Input data do not match the given data mode');
            }

            let alreadyExist = _list.map(x=> _isObjectMode ?  x.key : x).indexOf(_isObjectMode ?  data.key : data)!==-1;

            if(alreadyExist){
                Util.errorHandler(ERROR.Duplication, 'Value already exists');
            }else{
                _list.push(data);
                shiftUp(_list.length-1);
            }
        }

    }

    function pop() {
        if(_list == null || _list.length<=0){
            return null;
        }

        let data = _list[0];
        _list[0] = _list[_list.length-1];
        _list.pop();
        shiftDown(0);
        return data;
    }


    function shiftDown(i) {
        let swapped = checkChild(i);
        if(swapped >= 0)
            shiftDown(swapped);
    }

    function shiftUp(i) {
        let swapped = checkParent(i);
        if(swapped >= 0)
            shiftUp(swapped);
    }

    function search(v){
        if(v == null){
            Util.errorHandler(ERROR.Validation, 'Cannot search null');
        }

        if(typeof v !== 'number'){
            Util.errorHandler(ERROR.Validation, 'Input is not a number');
        }

        return _search(_list, v);
    }

    function _search(list, v) {
        if(!list || list.length<=0) return null;

        if(_isObjectMode){
            for(let d of _list){
                if(d.key === v)
                    return d;
            }
            return null;
        }else{
            if(_list.indexOf(v)!==-1)
                return v;
            else
                return null;
        }
    }

    function peek() {
        if(_list == null || _list.length<=0){
            return null;
        }

        return _list[0];
    }

    function print() {
        console.log(toString(_list));
    }

    function toString(list) {
        return getVisualStr(list);
    }

    function getVisualStr(list){
        let maxLevel = level(list.length);
		let maxLeafNum = Math.pow(2, maxLevel);

		let maxWidth = maxLeafNum * _VALUE_WIDTH;
		let output = _getVisualStr([{i:0, position:_POSITION.ORPHAN}], maxWidth, maxLevel, 0);
		return output.join('\n');
	}

	function _getVisualStr(nodes, maxWidth, maxLevel, crtLevel){
		let output=[];

		if(crtLevel > maxLevel){
			return output;
		}
		let num = nodes.length;
		let space = maxWidth/num;

		if(crtLevel !== 0){
			output=output.concat(Util.generateConnectors(nodes, space));
		}

		let newNodes = [];
		let row = '';
		for(let n of nodes){
			if(!n){
				row += Util.formatNodeValue(null, space);
				newNodes.push(null);
				newNodes.push(null);
			}else{
				row += Util.formatNodeValue( _isObjectMode?_list[n.i].key:_list[n.i], space);

				if(leftChild(n.i) !== -1){
					newNodes.push({i:leftChild(n.i), position:_POSITION.LEFT});
				}else{
					newNodes.push(null);
				}
				if(rightChild(n.i) !== -1){
					newNodes.push({i:rightChild(n.i), position:_POSITION.RIGHT});
				}else{
					newNodes.push(null);
				}
			}
		}
		output.push(row);
		output = output.concat(_getVisualStr(newNodes, maxWidth, maxLevel, crtLevel+1));
		return output;
	}

    init(list, isMinHeap, isObjectMode);

    return {
        init,
        push,
        pop,
        peek,
        search,
        toString,
        print
    }

}

module.exports = Heap;

},{"./util":5}],4:[function(require,module,exports){
'use strict'

let Util = require('./util');
const ERROR = Util.ERROR();

let Tree =function(list, isObjectMode){

	const _POSITION = {LEFT:0, RIGHT:1, ORPHAN:-1};
	const _ORDER = {PreOrder:0, InOrder:1, PostOrder:2};

	const _VALUE_WIDTH = 6;

	Object.freeze(_POSITION);
	Object.freeze(_ORDER);


	let _root = null;
	let _isObjectMode=false;

	function toJSON(node) {
		return node ? _toJSON(node) : _toJSON(_root);
	}

	function _toJSON(node) {
		let data = {v:node.value};
		if(node.left){
			data.l = _toJSON(node.left);
		}
		if(node.right){
			data.r = _toJSON(node.right);
		}
		return data;
	}

	function height(node){
		return node ? Math.max(height(node.left), height(node.right))+1 : -1;
	}

	function init(list, isObjectMode){
		if(!!isObjectMode) _isObjectMode=true;

		if(!list || list.length <= 0){
			return;
		}

		if(!Util.isValidList(list, _isObjectMode)) {
			Util.errorHandler(ERROR.Validation,'Input data list do not match the given data mode');
		}

		if(Util.hasDuplicates(list.map(x=> _isObjectMode ?  x.key : x))){
			Util.errorHandler(ERROR.Duplication,'Input data list has duplicate keys');
		}

		list = list.sort(function(a, b){return _isObjectMode ? a.key-b.key : a - b;});

		_root = _create(list, null, _POSITION.ORPHAN,0,list.length-1);
	}

	function _create(list, parent, position, start, end) {
		if(start > end) return null;

		let i = Math.floor(start+(end-start)/2);
		let node = new Node(list[i], parent, position);
		if(start !== end){
			node.left = _create(list, node, _POSITION.LEFT, start,i-1);
			node.right = _create(list, node, _POSITION.RIGHT,i+1, end);
		}
		return node;
	}


	function insert(data){
		if(data == null){
			Util.errorHandler(ERROR.Validation, 'Cannot insert null');
		}
		if(Array.isArray(data)){
			if (!Util.isValidList(data, _isObjectMode)){
				Util.errorHandler(ERROR.Validation,'Input data list do not match the given data mode');
			}

			for(let d of data){
				insert(d);
			}
		}else{
			if (!Util.isValidData(data, _isObjectMode)){
				Util.errorHandler(ERROR.Validation,'Input data do not match the given data mode');
			}

			if(!_root){
				_root = new Node(data, null, _POSITION.ORPHAN);
				return;
			}
			if(_isObjectMode ? search(data.key) : search(data)){
				Util.errorHandler(ERROR.Duplication, 'Value already exists');
			}else{
				_insert(_root, data);
			}
		}
	}


	function _insert(node, data){
		let value= _isObjectMode ? data.key : data;
		if(value < node.value){
			if(node.left){
				_insert(node.left, data);
			}else{
				node.left = new Node(data, node, _POSITION.LEFT);
				balance(node.left);
			}
		}else{
			if(node.right){
				_insert(node.right, data);
			}else{
				node.right = new Node(data, node, _POSITION.RIGHT);
				balance(node.right);
			}
		}
	}

	function search(v){
		if(v == null){
			Util.errorHandler(ERROR.Validation, 'Cannot search null');
		}

		if(typeof v !== 'number'){
			Util.errorHandler(ERROR.Validation, 'Input is not a number');
		}

		return _search(_root, v);
	}

	function _search(node, v) {
		if(!node) return null;

		if(node.value === v){
			return node;
		}else if (node.value > v){
			return _search(node.left, v);
		}else{
			return _search(node.right, v);
		}
	}

	function remove(v) {
		let node = search(v);
		if(!node){
			Util.errorHandler(ERROR.Validation, 'Value not found');
		}
		let last = _remove(node);
		if(last){
			balance(last);
		}
	}
	function _remove(node) {
		let last = null;
		if(node.left && node.right){
			let maxInLeft = rightest(node.left);
			node.value = maxInLeft.value;
			node.data = maxInLeft.data;
			last = _remove(maxInLeft);
		}else if(node.left){
			last = liftChild(node, node.left);
		}else if(node.right){
			last = liftChild(node, node.right);
		}else{
			last = liftChild(node, null);
		}
		return last;
	}

	function liftChild(node, child) {
		let p = node.parent;
		let position = node.position;
		unbind(node);
		node = null;
		if(child){
			bind(p, position, child);
		}
		return p;
	}

	function leftest(node) {
		if(!node) return null;

		if(node.left)
			return leftest(node.left)
		else
			return node;
	}
	function rightest(node) {
		if(!node) return null;

		if(node.right)
			return rightest(node.right)
		else
			return node;
	}

	function isBalanced() {
		return _isBalanced(_root);
	}

	function _isBalanced(node) {
		if(!node) return true;

		let bf = factor(node);

		if(bf > 1 || bf < -1){
			return false;
		}else{
			return _isBalanced(node.left) && _isBalanced(node.right);
		}
	}

	function balance(node) {
		if(!node) return false;

		let bf = factor(node);
		let nextNode = node.parent;
		let unbalancedEver = false;

		if(bf > 1 || bf < -1){
			//Util.debug(node.value + ' is not balanced!');
			rotate(node, bf);
			unbalancedEver = true;
		}
		if(nextNode){
			unbalancedEver = unbalancedEver || balance(nextNode);
		}

		if(!nextNode && unbalancedEver){
			//find the new root when the old root has been rebalanced.
			_root = node.parent;
		}
		return unbalancedEver;
	}

	function factor(node) {
		return height(node.left) - height(node.right);
	}

	function rotate(node, bf) {
		if(bf > 1 && factor(node.left) < 0){
			rotateLeft(node.left);
		}
		if(bf <- 1 && factor(node.right) > 0){
			rotateRight(node.right);
		}

		if(bf > 1){
			rotateRight(node);
		}else{
			rotateLeft(node);
		}
	}

	function rotateLeft(node) {
		let t = node.right;

		//adjust t
		bind(node.parent, node.position, t);

		//adjust t's left child
		if(t.left){
			bind(node, _POSITION.RIGHT, t.left);
		}

		//adjust node
		bind(t, _POSITION.LEFT, node);
	}

	function rotateRight(node) {///
		let t = node.left;

		//adjust t
		bind(node.parent, node.position, t);

		//adjust t's right child
		if(t.right){
			bind(node, _POSITION.LEFT, t.right);
		}

		//adjust node
		bind(t, _POSITION.RIGHT, node);
	}

	function bind(parent, position, node) {
		unbind(node);

		if(parent){
			if(position === _POSITION.RIGHT){
				parent.right = node;
			}else{
				parent.left = node;
			}
			node.position = position;
			node.parent = parent;
		}

	}

	function unbind(child) {
		if(child.parent){
			if(child.position === _POSITION.RIGHT){
				if(child.parent.right == child)
					child.parent.right = null;
			}else{
				if(child.parent.left == child)
					child.parent.left = null;
			}
			child.parent = null;
			child.position = _POSITION.ORPHAN;
		}
	}

	function print(node) {
		node ? console.log(toString(node)) : console.log(toString(_root));
	}

	function toString(node) {
		return getVisualStr(node);
	}

	function getVisualStr(node){
		let maxLevel = height(node);
		let maxLeafNum = Math.pow(2, maxLevel);

		let maxWidth = maxLeafNum * _VALUE_WIDTH;
		let output = _getVisualStr([node], maxWidth, maxLevel, 0);
		return output.join('\n');
	}

	function _getVisualStr(nodes, maxWidth, maxLevel, crtLevel){
		let output=[];

		if(crtLevel > maxLevel){
			return output;
		}
		let num = nodes.length;
		let space = maxWidth/num;

		if(crtLevel !== 0){
			output=output.concat(Util.generateConnectors(nodes, space));
		}

		let newNodes = [];
		let row = '';
		for(let n of nodes){
			if(!n){
				row += Util.formatNodeValue(null, space);
				newNodes.push(null);
				newNodes.push(null);
			}else{
				row += Util.formatNodeValue(n.value, space);

				if(n.left){
					newNodes.push(n.left);
				}else{
					newNodes.push(null);
				}
				if(n.right){
					newNodes.push(n.right);
				}else{
					newNodes.push(null);
				}
			}
		}
		output.push(row);
		output = output.concat(_getVisualStr(newNodes, maxWidth, maxLevel, crtLevel+1));
		return output;
	}

	function traversal(order) {
		switch(order){
			case _ORDER.PreOrder:
				return _traversalPreOrder(_root);
			case _ORDER.InOrder:
				return _traversalInOrder(_root);
			case _ORDER.PostOrder:
				return _traversalPostOrder(_root);
			default:
				return _traversalInOrder(_root);
		}

	}
	function _traversalPreOrder(node) {
		let result = [];
		if(node){
			if(node.left){
				result = result.concat(_traversalPreOrder(node.left));
			}
			result.push(node.data);
			if(node.right){
				result = result.concat(_traversalPreOrder(node.right));
			}
		}
		return result;
	}
	function _traversalInOrder(node) {
		let result = [];
		if(node){
			result.push(node.data);
			if(node.left){
				result = result.concat(_traversalInOrder(node.left));
			}
			if(node.right){
				result = result.concat(_traversalInOrder(node.right));
			}
		}
		return result;
	}
	function _traversalPostOrder(node) {
		let result = [];
		if(node){
			if(node.right){
				result = result.concat(_traversalPostOrder(node.right));
			}
			result.push(node.data);
			if(node.left){
				result = result.concat(_traversalPostOrder(node.left));
			}
		}
		return result;
	}

	function Node(data, parent, position) {
		this.value = _isObjectMode ? data.key : data;
		this.data = data;
		this.left = null;
		this.right = null;
		this.parent = parent;
		this.position = position;
	}

	init(list, isObjectMode);

	return {
		Node,
		CONST:{ORDER:_ORDER},
		init,
		insert,
		search,
		remove,
		isBalanced,
		traversal,
		toJSON,
		toString,
		print
	}

}

module.exports = Tree;
},{"./util":5}],5:[function(require,module,exports){
let Errors = require('./errors');

class Util{

    static findFirstDuplicates(list) {
        for(let d of list){
            if(list.indexOf(d) !== list.lastIndexOf(d))
                return d;
        }
        return null;
    }

    static hasDuplicates(list){
        return Util.findFirstDuplicates(list) != null;
    }

    static isValidList(list, isObj) {
        for(let d of list){
            if(!Util.isValidData(d, isObj)) return false;
        }
        return true;
    }

    static isValidData(data, isObj) {
        return isObj ? typeof data === 'object' && data.key !== null : typeof data === 'number';
    }



    //use function instead of property because static properties are not supported so far.
    static ERROR() {
        return {Validation:0, Duplication:1};
    }

    static errorHandler(err, msg) {
        switch (err) {
            case Util.ERROR().Validation:
                throw new Errors.ValidationError(msg);
                break;
            case Util.ERROR().Duplication:
                throw new Errors.DuplicationError(msg);
                break;
            default:
                throw new Error(msg);
        }
    }

    /*static debug(msg) {
        console.log(msg);
    }*/


    static POSITION(){
        return {LEFT:0, RIGHT:1, ORPHAN:-1};
    }

    static generateConnectors(nodes, space){
        let row = '';
        for(let n of nodes){
            row += Util.generateConnectorsForNode(n, space);
        }
        return [row];
    }

    static formatNodeValue(value, space){
        let SPACE_CHAR=' ';

        if(value === null){
            return SPACE_CHAR.repeat(space);
        }

        let digits = Math.floor(Math.log10(value))+1;
        let frontPadding = Math.floor((space-digits)/2);
        let rearPadding = space-digits-frontPadding;
        return SPACE_CHAR.repeat(frontPadding)+value+SPACE_CHAR.repeat(rearPadding);
    }

    static generateConnectorsForNode(node, space){
        let SPACE_CHAR=' ';

        if(node == null) return SPACE_CHAR.repeat(space);

        let frontPadding = Math.floor((space-1)/2);
        let rearPadding = space-1-frontPadding;
        let branch = node.position === Util.POSITION().LEFT ?'/':'\\';

        return SPACE_CHAR.repeat(frontPadding)+branch+SPACE_CHAR.repeat(rearPadding);
    }
}



module.exports=Util;
},{"./errors":2}]},{},[1]);
