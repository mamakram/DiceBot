import {
  ChatInputCommandInteraction,
  GuildMember,
  Message,
  SlashCommandBuilder,
} from "discord.js";
import * as db from "../database.ts";
import { selectPlayer } from "../selectPlayer.ts";
import { fr } from "../locales/fr.ts";

/**
 * Delete a player associated to discord id of sender
 * @param {*} msg discord message
 */
export const data = new SlashCommandBuilder()
  .setName(fr.slashCommands.delete)
  .setDescription(fr.commandDescriptions.delete)
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription(fr.optionDescriptions.user)
      .setRequired(true)
  );

export async function executeInteraction(
  interaction: ChatInputCommandInteraction
) {
  let member = interaction.options.getMember("user") as GuildMember;
  let player = db.getPlayerFromAuthorId(member.id, interaction.guild?.id ?? "");
  if (player.length == 1) {
    db.removePlayer(player[0]);
    await interaction.reply(fr.success.playerDeleted(player[0]));
  } else if (player.length > 1) {
    selectPlayer(interaction, "db.removePlayer", []);
  } else {
    await interaction.reply(fr.error.playerDoesNotExist);
  }
}

export async function executeMessage(msg: Message) {
  if (msg.channel.isSendable()) {
    let tmp = msg.content.split(" ");
    if (tmp.length != 2) {
      await msg.channel.send(fr.usage.delete);
      return;
    }
    var id = msg.content.split(" ")[1].replace(/[@<>]/g, "");
    let player = db.getPlayerFromAuthorId(id, msg.guild?.id ?? "");
    if (player.length == 1) {
      db.removePlayer(player[0]);
      await msg.channel.send(fr.success.playerDeleted(player[0]));
    } else if (player.length > 1) {
      selectPlayer(msg, "db.removePlayer", []);
    } else {
      await msg.channel.send(fr.error.playerDoesNotExist);
    }
  }
}
