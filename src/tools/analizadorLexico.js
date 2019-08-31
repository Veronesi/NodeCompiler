const caracteres = require('../config/caracteres')
const palabrasReservadas = require('../config/palabrasReservadas')
const expReg = require('../tools/expReg')
const fs = require('fs')
const readline = require('readline');
AnalizadorLexico = {
    /**
     * @description devuelve el que es el elemento y su token respectivo
     */
    analizarElemento: (texto) => {
        let tipo = caracteres.find( e => e.caracter == texto)
        if(tipo != undefined) return tipo.valor

        tipo = palabrasReservadas.find( e => e == texto.toUpperCase())
        if(tipo != undefined) return texto

        
    },
    /**
     * @description Analiza la cadena y encuentra el primer elemento
     * @param {String} texto string formado por varias palabras
     * @return {Array}  Devuelve un array formado por el primer elemento de la cadena,
     *                  y la posicion en que termina el mismo.
     */
    analizarCadena: (texto) => {
        const espacios = expReg.Espacio.exec(texto)
        cantidadEspacios = (espacios == null) ? 0 : espacios[0].length 
        texto = texto.substr(cantidadEspacios)
        const match = expReg.e.exec(texto)
        return (match == null) ? false : [match[0], match[0].length + cantidadEspacios]
    }
}
module.exports = AnalizadorLexico;


/*
    start(filename) {
        clase = this.clase
        console.log(`importando ${filename}`)
        let rl = readline.createInterface({
            input: fs.createReadStream('./src/public/example.f')
        })
        let line_no = 0
        rl.on('line', line => {
            line_no++;
            clase.analizarLinea(line)
        })
    }
*/
