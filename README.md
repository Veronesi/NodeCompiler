# NodeCompiler

## Table of contents

- [Instalacion](#instalacion)
- [Lista de comandos](#lista-de-comandos)
- [Analizador lexico](#analisis-lexico)
- [Analizador sintactico](#analisis-sintactico)
- [Evaluador](#evaluador)
- [Caracteres](https://github.com/Veronesi/NodeCompiler/blob/master/src/config/caracteres.js)
- [Palabras reservadas](https://github.com/Veronesi/NodeCompiler/blob/master/src/config/palabrasReservadas.js)
- [Producciones](https://github.com/Veronesi/NodeCompiler/blob/master/src/config/producciones.js)
- [Manejo de errores](https://github.com/Veronesi/NodeCompiler/wiki/Manejo-de-errores)
- [Generacion de la tabla y arbol](https://github.com/Veronesi/NodeCompile) - Sin hacer
- [Generacion de codigo intermedio](https://github.com/Veronesi/NodeCompile) - Sin hacer
- [Ejemplo de compilacion](https://github.com/Veronesi/NodeCompiler/wiki/ejemplo-compilaci%C3%B3n)

## Instalacion
1. Instalar [Node.js](https://nodejs.org/es/)
2. Clonar repo: `git clone https://github.com/Veronesi/NodeCompiler.git`
3. Instalar modulos: `cd NodeCompiler` y luego `npm i`
4. crear un archivo en la carpeta en `src/public` (o utilizar uno de los archivos que trae por defecto)
5. Ejecutar el programa: `npm run parsing example.js show`


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

Esta fase tiene como entrada el código fuente `*.js`, donde se va leyendo línea a línea, limpiando espacios en blanco y comentarios. Con la utilización de expresiones regulares, se [analiza](https://github.com/Veronesi/NodeCompiler/blob/e7702fe3cf06dffd7377b4712b6dc85122936f1a/src/tools/AnalisisLexico.js#L70-L135) cada elemento para insertarlo en la tabla de tokens (además de verificar si el mismo es una [palabra reservada](https://github.com/Veronesi/NodeCompiler/blob/master/src/config/palabrasReservadas.js) o un [caracter](https://github.com/Veronesi/NodeCompiler/blob/master/src/config/caracteres.js) ), indicando el tipo (ID, NUMERO, OPERADOR, etc.) y en qué línea se encuentra. 

Una vez finalizada la fase de análisis léxico, continua el análisis sintáctico, verificando si el orden de estos token cumplen con las [posibles producciones](https://github.com/Veronesi/NodeCompiler/blob/master/src/config/producciones.js) definidas anteriormente, es decir, si "tiene sentido el orden de los mismos".

Código de entrada
```js
A = 3;
```

Tabla de Tokens generada

| index | name | element | type | Line |
| :---: | :---: | :---: | :---: | :---: |
| 0 | 'Token' | 'A' | 'ID' | 1 |
| 1 | 'Token' | '=' | 'OPERADORASIGNACION' | 1 |
| 2 | 'Token' | '3' | 'NUMERO' | 1 |
| 3 | 'Token' | ';' | 'PUNTOYCOMA' | 1 |

En esta fase solo puede generarse un error al "leerse" un elemento que no sea capturado por ninguna expresión regular, por ejemplo un caracter que no esté en la lista de caracteres
```js
var1 = $;
```
> **LexicalError**: token no válido o inesperado **'$'** en linea **1**

### Analisis Sintactico
En esta fase se decidió dividir en 3 etapas. 

**1.** Buscar un subárbol (sin importar que este no sea el raíz sea la producción, es decir el nodo `<Programa>` ni que el árbol este completo), ya que la cantidad de posibilidades que existen de árboles que tienen como nodo raíz `<Programa>` y como primer token el primer elemento de la tabla de tokens)  era mucho mayor a únicamente aquellos árboles que tienen como primer nodo el primer token de la tabla.
**1.1** Se toma el primer elemento de la lista de tokens y se busca todas las producciones que general al mismo (aquellas producciones que el primer token que genera sea este).

Ej.:
Primer token de la tabla: `SIGNO` `<`

Producciones que lo generan
```diff
{
   name: 'Produccion', 
   Produccion: '<Condicion>',
   produce: [
      '<ExpresionAritmetica>', 
!     'SIGNO', 
      '<ExpresionAritmetica>'
     ]
},
```
**1.2.** se insertan todas las producciones en `AnalisisSintactico.produccion` que generan al token.

Ej.:
```diff
  <Condicion>
  ├──<ExpresionAritmetica> (Produccion libre)
+ ├──SIGNO '>'
  └──NUMERO (Token libre)
```

**1.3.** Se toma el próximo elemento  de la lista de tokens y se verifica cada producción (una a una) obtenida del paso anterior si sigue siendo un posible subárbol que genere a toda la tabla.

**1.3.1.** Si el token coincide con el próximo "token libre" de la producción, este se inserta, caso contrario la producción se descarta.

Ej.:
Proximo Token: `NUMERO` `123`
```diff
  <Condicion>
  ├──<ExpresionAritmetica> (Produccion libre)
  ├──SIGNO '>'
+ └──NUMERO '123' <- Se insertara en este Token libre
```

**1.3.2.** si no hay mas tokens libres, se busca la primera "produccion libre" que se encuentre despues del ultimo token no-libre, reemplazando el mimso por aquellas producciones que generen a este token (si no hay produccion que genere a este token, la produccion se descarta).
   
Ej.:
Proximo Token: `NUMERO` `123`   
```diff
<Asignacion>
  ├──ID 'A'
  ├──OPERADORASIGNACION '='
! └──<ExpresionAritmetica> (Produccion libre) <- Proxima produccion libre
```
Producciones de `<ExpresionAritmetica>` que generan `NUMERO`
```diff
<ExpresionAritmetica>
├──NUMERO
└──<ExpresionAritmeticaFinal> 
```

Reemplazando en la posble produccion
```diff
<Asignacion>
  ├──ID 'A'
  ├──OPERADORASIGNACION '='
! └──<ExpresionAritmetica>                             
+     ├──NUMERO '123'                                  
+     └──<ExpresionAritmeticaFinal> (Produccion libre) 
```  

**1.3.3.** Si no hay ni token libres ni producciones libres, se [busca](https://github.com/Veronesi/NodeCompiler/blob/812fd9cc2210fc26fc62d8aaf361af32b37e7895/src/tools/AnalisisSintactico.js#L325-L335) aquellas producciones que generan al nodo raiz de esta produccion (en el caso de que nadie genere al nodo raiz, la produccion se descarta).
   
Ej.:
Proximo Token: `PUNTOYCOMA`   
```diff
! <Asignacion>                 <- El unico que puede generar a PUNTOYCOMA
  ├──ID 'A'
  ├──OPERADORASIGNACION '='
  └──<Expresion>
     └──<ExpresionAritmetica>
        ├──NUMERO '3'
        └──<ExpresionAritmeticaFinal>
           └──EPSILON
```
Producciones que generan a `<Asignacion>`
```diff
<Sentencia>
└──<Asignacion>
```

Insertamos todas las producciones que generan a `<Asignacion>`
```diff
+ <Sentencia>                        <- No es el Nodo Raiz del lenguaje
! └──<Asignacion>
     ├──ID 'A'
     ├──OPERADORASIGNACION '='
     └──<Expresion>
        └──<ExpresionAritmetica>
           ├──NUMERO '3'
           └──<ExpresionAritmeticaFinal>
              └──EPSILON
```

Una vez que se terminaron de analizar todas las posibles producciones para este token, si aun quedan producciones sin incluir a este (en el caso que haya pasado el punto 1.3.2 o 1.3.3) se pasa al proximo token, caso contrario se vuelven a analizar estas producciones hasta que incluyan al token.

**2.** Cuando ya no quedan mas tokens por [analizar](https://github.com/Veronesi/NodeCompiler/blob/812fd9cc2210fc26fc62d8aaf361af32b37e7895/src/tools/AnalisisSintactico.js#L346), siguiendo la misma estrategia del punto anterior, se trata de que el nodo raiz de cada posible produccion sea generado por el **Nodo Raiz**, para este lenguaje es la produccion `<Programa>`.

```js
A = 3;
```

```diff
+ <Programa> <- Ya es Nodo Raiz
  ├──<Sentencia>
  │  └──<Asignacion>
  │     ├──ID 'A'
  │     ├──OPERADORASIGNACION '='
  │     └──<Expresion>
  │        └──<ExpresionAritmetica>
  │           ├──NUMERO '3'
  │           └──<ExpresionAritmeticaFinal>
  │              └──EPSILON
  ├──PUNTOYCOMA ';'
  └──<ProgramaFin> (Produccion libre)
```

**3.** Luego se trata de [completar](https://github.com/Veronesi/NodeCompiler/blob/812fd9cc2210fc26fc62d8aaf361af32b37e7895/src/tools/AnalisisSintactico.js#L371) todas las posibles producciones, es decir, que no quede ninguna "produccion libre" ni que quede un "token libre", quedando una unica produccion posible, sinedo esta la produccion que genera a la lista de tokens. 

```js
A = 3;
```

```diff
  <Programa> <- Ya es Nodo Raiz
  ├──<Sentencia>
  │  └──<Asignacion>
  │     ├──ID 'A'
  │     ├──OPERADORASIGNACION '='
  │     └──<Expresion>
  │        └──<ExpresionAritmetica>
  │           ├──NUMERO '3'
  │           └──<ExpresionAritmeticaFinal>
  │              └──EPSILON
  ├──PUNTOYCOMA ';'
! └──<ProgramaFin>
+    └──EPSILON
```

En esta fase puede generarse un error por (cuando solo queda una unica posible produccion, ya que si quedan varias esta se descarta): 
- cuando se quiere insertar un token y existe un "token libre" y estos no coinciden
```js
while(i < 10){ [       <-- Elemento '[' genera un error
    readint(Elem);
    a = cons(Elem, A);
    i = i+1;
};
```
Proximo Token: `CORCHETE_OPEN`
```diff
  <Ciclo>
  ├──WHILE 'while'
  ├──PARENTESIS_OPEN '('
  ├──<Condicion>
  │  ├──<ExpresionAritmetica>
  │  │  ├──ID 'i'
  │  │  └──<ExpresionAritmeticaFinal>
  │  │     └──EPSILON
  │  ├──SIGNO '<'
  │  └──<ExpresionAritmetica>
  │     ├──NUMERO '10'
  │     └──<ExpresionAritmeticaFinal>
  │        └──EPSILON
  ├──PARENTESIS_CLOSE ')'
  ├──LLAVE_OPEN '{'
  ├──<Programa>
  │  ├──<Sentencia>
  │  │  └──<Lectura>
  │  │     └──<LecturaLista>
- │  │        ├──READLIST                <- Proximo Token Libre
  │  │        └──<EscrituraLectura>
  │  ├──PUNTOYCOMA                     
  │  └──<ProgramaFin>
  └──LLAVE_CLOSE
```
> **SyntaxError**: token inesperado **'\['** en linea **1**

- a la hora de verificar si la produccion esta completa (etapa 3), la unica produccion posible es descartada por que queda un token libre
```js
var1 = 45
```

```diff
  <Programa>
  ├──<Sentencia>
  │  └──<Asignacion>
  │     ├──ID 'var1'
  │     ├──OPERADORASIGNACION '='
  │     └──<Expresion>
  │        └──<ExpresionAritmetica>
  │           ├──NUMERO '45'
  │           └──<ExpresionAritmeticaFinal>
  │              └──EPSILON
- ├──PUNTOYCOMA (Token libre)
  └──<ProgramaFin>
```
> **SyntaxError**: se esperaba un **';'** en linea **1**

### Evaluador

El evaluador se encarga de recorrer todas las producciones `<Programa>`que se encuentran en el árbol generado por el analizador sintáctico, ejecutándolas de forma ordenada, en donde dependiendo del nodo hijo de la producción `<Sentencia>`, ejecutara una acción. 

**1. `<Asignacion>`**
Al ejecutar una asignación, el evaluador le asigna a la variable (`ID`) una variable temporal, la cual esta tendrá el nuevo valor de la variable. El evaluador recorrerá el subárbol `<Expresion>`.

**1.1 Caso Expresión Numérica:** el evaluador verifica si se trata de un numero o una variable, si es un numero le asigna el valor del mismo a una nueva variable temporal, en caso de ser una variable, busca su valor en la tabla de variables. Una vez que se recorrió toda la producción `<Expresion>` el evaluador recorre la tabla de variables temporales desde el último elemento en ingresarse hasta el primero, reasignando los valores (cuando encuentra un `tempX` en la propiedad `value` busca su valor en la tabla), cuando todas las variables temporales fueron analizadas, se busca aquella variable que tenía como valor una variable temporal y se le asigna el valor "real" de la variable temporal.

```js
var1 = 4;
var2 = var1 + 3;
```

| index | name | value | \_eval | type |
| :---: | :---: | :---: | :---: | :---: |
| 0 | 'temp1' | '4' | null | temp |
| 1 | 'temp2' | '4 + temp3' | null | temp |
| 2 | 'temp3' | 'temp4' | null | temp |
| 3 | 'temp4' | '3' | null | temp |

_La propiedad \_eval se encarga de guardar la segunda parte del valor de una variable temporal, si es que existe_


| index | name | value | type |
| :---: | :---: | :---: | :---: |
| 0 | 'var1' | 4 | var |
| 1 | 'var2' | 7 | var |

Ejemplo de var2: 
```js
var2 = temp2

temp4 = 3
temp3 = temp4
temp3 = 3
temp2 = 4 + temp3
temp2 = 4 + 3

var2 = eval(4+3)
var2 = 7
```

**1.2 Caso Expresion Lista: Falta programarlo**

**2. `<Condicional>`**
Al ejecutar una asignación, el evaluador deberá saber si la comparación entre las dos <ExpresionAritmetica> resulta ser verdadera o falsa, para esto, el mismo crea una variable donde calculara y se guardara el valor de cada expresión para poder compararlas. (Para evitar colisionar con una creada por el usuario se le antepone el caracter $). Como el lenguaje a interpretar utiliza los mismos signos de comparación que el lenguaje compilador (Javascript) no es necesario implementar un "switch/case".

Ejemplo:
```js
var1 = 4;
if(var1 > 3){
    var2 = var1 + 3;
};
```
| index | name | value | type |
| :---: | :---: | :---: | :---: |
| 0 | 'var1' | 4 | var |
| 1 | '$c1' | 4 | var |
| 2 | '$c2' | 3 | var |
| 3 | 'var2' | 7 | var |

_donde $c1 referencia a la primera componente de la comparacion y $c2 a la segunda componente._
