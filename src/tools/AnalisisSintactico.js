"use strict";
const producciones = require('../config/producciones');
const Arbol = require('../models/Arbol');
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
            return new Arbol({ node: e.produccion, childs: e.produce });
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
                    const prod = producciones.filter(e => element.type === e.slice());
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

    getProduce(production){
        return producciones.filter(e => production === e.produccion);
    }

    checkElement(element, production) {
        const child = production.next();
        if(/^[<]/.test(child)){
            console.log(`elemento a analizar: ${child}`);
            // Produccion
            return this.getProduce(child);
        }else if(typeof child === 'string'){
            console.log(`elemento a analizar: ${child}`);
            // Palabra
            if(child === element.type){
                return element;
            }else{
                console.log('la produccion no sirve');
                return undefined;
            }
        }else if(child.name === 'Produccion'){
            console.log(`elemento a analizar: ${child.produccion} => ${child.produce}`);
            return new Arbol({node: child.produccion,childs: child.produce});
        }
    }

    checkProductions(element) {
        const _this = this;
        let isFollow = true;
        let newProductions = [];
        this.produccion.forEach( (e, index) => {
            const newChild = _this.checkElement(element, e);
            if(newChild.name === undefined){
                isFollow = false;
                newChild.forEach(item => {
                    console.log(JSON.stringify(_this.produccion[index]));
                    let newProduction = Object.create(this.produccion[index]);
                    newProduction.setChild(item);
                    newProductions.push(newProduction);
                });
            }else{
                let newProduction = Object.create(this.produccion[index]);
                newProduction.setChild(newChild);
                if(newChild.name === 'Token'){
                    _this.stackProduction.push(newProduction);
                }else{
                    isFollow = false;
                    newProductions.push(newProduction);
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
        console.table(this.produccion);
        console.table(this.stackProduction);
        if(!isFollow){
            this.checkProductions(element);
        }
        
        fun();
    }
};