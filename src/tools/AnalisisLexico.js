"use strict";

const fs = require('fs');
const Caracteres = require('../config/caracteres');
const PalabrasReservadas = require('../config/palabrasReservadas');
const expReg = require('./expReg');
const colors = require('colors/safe');

/**
 * @class AnalisisLexico
 * @description limpia el codigo y agrupa los componentes lexicos, ademas de comprobar que los simbolos se escribieron correctamente.
 * @var {String} fileName nombre del archivo a analizar
 * @var {Array} lines codigo fuente separado linea a linea en un arreglo 
 * @var {String} name nombre de la clase
 * @var {String} textoPlano 
 * @var {Array} tokens
 */
module.exports = class AnalisisLexico {

    constructor() {
        this.fileName = "";
        this.lines = [];
        this.name = this.constructor.name;
        this.textoPlano = "";
        this.tokens = [];
        this.error = false;
    }

    clear() {
        this.fileName = "";
        this.lines = [];
        this.name = this.constructor.name;
        this.textoPlano = "";
        this.tokens = [];
        this.error = false;
    }

    SetTextoPlano(texto) {
        this.textoPlano = texto
    }

    /**
     * @description Lee el archivo y lo guarda en texto plano
     * @param {String} fileName 
     * @requires fs
     */
    ImportarCodigo(fileName) {
        this.fileName = fileName;
        try{
            this.textoPlano = fs.readFileSync(`./src/public/${this.fileName}`, 'utf8');
        }catch{
            this.error = true;
            console.log(colors.red('✘')+' Scanner')
            console.log(colors.red((`Error: No se a podido encontrar el archivo ./src/public/${this.fileName}`)));
        }
    }

    /**
     * @description analiza un string y genera un arreglo con cada linea del mismo.
     * @todo realizar un metodo para borrar los comentarios multilineas
     */
    LeerLineas() {
        // borramos las lineas vacias
        this.textoPlano.match(expReg.line).filter(linea => linea.length > 0).forEach((line, index) => {
            // filtramos las lineas que son un comentario
            (expReg.comentario.test(line)) ? false : this.lines.push({ line: line, number: index + 1 });
        });
    }

    analizarLineas(success = () => { }) {
        this.lines.forEach(line => {
            let texto = line.line
            while (texto.length) {
                // Borramos los espacios en blanco al inicio
                texto = texto.replace(expReg.Espacio, '')

                const match = expReg.ones.exec(texto);
                try {
                    if (match === null) {
                        console.log(colors.red('✘')+' Scanner')
                        throw new Error(colors.red((`LexicalError: token no válido o inesperado '${texto[0]}' en linea ${line.number}`)))
                    } else {
                        const type = this.getType(match[0]);
                        if (!type) {
                            console.log(colors.red('✘')+' Scanner')
                            throw new Error(colors.red((`LexicalError: token no válido o inesperado '${texto[0]}' en linea ${line.number}`)))
                        } else {
                            if (type == 'CADENA') {
                                texto = texto.slice(match[0].length);

                                this.tokens.push({
                                    name: 'Token',
                                    element: '"',
                                    type: "COMILLA",
                                    line: line.number
                                });

                                this.tokens.push({
                                    name: 'Token',
                                    element: match[0].replace(/\"/g, ''),
                                    type: 'TEXTO',
                                    line: line.number
                                });

                                this.tokens.push({
                                    name: 'Token',
                                    element: '"',
                                    type: "COMILLA",
                                    line: line.number
                                });

                            } else {
                                texto = texto.slice(match[0].length);
                                this.tokens.push({
                                    name: 'Token',
                                    element: match[0],
                                    type: type,
                                    line: line.number
                                });
                            }
                        }
                    }
                }
                catch (error) {
                    texto = "";
                    this.error = true;
                    this.Error = error.message
                    console.log(error.message);
                }
                // Borramos los espacios en blanco que quedaron
                texto = texto.replace(expReg.Espacio, '')
            }
        });
        success(this.tokens)
    }


    /**
     * @description devuelve el tipo de elemento que es
     * @param {String} elemento elemento a analizar
     * @returns {String | Boolean} tipo del elemento
     */
    getType(elemento) {
        let tipo;
        // es un caracter
        tipo = Caracteres.find(e => e.caracter === elemento);
        if (tipo !== undefined) {
            return tipo.valor;
        }

        // es una palabra reservada
        tipo = PalabrasReservadas.find(e => e === elemento.toUpperCase());
        if (tipo !== undefined) {
            return tipo;
        }

        // es un elemento
        tipo = Object.keys(expReg.caracter).find(e => {
            if (expReg.caracter[e].test(elemento)) {
                return e;
            }
        });
        if (tipo !== undefined) {
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
    async start(args, success = () => { }) {
        const { fileName = 'non_file_name', scan = true, save = false } = args;
        if (scan) {
            try {
                if(fileName == 'non_file_name'){
                    console.log(colors.red('✘')+' Scanner')
                    throw new Error(colors.red((`Error: Nombre de archivo indefinido: npm run scanner ejemplo.js`)))
                }
                    this.ImportarCodigo(fileName);
                    this.LeerLineas();
                    this.analizarLineas();
            } catch (error) {
                this.error = true;
                this.Error = error.message
                console.log(error.message);
            }            
        }
        if (!this.error) {
            if (save) {
                const output = await JSON.stringify(this.tokens);
                fs.writeFileSync("./src/public/lexico-output.js", output);
            }
            console.log(colors.green('✔')+' Scanner')
            success(this.tokens);
        }
    }
};