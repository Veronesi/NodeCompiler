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
```
