import {
  SlashCommandBuilder,
  Message,
  ChatInputCommandInteraction,
  GuildMember,
} from "discord.js";
import * as db from "../database.ts";
import { selectPlayer } from "../selectPlayer.ts";

/**return Info for a given player based on discord id
 * If multiple players exist, shows a selection menu to choose
 * **/
export const data = new SlashCommandBuilder()
  .setName("inventaire")
  .setDescription("Inventaire d'un personnage")
  .addUserOption((option) =>
    option.setName("user").setDescription("L'utilisateur").setRequired(true)
  );

export async function executeInteraction(
  interaction: ChatInputCommandInteraction
) {
  let member = interaction.options.getMember("user") as GuildMember;
  let player = db.getPlayerFromAuthorId(member.id, interaction.guild?.id ?? "");
  if (player.length == 1) {
    let p = db.getInventory(player[0]);
    if (p) {
      await interaction.reply({ embeds: [p.toEmbed()] });
    }
  } else if (player.length > 1) {
    selectPlayer(interaction, "db.getInventory", []);
  } else {
    await interaction.reply("Ce joueur n'existe pas");
  }
}
export async function executeMessage(msg: Message) {
  if (msg.channel.isSendable()) {
    let args = msg.content.split(" ");
    if (args.length != 2) {
      await msg.channel.send("?inventaire @joueur");
      return;
    }
    var id = args[1].replace(/[@<>]/g, "");
    let player = db.getPlayerFromAuthorId(id, msg.guild?.id ?? "");
    if (player.length == 1) {
      let p = db.getInventory(player[0]);
      if (p) {
        await msg.channel.send({ embeds: [p.toEmbed()] });
      }
    } else if (player.length > 1) {
      selectPlayer(msg, "db.getInventory", []);
    } else {
      await msg.channel.send("Ce joueur n'existe pas");
    }
  }
}
