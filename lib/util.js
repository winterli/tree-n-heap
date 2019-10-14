let Errors = require('./errors');

class Util{

    static findFirstDuplicates(list) {
        for(let d of list){
            if(list.indexOf(d) !== list.lastIndexOf(d))
                return d;
        }
        return null;
    }

    static hasDuplicates(list){
        return Util.findFirstDuplicates(list) != null;
    }

    static isListValid(list, isObj) {
        for(let d of list){
            if(!Util.isDataValid(d, isObj)) return false;
        }
        return true;
    }

    static isDataValid(data, isObj) {
        return isObj ? typeof data === 'object' && data.key !== null : typeof data === 'number';
    }



    //use function instead of property because static properties are not supported so far.
    static ERROR() {
        return {Validation:0, Duplication:1};
    }

    static errorHandler(err, msg) {
        switch (err) {
            case Util.ERROR().Validation:
                throw new Errors.ValidationError(msg);
                break;
            case Util.ERROR().Duplication:
                throw new Errors.DuplicationError(msg);
                break;
            default:
                throw new Error(msg);
        }
    }

    static debug(msg) {
        console.log(msg);
    }


    static POSITION(){
        return {LEFT:0, RIGHT:1, ORPHAN:-1};
    }

    static generateConnectors(nodes, space){
        let row = '';
        for(let n of nodes){
            row += Util.generateConnectorsForNode(n, space);
        }
        return [row];
    }

    static formatNodeValue(value, space){
        let SPACE_CHAR=' ';

        if(value === null){
            return SPACE_CHAR.repeat(space);
        }

        let digits = Math.floor(Math.log10(value))+1;
        let frontPadding = Math.floor((space-digits)/2);
        let rearPadding = space-digits-frontPadding;
        return SPACE_CHAR.repeat(frontPadding)+value+SPACE_CHAR.repeat(rearPadding);
    }

    static generateConnectorsForNode(node, space){
        let SPACE_CHAR=' ';

        if(node == null) return SPACE_CHAR.repeat(space);

        let frontPadding = Math.floor((space-1)/2);
        let rearPadding = space-1-frontPadding;
        let branch = node.position === Util.POSITION().LEFT ?'/':'\\';

        return SPACE_CHAR.repeat(frontPadding)+branch+SPACE_CHAR.repeat(rearPadding);
    }
}



module.exports=Util;