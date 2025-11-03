import {
  SlashCommandBuilder,
  Message,
  ChatInputCommandInteraction,
  StringSelectMenuInteraction,
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
  // TODO: Implement add HP logic
  await interaction.reply("Add HP command");
}

export async function executeMessage(command: Message) {
  if (command.channel.isSendable()) {
    let tmp = command.content.split(" ");
    if (tmp.length != 3) {
      await command.channel.send("?ajouterPV @joueur quantité");
      return;
    }
    let amount = parseInt(tmp[2]) ?? 0;
    let id = tmp[1].replace("@", "").replace("<", "").replace(">", "");
    let player = db.getPlayerFromAuthorId(id, command.guild.id);
    if (player.length == 1) {
      db.modifyHP(player[0], amount);
      await command.channel.send(
        player[0] + " a " + db.getInfoPlayer(player[0]).getHp() + " PV"
      );
    } else if (player.length > 1) {
      selectPlayer(command, "db.modifyHP", [amount]);
    } else {
      await command.channel.send("Ce joueur n'existe pas");
    }
  }
}

export async function executeAfterSelection(
  interaction: Message | StringSelectMenuInteraction
) {}
