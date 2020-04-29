"use strict";
const fs = require('fs');
const AnalisisLexico = require('./tools/AnalisisLexico');
const AnalisisSintactico = require('./tools/AnalisisSintactico');
const CodigoIntermedio = require('./tools/Evaluador')

const help =
    ` _____       _     _____               _ _         
|   | |___ _| |___|     |___ _____ ___|_| |___ ___ 
| | | | . | . | -_|   --| . |     | . | | | -_|  _|
|_|___|___|___|___|_____|___|_|_|_|  _|_|_|___|_|  
                                  |_|              
                                  
El archivo a ejecutar debe situarse en la carpeta public del proyecto

Commands:
Usage: npm run [Command] [filename.js] [arguments]

Global Commands
    lexying ............................. Genera la tabla de componentes Lexicos
    parsing ............................. Genera el arbol sintactico
    compile ............................. Compila un archivo en codigo fuente
    start ............................... Compila y ejecuta un archivo 

    help ................................ Muestra informacion sobre los comandos
    
    characters .......................... Lista los caracteres
    reserved-words ...................... Lista las palabras reservadas
    productions ......................... Lista las producciones

Global arguments
    debug ............................... Muetra que va haciendo el compilador
    save ................................ Exporta cada etapa en archivos
    show ................................ Muetra informacion al finalizar cada etapa

Examples
    npm run lexying myfile.js save
    npm run start myfile.js
 
repo: https://github.com/Veronesi/NodeCompiler
`

let analisisLexico = new AnalisisLexico();
if (process.argv.length > 2) {
    switch (process.argv[2]) {
        case 'scanner':
            console.log('runing...')
            analisisLexico = new AnalisisLexico();
            analisisLexico.start({ fileName: process.argv[3], save: process.argv.includes("save") })
            process.argv.includes("show") ? console.table(analisisLexico.tokens) : false;
            break;
        case 'parsing':
            console.log('runing...')
            analisisLexico = new AnalisisLexico();
            analisisLexico.start({ fileName: process.argv[3], save: process.argv.includes("save") }, tokens => {
                process.argv.includes("show") ? console.table(tokens) : false;

                const analisisSintactico = new AnalisisSintactico({ debug: process.argv.includes("debug") });
                analisisSintactico.start({
                    tokens: tokens
                }, tree => {
                    process.argv.includes("show") ? tree.showTree('', '', true) : false;
                });
            })
            break;
        case 'start':
            console.log('runing...')
            analisisLexico = new AnalisisLexico();
            analisisLexico.start({ fileName: process.argv[3], save: process.argv.includes("save") }, tokens => {
                process.argv.includes("show") ? console.table(tokens) : false;

                const analisisSintactico = new AnalisisSintactico({ debug: process.argv.includes("debug") });
                analisisSintactico.start({
                    tokens: tokens
                }, tree => {
                    process.argv.includes("show") ? tree.showTree('', '', true) : false;
                    const codigoIntermedio = new CodigoIntermedio({tree: tree, debug: true});
                    codigoIntermedio.start();
                });
            })
            break;
        case 'help':
            console.log(help)
            break;
        case 'characters':
            const Caracteres = require('./config/caracteres')
            console.table(Caracteres)
            break;
        case 'reserved-words':
            const palabrasReservadas = require('./config/palabrasReservadas')
            console.table(palabrasReservadas)
            break;
        case 'productions':
            const producciones = require('./config/producciones')
            console.table(producciones.map(e => { return { produccion: e.produccion, produce: e.produce } }))
            break;
        default:
            break;
    }
} else {
    console.log(help)
}


/*
let textoPlano = fs.readFileSync(`./src/public/sintactico-output.js`, 'utf8');
JSON.parse(textoPlano).showTree('', '', true);

let evaluador = new Evaluador({three: JSON.parse(textoPlano), debug: true});
evaluador.start()
*/