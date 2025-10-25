
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

import {NumberOptions} from "./utils.js";
const MAX_STAT = 10;
const STATS = [{
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
  hpSelect.addOptions(NumberOptions(20),)
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

export function statSelectionModal(name){
    let modalComponents = []
    for(let i =0;i<STATS.length;i++){
        modalComponents.push(new StringSelectMenuBuilder()
      .setCustomId(STATS[i].name+"/" + name)
      .setPlaceholder(STATS[i].niceName))
        modalComponents[i].addOptions(NumberOptions(MAX_STAT),)
    }
    return modalComponents
}