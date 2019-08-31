/*
const AnalizadorLexico = require('./tools/analizadorLexico');

const elemento = AnalizadorLexico.analizarCadena('var1 = 4;')
AnalizadorLexico.analizarElemento(elemento[0])

*/
const Lexico = require('./models/Lexico');
const lexico = new Lexico()

const tokens = lexico.start({
    filename: 'example.f',
    debug: false
}, () => {
    
})

console.table(tokens)