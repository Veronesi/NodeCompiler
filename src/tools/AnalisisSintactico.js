"use strict";
const colors = require('colors/safe');
const producciones = require('../config/producciones');
const Caracteres = require('../config/caracteres');
const fs = require('fs');
let modeDebug = false;
let ultimoToken = '';
function show(text, force = false) {
    (modeDebug || force) ? console.log(text) : null;
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

Object.prototype.showTree = function (init = '', spaces = '', force = false) {
    show(init + colors.cyan(this.node), force);
    if (this.childs.length) {
        this.childs.forEach((element, index) => {
            if (typeof element === 'string') {
                if (element !== 'EPSILON') {
                    if (/^[<]/.test(element)) {
                        if (this.childs.length - 1 === index) {
                            show(spaces + '└──' + colors.blue(element), force);
                        } else {
                            show(spaces + '├──' + colors.blue(element), force);
                        }
                    } else {
                        if (this.childs.length - 1 === index) {
                            show(spaces + '└──' + colors.white(element), force);
                        } else {
                            show(spaces + '├──' + colors.white(element), force);
                        }
                    }

                } else {
                    if (this.childs.length - 1 === index) {
                        show(spaces + '└──' + colors.gray(element), force);
                    } else {
                        show(spaces + '├──' + colors.gray(element), force);
                    }
                }
            }
            switch (element.name) {
                case 'Token':
                    if (this.childs.length - 1 === index) {
                        show(spaces + '└──' + colors.yellow(element.type) + ` '${element.element}'`, force);
                    } else {
                        show(spaces + '├──' + colors.yellow(element.type) + ` '${element.element}'`, force);
                    }
                    break;
                case 'Arbol':
                    if (this.childs.length - 1 === index) {
                        element.showTree(spaces + '└──', spaces + '   ', force);
                    } else {
                        element.showTree(spaces + '├──', spaces + '│  ', force);
                    }

                    break;
                case 'Produccion':
                    if (this.childs.length - 1 === index) {
                        show(spaces + '└──' + colors.green(element.produccion + ' [' + element.produce + ']'), force);
                    } else {
                        show(spaces + '├──' + colors.green(element.produccion + ' [' + element.produce + ']'), force);
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
    let posicionPrimeraPalabra = 99;
    let generaPalabraAntes = false;
    return this.produce.some((e, index) => {
        if (e[0] !== '<' && e !== 'EPSILON') {
            if (!generaPalabraAntes) {
                posicionPrimeraPalabra = index;
                generaPalabraAntes = true;
            }
        }
        if (e === element && posicionPrimeraPalabra > index) {
            return true;
        }
    });
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
                    isFollow = false;
                }
            } else if (e.name === 'Produccion') {
                isFollow = false;
                this.childs[index] = newChild;
            }
        }
    });
};

module.exports = class AnalisisSintactico {
    constructor(params) {
        const { debug = false } = params;
        modeDebug = debug;
        this.name = this.constructor.name;
        this.tokens = [];
        this.error = false;

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
                        console.log(colors.red('✘')+' Parsing')
                        throw new Error(`ERROR: doesn't exist element to produce '${element.element}' on line ${element.line}`);
                    }
                    break;
                default:
                    //const prod2 = producciones.filter(e => element === e.first());
                    const _producciones2 = JSON.parse((JSON.stringify(producciones)));
                    const prod2 = _producciones2.filter(e => {
                        if (e.existInProduce(element)) {
                            // Filtrar que no genere un string antes 

                            show(`position of index: ${e.produce.indexOf(element)}`);
                            return true;
                        }
                    });

                    if (prod2.length) {
                        return prod2;
                    } else {
                        return;
                    }
                    break;
            }
        } catch (error) {
            if(!this.error) show(error.message, true);
            this.error = true;
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
                show(colors.red('Descartar arbol'));
                return;
            }
        } else if (child.name === 'Produccion') {
            show(`Elemento a analizar: ${child.produccion} (Es una produccion)`);
            return ({ node: child.produccion, childs: child.produce, name: 'Arbol' });
        }
    }

    forceEpsilon(child){
        if (/^[<]/.test(child)) {
            // Produccion
            show(`Elemento a analizar: ${child} (Es un string-produccion)`);
            let newChild = this.getProduce(child).filter(unaProduccion => unaProduccion.produce.every(e => /^<|EPSILON/.test(e)));
            if(newChild.length){
                return newChild;
            }else{
                show('ninguna de las nuevas producciones sirve');
                return false;
            }
        } else if (typeof child === 'string') {
            // Palabra
                show(`Elemento a analizar: ${child} (Es un String-token)`);
                return child;
            
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
                            show(colors.green('Produccion lista'));
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
     * fuerza a la produccione para que sea generada por el nodo raiz si es posible.
     * 
     */
    rootearProduccion(production) {
        // Verificamos si ya esta rooteado
        /**
         * @todo Cambiar '<Programa>' por una cte.
         */
        if (production.node === '<Programa>') {
            show('la produccion ya esta rooteada');
            this.stackProductionRooted.push(production);
            return;
        } else {
            // Buscamos quienes lo produce
            let e = producciones.filter(e => {
                const position = e.produce.indexOf(production.node);
                const positionFirstString =  e.produce.findIndex(f => (f[0] !== '<' && f[0] !== 'EPSILON'));
                if (position > -1 && (positionFirstString === -1 || positionFirstString > position)) {
                    let newsRoots = this.getProduction(production.node);
                    if (newsRoots) {
                        newsRoots.forEach(newsProduccion => {
                            newsProduccion.produce[newsProduccion.positionInProduce(oneProduction.node)] = oneProduction;
                            let newProduction = {
                                node: newsProduccion.produccion,
                                childs: newsProduccion.produce,
                                name: 'Arbol'
                            };
                            this.stackProductionotRouted.push(newProduction);
                        });
                    }
                    return true;
                }
            });
        }
    }

    CompletarProduccion(production){
        if(production.hasSpace()){
            // Obtenemos el proximo elemento
            let newChild = this.forceEpsilon(production.next());
            if(newChild){
                if(newChild.length){
                    try{
                        if(typeof newChild == 'string'){
                            let element = Caracteres.find(e => e.valor === newChild);
                            element = element ? element.caracter : newChild;
                            console.log(colors.red('✘')+' Parsing')
                            throw new Error(colors.red((`SyntaxError: se esperaba un '${element}' en linea ${ultimoToken.line}`)))
                        }
                        newChild.forEach(elementNewChild => {
                            show(`-- hijo: [${elementNewChild.produce}] (${elementNewChild.name})`);
                            let newProduction = JSON.parse((JSON.stringify(production)));
                            newProduction.setChild(elementNewChild);
                            this.stackProductionotFull.push(newProduction);
                            newProduction.showTree();
                        });
                    }catch(error){
                        if(!this.error) show(error.message, true);
                        this.error = true;
                    }
                }else{
                    let newProduction = JSON.parse((JSON.stringify(production)));
                    newProduction.setChild(newChild);
                    if (newChild.name === 'Token') {
                        show(`-- hijo: ${newChild.name} (${newChild.type}) "${newChild.element}"`);
                        show(colors.green('Produccion lista'));
                        this.stackProductionFull.push(newProduction);
                    } else {
                        show(`-- hijo: ${newChild.name}`);
                        this.stackProductionotFull.push(newProduction);
                    }
                    newProduction.showTree();
                }
            }else{
                show('err newChild');
            }
        }else{
            show('la produccion ya esta completa');
            this.stackProductionReady.push(production);
        }
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
    async start(args, fun) {
        const { tokens = ""/*, tpyeImport= "arr", filename = ""*/ } = args;
        this.tokens = tokens;
        this.initTree();

        while (this.tokens.length) {
            show('********production**********');
            this.produccion.forEach(e => {
                e.showTree();
                show('...........................');
            });
            let nextToken = this.tokens.shift();
            show(colors.bgBlue(`Proximo token: ${nextToken.type} '${nextToken.element}'`));
            if(this.produccion != 0){
                ultimoToken = nextToken;
            }
            while (this.produccion.length) {
                show(colors.bgCyan(`Analizando producciones...`));
                this.produccion.forEach(e => {
                    e.showTree();
                    show('...........................');
                });
                this.checkProductions(nextToken);
            }
            this.produccion = this.stackProductionReady;
            this.stackProductionReady = [];
        }
        this.produccion.forEach(e => {
            e.showTree();
        });

        show('********Verficiamos que sean generados por el nodo raiz**********');
        this.stackProductionRooted = [];
        this.stackProductionotRouted = [];
        while(this.produccion.length){

            this.produccion.forEach(e=>{
                this.rootearProduccion(e);
            });

            this.produccion = this.stackProductionotRouted;
            this.stackProductionotRouted = [];
        }
        this.produccion = this.stackProductionRooted;
        show('********Rooteados**********');
        this.produccion.forEach(e => {
            e.showTree();
        });

        show('********Verficiamos que el arbol este completo**********');
        this.stackProductionFull = [];
        this.stackProductionotFull = [];
        this.stackProductionReady = [];
        while(this.produccion.length){

            this.produccion.forEach(e=>{
                this.CompletarProduccion(e);
            });

            this.produccion = this.stackProductionotFull;
            this.stackProductionotFull = [];
        }
        this.produccion = this.stackProductionFull;

        // Verficiamos que solo nos haya quedado una sola produccion
        try{
            if(this.stackProductionReady.length === 1){
                this.stackProductionReady = this.stackProductionReady[0];
            }else{
                console.log(colors.red('✘')+' Parsing')
                throw new Error(colors.red((`SyntaxError: token inesperado '${ultimoToken.element}' en linea ${ultimoToken.line}`)));
            }

            //this.stackProductionReady.showTree('', '', true);
            const output = await JSON.stringify(this.stackProductionReady);
            fs.writeFileSync("./src/public/sintactico-output.js", output);
            console.log(colors.green('✔')+' Parsing')
            fun(this.stackProductionReady);
        } catch (error) {
            if(!this.error) show(error.message, true);
            this.error = true;
        }
    }
};