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

        if(!Util.isListValid(list, _isObjectMode)) {
            Util.errorHandler(ERROR.Validation,'Input data list do not match the given data mode');
        }

        if(Util.hasDuplicates(list.map(x=> _isObjectMode ?  x.key : x))){
            Util.errorHandler(ERROR.Duplication,'Input data list has duplicate keys');
        }

        _list = list;
        build(_list);
    }

    function build(list) {
        let lv = level(list.length-1)-1;
        while(lv >= 0){
            let rg = range(lv);
            for(let i=rg.start; i<=rg.end; i++){
                checkChild(i);
            }
            lv--;
        }
    }

    function checkChild(i) {
        let v = _list[i];
        let l = leftChild(i), r = rightChild(i);
        let c = -1;
        if(l>=0 && r>=0){
            c =  hasHigherWeight(_list[l], _list[r]) ? l : r;
        }else if(l>=0)
            c = l;
        else if(r>=0)
            c = r;

        if(c>=0 && hasHigherWeight(_list[c], v)){
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
        return Math.floor(Math.log2(i+1));
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
            if (!Util.isListValid(data, _isObjectMode)){
                Util.errorHandler(ERROR.Validation,'Input data list do not match the given data mode');
            }

            for(let d of data){
                push(d);
            }
        }else{
            if (!Util.isDataValid(data, _isObjectMode)){
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


    function print() {
        console.log(toString(_list));
    }

    function toString(list) {
        return getVisualStr(list);
    }

    function getVisualStr(list){
        let maxLevel = level(list.length-1);
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
        search,
        toString,
        print
    }

}

module.exports = Heap;
