import {
  ChatInputCommandInteraction,
  Message,
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";
import { fr } from "../locales/fr.ts";

/**
 * Display help message as Discord Embed
 * @param {*} msg
 */
export const data = new SlashCommandBuilder()
  .setName(fr.slashCommands.help)
  .setDescription(fr.commandDescriptions.help);

export async function executeInteraction(
  interaction: ChatInputCommandInteraction
) {
  await interaction.reply({ embeds: [helpEmbed()] });
}

export async function executeMessage(command: Message) {
  if (command.channel.isSendable()) {
    command.channel.send({ embeds: [helpEmbed()] });
  }
}

function helpEmbed() {
  const help = fr.help;
  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(help.title)
    .setDescription(help.description)
    .addFields(
      { name: help.sections.diceRoll.title, value: "" },
      {
        name: fr.textCommands.roll + " _d_",
        value: help.sections.diceRoll.commands.roll,
      },
      { name: "\u200B", value: "" }
    )
    .addFields(
      { name: help.sections.sounds.title, value: "" },
      {
        name: fr.textCommands.play,
        value: help.sections.sounds.play,
        inline: true,
      },
      {
        name: fr.textCommands.quit,
        value: help.sections.sounds.quit,
        inline: true,
      },
      { name: "\u200B", value: "" }
    )
    .addFields(
      {
        name: help.sections.sheets.title,
        value: help.sections.sheets.description,
      },
      {
        name: fr.textCommands.new,
        value: help.sections.sheets.commands.new,
        inline: true,
      },
      {
        name: fr.usage.delete,
        value: help.sections.sheets.commands.delete,
        inline: true,
      },
      {
        name: fr.usage.addPerk,
        value: help.sections.sheets.commands.addPerk,
        inline: true,
      },
      {
        name: fr.usage.addEquipment,
        value: help.sections.sheets.commands.addEquipment,
        inline: true,
      },
      {
        name: fr.usage.addItem,
        value: help.sections.sheets.commands.addItem,
        inline: true,
      },
      {
        name: fr.usage.addProfilePicture,
        value: help.sections.sheets.commands.addProfilePicture,
        inline: true,
      },
      {
        name: fr.usage.info,
        value: help.sections.sheets.commands.info,
        inline: true,
      },
      {
        name: fr.textCommands.status,
        value: help.sections.sheets.commands.status,
        inline: true,
      },
      {
        name: help.sections.sheets.commands.addHP,
        value: "",
        inline: true,
      },
      {
        name: help.sections.sheets.commands.removeHP,
        value: "",
        inline: true,
      }
    );
  return embed;
}
