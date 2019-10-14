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
			Util.debug(node.value + ' is not balanced!');
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