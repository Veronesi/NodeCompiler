"use strict";
const AnalisisLexico = require('./tools/AnalisisLexico');
const AnalisisSintactico = require('./tools/AnalisisSintactico');

const analisisLexico = new AnalisisLexico(); 

analisisLexico.start({
    fileName: 'example.f'
}, (tokens) => {
    console.table(tokens);
    const analisisSintactico = new AnalisisSintactico();
    analisisSintactico.start({
        tokens : tokens,
        tpyeImport: 'arr'
    }, () => {

    });
});

