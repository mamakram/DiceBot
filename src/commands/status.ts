import {
  ChatInputCommandInteraction,
  Message,
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";
import * as db from "../database.ts";
import { fr } from "../locales/fr.ts";

/**
 * Send Status of all players
 */
export const data = new SlashCommandBuilder()
  .setName(fr.slashCommands.status)
  .setDescription(fr.commandDescriptions.status);

export async function executeInteraction(
  interaction: ChatInputCommandInteraction
) {
  let state = db.getStatus(interaction.guild?.id ?? "");
  let embed = new EmbedBuilder().setTitle(fr.status.title);
  for (var s of state) {
    embed.addFields({
      name: s.name,
      value: fr.status.hp(s.HP, s.HP_MAX) + (s.HP == 0 ? fr.status.skull : ""),
    });
  }
  await interaction.reply({ embeds: [embed] });
}

export async function executeMessage(msg: Message) {
  if (msg.channel.isSendable()) {
    let state = db.getStatus(msg.guild?.id ?? "");
    let embed = new EmbedBuilder().setTitle(fr.status.title);
    for (var s of state) {
      embed.addFields({
        name: s.name,
        value: s.HP == 0 ? fr.status.skull : fr.status.hp(s.HP, s.HP_MAX),
      });
    }
    await msg.channel.send({ embeds: [embed] });
  }
}
