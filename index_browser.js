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


