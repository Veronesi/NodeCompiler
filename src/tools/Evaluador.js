const colors = require('colors/safe');

let modeDebug;

module.exports = class Evaluador {
    constructor(params) {
        const { debug = false, tree } = params;
        modeDebug = debug;
        this.name = this.constructor.name;
        this.tree = tree;
        this.temps = [];
        this.vars = [];
        this.codigoIntermedio = [];
        this.error = false;
    }

    /**
     * 
     * @param {[Tree|Token]} childsList 
     * @description Muestra los hijos de un elemento de forma legible 
     */
    seeChilds(childsList) {
        let lista = 'Lista de hijos: ';
        childsList.forEach(child => {
            switch (child.name) {
                case 'Token':
                    lista += colors.yellow(`${child.type} `)
                    break;
                case 'Arbol':
                    lista += colors.cyan(`${child.node} `)
                    break;
                default:
                    lista += colors.gray(`${child} `)
                    break;
            }
        });
        //console.log(lista);
    }
    /**
     * 
     * @param {Token<ID>} varaible 
     * @description Gurda una variable en la tabla de variables y si existe la actualiza, ademas de asignarle una variable temporal
     */
    SetVar(varaible) {
        const positionVariable = this.vars.findIndex(e => e.name == varaible.element);
        // Creamos una variable temp. 
        const newTemp = `temp${this.temps.length + 1}`;
        const newVar = { name: varaible.element, value: newTemp, type: 'var' };
        positionVariable < 0 ? this.vars.push(newVar) : this.vars[positionVariable] = newVar;

        this.temps.push({ name: newTemp, value: null, _eval: null, type: 'temp' });

        return newVar;
    }

    getVar(name){
        return this.vars.find(e => e.name == name).value
    }

    SetTemp(temp, value = null, operator = null) {
        const positionTemp = this.temps.findIndex(e => e.name == temp);
        const newTempName = `temp${this.temps.length + 1}`;
        if(positionTemp > 0 && operator){
            this.temps[positionTemp -1].value+= ` ${operator} ${temp}`;
            this.temps[positionTemp -1]._eval = null;
            operator = null;
        }
        
        if(positionTemp > 0 && this.temps[positionTemp -1]._eval != null){
            this.temps[positionTemp -1].value = temp;
            this.temps[positionTemp -1]._eval = null;
        }
        
        //operator
        if(operator){
            this.temps[positionTemp].value = `${value || ''} ${operator} ${newTempName}`;
        }else{
            this.temps[positionTemp].value = value;;
            this.temps[positionTemp]._eval = newTempName;
        }
        const newTemp = { name: newTempName, value: null, _eval: null, type: 'temp' };
        this.temps.push(newTemp);
        return newTemp;
    }

    closeTemp(temp){
        const positionTemp = this.temps.findIndex(e => e.name == temp);
        
        this.temps[positionTemp -1]._eval = null;
        this.temps.splice(positionTemp, 1);
        this.evalTemp();
    }

    evalTemp(){
        let temp = this.temp;
        let value = '';
        let positionTemp = this.temps.findIndex(e => e.name == temp);
        value = this.temps[positionTemp].value;

        let matchTemp = /temp\d+/.exec(value);
        while(matchTemp){
            const nextTemp = matchTemp[0];
            positionTemp = this.temps.findIndex(e => e.name == matchTemp);
            value = value.replace(nextTemp, ` ${this.temps[positionTemp].value}`)
            //value += ` ${this.temps[positionTemp].value}`;
            matchTemp = /temp\d+/.exec(value);
        }
        const positionVar = this.vars.findIndex(e => e.value == temp);
        this.vars[positionVar].value = eval(value);
    }

    EvalExpresionAritmeticaFinal(node, variable) {
        // Verificamos que produccion es:
        switch (node.childs[0].type) {
            case 'OPERADOR':
                let newTemp;
                if(variable.varaible){
                    newTemp = this.SetTemp(variable.value, undefined, node.childs[0].element);
                }else{
                    newTemp = this.SetTemp(variable.name, undefined, node.childs[0].element);
                }
                this.EvalExpresionAritmetica(node.childs[1].childs, newTemp);
                break;
            default:
                if(node.childs[0] == 'EPSILON'){
                    this.closeTemp(variable.name);

                    //this.evalTemp()
                }else{
                    console.log(`ERROR en EvalExpresionAritmeticaFinal: ${node.childs[0].type}`)
                }
                
                break;
        }
    }

    EvalExpresionAritmetica(childs, variable) {
        // Verificamos que produccion es:
        //console.log(`\nExpresionAritmetica a evaluar: ${colors.cyan(childs[1].node)}`);
        this.seeChilds(childs[1].childs);
        let newTemp;
        switch (childs[0].type) {
            case 'NUMERO':
                if(variable.type == 'temp'){
                    newTemp = this.SetTemp(variable.name, childs[0].element);
                }else{
                    newTemp = this.SetTemp(variable.value, childs[0].element);
                }
                this.EvalExpresionAritmeticaFinal(childs[1], newTemp);
                break;
            case 'ID':
                // Buscamos el valor del ID
                try{
                    const _temp = this.vars.find(e => e.name == childs[0].element);
                    
                    if(_temp == undefined){
                        throw new Error(colors.red((`Uncaught ReferenceError: ${childs[0].element} no esta definida en linea ${childs[0].line}`)))
                    }

                    if(variable.type == 'temp'){
                        newTemp = this.SetTemp(variable.name, _temp.value);
                    }else{
                        newTemp = this.SetTemp(variable.value, _temp.value);
                    }
                    this.EvalExpresionAritmeticaFinal(childs[1], newTemp);
                }catch(error){
                    if(!this.error) console.log(error.message);
                    this.error = true;
                }
                break;

            default:
                console.log(`ERROR en EvalExpresionAritmetica: ${childs[0].type}`)
                break;
        }
    }

    /**
     * 
     * @param {*} expresion 
     * @param {*} variable 
     * @module <Expresion>
     */
    EvalExpresion(expresion, variable) {
        //console.log(`\nExpresion a evaluar: ${colors.cyan(expresion.childs[0].node)}`);
        switch (expresion.childs[0].node) {
            case '<ExpresionAritmetica>':
                this.seeChilds(expresion.childs[0].childs)
                this.EvalExpresionAritmetica(expresion.childs[0].childs, variable)
                break;
            case '<ExpresionLista>':

                break;
            default:
                console.log('ERROR en evalExpresion')
                break;
        }
    }
    EvalCondicion(condicion){
        const _c1 = this.SetVar({ name: '_t', element: '$c1', type: 'ID', line: condicion.childs[1].line })
        this.temp = _c1.value
        this.EvalExpresionAritmetica(condicion.childs[0].childs, _c1)

        const _c2 = this.SetVar({ name: '_t', element: '$c2', type: 'ID', line: condicion.childs[1].line })
        this.temp = _c2.value
        this.EvalExpresionAritmetica(condicion.childs[2].childs, _c2)
        // Como los signos condicionales son iguales que el lenguaje que evalua la sentencia
        // no es neceario ver de que signo se trata.

        return eval(`${this.getVar('$c1')} ${condicion.childs[1].element} ${this.getVar('$c2')}`)
    }
    /**
     * 
     * @param {Tree} tree 
     * @description Evalua una <Sentencia>
     * @module <Sentencia>
     */
    EvalSentencia(tree) {
        const sentencia = tree.childs[0]
        //console.log(`\nSentencia a analizar: ${colors.cyan(sentencia.node)}`)
        this.seeChilds(sentencia.childs)
        switch (sentencia.node) {
            case '<Asignacion>':
                // Actualizamos su valor (como temp.)
                const newVar = this.SetVar(sentencia.childs[0])
                this.temp = newVar.value
                this.EvalExpresion(sentencia.childs[2], newVar)
                break;
            case '<Condicional>':
                const condicion = this.EvalCondicion(sentencia.childs[2]);
                if(condicion){
                    this.EvalPrograma(sentencia.childs[5]);
                }
                
                break;
            default:
                console.log(`Error: no existe la sentencia '${sentencia.node}'`)
                break;
        }
    }

    EvalPrograma(tree){
        while(tree.childs[0] != 'EPSILON'){
            this.EvalSentencia(tree.childs[0]);
            tree = tree.childs[2]
        } 
    }

    start() {
        while(this.tree.childs[0] != 'EPSILON'){
            this.EvalSentencia(this.tree.childs[0]);
            this.tree = this.tree.childs[2]
        }
        if(!this.error){
            console.table(this.vars)
            console.table(this.temps)
        }        
    }
};