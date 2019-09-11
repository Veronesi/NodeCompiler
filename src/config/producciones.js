"use strict";
const producciones = [
    {name: 'Produccion', produccion: '<Programa>',                     produce: ['<Sentencia>', 'PUNTOYCOMA', '<ProgramaFin>']},
    {name: 'Produccion', produccion: '<ProgramaFin>',                  produce: ['<Sentencia>', 'PUNTOYCOMA', '<Programa>']},
    {name: 'Produccion', produccion: '<ProgramaFin>',                  produce: ['EPSILON']},
    {name: 'Produccion', produccion: '<Programa>',                     produce: ['EPSILON']},
    {name: 'Produccion', produccion: '<Sentencia>',                    produce: ['<Asignacion>']},
    {name: 'Produccion', produccion: '<Asignacion>',                   produce: ['ID', 'OPERADORASIGNACION', '<Expresion>']},
    {name: 'Produccion', produccion: '<Expresion>',                    produce: ['<ExpresionAritmetica>']},
    {name: 'Produccion', produccion: '<ExpresionAritmetica>',          produce: ['ID', '<ExpresionAritmeticaFinal>']},
    {name: 'Produccion', produccion: '<ExpresionAritmetica>',          produce: ['NUMERO', '<ExpresionAritmeticaFinal>']},
    {name: 'Produccion', produccion: '<ExpresionAritmeticaFinal>',     produce: ['OPERADOR', '<ExpresionAritmetica>']},
    {name: 'Produccion', produccion: '<ExpresionAritmeticaFinal>',     produce: ['EPSILON']},
];

module.exports = producciones;