'use strict'

let { Tree, Heap, Errors } = require('./index.js');

function mainForTree_Number(){

    let tree=new Tree();
    let ORDER=tree.CONST.ORDER;

    //let data=[1564542121,44353333,7535353,545645643,91454548,265256843,198034322,452565656];
    let data=[1,2,3,4,6,7,11];

    tree.init(data);
    console.log(tree.isBalanced());
    tree.insert([43, 56, 99]);
    tree.print();
    console.log(tree.isBalanced());
    tree.insert(5);
    tree.print();
    console.log(tree.isBalanced());
    tree.remove(43);
    tree.print();
    console.log(tree.isBalanced());

    console.log(tree.traversal(ORDER.PostOrder));

}

function mainForTree_Object(){

    let tree=new Tree();
    let ORDER=tree.CONST.ORDER;

    let data=[{key:1, name:'Mike'},{key:2, name:'Peter'},{key:3, name:'Joe'},{key:4, name:'Tom'},{key:5, name:'Leo'},{key:6, name:'Jean'}];
    tree.init(data, true);
    tree.print();

    console.log(tree.traversal(ORDER.PostOrder));
}

function mainForHeap_Number(){

    let heap = new Heap();
    heap.init([1,2,3,4,5,6], false);

    heap.push(10);
    heap.push(23);
    heap.print();

    console.log("Start popping...");
    let v=heap.pop();
    while(v!=null){
        console.log(v);
        //heap.print();
        v=heap.pop();
    }
    console.log("End popping.");

}

function mainForHeap_Object(){

    let data=[{key:1, name:'Mike'},{key:2, name:'Peter'},{key:3, name:'Joe'},{key:4, name:'Tom'},{key:5, name:'Leo'},{key:6, name:'Jean'}];
    let heap = new Heap();
    heap.init(data, true, true);

    heap.push({key:7, name:'Someone'});

    console.log("Start popping...");
    let v=heap.pop();
    while(v!=null){
        console.log(v);
        //heap.print();
        v=heap.pop();
    }
    console.log("End popping.");

}


function main() {
    mainForTree_Number();
    //mainForTree_Object();
    //mainForHeap_Number();
    //mainForHeap_Object();
}

main();
