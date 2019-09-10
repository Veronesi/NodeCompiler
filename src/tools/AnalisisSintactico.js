"use strict";
module.exports = class AnalisisSintactico {
    constructor(){
        this.name = this.constructor.name;
        this.tokens = [];
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
    start(args, fun){
        const { tokens = "", tpyeImport= "arr", filename = "" } = args;
        this.tokens = tokens;
        fun();
    }
};