let Tree = require('../lib/tree');
let Errors = require('../lib/errors');
let tree=new Tree();
let ORDER=tree.CONST.ORDER;

function init(){
    let data=[{key:1, name:'Mike'},{key:2, name:'Peter'},{key:3, name:'Joe'},{key:4, name:'Tom'},{key:5, name:'Leo'},{key:6, name:'Jean'}];
    tree.init(data, true);
}

function _test(name, cb){
    test(name, ()=>{
        init();
        cb();
    })
}

_test('object tree: insert null', ()=>{
    expect(()=>{tree.insert();}).toThrow(Errors.ValidationError);
    expect(()=>{tree.insert();}).toThrow('Cannot insert null');
})

_test('object tree: insert duplication value', ()=>{
    expect(()=>{tree.insert({key:1, name:'Someone'});}).toThrow(Errors.DuplicationError);
    expect(()=>{tree.insert({key:1, name:'Someone'});}).toThrow('Value already exists');
})

_test('object tree: insert single value', ()=>{
    tree.insert({key:7, name:'Someone'});
    expect(tree.search(7).data.name).toBe('Someone');
    expect(tree.isBalanced()).toBe(true);
})

_test('object tree: insert list value', ()=>{
    tree.insert([{key:10, name:'Bill'}, {key:9, name:'Jonson'}, {key:8, name:'Jay'}]);
    expect(tree.search(8)).not.toBeNull();
    expect(tree.search(9)).not.toBeNull();
    expect(tree.search(10)).not.toBeNull();
    expect(tree.isBalanced()).toBe(true);
})
_test('object tree: remove value', ()=>{
    tree.remove(5);
    expect(tree.isBalanced()).toBe(true);
    expect(tree.search(5)).toBeNull();
})

_test('object tree: search null', ()=>{
    expect(()=>{tree.search();}).toThrow(Errors.ValidationError);
    expect(()=>{tree.search();}).toThrow('Cannot search null');
})

_test('object tree: search invalid input', ()=>{
    expect(()=>{tree.search({key:1, name:'Mike'})}).toThrow(Errors.ValidationError);
    expect(()=>{tree.search({key:1, name:'Mike'})}).toThrow('Input is not a number');
})

_test('object tree: search value', ()=>{
    expect(tree.search(5)).not.toBeNull();
    expect(tree.search(5).data.name).toBe('Leo');
})

_test('object tree: traversal in-order', ()=>{
    expect(tree.traversal(ORDER.InOrder).map(a=>a.key)).toEqual([1,2,3,4,5,6]);
})

_test('object tree: traversal pre-order', ()=>{
    expect(tree.traversal(ORDER.PreOrder).map(a=>a.key)).toEqual([3,1,2,5,4,6]);
})
_test('object tree: traversal post-order', ()=>{
    expect(tree.traversal(ORDER.PostOrder).map(a=>a.key)).toEqual([2,1,4,6,5,3]);
})
