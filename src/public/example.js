Prim = first(A);
if(Prim == 0){
    A = cons(1, rest(rest(A)));
    writelist("la lista resultante es ",A);
}else{
    Prim = first(B);
    writeint("el primeroo de la lista B es ", Prim);
};