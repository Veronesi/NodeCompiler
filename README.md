# NodeCompiler

## Table of contents

- [Lista de comandos](#lista-de-comandos)
- [Analizador lexico](https://github.com/Veronesi/NodeCompile)
- [Analizador sintactico](https://github.com/Veronesi/NodeCompile)
- [Evaluador](https://github.com/Veronesi/NodeCompile)
- [Caracteres](https://github.com/Veronesi/NodeCompile)
- [Palabras reservadas](https://github.com/Veronesi/NodeCompile)
- [Producciones](https://github.com/Veronesi/NodeCompile)
- [Manejo de errores](https://github.com/Veronesi/NodeCompile)
- [Generacion de la tabla y arbol](https://github.com/Veronesi/NodeCompile)
- [Generacion de codigo intermedio](https://github.com/Veronesi/NodeCompile)
- [Ejemplo de compilacion](https://github.com/Veronesi/NodeCompile)

## Lista de comandos

```
Usage: npm run [Command] [filename.js] [arguments]

Global Commands
    scanner ............................. Genera la tabla de componentes Lexicos
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
```

## Funcionamiento

### Analisis Lexico

En esta fase se lee el código de entrada `*.js` leyendo línea a línea, limpiando espacios en blanco y comentarios. Mediante expresiones regulares [analiza](https://github.com/Veronesi/NodeCompiler/blob/e7702fe3cf06dffd7377b4712b6dc85122936f1a/src/tools/AnalisisLexico.js#L70-L135) cada elemento para insertarlo en la tabla de tokens (además de verificar si el mismo es una [palabra reservada](https://github.com/Veronesi/NodeCompiler/blob/master/src/config/palabrasReservadas.js) o un [caracter](https://github.com/Veronesi/NodeCompiler/blob/master/src/config/caracteres.js) ), indicando el tipo (ID, NUMERO, OPERADOR, etc.) y en que línea se encuentra. 

Una vez finalizado la fase de análisis léxico, continua el análisis sintáctico, verificando si el orden de estos token cumplen con las [posibles producciones](https://github.com/Veronesi/NodeCompiler/blob/master/src/config/producciones.js), es decir, si "tiene sentido el orden de los mismos".

```js
A = 3;
┌─────────┬─────────┬─────────┬──────────────────────┬──────┐
│ (index) │  name   │ element │         type         │ line │
├─────────┼─────────┼─────────┼──────────────────────┼──────┤
│    0    │ 'Token' │   'A'   │         'ID'         │  1   │
│    1    │ 'Token' │   '='   │ 'OPERADORASIGNACION' │  1   │
│    2    │ 'Token' │   '3'   │       'NUMERO'       │  1   │
│    3    │ 'Token' │   ';'   │     'PUNTOYCOMA'     │  1   │
└─────────┴─────────┴─────────┴──────────────────────┴──────┘
```

En esta fase solo puede generarse un error al "leerse" un elemento que no sea capturado por ninguna expresión regular, por ejemplo un caracter que no esté en la lista de caracteres
```
var1 = $;

LexicalError: token no válido o inesperado '$' en linea 1
```

