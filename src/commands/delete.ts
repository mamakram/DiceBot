import {
  ChatInputCommandInteraction,
  GuildMember,
  Message,
  SlashCommandBuilder,
} from "discord.js";
import * as db from "../database.ts";
import { selectPlayer } from "../selectPlayer.ts";

/**
 * Delete a player associated to discord id of sender
 * @param {*} msg discord message
 */
export const data = new SlashCommandBuilder()
  .setName("supprimer")
  .setDescription("Supprime le personnage associé au joueur")
  .addUserOption((option) =>
    option.setName("user").setDescription("L'utilisateur").setRequired(true)
  );

export async function executeInteraction(
  interaction: ChatInputCommandInteraction
) {
  let member = interaction.options.getMember("user") as GuildMember;
  let player = db.getPlayerFromAuthorId(member.id, interaction.guild?.id ?? "");
  if (player.length == 1) {
    db.removePlayer(player[0]);
    await interaction.reply(player[0] + " a été supprimé !");
  } else if (player.length > 1) {
    selectPlayer(interaction, "db.removePlayer", []);
  } else {
    await interaction.reply("Ce joueur n'existe pas");
  }
}

export async function executeMessage(msg: Message) {
  if (msg.channel.isSendable()) {
    let tmp = msg.content.split(" ");
    if (tmp.length != 2) {
      await msg.channel.send("?supprimer @joueur");
      return;
    }
    let id = msg.content
      .split(" ")[1]
      .replace("@", "")
      .replace("<", "")
      .replace(">", "");
    let player = db.getPlayerFromAuthorId(id, msg.guild?.id ?? "");
    if (player.length == 1) {
      db.removePlayer(player[0]);
      await msg.channel.send(player[0] + " a été supprimé !");
    } else if (player.length > 1) {
      selectPlayer(msg, "db.removePlayer", []);
    } else {
      await msg.channel.send("Ce joueur n'existe pas");
    }
  }
}
