"use strict";

const fs = require('fs');
const Caracteres = require('../config/caracteres');
const PalabrasReservadas = require('../config/palabrasReservadas');
const expReg = require('./expReg');

/**
 * @class AnalisisLexico
 * @description limpia el codigo y agrupa los componentes lexicos, ademas de comprobar que los simbolos se escribieron correctamente.
 * @var {String} fileName nombre del archivo a analizar
 * @var {Array} lines codigo fuente separado linea a linea en un arreglo 
 * @var {String} name nombre de la clase
 * @var {String} planeText 
 * @var {Array} tokens
 */
module.exports = class AnalisisLexico {

    constructor(){
        this.fileName = "";
        this.lines = [];
        this.name = this.constructor.name;
        this.planeText = "";
        this.tokens = [];
    }

    /**
     * @description Lee el archivo pasado por parametro y lo guarda en la variable text
     * @param {String} fileName 
     * @requires fs
     */
    importFromFile(fileName){
        this.fileName = fileName;
        this.planeText = fs.readFileSync(`./src/public/${this.fileName}`,'utf8');
    }

    /**
     * @description analiza una cadena de texto y genera un arreglo con cada linea del archivo leido limpiada.
     * @todo realizar un metodo para borrar los comentarios multilineas
     */
    generateLines(){
        // Evita las lineas vacias.
        let linesWoEmptyLines = this.planeText.match(expReg.line).filter(textLine => textLine.length > 0);

        for(let i = 0; i < linesWoEmptyLines.length; i+=1){
            // Evita los comentarios se una linea
            if(!expReg.comentario.test(linesWoEmptyLines[i])){
                this.lines.push({line: linesWoEmptyLines[i], number: i+1});
            }
        }
    }

    analizarLineas(){
        let tokens = this.lines.map( e => {
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
     * @param {{fileName: String, debug: Boolean, scan: Boolean}} args flags del analisis:
     *      - fileName : nombre del archivo de codigo fuente
     *      - debug: Mostrar por consola el procedimiento.
     *      - scan: Ejecutar el analisis automaticamente.
     * @param {function} success Ejecuta al funcion al terminar el analisis.
     * @returns {Array} arreglo de tokens
     */
    start(args, success = () => {}){
        const { fileName = 'non_file_name', scan = true } = args;
        if(scan){
            this.importFromFile(fileName);
            this.generateLines();
            this.analizarLineas();
        }
        success(this.tokens);
    }
};