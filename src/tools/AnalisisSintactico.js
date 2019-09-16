"use strict";
const colors = require('colors/safe');
const producciones = require('../config/producciones');
const debug = true;
function show(text){
    (debug) ? console.log(text) : null;
}

/**
 * Devuelve el proximo elemento que puede ser reemplazado.
 * @returns { string | Proiduccion }
 */
Object.prototype.next = function () {
    let element;
    this.childs.forEach(e => {
        if (element !== undefined) { return; }

        if (typeof e === 'string') {
            if (e !== 'EPSILON') { element = e; }
        } else {
            switch (e.name) {
                case 'Arbol':
                    if (e.hasSpace()) {
                        const newE = e.next();
                        if (newE) { element = newE; }
                    }
                    break;
                case 'Produccion':
                    element = e;
                    break;
            }
        }
    });
    return element;
};

Object.prototype.showTree = function (init = '', spaces = '') {
    console.log(init + colors.cyan(this.node));
    if (this.childs.length) {
        this.childs.forEach((element, index) => {
            if (typeof element === 'string') {
                if (element !== 'EPSILON') {
                    if (/^[<]/.test(element)) {
                        if (this.childs.length - 1 === index) {
                            console.log(spaces + '└──' + colors.blue(element));
                        } else {
                            console.log(spaces + '├──' + colors.blue(element));
                        }
                    } else {
                        if (this.childs.length - 1 === index) {
                            console.log(spaces + '└──' + colors.white(element));
                        } else {
                            console.log(spaces + '├──' + colors.white(element));
                        }
                    }

                } else {
                    if (this.childs.length - 1 === index) {
                        console.log(spaces + '└──' + colors.gray(element));
                    } else {
                        console.log(spaces + '├──' + colors.gray(element));
                    }
                }
            }
            switch (element.name) {
                case 'Token':
                    if (this.childs.length - 1 === index) {
                        console.log(spaces + '└──' + colors.yellow(element.type) + ` '${element.element}'`);
                    } else {
                        console.log(spaces + '├──' + colors.yellow(element.type) + ` '${element.element}'`);
                    }
                    break;
                case 'Arbol':
                    if (this.childs.length - 1 === index) {
                        element.showTree(spaces + '└──', spaces + '   ');
                    } else {
                        element.showTree(spaces + '├──', spaces + '│  ');
                    }

                    break;
                case 'Produccion':
                    if (this.childs.length - 1 === index) {
                        console.log(spaces + '└──' + colors.green(element.produccion + ' [' + element.produce + ']'));
                    } else {
                        console.log(spaces + '├──' + colors.green(element.produccion + ' [' + element.produce + ']'));
                    }
                    break;
                default:
                    break;
            }
        });
    }
};

/**
 * Verifica si hay espacio para un nuevo elemento en el arbol
 * @returns {Boolean}
 */
Object.prototype.hasSpace = function () {
    const isFull = this.childs.some(e => {
        if (typeof e === 'string' && e !== 'EPSILON') {
            return true;
        } else {
            switch (e.name) {
                case 'Token':
                    return false;
                case 'Produccion':
                    return true;
                case 'Arbol':
                    return e.hasSpace();
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

Object.prototype.existInProduce = function (element) {
    return this.produce.some(e => e === element);
};

Object.prototype.positionInProduce = function (element) {
    const position = this.produce.findIndex(e => e === element);
    return position;
};

/**
 * Reemplaza el proximo String o Produccion por un nuevo elemento
 */
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
                if (e.hasSpace()) {
                    e.setChild(newChild);
                }
            } else if (e.name === 'Produccion') {
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
        this.stackProductionReady = [];
    }

    initTree() {
        const element = this.tokens.shift();
        const listProductions = this.getProduction(element);

        this.produccion = listProductions.map(e => {
            e.produce[0] = element;
            return ({ node: e.produccion, childs: e.produce, name: 'Arbol' });
        });
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
                    const _producciones = JSON.parse((JSON.stringify(producciones)));
                    const prod = _producciones.filter(e => element.type === e.first());
                    if (prod.length) {
                        return prod;
                    } else {
                        throw new Error(`ERROR: doesn't exist element to produce '${element.element}' on line ${element.line}`);
                    }
                    break;
                default:
                    //const prod2 = producciones.filter(e => element === e.first());
                    const _producciones2 = JSON.parse((JSON.stringify(producciones)));
                    const prod2 = _producciones2.filter(e => e.existInProduce(element));
                    if (prod2.length) {
                        return prod2;
                    } else {
                        return;
                    }
                    break;
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    getProduce(production) {
        const _producciones = JSON.parse((JSON.stringify(producciones)));
        const productions = _producciones.filter(e => production === e.produccion);
        return productions;
    }

    checkElement(element, production) {
        const child = production.next();
        if (/^[<]/.test(child)) {
            // Produccion
            show(`Elemento a analizar: ${child} (Es un string-produccion)`);
            const produce = this.getProduce(child);
            return produce;
        } else if (typeof child === 'string') {
            // Palabra
            if (child === element.type) {
                show(`Elemento a analizar: ${child} (Es un String-token)`);
                return element;
            } else {
                show(`Elemento a analizar: ${child} (Es un String y no coinciden)`);
                return;
            }
        } else if (child.name === 'Produccion') {
            show(`Elemento a analizar: ${child.produccion} (Es una produccion)`);
            return ({ node: child.produccion, childs: child.produce, name: 'Arbol' });
        }
    }

    checkProductions(token) {
        const _this = this;
        let newProductions = [];
        this.produccion.forEach((oneProduction, index) => {
            show(colors.bgGreen(`Analizando produccion ${index}...`));
            if (oneProduction.hasSpace()) {
                show(`Hay espacio en el arbol`);
                const newChild = _this.checkElement(token, oneProduction);
                if (newChild !== undefined) {
                    if (newChild.length) {
                        // newChild is an array
                        show(`hay un array de nuevos hijos`);
                        newChild.forEach(elementNewChild => {
                            show(`-- hijo: [${elementNewChild.produce}] (${elementNewChild.name})`);
                            let newProduction = JSON.parse((JSON.stringify(this.produccion[index])));
                            newProduction.setChild(elementNewChild);
                            newProductions.push(newProduction);
                        });
                    } else {
                        let newProduction = JSON.parse((JSON.stringify(this.produccion[index])));
                        newProduction.setChild(newChild);
                        if (newChild.name === 'Token') {
                            show(`-- hijo: ${newChild.name} (${newChild.type}) "${newChild.element}"`);
                            _this.stackProductionReady.push(newProduction);
                        } else {
                            show(`-- hijo: ${newChild.name}`);
                            newProductions.push(newProduction);
                        }
                    }
                }
            } else {
                show(`No hay espacio en el arbol`);
                // Tree is full
                let newsRoots = this.getProduction(oneProduction.node);
                if (newsRoots) {
                    newsRoots.forEach(newsProduccion => {
                        newsProduccion.produce[newsProduccion.positionInProduce(oneProduction.node)] = oneProduction;
                        let newProduction = {
                            node: newsProduccion.produccion,
                            childs: newsProduccion.produce,
                            name: 'Arbol'
                        };
                        newProductions.push(newProduction);
                    });
                }
            }
        });
        this.produccion = newProductions;
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

        while (this.tokens.length) {
            console.log('********production**********');
            this.produccion.forEach(e => {
                e.showTree();
                console.log('...........................');
            });
            let nextToken = this.tokens.shift();
            show(colors.bgBlue(`Proximo token: ${nextToken.type} '${nextToken.element}'`));
            while (this.produccion.length) {
                show(colors.bgCyan(`Analizando producciones...`));
                this.produccion.forEach(e => {
                    e.showTree();
                    console.log('...........................');
                });
                this.checkProductions(nextToken);
            }
            this.produccion = this.stackProductionReady;
            this.stackProductionReady = [];
        }
        fun();
    }
};