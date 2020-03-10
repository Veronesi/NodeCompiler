"use strict";
const fs = require('fs');
const AnalisisLexico = require('./tools/AnalisisLexico');
const AnalisisSintactico = require('./tools/AnalisisSintactico');
const Evaluador = require('./tools/Evaluador');

const analisisLexico = new AnalisisLexico(); 


/*
let textoPlano = fs.readFileSync(`./src/public/sintactico-output.js`, 'utf8');
JSON.parse(textoPlano).showTree('', '', true);

let evaluador = new Evaluador({three: JSON.parse(textoPlano), debug: true});
evaluador.start()
*/

/*
analisisLexico.start({
    fileName: 'example.f'
}, tokens => console.table(tokens))
*/


analisisLexico.start({
    fileName: 'example.js'
}, (tokens) => {
    //console.table(tokens)
    const analisisSintactico = new AnalisisSintactico({debug: false});
    analisisSintactico.start({
        tokens : tokens,
        tpyeImport: 'arr'
    }, (three) => {
        //showTree(three);
    	//const codigoIntermedio = new CodigoIntermedio({three: three, debug: true});
        //codigoIntermedio.start(); 
    });
});

