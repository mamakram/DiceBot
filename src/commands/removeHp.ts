import {
  SlashCommandBuilder,
  Message,
  ChatInputCommandInteraction,
  GuildMember,
} from "discord.js";
import * as db from "../database.ts";
import { selectPlayer } from "../selectPlayer.ts";
import { fr } from "../locales/fr.ts";

/**
 * remove HP from given player
 * @param {*} msg
 */
export const data = new SlashCommandBuilder()
  .setName(fr.slashCommands.removeHP)
  .setDescription(fr.commandDescriptions.removeHP)
  .addUserOption((option) =>
    option
      .setName("utilisateur")
      .setDescription(fr.optionDescriptions.user)
      .setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName("quantité")
      .setDescription(fr.optionDescriptions.amountToRemove)
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
      db.modifyHP(player[0], -amount);
      const hp = db.getInfoPlayer(player[0])?.getHp() ?? 0;
      await interaction.reply(fr.success.playerHP(player[0], hp));
    } else if (player.length > 1) {
      selectPlayer(interaction, "db.modifyHP", [(-amount).toString()]);
    } else {
      await interaction.reply(fr.error.playerDoesNotExist);
    }
  }
}
export async function executeMessage(msg: Message) {
  if (msg.channel.isSendable()) {
    let args = msg.content.split(" ");
    if (args.length != 3) {
      await msg.channel.send(fr.usage.removeHP);
      return;
    }
    let amount = parseInt(args[2]) ?? 0;
    var id = args[1].replace(/[@<>]/g, "");
    let player = db.getPlayerFromAuthorId(id, msg.guild?.id ?? "");
    if (player.length == 1) {
      db.modifyHP(player[0], -amount);
      const hp = db.getInfoPlayer(player[0])?.getHp() ?? 0;
      await msg.channel.send(fr.success.playerHP(player[0], hp));
    } else if (player.length > 1) {
      selectPlayer(msg, "db.modifyHP", [(-amount).toString()]);
    } else {
      await msg.channel.send(fr.error.playerDoesNotExist);
    }
  }
}

export function removeHP() {}
