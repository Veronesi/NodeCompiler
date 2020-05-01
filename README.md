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

### Analisis Sintactico
En esta fase de desidio dividir en 3 etapas. 

**1.** Buscar un subarbol (sin importar que que no sea el raiz sea la produccion `<Programa>` ni que el arbol este completo) ya que eran muchos mas los posibles arboles que generen la produccion a medida que se van analizando los tokens que empezar por la produccion que genere el primer token. 

**1.1** Se toma el primer token de la lista de tokens y se busca todas las producciones que general al mismo (aquellas producciones que el primer token que genera sea este). 
```
Ej.:
Proximo Token: SIGNO

posibles produccines que lo generan:
<Condicion> => <ExpresionAritmetica> SIGNO <ExpresionAritmetica>
```
**1.2.** se insertan todas las producciones en `AnalisisSintactico.produccion` que generan al token.
```
Ej.:
<Condicion>
├──<ExpresionAritmetica> (Produccion libre)
├──SIGNO '>'
└──NUMERO (Token libre)
```

**1.3.** Se toma el proximo token de la lista de tokens y se verifica cada posible produccion del paso anterior si sigue siendo posible.

1.3.1. si el token coincide con el proximo "token libre" de la posible produccion, este se inserta, caso contrario la produccion se descarta.
```
Ej.:
Proximo Token: NUMERO
   
<Condicion>
├──<ExpresionAritmetica> (Produccion libre)
├──SIGNO '>'
└──NUMERO '123' <- Se insertara en este Token libre
```

**1.3.2.** si no hay mas tokens libres se busca la primera "produccion libre" que se encuentre despues del ultimo token no-libre, reemplazando el mimso por aquellas producciones que generen a este token (si no hay produccion que genere a este token, la produccion se descarta).
   
```
Ej.:
Proximo Token: NUMERO (123)

posible produccion:
<Asignacion>
├──ID 'A'
├──OPERADORASIGNACION '='
└──<ExpresionAritmetica> (Produccion libre) <- Proxima produccion libre

Producciones de <ExpresionAritmetica> que generan NUMERO
<ExpresionAritmetica>
├──NUMERO
└──<ExpresionAritmeticaFinal> 


Reemplazando en la posble produccion

<Asignacion>
├──ID 'A'
├──OPERADORASIGNACION '='
└──<ExpresionAritmetica>                             |
    ├──NUMERO '123'                                  | Nuevo bloque
    └──<ExpresionAritmeticaFinal> (Produccion libre) |
```  

**1.3.3.** Si no hay ni token libres ni producciones libres se busca aquellas producciones que generan al nodo raiz de esta produccion (en el caso de que nadie genere al nodo raiz, la produccion se descarta).
   
```
Ej.:
Proximo Token: PUNTOYCOMA

posible produccion:
<Asignacion>                 <- El unico que puede generar a PUNTOYCOMA
├──ID 'A'
├──OPERADORASIGNACION '='
└──<Expresion>
   └──<ExpresionAritmetica>
      ├──NUMERO '3'
      └──<ExpresionAritmeticaFinal>
         └──EPSILON

Producciones que generan a <Asignacion>
<Sentencia>
└──<Asignacion>

Insertamos todas las producciones que generan a <Asignacion>

<Sentencia>
└──<Asignacion>
   ├──ID 'A'
   ├──OPERADORASIGNACION '='
   └──<Expresion>
      └──<ExpresionAritmetica>
         ├──NUMERO '3'
         └──<ExpresionAritmeticaFinal>
            └──EPSILON
```

una vez que se terminaron de analizar todas las posibles producciones para este token, si aun quedan producciones sin incluir a este (en el caso que haya pasado el punto 1.3.2 o 1.3.3) se pasa al proximo token, caso contrario se vuelven a analizar estas producciones hasta que incluyan al token.
