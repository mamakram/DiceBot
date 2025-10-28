/**
 * Stat Modifier
 * name:name of Stat modified
 * value:number
 * conditional: modifier depends on a specific condition
 */
export class Modifier{
    name:string //stat name
    value:number
    conditional:Boolean
    condition :String

    constructor(name:string,value:number,conditional:Boolean=false,condition=""){
        this.name = name;
        this.value = value
        this.conditional=conditional
        this.condition=condition
    }

    getName():string{
        return this.name
    }
    getValue():number{
        return this.value
    }
    isConditional():Boolean{
        return this.conditional
    }
    getCondition():String{
        return this.condition
    }
}