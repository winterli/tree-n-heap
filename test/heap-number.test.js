let Heap = require('../lib/heap');
let Errors = require('../lib/errors');
let heap=new Heap();

function init(){
    let data=[1,2,3,4,5,6];
    heap.init(data);
}

function _test(name, cb){
    test(name, ()=>{
        init();
        cb();
    })
}


_test('heap number: push null', ()=>{
    expect(()=>{heap.push();}).toThrow(Errors.ValidationError);
    expect(()=>{heap.push();}).toThrow('Cannot push null');
})

_test('heap number: push duplication value', ()=>{
    expect(()=>{heap.push(1);}).toThrow(Errors.DuplicationError);
    expect(()=>{heap.push(1);}).toThrow('Value already exists');
})

_test('heap number: push single value', ()=>{
    heap.push(7);
    expect(heap.search(7)).toBe(7);
})

_test('heap number: push list value', ()=>{
    heap.push([10, 9, 8]);
    expect(heap.search(8)).not.toBeNull();
    expect(heap.search(9)).not.toBeNull();
    expect(heap.search(10)).not.toBeNull();
})


_test('heap number: search null', ()=>{
    expect(()=>{heap.search();}).toThrow(Errors.ValidationError);
    expect(()=>{heap.search();}).toThrow('Cannot search null');
})

_test('heap number: search invalid input', ()=>{
    expect(()=>{heap.search('dummy')}).toThrow(Errors.ValidationError);
    expect(()=>{heap.search('dummy')}).toThrow('Input is not a number');
})

_test('heap number: search value', ()=>{

    expect(heap.search(1)).not.toBeNull();
    expect(heap.search(1)).toBe(1);
})

_test('heap number: pop', ()=>{
    let data=[1,2,3,4,5,6];
    heap.init(data);

    expect(heap.pop()).toBe(6);
    expect(heap.pop()).toBe(5);
    expect(heap.pop()).toBe(4);
})

