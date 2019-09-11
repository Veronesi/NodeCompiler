"use strict";
const producciones = require('../config/producciones');
//const Arbol = require('../models/Arbol');
Object.prototype.next = function () {
    let element;
    this.childs.forEach(e => {
        if (element === undefined) {
            if (typeof e === 'string') {
                if (e !== 'EPSILON') {
                    element = e;
                }
            } else {
                switch (e.name) {
                    case 'Arbol':
                        if (!e.isComplete()) {
                            console.log('el arbol no esta completo');
                            element = e.next();
                        }
                        break;
                    case 'Produccion':
                        element = e;
                        console.log('es una produccion:');
                        console.table(element);
                        break;
                    default:
                        break;
                }
            }
        }
    });
    return element;
};

Object.prototype.isComplete = function () {
    /** VER ESTO */
    const isFull = this.childs.some(e => {
        if(typeof e === 'string' && e !== 'EPSILON'){
            return true;
        }else{
            switch (e.name) {
                case 'Token':
                    return false;
                case 'Produccion':
                    return false;
                case 'Arbol':
                    return e.isComplete();
                default:
                    break;
            }
        }
    });
    return isFull;
};

Object.prototype.first = function () {
    return this.produce[0];
};

Object.prototype.setChild = function (newChild) {
    let isFollow = true;
    this.childs.forEach((e, index) => {
        if (typeof e === 'string' && isFollow) {
            if (e !== 'EPSILON') {
                isFollow = false;
                this.childs[index] = newChild;
            }
        } else {
            if (e.name === 'Arbol' && isFollow) {
                if (!e.isComplete()) {
                    console.log('el arbol no esta completo');
                    e.setChild(newChild);
                }
            } else if (e.name === 'Produccion') {
                console.log('reemplazando la produccion por un arbol...');
                isFollow = false;
                this.childs[index] = newChild;
            }
        }
    });
};

module.exports = class AnalisisSintactico {
    constructor() {
        this.name = this.constructor.name;
        this.tokens = [];

        // lista de Arboles que falta procesar.
        this.produccion = [];

        // Lista de Arboles procesadas.
        this.stackProduction = [];
    }

    initTree() {
        const element = this.tokens.shift();
        const listProductions = this.getProduction(element);

        this.produccion = listProductions.map(e => {
            e.produce[0] = element;
            return ({ node: e.produccion, childs: e.produce, name: 'Arbol' });
        });
        console.table(this.produccion);
    }

    /**
     * Busca todas las producciones que generen al elemento
     * @param {String} element 
     * @returns {Array} lista de producciones
     */
    getProduction(element) {
        try {
            switch (element.name) {
                case 'Token':
                    const prod = producciones.filter(e => element.type === e.first());
                    if (prod.length) {
                        return prod;
                    } else {
                        throw new Error(`ERROR: doesn't exist element to produce '${element.element}' on line ${element.line}`);
                    }
                    break;

                default:
                    throw new Error(`ERROR: type element doesn't exist on line ${element.line}`);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    getProduce(production) {
        return producciones.filter(e => production === e.produccion);
    }

    checkElement(element, production) {

        const child = production.next();
        if (/^[<]/.test(child)) {
            console.log(`elemento a analizar: ${child}`);
            // Produccion
            return this.getProduce(child);
        } else if (typeof child === 'string') {
            console.log(`elemento a analizar: ${child}`);
            // Palabra
            if (child === element.type) {
                return element;
            } else {
                console.log('la produccion no sirve');
                return undefined;
            }
        } else if (child.name === 'Produccion') {
            console.log(`elemento a analizar: ${child.produccion} => ${child.produce}`);
            return ({ node: child.produccion, childs: child.produce, name: 'Arbol' });
        }
    }

    checkProductions(element) {
        const _this = this;
        let isFollow = true;
        let newProductions = [];
        this.produccion.forEach((e, index) => {
            const newChild = _this.checkElement(element, e);
            if (typeof newChild !== 'undefined') {
                if (newChild.name === undefined) {
                    isFollow = false;
                    newChild.forEach(item => {
                        let newProduction = JSON.parse((JSON.stringify(this.produccion[index])));
                        newProduction.setChild(item);
                        newProductions.push(newProduction);
                    });
                } else {
                    let newProduction = JSON.parse((JSON.stringify(this.produccion[index])));
                    newProduction.setChild(newChild);
                    console.log(JSON.stringify(newProduction, null, 1));


                    if (newChild.name === 'Token') {
                        _this.stackProduction.push(newProduction);
                    } else {
                        isFollow = false;
                        newProductions.push(newProduction);
                    }
                }
            }
        });
        this.produccion = newProductions;
        return isFollow;
    }

    /**
     * 
     * @param {Object} args lista de flags de configuracion:
     *                      - tokens: lista de tokens en formato de Array
     *                      - typeImport: arr: lee lo que esta en el flag tokens,
     *                      - file: lee el archivo pasado por el flag filename
     *                      - filename: nombre del archivo en donde se encuentra la lista de tokens
     * @param {*} fun function a ejecutar cuando finaliza el analisis
     */
    start(args, fun) {
        const { tokens = ""/*, tpyeImport= "arr", filename = ""*/ } = args;
        this.tokens = tokens;
        this.initTree();

        let element = this.tokens.shift();
        const isFollow = this.checkProductions(element);
        console.log('1-------');
        console.table(this.produccion);
        console.table(this.stackProduction);
        if (!isFollow) {
            this.checkProductions(element);
        }
        console.log('2-------');
        console.table(this.produccion);
        console.table(this.stackProduction);
        if (!isFollow) {
            this.checkProductions(element);
        }
        console.log('3-------');
        console.table(this.produccion);
        console.table(this.stackProduction);
        //console.log(JSON.stringify(this.produccion, null, 2));
        //console.log(JSON.stringify(this.stackProduction, null, 2));
        fun();
    }
};