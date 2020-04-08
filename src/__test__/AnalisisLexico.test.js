const AnalisisLexico = require('../tools/AnalisisLexico');

describe('Analisis Lexico', () => {
    test('Asignaciones simples', () => {
        const analisisLexico = new AnalisisLexico();
        let mockCallback = jest.fn(x => x);
        analisisLexico.SetTextoPlano(`B = [2, 4];\n C = 4`);
        analisisLexico.LeerLineas();
        analisisLexico.analizarLineas(mockCallback);
        expect(mockCallback.mock.calls[0][0]).toEqual([{ name: 'Token', element: 'B', type: 'ID', line: 1 }, { name: 'Token', element: '=', type: 'OPERADORASIGNACION', line: 1 }, { name: 'Token', element: '[', type: 'CORCHETE_OPEN', line: 1 }, { name: 'Token', element: '2', type: 'NUMERO', line: 1 }, { name: 'Token', element: ',', type: 'COMA', line: 1 }, { name: 'Token', element: '4', type: 'NUMERO', line: 1 }, { name: 'Token', element: ']', type: 'CORCHETE_CLOSE', line: 1 }, { name: 'Token', element: ';', type: 'PUNTOYCOMA', line: 1 }, { name: 'Token', element: 'C', type: 'ID', line: 2 }, { name: 'Token', element: '=', type: 'OPERADORASIGNACION', line: 2 }, { name: 'Token', element: '4', type: 'NUMERO', line: 2 }]);
    });
    test('Leer un numero y una lista', () => {
        const analisisLexico = new AnalisisLexico();
        let mockCallback = jest.fn(x => x);
        analisisLexico.SetTextoPlano(`readint("ingrese un numero", Elem);  readlist("ingrese una lista", A);`);
        analisisLexico.LeerLineas();
        analisisLexico.analizarLineas(mockCallback);
        expect(mockCallback.mock.calls[0][0]).toEqual([ { name: 'Token', element: 'readint', type: 'READINT', line: 1 }, { name: 'Token', element: '(', type: 'PARENTESIS_OPEN', line: 1 }, { name: 'Token', element: '"', type: 'COMILLA', line: 1 }, { name: 'Token', element: 'ingrese un numero', type: 'TEXTO', line: 1 }, { name: 'Token', element: '"', type: 'COMILLA', line: 1 }, { name: 'Token', element: ',', type: 'COMA', line: 1 }, { name: 'Token', element: 'Elem', type: 'ID', line: 1 }, { name: 'Token', element: ')', type: 'PARENTESIS_CLOSE', line: 1 }, { name: 'Token', element: ';', type: 'PUNTOYCOMA', line: 1 }, { name: 'Token', element: 'readlist', type: 'READLIST', line: 1 }, { name: 'Token', element: '(', type: 'PARENTESIS_OPEN', line: 1 }, { name: 'Token', element: '"', type: 'COMILLA', line: 1 }, { name: 'Token', element: 'ingrese una lista', type: 'TEXTO', line: 1 }, { name: 'Token', element: '"', type: 'COMILLA', line: 1 }, { name: 'Token', element: ',', type: 'COMA', line: 1 }, { name: 'Token', element: 'A', type: 'ID', line: 1 }, { name: 'Token', element: ')', type: 'PARENTESIS_CLOSE', line: 1 }, { name: 'Token', element: ';', type: 'PUNTOYCOMA', line: 1 } ]);
    });
    test('Ejecutar un bloque While', () => {
        const analisisLexico = new AnalisisLexico();
        let mockCallback = jest.fn(x => x);
        analisisLexico.SetTextoPlano(`while(I < 10){ readint(Elem); A = cons(Elem, A); I = I+1; };`);
        analisisLexico.LeerLineas();
        analisisLexico.analizarLineas(mockCallback);
        expect(mockCallback.mock.calls[0][0]).toEqual([ { name: 'Token', element: 'while', type: 'WHILE', line: 1 }, { name: 'Token', element: '(', type: 'PARENTESIS_OPEN', line: 1 }, { name: 'Token', element: 'I', type: 'ID', line: 1 }, { name: 'Token', element: '<', type: 'SIGNO', line: 1 }, { name: 'Token', element: '10', type: 'NUMERO', line: 1 }, { name: 'Token', element: ')', type: 'PARENTESIS_CLOSE', line: 1 }, { name: 'Token', element: '{', type: 'LLAVE_OPEN', line: 1 }, { name: 'Token', element: 'readint', type: 'READINT', line: 1 }, { name: 'Token', element: '(', type: 'PARENTESIS_OPEN', line: 1 }, { name: 'Token', element: 'Elem', type: 'ID', line: 1 }, { name: 'Token', element: ')', type: 'PARENTESIS_CLOSE', line: 1 }, { name: 'Token', element: ';', type: 'PUNTOYCOMA', line: 1 }, { name: 'Token', element: 'A', type: 'ID', line: 1 }, { name: 'Token', element: '=', type: 'OPERADORASIGNACION', line: 1 }, { name: 'Token', element: 'cons', type: 'CONS', line: 1 }, { name: 'Token', element: '(', type: 'PARENTESIS_OPEN', line: 1 }, { name: 'Token', element: 'Elem', type: 'ID', line: 1 }, { name: 'Token', element: ',', type: 'COMA', line: 1 }, { name: 'Token', element: 'A', type: 'ID', line: 1 }, { name: 'Token', element: ')', type: 'PARENTESIS_CLOSE', line: 1 }, { name: 'Token', element: ';', type: 'PUNTOYCOMA', line: 1 }, { name: 'Token', element: 'I', type: 'ID', line: 1 }, { name: 'Token', element: '=', type: 'OPERADORASIGNACION', line: 1 }, { name: 'Token', element: 'I', type: 'ID', line: 1 }, { name: 'Token', element: '+', type: 'OPERADOR', line: 1 }, { name: 'Token', element: '1', type: 'NUMERO', line: 1 }, { name: 'Token', element: ';', type: 'PUNTOYCOMA', line: 1 }, { name: 'Token', element: '}', type: 'LLAVE_CLOSE', line: 1 }, { name: 'Token', element: ';', type: 'PUNTOYCOMA', line: 1 } ]);
    });
    test('Ejecutar un bloque if esle', () => {
        const analisisLexico = new AnalisisLexico();
        let mockCallback = jest.fn(x => x);
        analisisLexico.SetTextoPlano(`if(Prim == 0){ A = cons(1, rest(rest(A))); writelist("la lista resultante es ",A); }else{ Prim = first(B); writeint("el primeroo de la lista B es ", Prim); };`);
        analisisLexico.LeerLineas();
        analisisLexico.analizarLineas(mockCallback);
        expect(mockCallback.mock.calls[0][0]).toEqual([ { name: 'Token', element: 'if', type: 'IF', line: 1 }, { name: 'Token', element: '(', type: 'PARENTESIS_OPEN', line: 1 }, { name: 'Token', element: 'Prim', type: 'ID', line: 1 }, { name: 'Token', element: '==', type: 'SIGNO', line: 1 }, { name: 'Token', element: '0', type: 'NUMERO', line: 1 }, { name: 'Token', element: ')', type: 'PARENTESIS_CLOSE', line: 1 }, { name: 'Token', element: '{', type: 'LLAVE_OPEN', line: 1 }, { name: 'Token', element: 'A', type: 'ID', line: 1 }, { name: 'Token', element: '=', type: 'OPERADORASIGNACION', line: 1 }, { name: 'Token', element: 'cons', type: 'CONS', line: 1 }, { name: 'Token', element: '(', type: 'PARENTESIS_OPEN', line: 1 }, { name: 'Token', element: '1', type: 'NUMERO', line: 1 }, { name: 'Token', element: ',', type: 'COMA', line: 1 }, { name: 'Token', element: 'rest', type: 'REST', line: 1 }, { name: 'Token', element: '(', type: 'PARENTESIS_OPEN', line: 1 }, { name: 'Token', element: 'rest', type: 'REST', line: 1 }, { name: 'Token', element: '(', type: 'PARENTESIS_OPEN', line: 1 }, { name: 'Token', element: 'A', type: 'ID', line: 1 }, { name: 'Token', element: ')', type: 'PARENTESIS_CLOSE', line: 1 }, { name: 'Token', element: ')', type: 'PARENTESIS_CLOSE', line: 1 }, { name: 'Token', element: ')', type: 'PARENTESIS_CLOSE', line: 1 }, { name: 'Token', element: ';', type: 'PUNTOYCOMA', line: 1 }, { name: 'Token', element: 'writelist', type: 'WRITELIST', line: 1 }, { name: 'Token', element: '(', type: 'PARENTESIS_OPEN', line: 1 }, { name: 'Token', element: '"', type: 'COMILLA', line: 1 }, { name: 'Token', element: 'la lista resultante es ', type: 'TEXTO', line: 1 }, { name: 'Token', element: '"', type: 'COMILLA', line: 1 }, { name: 'Token', element: ',', type: 'COMA', line: 1 }, { name: 'Token', element: 'A', type: 'ID', line: 1 }, { name: 'Token', element: ')', type: 'PARENTESIS_CLOSE', line: 1 }, { name: 'Token', element: ';', type: 'PUNTOYCOMA', line: 1 }, { name: 'Token', element: '}', type: 'LLAVE_CLOSE', line: 1 }, { name: 'Token', element: 'else', type: 'ELSE', line: 1 }, { name: 'Token', element: '{', type: 'LLAVE_OPEN', line: 1 }, { name: 'Token', element: 'Prim', type: 'ID', line: 1 }, { name: 'Token', element: '=', type: 'OPERADORASIGNACION', line: 1 }, { name: 'Token', element: 'first', type: 'FIRST', line: 1 }, { name: 'Token', element: '(', type: 'PARENTESIS_OPEN', line: 1 }, { name: 'Token', element: 'B', type: 'ID', line: 1 }, { name: 'Token', element: ')', type: 'PARENTESIS_CLOSE', line: 1 }, { name: 'Token', element: ';', type: 'PUNTOYCOMA', line: 1 }, { name: 'Token', element: 'writeint', type: 'WRITEINT', line: 1 }, { name: 'Token', element: '(', type: 'PARENTESIS_OPEN', line: 1 }, { name: 'Token', element: '"', type: 'COMILLA', line: 1 }, { name: 'Token', element: 'el primeroo de la lista B es ', type: 'TEXTO', line: 1 }, { name: 'Token', element: '"', type: 'COMILLA', line: 1 }, { name: 'Token', element: ',', type: 'COMA', line: 1 }, { name: 'Token', element: 'Prim', type: 'ID', line: 1 }, { name: 'Token', element: ')', type: 'PARENTESIS_CLOSE', line: 1 }, { name: 'Token', element: ';', type: 'PUNTOYCOMA', line: 1 }, { name: 'Token', element: '}', type: 'LLAVE_CLOSE', line: 1 }, { name: 'Token', element: ';', type: 'PUNTOYCOMA', line: 1 } ]);
    });

    test('LexicalError por token no valido',async () => {
        const analisisLexico = new AnalisisLexico();
        let mockCallback = jest.fn(x => x);
        analisisLexico.SetTextoPlano(`while(i < 10){ readint(Elem); a =$ cons(Elem, A); i = i+1; };`);
        analisisLexico.LeerLineas();
        analisisLexico.analizarLineas(mockCallback);
        expect(analisisLexico.Error).toBe("\u001b[31mLexicalError: token no válido o inesperado '$' en linea 1\u001b[39m");
    });
});


