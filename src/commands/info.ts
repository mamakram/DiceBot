import {
  SlashCommandBuilder,
  Message,
  ChatInputCommandInteraction,
  GuildMember,
} from "discord.js";
import * as db from "../database.ts";
import { selectPlayer } from "../selectPlayer.ts";
import { fr } from "../locales/fr.ts";

/**return Info for a given player based on discord id
 * If multiple players exist, shows a selection menu to choose
 * **/
export const data = new SlashCommandBuilder()
  .setName(fr.slashCommands.info)
  .setDescription(fr.commandDescriptions.info)
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
    let p = db.getInfoPlayer(player[0]);
    if (p) {
      await interaction.reply({ embeds: [p.toEmbed()] });
    }
  } else if (player.length > 1) {
    selectPlayer(interaction, "db.getInfoPlayer", []);
  } else {
    await interaction.reply(fr.error.playerDoesNotExist);
  }
}
export async function executeMessage(msg: Message) {
  if (msg.channel.isSendable()) {
    let args = msg.content.split(" ");
    if (args.length != 2) {
      await msg.channel.send(fr.usage.info);
      return;
    }
    var id = args[1].replace(/[@<>]/g, "");
    let player = db.getPlayerFromAuthorId(id, msg.guild?.id ?? "");
    if (player.length == 1) {
      let p = db.getInfoPlayer(player[0]);
      if (p) {
        await msg.channel.send({ embeds: [p.toEmbed()] });
      }
    } else if (player.length > 1) {
      selectPlayer(msg, "db.getInfoPlayer", []);
    } else {
      await msg.channel.send(fr.error.playerDoesNotExist);
    }
  }
}
