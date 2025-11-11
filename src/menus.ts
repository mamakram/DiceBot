import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  UserSelectMenuBuilder,
  LabelBuilder,
  ContainerBuilder,
  SectionBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
} from "discord.js";

import {
  STATS,
  MAX_STAT,
  numberOptions,
  statOptions,
  bodyPartOptions,
} from "./utils.ts";
import * as db from "./database.ts";
import { BodyParts } from "./objects/Equipment.ts";

export const SelectionTypes = {
  Perk: 0,
  Equipment: 1,
  Item: 2,
} as const;

type SelectionType = (typeof SelectionTypes)[keyof typeof SelectionTypes];

const selectionText = [
  [
    "Choisir une perk préexistante",
    "perkSelect",
    "perks",
    "Pas de perks préexistantes",
    "ou créer une nouvelle perk",
    "openPerkContainer",
  ],
  [
    "Choisir un équipement préexistant",
    "equipmentSelect",
    "équipements",
    "Pas d'équipements préexistants",
    "ou créer un nouvel équipement",
    "openEquipmentContainer",
  ],
  [
    "Choisir un item préexistant",
    "itemSelect",
    "items",
    "Pas d'items préexistants",
    "ou créer un nouvel item",
    "openItemContainer",
  ],
];

const selectionFunctions = [
  db.getAllPerkNames,
  db.getAllEquipmentNames,
  db.getAllItemNames,
];
export function selectionOptions(
  type: SelectionType
): StringSelectMenuOptionBuilder[] {
  let options = [];
  for (var option of selectionFunctions[type]()) {
    options.push(
      new StringSelectMenuOptionBuilder()
        .setLabel(option.NAME)
        .setValue(option.NAME)
    );
  }
  return options;
}

/**
 * Container for selecting a perk from preexisting or button to create new perk
 * @param {*} id
 * @param {*} name
 * @returns
 */
export function SelectionContainer(
  id: string,
  name: string,
  type: SelectionType
): ContainerBuilder {
  let options = selectionOptions(type);
  let container = new ContainerBuilder()
    .setAccentColor(0x0099ff)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(selectionText[type][0])
    )
    .addActionRowComponents(
      new ActionRowBuilder<any>().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId(selectionText[type][1] + "/" + id + "/" + name)
          .setPlaceholder(selectionText[type][2])
          .addOptions(
            options.length == 0
              ? [
                  new StringSelectMenuOptionBuilder()
                    .setLabel(selectionText[type][3])
                    .setValue("undefined"),
                ]
              : options
          )
      )
    )
    .addSeparatorComponents(new SeparatorBuilder())
    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(selectionText[type][4])
        )
        .setButtonAccessory(
          new ButtonBuilder()
            .setCustomId(selectionText[type][5] + "/" + id + "/" + name)
            .setLabel("Créer")
            .setStyle(ButtonStyle.Primary)
        )
    );
  return container;
}

/**
 * Perk creation container, takes value inputs to create a new perk
 * @param {*} id
 * @param {*} name
 * @returns
 */
export function perkCreationContainer(
  id: string,
  name: string
): ContainerBuilder {
  let container = new ContainerBuilder()
    .setAccentColor(0x0099ff)
    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent("Nom de la perk: ")
        )
        .setButtonAccessory(
          new ButtonBuilder()
            .setCustomId("enterPerkName/+" + id + "/" + name)
            .setLabel("Choisir nom")
            .setStyle(ButtonStyle.Primary)
        )
    )
    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent("Condition (optionnel) :")
        )
        .setButtonAccessory(
          new ButtonBuilder()
            .setCustomId("enterCondition/" + id + "/" + name)
            .setLabel("Choisir Condition")
            .setStyle(ButtonStyle.Primary)
        )
    );
  let modifier = modifierComponent(id, 0);
  container.addActionRowComponents(modifier[0] as ActionRowBuilder<any>);
  container.addActionRowComponents(modifier[1] as ActionRowBuilder<any>);
  container.addSectionComponents(modifier[2] as SectionBuilder);
  container.addActionRowComponents(
    new ActionRowBuilder<any>().addComponents(
      new ButtonBuilder()
        .setCustomId("perkSubmit/" + id + "/" + name)
        .setLabel("Valider")
        .setStyle(ButtonStyle.Primary)
    )
  );
  return container;
}

export function equipmentCreationContainer(
  id: string,
  name: string
): ContainerBuilder {
  let container = new ContainerBuilder()
    .setAccentColor(0x0099ff)
    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent("Nom de l'équipment: ")
        )
        .setButtonAccessory(
          new ButtonBuilder()
            .setCustomId("enterEquipmentName/+" + id + "/" + name)
            .setLabel("Choisir nom")
            .setStyle(ButtonStyle.Primary)
        )
    )
    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent("Description (optionnel) :")
        )
        .setButtonAccessory(
          new ButtonBuilder()
            .setCustomId("enterDescription/" + id + "/" + name)
            .setLabel("Choisir description")
            .setStyle(ButtonStyle.Primary)
        )
    )
    .addActionRowComponents(
      new ActionRowBuilder<any>().setComponents(
        new StringSelectMenuBuilder()
          .setCustomId("bodyPartSelect/" + id)
          .setPlaceholder("Partie du corps")
          .setRequired(true)
          .addOptions(bodyPartOptions())
      )
    );
  let modifier = modifierComponent(id, -1);
  container.addSectionComponents(modifier[0] as SectionBuilder);
  container.addActionRowComponents(
    new ActionRowBuilder<any>().addComponents(
      new ButtonBuilder()
        .setCustomId("equipmentSubmit/" + id + "/" + name)
        .setLabel("Valider")
        .setStyle(ButtonStyle.Primary)
    )
  );
  return container;
}
export function itemCreationContainer(
  id: string,
  name: string
): ContainerBuilder {
  let container = new ContainerBuilder()
    .setAccentColor(0x0099ff)
    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent("Nom de l'item: ")
        )
        .setButtonAccessory(
          new ButtonBuilder()
            .setCustomId("enterItemName/+" + id + "/" + name)
            .setLabel("Choisir nom")
            .setStyle(ButtonStyle.Primary)
        )
    )
    .addActionRowComponents(
      new ActionRowBuilder<any>().setComponents(
        new StringSelectMenuBuilder()
          .setCustomId("amountSelect/" + id)
          .setPlaceholder("quantité")
          .setRequired(true)
          .addOptions(numberOptions(20))
      )
    );
  container.addActionRowComponents(
    new ActionRowBuilder<any>().addComponents(
      new ButtonBuilder()
        .setCustomId("itemSubmit/" + id + "/" + name)
        .setLabel("Valider")
        .setStyle(ButtonStyle.Primary)
    )
  );
  return container;
}

/**
 * Player creation container, takes value inputs to create a new player
 * @param {*} id user id
 */
export function playerCreationContainer(id: string): ContainerBuilder {
  let container = new ContainerBuilder()
    .setAccentColor(0x0099ff)
    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent("Nom du personnage: ")
        )
        .setButtonAccessory(
          new ButtonBuilder()
            .setCustomId("enterPlayerName/+" + id)
            .setLabel("Choisir nom")
            .setStyle(ButtonStyle.Primary)
        )
    )
    .addActionRowComponents(
      new ActionRowBuilder<any>().setComponents(
        new UserSelectMenuBuilder()
          .setCustomId("userSelect/" + id)
          .setPlaceholder("Joueur")
          .setRequired(true)
          .setMaxValues(1)
      )
    )
    .addActionRowComponents(
      new ActionRowBuilder<any>().setComponents(
        new StringSelectMenuBuilder()
          .setCustomId("hpSelect/" + id)
          .setPlaceholder("PV")
          .setRequired(true)
          .addOptions(numberOptions(20))
      )
    )
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        "Choisissez les **stats** de base du joueur:"
      )
    );
  //add stat selectors
  for (var stat of statSelectionComponents(id)) {
    container.addActionRowComponents(
      new ActionRowBuilder<any>().setComponents(stat)
    );
  }
  container.addActionRowComponents(
    new ActionRowBuilder<any>().addComponents(
      new ButtonBuilder()
        .setCustomId("playerSubmit/" + id)
        .setLabel("Valider")
        .setStyle(ButtonStyle.Primary)
    )
  );
  return container;
}

/**
 * Exports Discord ui components for a modifier in @see perkCreationContainer
 * @param {*} id
 * @param {*} num
 * @returns
 */
export function modifierComponent(
  id: string,
  num: number
): (ActionRowBuilder | SectionBuilder)[] {
  let ret = [];
  if (num >= 0) {
    ret.push(
      new ActionRowBuilder<any>().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("modStatSelect/" + id + "/" + num)
          .setPlaceholder("Stat")
          .addOptions(statOptions())
          .setRequired(true)
      )
    );
    ret.push(
      new ActionRowBuilder<any>().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("modValueSelect/" + id + "/" + num)
          .setPlaceholder("valeur")
          .addOptions(numberOptions(5, -5, true))
          .setRequired(true)
      )
    );
  }
  if (num < 3) {
    ret.push(
      new SectionBuilder()
        .addTextDisplayComponents(new TextDisplayBuilder().setContent("\u200B"))
        .setButtonAccessory(
          new ButtonBuilder()
            .setCustomId("addModifier/" + id + "/" + num)
            .setLabel("Ajouter modification")
            .setStyle(ButtonStyle.Primary)
        )
    );
  }
  return ret;
}

/**
 * Modal for inputing a string
 * @param {} name
 * @param {*} string_id
 * @returns
 */
export function stringInputModal(
  id: string,
  name: string,
  string_id: string
): ModalBuilder {
  const modal = new ModalBuilder()
    .setCustomId("stringInputModal/" + id)
    .setTitle(name)
    .addLabelComponents(
      new LabelBuilder()
        .setLabel("Entrez " + name + " :")
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId(string_id)
            .setPlaceholder(name)
            .setStyle(TextInputStyle.Short)
            .setMinLength(1)
            .setRequired(false)
        )
    );
  return modal;
}

/**
 * Export Discord ui components for @see playerCreationContainer
 * @param {*} name
 * @returns
 */
export function statSelectionComponents(id: string): StringSelectMenuBuilder[] {
  let modalComponents = [];
  for (let i = 0; i < STATS.length; i++) {
    modalComponents.push(
      new StringSelectMenuBuilder()
        .setCustomId("playerStatSelect/" + STATS[i].name + "/" + id)
        .setPlaceholder(STATS[i].niceName)
    );
    modalComponents[i].addOptions(numberOptions(MAX_STAT));
  }
  return modalComponents;
}
