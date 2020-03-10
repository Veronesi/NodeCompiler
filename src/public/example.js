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