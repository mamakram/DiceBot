import {
  ChatInputCommandInteraction,
  Message,
  SlashCommandBuilder,
  MessageFlags,
  ButtonInteraction,
  ContainerComponent,
  ActionRow,
  SectionComponent,
  ButtonStyle,
  ButtonComponent,
} from "discord.js";

import { playerCreationContainer } from "../menus.js";
import { selectCache } from "../SelectCache.ts";
import { STATS } from "../utils.ts";
import * as db from "../database.ts";
/**
 * create new player
 * @param {*} msg discord message
 */
export const data = new SlashCommandBuilder()
  .setName("nouveau")
  .setDescription("Créer un nouveau personnage");

export async function executeInteraction(
  interaction: ChatInputCommandInteraction
) {
  await interaction.reply({
    components: [playerCreationContainer(interaction.user.id)],
    flags: MessageFlags.IsComponentsV2,
  });
}

export async function executeMessage(command: Message) {
  if (command.channel.isSendable()) {
    await command.channel.send({
      components: [playerCreationContainer(command.author.id)],
      flags: MessageFlags.IsComponentsV2,
    });
  }
}

/**
 * Create new player based on submission from @see playerCreationContainer
 * @param {*} interaction interaction from validate button
 */
export function playerSubmit(interaction: ButtonInteraction) {
  var container = interaction.message.components[0] as ContainerComponent;
  //user or maxHp or name not entered
  if (
    !selectCache.exists(
      (container.components[1] as unknown as ActionRow<any>).components[0]
        .customId
    ) ||
    !selectCache.exists(
      (container.components[2] as unknown as ActionRow<any>).components[0]
        .customId
    ) ||
    (
      (container.components[0] as unknown as SectionComponent)
        .accessory as ButtonComponent
    ).style == ButtonStyle.Primary
  ) {
    return false;
  }
  //stat value not entered
  for (let i = 0; i < STATS.length; i++) {
    if (
      !selectCache.exists(
        (container.components[5 + i] as unknown as ActionRow<any>).components[0]
          .customId
      )
    ) {
      return false;
    }
  }
  var playerName =
    ((container.components[0] as SectionComponent).accessory as ButtonComponent)
      .label ?? "";
  var authorId =
    selectCache.pop(
      (container.components[1] as unknown as ActionRow<any>).components[0]
        .customId
    ) ?? "";
  var maxHP =
    selectCache.pop(
      (container.components[2] as unknown as ActionRow<any>).components[0]
        .customId
    ) ?? "";
  db.addPlayer(
    playerName,
    authorId,
    interaction.guild?.id ?? "",
    parseInt(maxHP)
  );
  for (let i = 0; i < STATS.length; i++) {
    var val =
      selectCache.pop(
        (container.components[5 + i] as unknown as ActionRow<any>).components[0]
          .customId
      ) ?? "";
    var name = (
      container.components[5 + i] as unknown as ActionRow<any>
    ).components[0].customId.split("/")[1];
    db.updateSkills(name, playerName, parseInt(val));
  }
  return true;
}
