import { Modifier } from "./modifier.ts";

export class Perk{
    name:String;
    description:String;
    modifiers:Array<Modifier>;
    
    constructor(name:String,description:String,modifiers:Array<Modifier>){
        this.name = name;
        this.description=description;
        this.modifiers = modifiers;
    }

    getName():String{
        return this.name
    }
    getDescription():String{
        return this.description
    }
    getModifiers():Array<Modifier>{
        return this.modifiers
    }
    toEmbed(){
        let ret=[]
        ret.push({name:this.name,value:this.description})
        for (var mod of this.modifiers){
            let value = mod.getValue().toString()
            if (mod.getValue()>0){
                value = "+"+value
            }
            ret.push({name:value+" "+ mod.getName(),value:"",inline:true})
        }
        return ret
    }
}