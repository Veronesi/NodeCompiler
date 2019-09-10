module.exports = class Token {
    constructor(args){
        const { element = "", type= "", line = 0 } = args
        this.name = this.constructor.name
        this.element = element
        this.type = type
        this.line = line
    }
}