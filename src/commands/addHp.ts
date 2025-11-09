import {
  SlashCommandBuilder,
  Message,
  ChatInputCommandInteraction,
  StringSelectMenuInteraction,
  GuildMember,
} from "discord.js";

import * as db from "../database.ts";
import { selectPlayer } from "../selectPlayer.ts";

export const data = new SlashCommandBuilder()
  .setName("ajouterpv")
  .setDescription("Add HP to a player")
  .addUserOption((option) =>
    option.setName("user").setDescription("The user").setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName("amount")
      .setDescription("Amount of HP to add")
      .setRequired(true)
  );

export async function executeInteraction(
  interaction: ChatInputCommandInteraction
) {
  var member = interaction.options.getMember("user") as GuildMember;
  var amount = interaction.options.getInteger("amount") as number;
  if (member && amount) {
    let id = member.id;
    let player = db.getPlayerFromAuthorId(id, interaction.guild?.id ?? "");
    if (player.length == 1) {
      db.modifyHP(player[0], amount);
      await interaction.reply(
        player[0] + " a " + db.getInfoPlayer(player[0])?.getHp() + " PV"
      );
    } else if (player.length > 1) {
      selectPlayer(interaction, "db.modifyHP", [amount.toString()]);
    } else {
      await interaction.reply("Ce joueur n'existe pas");
    }
  }
}

export async function executeMessage(msg: Message) {
  if (msg.channel.isSendable()) {
    let tmp = msg.content.split(" ");
    if (tmp.length != 3) {
      await msg.channel.send("?ajouterPV @joueur quantité");
      return;
    }
    let amount = parseInt(tmp[2]) ?? 0;
    let id = tmp[1].replace("@", "").replace("<", "").replace(">", "");
    let player = db.getPlayerFromAuthorId(id, msg.guild?.id ?? "");
    if (player.length == 1) {
      db.modifyHP(player[0], amount);
      await msg.channel.send(
        player[0] + " a " + db.getInfoPlayer(player[0])?.getHp() + " PV"
      );
    } else if (player.length > 1) {
      selectPlayer(msg, "db.modifyHP", [amount.toString()]);
    } else {
      await msg.channel.send("Ce joueur n'existe pas");
    }
  }
}

export async function addHP(
  interaction: Message | StringSelectMenuInteraction
) {}
