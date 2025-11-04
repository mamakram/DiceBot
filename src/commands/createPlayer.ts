import {
  ChatInputCommandInteraction,
  Message,
  SlashCommandBuilder,
  MessageFlags,
} from "discord.js";

import { playerCreationContainer } from "../menus.js";
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
