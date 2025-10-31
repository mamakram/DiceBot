
import {
  Client,
  GatewayIntentBits,
  Message,
  Partials,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  InteractionType,
  MessageFlags,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  UserSelectMenuBuilder,
  LabelBuilder,
  ContainerBuilder,
  SectionBuilder,
  TextDisplayBuilder,
  SeparatorBuilder
} from "discord.js";

import {numberOptions,statOptions,perkOptions,STATS,MAX_STAT} from "./utils.js";


export function playerCreationModal(){
    
  const userSelect = new UserSelectMenuBuilder()
      .setCustomId("userSelect")
      .setPlaceholder("Joueur")
      .setRequired(true)
      .setMaxValues(1);
  const nameInput = new TextInputBuilder()
      .setCustomId("nameInput")
      .setStyle(TextInputStyle.Short)
      .setMinLength(1)
      .setRequired(true);
  const hpSelect = new StringSelectMenuBuilder()
      .setCustomId("hpSelect")
      .setPlaceholder("PV")
      .setRequired(true)
  hpSelect.addOptions(numberOptions,statOptions(20),)
  const modal = new ModalBuilder()
      .setCustomId("createPlayerModal")
      .setTitle("Fiche de personnage");
  modal.addLabelComponents(
      new LabelBuilder()
        .setLabel("Joueur")
        .setDescription("Selectionne le joueur qui va utiliser ce personnage")
        .setUserSelectMenuComponent(userSelect),
      new LabelBuilder()
        .setLabel("Nom")
        .setDescription("Nom du personnage")
        .setTextInputComponent(
          nameInput),
      new LabelBuilder()
      .setLabel("PV")
      .setDescription("PV MAX du joueur")
      .setStringSelectMenuComponent(hpSelect),
    )
    return modal
}

export function perkSelectionContainer(id,name){
  let perks = perkOptions()
  let container = new ContainerBuilder()
	.setAccentColor(0x0099ff)
  .addTextDisplayComponents(new TextDisplayBuilder()
            .setContent("Choisir une perk préexistante"),
        )
  .addActionRowComponents(new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
          .setCustomId("perkSelect")
          .setPlaceholder("perks")
          .addOptions(perks.length==0?[new StringSelectMenuOptionBuilder().setLabel("Pas de perks préexistantes").setValue("undefined")]:perks),
        ),)
  .addSeparatorComponents(new SeparatorBuilder(),)
  .addSectionComponents(new SectionBuilder()
  .addTextDisplayComponents(new TextDisplayBuilder()
            .setContent("ou créer une nouvelle perk"),
        )
  .setButtonAccessory(new ButtonBuilder().setCustomId("openPerkContainer/"+id+"/"+name).setLabel("Créer").setStyle(ButtonStyle.Primary)),)
  return container
}

export function perkCreationContainer(id,name){
  let container = new ContainerBuilder()
	.setAccentColor(0x0099ff)
  .addSectionComponents(new SectionBuilder()
  .addTextDisplayComponents(new TextDisplayBuilder()
            .setContent("Nom de la perk: "),
        )
  .setButtonAccessory(new ButtonBuilder().setCustomId("perkName/+"+id+"/"+name).setLabel("Choisir nom").setStyle(ButtonStyle.Primary)))
  .addSectionComponents(new SectionBuilder()
  .addTextDisplayComponents(new TextDisplayBuilder()
            .setContent("Condition (optionnel) :"),
        )
  .setButtonAccessory(new ButtonBuilder().setCustomId("condition/"+id+"/"+name).setLabel("Choisir Condition").setStyle(ButtonStyle.Primary)),);
  container.components = container.components.concat(modifierComponent(id,0));
  container.addActionRowComponents(
      new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("perkSubmit/"+id+"/"+name).setLabel("Valider").setStyle(ButtonStyle.Primary)),
    )
  return container
}

export function modifierComponent(id,num){
  let ret =[]
      ret.push(new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
      .setCustomId("statSelect/"+num)
      .setPlaceholder("Stat")
      .addOptions(statOptions())))
    
      ret.push(new ActionRowBuilder().addComponents(
      new  StringSelectMenuBuilder()
      .setCustomId("valueSelect/"+num)
      .setPlaceholder("valeur")
      .addOptions(numberOptions(5,-5,true))))
      if(num<3){
      ret.push(new SectionBuilder()
            .addTextDisplayComponents(new TextDisplayBuilder()
            .setContent('\u200B'),
        )
  .setButtonAccessory(new ButtonBuilder().setCustomId("addModifier/"+id+"/"+num).setLabel("Ajouter").setStyle(ButtonStyle.Primary)))}
  return ret
}

export function stringInputModal(name,string_id){
  const modal = new ModalBuilder()
      .setCustomId("stringInputModal")
      .setTitle(name)
      .addLabelComponents(new LabelBuilder().setLabel("Entrez "+name+" :").setTextInputComponent(new TextInputBuilder().
        setCustomId(string_id)
      .setPlaceholder(name)
      .setStyle(TextInputStyle.Short)
      .setMinLength(1)
      .setRequired(false)))
    return modal
}

export function playerCreationContainer(id,name){
let exampleContainer = new ContainerBuilder()
	.setAccentColor(0x0099ff)
	.addTextDisplayComponents(new TextDisplayBuilder()
    .setContent(
			'Bienvenue **'+name+'** !, choisis le joueur associé à ce personnage et ses PV max:',
		),
	)
	.addActionRowComponents((actionRow) =>
		actionRow.setComponents(new UserSelectMenuBuilder()
      .setCustomId("userSelect")
      .setPlaceholder("Joueur")
      .setRequired(true)
      .setMaxValues(1)),
	)
    .addActionRowComponents((actionRow) =>
		actionRow.setComponents(new StringSelectMenuBuilder()
              .setCustomId("hpSelect")
              .setPlaceholder("PV")
              .setRequired(true)
            .addOptions(numberOptions,statOptions(20),),)
              
	)
	.addSeparatorComponents((separator) => separator)
	.addTextDisplayComponents((textDisplay) =>
			textDisplay.setContent(
						'Choisissez les **stats** de base du joueur:',
					),);
    for(var stat of statSelectionModal(id)){
        exampleContainer.addActionRowComponents((actionRow) =>
		actionRow.setComponents(stat))
    }
    exampleContainer.addSectionComponents((section)=>
        section
    .addTextDisplayComponents((textDisplay) =>
				textDisplay
            .setContent("Appuyez sur le bouton quand vous avez fini")
        )
    .setButtonAccessory((button)=>
                button
            .setCustomId("playerSubmit/"+id)
            .setLabel("Valider")
            .setStyle(ButtonStyle.Primary)))
    return exampleContainer
}

export function statSelectionModal(name){
    let modalComponents = []
    for(let i =0;i<STATS.length;i++){
        modalComponents.push(new StringSelectMenuBuilder()
      .setCustomId(STATS[i].name+"/" + name)
      .setPlaceholder(STATS[i].niceName))
        modalComponents[i].addOptions(numberOptions,statOptions(MAX_STAT),)
    }
    return modalComponents
}

export function perkCreationModal(){
    const modal = new ModalBuilder()
      .setCustomId("create")
      .setTitle("Fiche de personnage");
    modal.addLabelComponents(
      new LabelBuilder()
      .setLabel("Condition")
      .setTextInputComponent(new TextInputBuilder()
      .setCustomId("modifier1")
      .setPlaceholder("Condition (optionnel)")
      .setStyle(TextInputStyle.Short)
      .setMinLength(1)
      .setRequired(false)),
      new LabelBuilder()
      .setLabel("Modification 1")
      .setStringSelectMenuComponent(new StringSelectMenuBuilder()
      .setCustomId("statSelect1")
      .setPlaceholder("Stat")
      .addOptions(statOptions())),
      new LabelBuilder()
      .setLabel('\u200B')
      .setStringSelectMenuComponent(new  StringSelectMenuBuilder()
      .setCustomId("valueSelect1")
      .setPlaceholder("valeur")
      .addOptions(numberOptions(5,-5,true))),
      new LabelBuilder()
      .setLabel("Modification 2")
      .setStringSelectMenuComponent(new StringSelectMenuBuilder()
      .setCustomId("statSelect2")
      .setPlaceholder("Stat")
      .addOptions(statOptions())),
      new LabelBuilder()
      .setLabel('\u200B')
      .setStringSelectMenuComponent(new  StringSelectMenuBuilder()
      .setCustomId("valueSelect2")
      .setPlaceholder("valeur")
      .addOptions(numberOptions(5,-5,true))),
    )
    return modal
}


export function modifierInputModal(){

}