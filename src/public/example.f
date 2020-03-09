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