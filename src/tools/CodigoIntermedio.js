let modeDebug;

module.exports = class AnalisisSintactico {
    constructor(params) {
        const { debug = false, three } = params;
        modeDebug = debug;
        this.name = this.constructor.name;
        this.three = three;
        this.temp = [];
        console.log('generando codigo intermedio...');
        console.log(this.three)
    }

    generate(three){
        console.log(three);
        console.log(`node: ${three.node}`);
        console.log(three.childs);
    }

    start() {

        this.generate(this.three.childs[0]);
    }
};