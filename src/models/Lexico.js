const fs = require('fs')
const Caracteres = require('../config/caracteres')
const PalabrasReservadas = require('../config/palabrasReservadas')
const ExpReg = require('../tools/expReg')
module.exports = class Lexico {
    constructor(){
        this.tokens
        this.filename
        this.text
        this.tokens
    }
    /**
     * @description Lee el archivo pasado por parametro y lo guarda en la variable text
     * @param {String} filename 
     * @requires fs
     */
    import(filename){
        this.filename = filename
        this.line = []
        this.text = fs.readFileSync(`./src/public/${this.filename}`,'utf8')
    }

    getFileName(){
        console.log(this.filename)
    }

    /**
     * @description analiza el text y genera un array con cada linea del archivo leido
     */
    getLines(){
        let exp = this.text.match(/(.*)/g).filter(e => e.length > 0)
        for(let i = 0; i < exp.length; i++){
            if(!/^\s*\#/.test(exp[i])) this.line.push({line: exp[i], number: i+1})
        }
    }

    analizarLineas(){
        let tokens = this.line.map( e => {
            let texto = e.line
            let token = []
            while(texto.length > 0){
                // Recortamos los espacios en blanco
                const espacios = expReg.Espacio.exec(texto)
                texto = texto.slice((espacios == null) ? 0 : espacios[0].length)
                const match = expReg.ones.exec(texto)
                if(match == null){
                    console.log("ERROR_1")
                    texto = ""
                }else{
                    const type = this.getType(match[0])
                    if(!type){
                        console.log("ERROR_2")
                        texto = "" 
                    }else{
                        texto = texto.slice(match[0].length)
                        token.push({
                            elem: match[0],
                            type: type,
                            line: e.number
                        })
                    }
                }
            }
            return token
        })
        this.tokens = tokens.reduce((acc, val) => acc.concat(val), [])
    }

    /**
     * @description devuelve el tipo de elemento que es
     * @param {String} elemento elemento a analizar
     * @returns {String | Boolean} tipo del elemento
     */
    getType(elemento){
        let tipo
        // es un caracter
        tipo = Caracteres.find( e => e.caracter == elemento)
        if(tipo != undefined) return tipo.valor

        // es una palabra reservada
        tipo = PalabrasReservadas.find( e => e == elemento.toUpperCase())
        if(tipo != undefined) return tipo

        // es un elemento
        tipo = Object.keys(ExpReg.caracter).find(e => { if(ExpReg.caracter[e].test(elemento)) return e })
        if(tipo != undefined) return tipo
        return false
    }

    scan(){
        this.getLines()
        this.analizarLineas()
    }
    /**
     * @description inicia un analisis lexico, ejecutando ciertos metodos dependiendo de los flags
     *              y devovlera la lista de tokens generados por le codigo fuente
     * @param {Object} option   flags del analisis
     *                          filename: nombre del archivo de codigo fuente
     *                          debug: verdadero si mostrara por consola que es lo que hizo
     *                          scan: verdadero si ejecuta el analisis autimaticamnete
     * @param {function} fun function a iniciar cuando termine el analisis
     * @returns {Array} devuelve la lista de tokens
     */
    start(option, fun){
        const { filename = 'non_file_name' } = option
        this.import(filename)
        this.scan()
        fun()
        return this.tokens
    }
}

// `./src/public/${this.filename}`