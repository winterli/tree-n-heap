let Tree = require('../lib/tree');
let Errors = require('../lib/errors');
let tree=new Tree();
let ORDER=tree.CONST.ORDER;

function init(){
    let data=[1,2,3,4,5,6];
    tree.init(data);
}

function _test(name, cb){
    test(name, ()=>{
        init();
        cb();
    })
}

_test('number tree: insert null', ()=>{
    expect(()=>{tree.insert();}).toThrow(Errors.ValidationError);
    expect(()=>{tree.insert();}).toThrow('Cannot insert null');
})

_test('number tree: insert duplication value', ()=>{
    expect(()=>{tree.insert(1);}).toThrow(Errors.DuplicationError);
    expect(()=>{tree.insert(1);}).toThrow('Value already exists');
})

_test('number tree: insert single value', ()=>{
    tree.insert(7);
    expect(tree.search(7).parent.value).toBe(6);
    expect(tree.isBalanced()).toBe(true);
})

_test('number tree: insert list value', ()=>{
    tree.insert([10, 9, 8]);
    expect(tree.search(8)).not.toBeNull();
    expect(tree.search(9)).not.toBeNull();
    expect(tree.search(10)).not.toBeNull();
    expect(tree.isBalanced()).toBe(true);
})
_test('number tree: remove value', ()=>{
    tree.remove(5);
    expect(tree.isBalanced()).toBe(true);
    expect(tree.search(5)).toBeNull();
})

_test('number tree: search null', ()=>{
    expect(()=>{tree.search();}).toThrow(Errors.ValidationError);
    expect(()=>{tree.search();}).toThrow('Cannot search null');
})

_test('number tree: search invalid input', ()=>{
    expect(()=>{tree.search('dummy')}).toThrow(Errors.ValidationError);
    expect(()=>{tree.search('dummy')}).toThrow('Input is not a number');
})

_test('number tree: search value', ()=>{
    expect(tree.search(5)).not.toBeNull();
    expect(tree.search(5).value).toBe(5);
})

_test('number tree: traversal pre-order', ()=>{
    expect(tree.traversal(ORDER.PreOrder)).toEqual([1,2,3,4,5,6]);
})

_test('number tree: traversal in-order', ()=>{
    expect(tree.traversal(ORDER.InOrder)).toEqual([3,1,2,5,4,6]);
})
_test('number tree: traversal post-order', ()=>{
    expect(tree.traversal(ORDER.PostOrder)).toEqual([6,5,4,3,2,1]);
})

_test('number tree: to JSON', ()=>{
    expect(tree.toJSON()).toEqual({ v: 3, l: { v: 1, r: { v: 2 } },r: { v: 5, l: { v: 4 }, r: { v: 6 } } });
})

