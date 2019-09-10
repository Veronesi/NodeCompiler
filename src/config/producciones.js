"use strict";
const Porduccion = require('../models/Produccion');
const caracter = [
    new Porduccion({produccion: '<Programa>',                     produce: ['<Sentencia>', 'PUNTOYCOMA', '<ProgramaFin>']}),
    new Porduccion({produccion: '<ProgramaFin>',                  produce: ['<Sentencia>', 'PUNTOYCOMA', '<Programa>']}),
    new Porduccion({produccion: '<ProgramaFin>',                  produce: ['EPSILON']}),
    new Porduccion({produccion: '<Programa>',                     produce: ['EPSILON']}),
    new Porduccion({produccion: '<Sentencia>',                    produce: ['<Asignacion>']}),
    new Porduccion({produccion: '<Asignacion>',                   produce: ['ID', 'OPERADORASIGNACION', '<Expresion>']}),
    new Porduccion({produccion: '<Expresion>',                    produce: ['<ExpresionAritmetica>']}),
    new Porduccion({produccion: '<ExpresionAritmetica>',          produce: ['ID', '<ExpresionAritmeticaFinal>']}),
    new Porduccion({produccion: '<ExpresionAritmetica>',          produce: ['NUMERO', '<ExpresionAritmeticaFinal>']}),
    new Porduccion({produccion: '<ExpresionAritmeticaFinal>',     produce: ['OPERADOR', '<ExpresionAritmetica>']}),
    new Porduccion({produccion: '<ExpresionAritmeticaFinal>',     produce: ['EPSILON']}),
];

module.exports = caracter;