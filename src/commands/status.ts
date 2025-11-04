import {
  ChatInputCommandInteraction,
  Message,
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";
import * as db from "../database.ts";

/**
 * Send Status of all players
 */
export const data = new SlashCommandBuilder()
  .setName("statut")
  .setDescription("Montre le statut de tous les joueurs");

export async function executeInteraction(
  interaction: ChatInputCommandInteraction
) {
  let state = db.getStatus(interaction.guild?.id ?? "");
  let embed = new EmbedBuilder().setTitle("Statut");
  for (var s of state) {
    embed.addFields({
      name: s.name,
      value: s.HP == 0 ? ":skull: " : "" + s.HP + "/" + s.HP_MAX + " PV",
    });
  }
  await interaction.reply({ embeds: [embed] });

  await interaction.reply("Status command");
}

export async function executeMessage(msg: Message) {
  if (msg.channel.isSendable()) {
    let state = db.getStatus(msg.guild?.id ?? "");
    let embed = new EmbedBuilder().setTitle("Statut");
    for (var s of state) {
      embed.addFields({
        name: s.name,
        value: s.HP == 0 ? ":skull: " : "" + s.HP + "/" + s.HP_MAX + " PV",
      });
    }
    await msg.channel.send({ embeds: [embed] });
  }
}
