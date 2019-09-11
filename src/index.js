"use strict";
const AnalisisLexico = require('./tools/AnalisisLexico');
const AnalisisSintactico = require('./tools/AnalisisSintactico');
//const Arbol = require('./models/Arbol');

/*
const analisisLexico = new AnalisisLexico();
analisisLexico.start({
    filename: 'example.f'
}, () => {
    console.table(analisisLexico.tokens);
    const analisisSintactico = new AnalisisSintactico();
    analisisSintactico.start({
        tokens : analisisLexico.tokens,
        tpyeImport: 'arr'
    }, () => {

    });
});

*/

const analisisLexico = new AnalisisLexico(); 
analisisLexico.start({
    filename: 'example.f'
}, () => {
    console.table(analisisLexico.tokens);
    const analisisSintactico = new AnalisisSintactico();
    analisisSintactico.start({
        tokens : analisisLexico.tokens,
        tpyeImport: 'arr'
    }, () => {

    });
});

