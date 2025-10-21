
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
} from "discord.js";

import {STATS,MAX_STAT } from "./utils.js";


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
          nameInput)
    )
    return modal
}

export function statSelectionModal(name){
    let modalComponents = []
    for(let i =0;i<STATS.length;i++){
        modalComponents.push(new StringSelectMenuBuilder()
      .setCustomId(STATS[i].name+"/" + name)
      .setPlaceholder(STATS[i].niceName))
      for(let j=0;j<MAX_STAT;j++){
        modalComponents[i].addOptions(new StringSelectMenuOptionBuilder().setLabel(j.toString()).setValue(j.toString()),)
    }
    }
    return modalComponents
}