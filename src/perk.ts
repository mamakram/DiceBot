import { Modifier } from "./modifier.ts";
export class Perk{
    name:string;
    modifiers:Array<Modifier>;
    
    constructor(name:string,modifiers:Array<Modifier>){
        this.name = name;
        this.modifiers = modifiers;
    }

    getName():string{
        return this.name
    }
    getModifiers():Array<Modifier>{
        return this.modifiers
    }
    toEmbed(){
        let ret=[]
        ret.push({name:this.name,value:"",inline:false})
        for (var mod of this.modifiers){
            let value = mod.getValue().toString()
            if (mod.getValue()>0){
                value = "+"+value
            }
            ret.push({name:value+" "+ mod.getName(),value:mod.getCondition(),inline:true})
        }
        return ret
    }
}