"use strict";
module.exports = class Arbol {
    constructor(args){
        const { nodo = null, hijos = [] } = args;
        this.name = this.constructor.name;
        this.nodo = nodo;
        this.hijos = hijos;
    }
};