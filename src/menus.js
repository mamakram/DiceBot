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
  numberOptions,
  statOptions,
  perkOptions,
  STATS,
  MAX_STAT,
} from "./utils.ts";

/**
 * Container for selecting a perk from preexisting or button to create new perk
 * @param {*} id
 * @param {*} name
 * @returns
 */
export function perkSelectionContainer(id, name) {
  let perks = perkOptions();
  let container = new ContainerBuilder()
    .setAccentColor(0x0099ff)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent("Choisir une perk préexistante")
    )
    .addActionRowComponents(
      new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("perkSelect/" + id + "/" + name)
          .setPlaceholder("perks")
          .addOptions(
            perks.length == 0
              ? [
                  new StringSelectMenuOptionBuilder()
                    .setLabel("Pas de perks préexistantes")
                    .setValue("undefined"),
                ]
              : perks
          )
      )
    )
    .addSeparatorComponents(new SeparatorBuilder())
    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent("ou créer une nouvelle perk")
        )
        .setButtonAccessory(
          new ButtonBuilder()
            .setCustomId("openPerkContainer/" + id + "/" + name)
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
export function perkCreationContainer(id, name) {
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
  container.components = container.components.concat(modifierComponent(id, 0));
  container.addActionRowComponents(
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("perkSubmit/" + id + "/" + name)
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
export function modifierComponent(id, num) {
  let ret = [];
  ret.push(
    new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("modStatSelect/" + id + "/" + num)
        .setPlaceholder("Stat")
        .addOptions(statOptions())
        .setRequired(true)
    )
  );
  ret.push(
    new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("modValueSelect/" + id + "/" + num)
        .setPlaceholder("valeur")
        .addOptions(numberOptions(5, -5, true))
        .setRequired(true)
    )
  );
  if (num < 3) {
    ret.push(
      new SectionBuilder()
        .addTextDisplayComponents(new TextDisplayBuilder().setContent("\u200B"))
        .setButtonAccessory(
          new ButtonBuilder()
            .setCustomId("addModifier/" + id + "/" + num)
            .setLabel("Ajouter")
            .setStyle(ButtonStyle.Primary)
        )
    );
  }
  return ret;
}

export function stringInputModal(name, string_id) {
  const modal = new ModalBuilder()
    .setCustomId("stringInputModal")
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
 * Player creation container, takes value inputs to create a new player
 * @param {*} id user id
 */
export function playerCreationContainer(id) {
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
      new ActionRowBuilder().setComponents(
        new UserSelectMenuBuilder()
          .setCustomId("userSelect/" + id)
          .setPlaceholder("Joueur")
          .setRequired(true)
          .setMaxValues(1)
      )
    )
    .addActionRowComponents(
      new ActionRowBuilder().setComponents(
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
      new ActionRowBuilder().setComponents(stat)
    );
  }
  container.addActionRowComponents(
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("playerSubmit/" + id)
        .setLabel("Valider")
        .setStyle(ButtonStyle.Primary)
    )
  );
  return container;
}

/**
 * Export Discord ui components for @see playerCreationContainer
 * @param {*} name
 * @returns
 */
export function statSelectionComponents(id) {
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
