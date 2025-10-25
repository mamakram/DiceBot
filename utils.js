import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";




export function NumberOptions(max_value,start_value=1){
    let options = []
    for (let i =start_value;i<=max_value;i++){
        options.push(new StringSelectMenuOptionBuilder().setLabel(i.toString()).setValue(i.toString())
    )

    }
    return options
}