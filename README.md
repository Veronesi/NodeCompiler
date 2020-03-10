# NodeCompiler

### Codigo fuente de ejemplo

```js
B = [2, 4];
readint("ingrese un numero", Elem);
readlist("ingrese una lista", A);
A = cons(Elem, A);
I = 3;
while(I < 10){
    readint(Elem);
    A = cons(Elem, A);
    I = I+1;
};
Prim = first(A);
if(Prim == 0){
    A = cons(1, rest(rest(A)));
    writelist("la lista resultante es ",A);
}else{
    Prim = first(B);
    writeint("el primeroo de la lista B es ", Prim);
};
```

### Tabla de tokens generada por el Analizador Lexico

```
┌─────────┬─────────┬─────────────────────────────────┬──────────────────────┬──────┐
│ (index) │  name   │             element             │         type         │ line │
├─────────┼─────────┼─────────────────────────────────┼──────────────────────┼──────┤
│    0    │ 'Token' │               'B'               │         'ID'         │  1   │
│    1    │ 'Token' │               '='               │ 'OPERADORASIGNACION' │  1   │
│    2    │ 'Token' │               '['               │   'CORCHETE_OPEN'    │  1   │
│    3    │ 'Token' │               '2'               │       'NUMERO'       │  1   │
│    4    │ 'Token' │               ','               │        'COMA'        │  1   │
│    5    │ 'Token' │               '4'               │       'NUMERO'       │  1   │
│    6    │ 'Token' │               ']'               │   'CORCHETE_CLOSE'   │  1   │
│    7    │ 'Token' │               ';'               │     'PUNTOYCOMA'     │  1   │
│    8    │ 'Token' │            'readint'            │      'READINT'       │  2   │
│    9    │ 'Token' │               '('               │  'PARENTESIS_OPEN'   │  2   │
│   10    │ 'Token' │               '"'               │      'COMILLA'       │  2   │
│   11    │ 'Token' │       'ingrese un numero'       │       'TEXTO'        │  2   │
│   12    │ 'Token' │               '"'               │      'COMILLA'       │  2   │
│   13    │ 'Token' │               ','               │        'COMA'        │  2   │
│   14    │ 'Token' │             'Elem'              │         'ID'         │  2   │
│   15    │ 'Token' │               ')'               │  'PARENTESIS_CLOSE'  │  2   │
│   16    │ 'Token' │               ';'               │     'PUNTOYCOMA'     │  2   │
│   17    │ 'Token' │           'readlist'            │      'READLIST'      │  3   │
│   18    │ 'Token' │               '('               │  'PARENTESIS_OPEN'   │  3   │
│   19    │ 'Token' │               '"'               │      'COMILLA'       │  3   │
│   20    │ 'Token' │       'ingrese una lista'       │       'TEXTO'        │  3   │
│   21    │ 'Token' │               '"'               │      'COMILLA'       │  3   │
│   22    │ 'Token' │               ','               │        'COMA'        │  3   │
│   23    │ 'Token' │               'A'               │         'ID'         │  3   │
│   24    │ 'Token' │               ')'               │  'PARENTESIS_CLOSE'  │  3   │
│   25    │ 'Token' │               ';'               │     'PUNTOYCOMA'     │  3   │
│   26    │ 'Token' │               'A'               │         'ID'         │  4   │
│   27    │ 'Token' │               '='               │ 'OPERADORASIGNACION' │  4   │
│   28    │ 'Token' │             'cons'              │        'CONS'        │  4   │
│   29    │ 'Token' │               '('               │  'PARENTESIS_OPEN'   │  4   │
│   30    │ 'Token' │             'Elem'              │         'ID'         │  4   │
│   31    │ 'Token' │               ','               │        'COMA'        │  4   │
│   32    │ 'Token' │               'A'               │         'ID'         │  4   │
│   33    │ 'Token' │               ')'               │  'PARENTESIS_CLOSE'  │  4   │
│   34    │ 'Token' │               ';'               │     'PUNTOYCOMA'     │  4   │
│   35    │ 'Token' │               'I'               │         'ID'         │  5   │
│   36    │ 'Token' │               '='               │ 'OPERADORASIGNACION' │  5   │
│   37    │ 'Token' │               '3'               │       'NUMERO'       │  5   │
│   38    │ 'Token' │               ';'               │     'PUNTOYCOMA'     │  5   │
│   39    │ 'Token' │             'while'             │       'WHILE'        │  6   │
│   40    │ 'Token' │               '('               │  'PARENTESIS_OPEN'   │  6   │
│   41    │ 'Token' │               'I'               │         'ID'         │  6   │
│   42    │ 'Token' │               '<'               │       'SIGNO'        │  6   │
│   43    │ 'Token' │              '10'               │       'NUMERO'       │  6   │
│   44    │ 'Token' │               ')'               │  'PARENTESIS_CLOSE'  │  6   │
│   45    │ 'Token' │               '{'               │     'LLAVE_OPEN'     │  6   │
│   46    │ 'Token' │            'readint'            │      'READINT'       │  7   │
│   47    │ 'Token' │               '('               │  'PARENTESIS_OPEN'   │  7   │
│   48    │ 'Token' │             'Elem'              │         'ID'         │  7   │
│   49    │ 'Token' │               ')'               │  'PARENTESIS_CLOSE'  │  7   │
│   50    │ 'Token' │               ';'               │     'PUNTOYCOMA'     │  7   │
│   51    │ 'Token' │               'A'               │         'ID'         │  8   │
│   52    │ 'Token' │               '='               │ 'OPERADORASIGNACION' │  8   │
│   53    │ 'Token' │             'cons'              │        'CONS'        │  8   │
│   54    │ 'Token' │               '('               │  'PARENTESIS_OPEN'   │  8   │
│   55    │ 'Token' │             'Elem'              │         'ID'         │  8   │
│   56    │ 'Token' │               ','               │        'COMA'        │  8   │
│   57    │ 'Token' │               'A'               │         'ID'         │  8   │
│   58    │ 'Token' │               ')'               │  'PARENTESIS_CLOSE'  │  8   │
│   59    │ 'Token' │               ';'               │     'PUNTOYCOMA'     │  8   │
│   60    │ 'Token' │               'I'               │         'ID'         │  9   │
│   61    │ 'Token' │               '='               │ 'OPERADORASIGNACION' │  9   │
│   62    │ 'Token' │               'I'               │         'ID'         │  9   │
│   63    │ 'Token' │               '+'               │      'OPERADOR'      │  9   │
│   64    │ 'Token' │               '1'               │       'NUMERO'       │  9   │
│   65    │ 'Token' │               ';'               │     'PUNTOYCOMA'     │  9   │
│   66    │ 'Token' │               '}'               │    'LLAVE_CLOSE'     │  10  │
│   67    │ 'Token' │               ';'               │     'PUNTOYCOMA'     │  10  │
│   68    │ 'Token' │             'Prim'              │         'ID'         │  11  │
│   69    │ 'Token' │               '='               │ 'OPERADORASIGNACION' │  11  │
│   70    │ 'Token' │             'first'             │       'FIRST'        │  11  │
│   71    │ 'Token' │               '('               │  'PARENTESIS_OPEN'   │  11  │
│   72    │ 'Token' │               'A'               │         'ID'         │  11  │
│   73    │ 'Token' │               ')'               │  'PARENTESIS_CLOSE'  │  11  │
│   74    │ 'Token' │               ';'               │     'PUNTOYCOMA'     │  11  │
│   75    │ 'Token' │              'if'               │         'IF'         │  12  │
│   76    │ 'Token' │               '('               │  'PARENTESIS_OPEN'   │  12  │
│   77    │ 'Token' │             'Prim'              │         'ID'         │  12  │
│   78    │ 'Token' │              '=='               │       'SIGNO'        │  12  │
│   79    │ 'Token' │               '0'               │       'NUMERO'       │  12  │
│   80    │ 'Token' │               ')'               │  'PARENTESIS_CLOSE'  │  12  │
│   81    │ 'Token' │               '{'               │     'LLAVE_OPEN'     │  12  │
│   82    │ 'Token' │               'A'               │         'ID'         │  13  │
│   83    │ 'Token' │               '='               │ 'OPERADORASIGNACION' │  13  │
│   84    │ 'Token' │             'cons'              │        'CONS'        │  13  │
│   85    │ 'Token' │               '('               │  'PARENTESIS_OPEN'   │  13  │
│   86    │ 'Token' │               '1'               │       'NUMERO'       │  13  │
│   87    │ 'Token' │               ','               │        'COMA'        │  13  │
│   88    │ 'Token' │             'rest'              │        'REST'        │  13  │
│   89    │ 'Token' │               '('               │  'PARENTESIS_OPEN'   │  13  │
│   90    │ 'Token' │             'rest'              │        'REST'        │  13  │
│   91    │ 'Token' │               '('               │  'PARENTESIS_OPEN'   │  13  │
│   92    │ 'Token' │               'A'               │         'ID'         │  13  │
│   93    │ 'Token' │               ')'               │  'PARENTESIS_CLOSE'  │  13  │
│   94    │ 'Token' │               ')'               │  'PARENTESIS_CLOSE'  │  13  │
│   95    │ 'Token' │               ')'               │  'PARENTESIS_CLOSE'  │  13  │
│   96    │ 'Token' │               ';'               │     'PUNTOYCOMA'     │  13  │
│   97    │ 'Token' │           'writelist'           │     'WRITELIST'      │  14  │
│   98    │ 'Token' │               '('               │  'PARENTESIS_OPEN'   │  14  │
│   99    │ 'Token' │               '"'               │      'COMILLA'       │  14  │
│   100   │ 'Token' │    'la lista resultante es '    │       'TEXTO'        │  14  │
│   101   │ 'Token' │               '"'               │      'COMILLA'       │  14  │
│   102   │ 'Token' │               ','               │        'COMA'        │  14  │
│   103   │ 'Token' │               'A'               │         'ID'         │  14  │
│   104   │ 'Token' │               ')'               │  'PARENTESIS_CLOSE'  │  14  │
│   105   │ 'Token' │               ';'               │     'PUNTOYCOMA'     │  14  │
│   106   │ 'Token' │               '}'               │    'LLAVE_CLOSE'     │  15  │
│   107   │ 'Token' │             'else'              │        'ELSE'        │  15  │
│   108   │ 'Token' │               '{'               │     'LLAVE_OPEN'     │  15  │
│   109   │ 'Token' │             'Prim'              │         'ID'         │  16  │
│   110   │ 'Token' │               '='               │ 'OPERADORASIGNACION' │  16  │
│   111   │ 'Token' │             'first'             │       'FIRST'        │  16  │
│   112   │ 'Token' │               '('               │  'PARENTESIS_OPEN'   │  16  │
│   113   │ 'Token' │               'B'               │         'ID'         │  16  │
│   114   │ 'Token' │               ')'               │  'PARENTESIS_CLOSE'  │  16  │
│   115   │ 'Token' │               ';'               │     'PUNTOYCOMA'     │  16  │
│   116   │ 'Token' │           'writeint'            │      'WRITEINT'      │  17  │
│   117   │ 'Token' │               '('               │  'PARENTESIS_OPEN'   │  17  │
│   118   │ 'Token' │               '"'               │      'COMILLA'       │  17  │
│   119   │ 'Token' │ 'el primeroo de la lista B es ' │       'TEXTO'        │  17  │
│   120   │ 'Token' │               '"'               │      'COMILLA'       │  17  │
│   121   │ 'Token' │               ','               │        'COMA'        │  17  │
│   122   │ 'Token' │             'Prim'              │         'ID'         │  17  │
│   123   │ 'Token' │               ')'               │  'PARENTESIS_CLOSE'  │  17  │
│   124   │ 'Token' │               ';'               │     'PUNTOYCOMA'     │  17  │
│   125   │ 'Token' │               '}'               │    'LLAVE_CLOSE'     │  18  │
│   126   │ 'Token' │               ';'               │     'PUNTOYCOMA'     │  18  │
└─────────┴─────────┴─────────────────────────────────┴──────────────────────┴──────┘
```

### Arbol sintactico generado por el Analizador Sintactico

```
<Programa>
├──<Sentencia>
│  └──<Asignacion>
│     ├──ID 'B'
│     ├──OPERADORASIGNACION '='
│     └──<Expresion>
│        └──<ExpresionLista>
│           └──<Lista>
│              ├──CORCHETE_OPEN '['
│              ├──<ListaInterna>
│              │  ├──NUMERO '2'
│              │  └──<ListaInternaNumero>
│              │     ├──COMA ','
│              │     └──<ListaInterna>
│              │        ├──NUMERO '4'
│              │        └──<ListaInternaNumero>
│              │           └──EPSILON
│              └──CORCHETE_CLOSE ']'
├──PUNTOYCOMA ';'
└──<ProgramaFin>
   ├──<Sentencia>
   │  └──<Lectura>
   │     └──<LecturaNumero>
   │        ├──READINT 'readint'
   │        └──<EscrituraLectura>
   │           ├──PARENTESIS_OPEN '('
   │           ├──<Cadena>
   │           │  ├──COMILLA '"'
   │           │  ├──TEXTO 'ingrese un numero'
   │           │  └──COMILLA '"'
   │           ├──COMA ','
   │           ├──ID 'Elem'
   │           └──PARENTESIS_CLOSE ')'
   ├──PUNTOYCOMA ';'
   └──<Programa>
      ├──<Sentencia>
      │  └──<Lectura>
      │     └──<LecturaLista>
      │        ├──READLIST 'readlist'
      │        └──<EscrituraLectura>
      │           ├──PARENTESIS_OPEN '('
      │           ├──<Cadena>
      │           │  ├──COMILLA '"'
      │           │  ├──TEXTO 'ingrese una lista'
      │           │  └──COMILLA '"'
      │           ├──COMA ','
      │           ├──ID 'A'
      │           └──PARENTESIS_CLOSE ')'
      ├──PUNTOYCOMA ';'
      └──<ProgramaFin>
         ├──<Sentencia>
         │  └──<Asignacion>
         │     ├──ID 'A'
         │     ├──OPERADORASIGNACION '='
         │     └──<Expresion>
         │        └──<ExpresionLista>
         │           ├──CONS 'cons'
         │           ├──PARENTESIS_OPEN '('
         │           ├──<ExpresionCons>
         │           │  ├──ID 'Elem'
         │           │  ├──COMA ','
         │           │  └──<ExpresionLista>
         │           │     └──<Lista>
         │           │        └──ID 'A'
         │           └──PARENTESIS_CLOSE ')'
         ├──PUNTOYCOMA ';'
         └──<Programa>
            ├──<Sentencia>
            │  └──<Asignacion>
            │     ├──ID 'I'
            │     ├──OPERADORASIGNACION '='
            │     └──<Expresion>
            │        └──<ExpresionAritmetica>
            │           ├──NUMERO '3'
            │           └──<ExpresionAritmeticaFinal>
            │              └──EPSILON
            ├──PUNTOYCOMA ';'
            └──<ProgramaFin>
               ├──<Sentencia>
               │  └──<Ciclo>
               │     ├──WHILE 'while'
               │     ├──PARENTESIS_OPEN '('
               │     ├──<Condicion>
               │     │  ├──<ExpresionAritmetica>
               │     │  │  ├──ID 'I'
               │     │  │  └──<ExpresionAritmeticaFinal>
               │     │  │     └──EPSILON
               │     │  ├──SIGNO '<'
               │     │  └──<ExpresionAritmetica>
               │     │     ├──NUMERO '10'
               │     │     └──<ExpresionAritmeticaFinal>
               │     │        └──EPSILON
               │     ├──PARENTESIS_CLOSE ')'
               │     ├──LLAVE_OPEN '{'
               │     ├──<Programa>
               │     │  ├──<Sentencia>
               │     │  │  └──<Lectura>
               │     │  │     └──<LecturaNumero>
               │     │  │        ├──READINT 'readint'
               │     │  │        └──<EscrituraLectura>
               │     │  │           ├──PARENTESIS_OPEN '('
               │     │  │           ├──ID 'Elem'
               │     │  │           └──PARENTESIS_CLOSE ')'
               │     │  ├──PUNTOYCOMA ';'
               │     │  └──<ProgramaFin>
               │     │     ├──<Sentencia>
               │     │     │  └──<Asignacion>
               │     │     │     ├──ID 'A'
               │     │     │     ├──OPERADORASIGNACION '='
               │     │     │     └──<Expresion>
               │     │     │        └──<ExpresionLista>
               │     │     │           ├──CONS 'cons'
               │     │     │           ├──PARENTESIS_OPEN '('
               │     │     │           ├──<ExpresionCons>
               │     │     │           │  ├──ID 'Elem'
               │     │     │           │  ├──COMA ','
               │     │     │           │  └──<ExpresionLista>
               │     │     │           │     └──<Lista>
               │     │     │           │        └──ID 'A'
               │     │     │           └──PARENTESIS_CLOSE ')'
               │     │     ├──PUNTOYCOMA ';'
               │     │     └──<Programa>
               │     │        ├──<Sentencia>
               │     │        │  └──<Asignacion>
               │     │        │     ├──ID 'I'
               │     │        │     ├──OPERADORASIGNACION '='
               │     │        │     └──<Expresion>
               │     │        │        └──<ExpresionAritmetica>
               │     │        │           ├──ID 'I'
               │     │        │           └──<ExpresionAritmeticaFinal>
               │     │        │              ├──OPERADOR '+'
               │     │        │              └──<ExpresionAritmetica>
               │     │        │                 ├──NUMERO '1'
               │     │        │                 └──<ExpresionAritmeticaFinal>
               │     │        │                    └──EPSILON
               │     │        ├──PUNTOYCOMA ';'
               │     │        └──<ProgramaFin>
               │     │           └──EPSILON
               │     └──LLAVE_CLOSE '}'
               ├──PUNTOYCOMA ';'
               └──<Programa>
                  ├──<Sentencia>
                  │  └──<Asignacion>
                  │     ├──ID 'Prim'
                  │     ├──OPERADORASIGNACION '='
                  │     └──<Expresion>
                  │        └──<ExpresionAritmetica>
                  │           ├──FIRST 'first'
                  │           ├──PARENTESIS_OPEN '('
                  │           ├──<ListaInterna>
                  │           │  ├──ID 'A'
                  │           │  └──<ListaInternaNumero>
                  │           │     └──EPSILON
                  │           ├──PARENTESIS_CLOSE ')'
                  │           └──<ExpresionAritmeticaFinal>
                  │              └──EPSILON
                  ├──PUNTOYCOMA ';'
                  └──<ProgramaFin>
                     ├──<Sentencia>
                     │  └──<Condicional>
                     │     ├──IF 'if'
                     │     ├──PARENTESIS_OPEN '('
                     │     ├──<Condicion>
                     │     │  ├──<ExpresionAritmetica>
                     │     │  │  ├──ID 'Prim'
                     │     │  │  └──<ExpresionAritmeticaFinal>
                     │     │  │     └──EPSILON
                     │     │  ├──SIGNO '=='
                     │     │  └──<ExpresionAritmetica>
                     │     │     ├──NUMERO '0'
                     │     │     └──<ExpresionAritmeticaFinal>
                     │     │        └──EPSILON
                     │     ├──PARENTESIS_CLOSE ')'
                     │     ├──LLAVE_OPEN '{'
                     │     ├──<Programa>
                     │     │  ├──<Sentencia>
                     │     │  │  └──<Asignacion>
                     │     │  │     ├──ID 'A'
                     │     │  │     ├──OPERADORASIGNACION '='
                     │     │  │     └──<Expresion>
                     │     │  │        └──<ExpresionLista>
                     │     │  │           ├──CONS 'cons'
                     │     │  │           ├──PARENTESIS_OPEN '('
                     │     │  │           ├──<ExpresionCons>
                     │     │  │           │  ├──NUMERO '1'
                     │     │  │           │  ├──COMA ','
                     │     │  │           │  └──<ExpresionLista>
                     │     │  │           │     ├──REST 'rest'
                     │     │  │           │     ├──PARENTESIS_OPEN '('
                     │     │  │           │     ├──<ExpresionLista>
                     │     │  │           │     │  ├──REST 'rest'
                     │     │  │           │     │  ├──PARENTESIS_OPEN '('
                     │     │  │           │     │  ├──<ExpresionLista>
                     │     │  │           │     │  │  └──<Lista>
                     │     │  │           │     │  │     └──ID 'A'
                     │     │  │           │     │  └──PARENTESIS_CLOSE ')'
                     │     │  │           │     └──PARENTESIS_CLOSE ')'
                     │     │  │           └──PARENTESIS_CLOSE ')'
                     │     │  ├──PUNTOYCOMA ';'
                     │     │  └──<ProgramaFin>
                     │     │     ├──<Sentencia>
                     │     │     │  └──<Escritura>
                     │     │     │     └──<EscribirLista>
                     │     │     │        ├──WRITELIST 'writelist'
                     │     │     │        └──<EscrituraLectura>
                     │     │     │           ├──PARENTESIS_OPEN '('
                     │     │     │           ├──<Cadena>
                     │     │     │           │  ├──COMILLA '"'
                     │     │     │           │  ├──TEXTO 'la lista resultante es '
                     │     │     │           │  └──COMILLA '"'
                     │     │     │           ├──COMA ','
                     │     │     │           ├──ID 'A'
                     │     │     │           └──PARENTESIS_CLOSE ')'
                     │     │     ├──PUNTOYCOMA ';'
                     │     │     └──<Programa>
                     │     │        └──EPSILON
                     │     └──<CierreCondicion>
                     │        ├──LLAVE_CLOSE '}'
                     │        ├──ELSE 'else'
                     │        ├──LLAVE_OPEN '{'
                     │        ├──<Programa>
                     │        │  ├──<Sentencia>
                     │        │  │  └──<Asignacion>
                     │        │  │     ├──ID 'Prim'
                     │        │  │     ├──OPERADORASIGNACION '='
                     │        │  │     └──<Expresion>
                     │        │  │        └──<ExpresionAritmetica>
                     │        │  │           ├──FIRST 'first'
                     │        │  │           ├──PARENTESIS_OPEN '('
                     │        │  │           ├──<ListaInterna>
                     │        │  │           │  ├──ID 'B'
                     │        │  │           │  └──<ListaInternaNumero>
                     │        │  │           │     └──EPSILON
                     │        │  │           ├──PARENTESIS_CLOSE ')'
                     │        │  │           └──<ExpresionAritmeticaFinal>
                     │        │  │              └──EPSILON
                     │        │  ├──PUNTOYCOMA ';'
                     │        │  └──<ProgramaFin>
                     │        │     ├──<Sentencia>
                     │        │     │  └──<Escritura>
                     │        │     │     └──<EscribirNumero>
                     │        │     │        ├──WRITEINT 'writeint'
                     │        │     │        └──<EscrituraLectura>
                     │        │     │           ├──PARENTESIS_OPEN '('
                     │        │     │           ├──<Cadena>
                     │        │     │           │  ├──COMILLA '"'
                     │        │     │           │  ├──TEXTO 'el primeroo de la lista B es '
                     │        │     │           │  └──COMILLA '"'
                     │        │     │           ├──COMA ','
                     │        │     │           ├──ID 'Prim'
                     │        │     │           └──PARENTESIS_CLOSE ')'
                     │        │     ├──PUNTOYCOMA ';'
                     │        │     └──<Programa>
                     │        │        └──EPSILON
                     │        └──LLAVE_CLOSE '}'
                     ├──PUNTOYCOMA ';'
                     └──<Programa>
                        └──EPSILON
```

## Manejo de errores:

### durante la fase del analizador lexico:

```js
while(i < 10){
    readint(Elem);
    a =$ cons(Elem, A);
    i = i+1;
};
```
> ***LexicalError***: token no válido o inesperado '***$***' en linea ***3***

### durante la fase del analizador sintactico:

```js
while(i < 10){
    readint(Elem);
    a = cons(Elem, A);
    i = i+1 [4, 3];
};
```
> ***SyntaxError***: token inesperado \' ***\[***\' en linea ***4***

### durante la fase del evaluador:

```js
var1 = 4 + 5;
var2 = var1 * var3 + 2;
```
> ***Uncaught ReferenceError***: ***var3*** no esta definida en linea ***2***
