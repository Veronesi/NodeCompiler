const colors = require('colors/safe');

let modeDebug;

module.exports = class Evaluador {
    constructor(params) {
        const { debug = false, three } = params;
        modeDebug = debug;
        this.name = this.constructor.name;
        this.three = three;
        this.temps = [];
        this.vars = [];
        this.codigoIntermedio = [];
        this.error = false;
    }

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
        console.log(lista);
    }

    SetVar(varaible) {
        const positionVariable = this.vars.findIndex(e => e.name == varaible.element);
        const newTemp = `temp${this.temps.length + 1}`;
        const newVar = { name: varaible.element, value: newTemp, type: 'var' };
        (positionVariable < 0) ? this.vars.push(newVar) : this.vars[positionVariable] = newVar;

        this.temps.push({ name: newTemp, value: null, _eval: null, type: 'temp' });

        return newVar;
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
        console.log(`\nExpresionAritmetica a evaluar: ${colors.cyan(childs[1].node)}`);
        this.seeChilds(childs[1].childs);
        let newTemp;
        switch (childs[0].type) {
            case 'NUMERO':
                if(variable.type == 'temp'){
                    //console.log(variable.name, childs[0].element);
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

    EvalExpresion(expresion, variable) {
        console.log(`\nExpresion a evaluar: ${colors.cyan(expresion.childs[0].node)}`);
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
        //console.log();
    }

    EvalSentencia(three) {
        const sentencia = three.childs[0];
        console.log(sentencia.childs);
        console.log(`\nSentencia a analizar: ${colors.cyan(sentencia.node)}`);
        this.seeChilds(sentencia.childs);
        switch (sentencia.node) {
            case '<Asignacion>':
                // Guardamos la variable.
                const newVar = this.SetVar(sentencia.childs[0]);
                this.temp = newVar.value;
                // Evaluamos la <Expresion>
                this.EvalExpresion(sentencia.childs[2], newVar)
                break;

            default:
                console.log(`Error: no existe la sentencia '${sentencia.node}'`);
                break;
        }
        /*
        console.log(three);
        console.log(`nodo: ${three.node}`);
        console.log(three.childs);
        */
    }

    start() {
        this.EvalSentencia(this.three.childs[0]);

        if(this.three.childs[2].childs[0] != 'EPSILON'){
            this.EvalSentencia(this.three.childs[2].childs[0]);
        }
        if(!this.error){
            console.table(this.vars);
            console.table(this.temps);
        }        
    }
};