"use strict";
const fs = require('fs');
const Caracteres = require('../config/caracteres');
const PalabrasReservadas = require('../config/palabrasReservadas');
const expReg = require('./expReg');
module.exports = class AnalisisLexico {
    constructor(){
        this.name = this.constructor.name;
        this.line = [];
    }
    /**
     * @description Lee el archivo pasado por parametro y lo guarda en la variable text
     * @param {String} filename 
     * @requires fs
     */
    import(filename){
        this.filename = filename;
        this.text = fs.readFileSync(`./src/public/${this.filename}`,'utf8');
    }

    getFileName(){
        console.log(this.filename);
    }

    /**
     * analiza el text y genera un array con cada linea del archivo leido
     */
    getLines(){
        let exp = this.text.match(/(.*)/g).filter(e => e.length > 0);
        for(let i = 0; i < exp.length; i+=1){
            if(!/^\s*\#/.test(exp[i])){
                this.line.push({line: exp[i], number: i+1});
            }
        }
    }

    analizarLineas(){
        let tokens = this.line.map( e => {
            let texto = e.line;
            let token = [];
            while(texto.length > 0){
                // Recortamos los espacios en blanco
                const espacios = expReg.Espacio.exec(texto);
                texto = texto.slice((espacios === null) ? 0 : espacios[0].length);
                const match = expReg.ones.exec(texto);
                if(match === null){
                    console.log("ERROR_1");
                    texto = "";
                }else{
                    const type = this.getType(match[0]);
                    if(!type){
                        console.log("ERROR_2");
                        texto = "";
                    }else{
                        texto = texto.slice(match[0].length);
                        token.push({
                            name: 'Token',
                            element: match[0],
                            type: type,
                            line: e.number
                        });
                    }
                }
            }
            return token;
        });
        this.tokens = tokens.reduce((acc, val) => acc.concat(val), []);
    }

    /**
     * @description devuelve el tipo de elemento que es
     * @param {String} elemento elemento a analizar
     * @returns {String | Boolean} tipo del elemento
     */
    getType(elemento){
        let tipo;
        // es un caracter
        tipo = Caracteres.find( e => e.caracter === elemento);
        if(tipo !== undefined){
            return tipo.valor;
        }

        // es una palabra reservada
        tipo = PalabrasReservadas.find( e => e === elemento.toUpperCase());
        if(tipo !== undefined){
            return tipo;
        }

        // es un elemento
        tipo = Object.keys(expReg.caracter).find(e => { 
            if(expReg.caracter[e].test(elemento)){
                return e;
            }
        });
        if(tipo !== undefined){
            return tipo;
        }
        return false;
    }

    /**
     * Inicia un analisis lexico
     * @param {{fillename: String, debug: Boolean, scan: Boolean}} args   flags del analisis:
     *                          - filename: nombre del archivo de codigo fuente
     *                          - debug: Mostrar por consola el procedimiento.
     *                          - scan: Ejecutar el analisis automaticamente.
     * @param {function} fun Ejecuta al funcion al terminar el analisis.
     * @returns {[Token]} Lista de tokens
     */
    start(args, fun){
        const { filename = 'non_file_name'/*, debug = false */, scan = true } = args;
        if(scan){
            this.import(filename);
            this.getLines();
            this.analizarLineas();
        }
        fun();
        return this.tokens;
    }
};