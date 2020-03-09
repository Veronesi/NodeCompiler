"use strict";
const AnalisisLexico = require('./tools/AnalisisLexico');
const AnalisisSintactico = require('./tools/AnalisisSintactico');
const CodigoIntermedio = require('./tools/CodigoIntermedio');

const analisisLexico = new AnalisisLexico(); 

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
        //console.log(JSON.stringify(three));
    	//const codigoIntermedio = new CodigoIntermedio({three: three, debug: true});
        //codigoIntermedio.start(); 
    });
});
