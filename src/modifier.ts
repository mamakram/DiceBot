export class Modifier{
    name:string //stat name
    value:number
    conditional:Boolean

    constructor(name:string,value:number,conditional:Boolean=false){
        this.name = name;
        this.value = value
        this.conditional=conditional
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
}