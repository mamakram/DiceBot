import {StringSelectMenuOptionBuilder } from "discord.js";
import * as db from "./database.ts"

export const MAX_STAT = 10;
export const STATS = [{
    niceName:"Combat",name:"COMBAT"
},
{
    niceName:"Survie",name:"SURVIVAL"
},
{
    niceName:"Mécanique/Bricolage",name:"MECHANIC"
},
{
    niceName:"Médecine",name:"MEDECINE"
},
{
    niceName:"Discrétion",name:"DISCRETION"
},
{
    niceName:"Charisme",name:"CHARISMA"
},
{
    niceName:"Perception",name:"PERCEPTION"
},
{
    niceName:"Endurance",name:"ENDURANCE"
},

]


export function numberOptions(max_value,start_value=1,showPlus=false){
    let options = []
    for (let i =start_value;i<=max_value;i++){
        if (i!=0){
        options.push(new StringSelectMenuOptionBuilder().setLabel(((showPlus&i>0)?"+":"")+i.toString()).setValue(i.toString())
        )}

    }
    return options
}

export function statOptions(){
    let options = []
    for (var stat of STATS){
        options.push(new StringSelectMenuOptionBuilder().setLabel(stat.niceName).setValue(stat.name)
    )
    }
    return options
}

export function perkOptions(){
    let options = []
    for (var perk of db.getAllPerks()){
        options.push(new StringSelectMenuOptionBuilder().setLabel(perk.NAME).setValue(perk.NAME)
    )
    }
    return options
}