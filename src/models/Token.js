"use strict";
module.exports = {
    constructor(args){
        const { element = "", type= "", line = 0 } = args;
        return {
            name : 'Token',
            element : element,
            type : type,
            line : line,
        };
    }
};