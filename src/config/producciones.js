caracter = [
    {
        produccion: '<Programa>',
        produce: [
            '<Sentencia>',
            'PUNTOYCOMA',
            '<ProgramaFin>'
        ]
    },
    {
        produccion: '<ProgramaFin>',
        produce: [
            '<Sentencia>',
            'PUNTOYCOMA',
            '<Programa>'
        ]
    },
]

module.exports = caracter