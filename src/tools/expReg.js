"use strict";
const expReg = {
    ones: /^(([\(\)\{\}\[\]\,])|(?:[a-zA-Z]\w*)|(?:\"(?:\w+|\s|[\.\+-\:\*])*\")|(?:\d+)|(?:\[(?:\,|\s|\d+)*\])|(?:[\-\+\*\/\;]{1})|(?:[<>=]{1}=|=[<>=]{1}|[<>=]{1}|\W-[\s]))/,
    caracter : {
        ID:  /^[a-zA-Z]\w*/,
        CADENA:  /^(?:\"(?:\w+|\s|[\.\+-\:\*])*\")/,
        NUMERO: /^\d+/,
        OPERADOR:  /^[+\-/*]/,
    },
    Espacio: /^\s+/,
    line: /(.*)/g,
    comentario: /^\s*\#/,
};
module.exports = expReg;