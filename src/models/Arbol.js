"use strict";
module.exports = class Arbol {
    constructor(args){
        const { node = null, childs = [] } = args;
        this.name = this.constructor.name;
        this.node = node;
        this.childs = childs;
        this.full = false;
    }

    setChild(newChild){
        let isFollow = true;
        this.childs.forEach( (e, index) => {
            if(typeof e === 'string' && isFollow){
                isFollow = false;
                this.childs[index] = newChild;
            }else{
                if(e.name === 'Arbol' && isFollow){
                    if(!e.full){
                        console.log('el arbol no esta completo');
                    }
                }
            }
        });
    }

    /**
     * Devuelve el siguiente elemento
     */
    next(){
        let element;
        this.childs.forEach(e => {
            if(element === undefined){
                if(typeof e === 'string'){
                    element = e;
                }else{
                    switch (e.name) {
                        case 'Arbol':
                                if(!e.full){
                                    console.log('el arbol no esta completo');
                                }
                            break;
                        case 'Produccion':
                            element = e;
                            console.log('es una produccion');
                            break;
                        default:
                            break;
                    }
                    /*
                    if(e.name === 'Arbol' && element === undefined){
                        if(!e.full){
                            console.log('el arbol no esta completo');
                        }
                    }
                    */
                }
            }
        });
        return element;
    }
};