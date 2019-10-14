let Heap = require('../lib/heap');
let Errors = require('../lib/errors');
let heap=new Heap();

function init(){
    let data=[{key:1, name:'Mike'},{key:2, name:'Peter'},{key:3, name:'Joe'},{key:4, name:'Tom'},{key:5, name:'Leo'},{key:6, name:'Jean'}];
    heap.init(data, false, true);
}

function _test(name, cb){
    test(name, ()=>{
        init();
        cb();
    })
}


_test('heap object: push null', ()=>{
    expect(()=>{heap.push();}).toThrow(Errors.ValidationError);
    expect(()=>{heap.push();}).toThrow('Cannot push null');
})

_test('heap object: push duplication value', ()=>{
    expect(()=>{heap.push({key:1, name:'Someone'});}).toThrow(Errors.DuplicationError);
    expect(()=>{heap.push({key:1, name:'Someone'});}).toThrow('Value already exists');
})

_test('heap object: push single value', ()=>{
    heap.push({key:7, name:'Someone'});
    expect(heap.search(7).name).toBe('Someone');
})

_test('heap object: push list value', ()=>{
    heap.push([{key:10, name:'Bill'}, {key:9, name:'Jonson'}, {key:8, name:'Jay'}]);
    expect(heap.search(8)).not.toBeNull();
    expect(heap.search(9)).not.toBeNull();
    expect(heap.search(10)).not.toBeNull();
})


_test('heap object: search null', ()=>{
    expect(()=>{heap.search();}).toThrow(Errors.ValidationError);
    expect(()=>{heap.search();}).toThrow('Cannot search null');
})

_test('heap object: search invalid input', ()=>{
    expect(()=>{heap.search({key:1, name:'Mike'})}).toThrow(Errors.ValidationError);
    expect(()=>{heap.search({key:1, name:'Mike'})}).toThrow('Input is not a number');
})

_test('heap object: search value', ()=>{

    expect(heap.search(1)).not.toBeNull();
    expect(heap.search(1).name).toBe('Mike');
})

_test('heap object: pop', ()=>{
    let data=[{key:1, name:'Mike'},{key:2, name:'Peter'},{key:3, name:'Joe'},{key:4, name:'Tom'},{key:5, name:'Leo'},{key:6, name:'Jean'}];
    heap.init(data, false, true);

    expect(heap.pop()).toEqual({key:6, name:'Jean'});
    expect(heap.pop()).toEqual({key:5, name:'Leo'});
    expect(heap.pop()).toEqual({key:4, name:'Tom'});
})

